const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const stage=path.join(root,'.pages-build');
// Only our generated staging directory can be cleaned; never touch the source or local records.
if(path.dirname(stage)!==root||path.basename(stage)!=='.pages-build')throw Error('Invalid staging directory');
fs.rmSync(stage,{recursive:true,force:true});fs.mkdirSync(stage);
for(const file of ['package.json','package-lock.json','tsconfig.json','next-env.d.ts'])fs.copyFileSync(path.join(root,file),path.join(stage,file));
fs.cpSync(path.join(root,'src'),path.join(stage,'src'),{recursive:true,filter:source=>source!==path.join(root,'src/app/api')});
fs.cpSync(path.join(root,'content/courses'),path.join(stage,'content/courses'),{recursive:true});
const courses=fs.readdirSync(path.join(stage,'content/courses')).map(id=>JSON.parse(fs.readFileSync(path.join(stage,'content/courses',id,'course.json'),'utf8')));
const materials={};
for(const course of courses)for(const lesson of course.lessons){
 const read=folder=>JSON.parse(fs.readFileSync(path.join(stage,'content/courses',course.id,folder,lesson.slug+'.json'),'utf8'));
 const bank=read('assessments');
 const fields=['id','version','objectiveId','objectiveTitle','type','prompt','choices','correctChoiceIds','explanation','hint','remediation','example'];
 bank.questions=bank.questions.map(q=>Object.fromEntries(fields.map(key=>[key,q[key]])));
 materials[lesson.slug]={lesson:read('lessons'),bank};
}
fs.writeFileSync(path.join(stage,'src/demo/materials.ts'),`import type { Assessment, Lesson } from '@/domain/types';\nexport const materials:Record<string,{lesson:Lesson;bank:Assessment}>=${JSON.stringify(materials)};\n`);
const courseParams="\nexport async function generateStaticParams(){return "+JSON.stringify(courses.map(c=>({courseId:c.id})))+";}\n";
fs.appendFileSync(path.join(stage,'src/app/courses/[courseId]/layout.tsx'),courseParams);
const lessonParams="\nexport async function generateStaticParams({params}:{params:{courseId:string}}){const course=await getCourse(params.courseId);return course.lessons.map(l=>({slug:l.slug}));}\n";
for(const route of ['page.tsx','quiz/page.tsx'])fs.appendFileSync(path.join(stage,'src/app/courses/[courseId]/lessons/[slug]',route),lessonParams);
const basePath=process.env.PAGES_BASE_PATH??'/ai-campus-demo';
if(!/^\/[a-zA-Z0-9-]+$/.test(basePath))throw Error('Invalid Pages base path');
fs.writeFileSync(path.join(stage,'next.config.ts'),`import type {NextConfig} from 'next';\nconst config:NextConfig={output:'export',basePath:${JSON.stringify(basePath)},trailingSlash:true,poweredByHeader:false};\nexport default config;\n`);
const result=spawnSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:stage,stdio:'inherit',env:{...process.env,NEXT_PUBLIC_PAGES_DEMO:'true'}});
if(result.status!==0)process.exit(result.status??1);
// Some Next exports emit segment payloads as nested folders, while the client
// requests dot-separated names. Keep both layouts for plain static hosting.
const output=path.join(stage,'out');
for(const entry of fs.readdirSync(output,{recursive:true,withFileTypes:true})){
 if(!entry.isFile()||!entry.name.endsWith('.txt'))continue;
 const source=path.join(entry.parentPath,entry.name),parts=path.relative(output,source).split(path.sep);
 const segment=parts.findIndex(part=>part.startsWith('__next.'));
 if(segment>=0&&segment<parts.length-1){
  const alias=path.join(output,...parts.slice(0,segment),parts.slice(segment).join('.'));
  if(!fs.existsSync(alias))fs.copyFileSync(source,alias);
 }
}
fs.writeFileSync(path.join(stage,'out/.nojekyll'),'');
fs.writeFileSync(path.join(stage,'out/build-info.json'),JSON.stringify({commit:process.env.GITHUB_SHA??'local',courses:courses.length,lessons:Object.keys(materials).length,builtAt:new Date().toISOString()}));
console.log('Latest Pages demo: .pages-build/out');
