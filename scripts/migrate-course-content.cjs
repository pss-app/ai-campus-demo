// 旧プレビュー原稿から、教材とサーバー用問題集を分離する一度限りの移行。
const fs=require('node:fs');
const path=require('node:path');
const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/foundation/course.json'),'utf8'));
const dir=path.join(__dirname,'../content/courses',source.id);
if(fs.existsSync(path.join(dir,'course.json')))throw Error('Migrated content already exists. Edit the new files directly.');
fs.mkdirSync(path.join(dir,'lessons'),{recursive:true});fs.mkdirSync(path.join(dir,'assessments'),{recursive:true});
const course={schemaVersion:1,id:source.id,title:source.title,description:source.description,audience:source.audience,version:source.version,status:'draft',lessons:[]};
for(const [index,l] of source.lessons.entries()){
 course.lessons.push({id:l.id,slug:l.slug,title:l.title,order:index+1,goal:l.goal,objectiveIds:l.objectives.map(o=>o.id)});
 const lesson={schemaVersion:1,id:l.id,slug:l.slug,title:l.title,version:l.version,goal:l.goal,terms:l.terms,practice:l.practice,sources:l.sources,objectives:l.objectives.map(o=>({id:o.id,title:o.title,keyPoint:o.keyPoint,body:o.body,example:o.example,diagram:o.diagram}))};
 const assessment={schemaVersion:1,lessonId:l.id,lessonVersion:l.version,questions:l.objectives.flatMap(o=>o.questions.map(q=>({...q,objectiveTitle:o.title,hint:o.hint,remediation:o.remediation,example:o.example})))};
 fs.writeFileSync(path.join(dir,'lessons',l.slug+'.json'),JSON.stringify(lesson,null,2)+'\n');
 fs.writeFileSync(path.join(dir,'assessments',l.slug+'.json'),JSON.stringify(assessment,null,2)+'\n');
}
fs.writeFileSync(path.join(dir,'course.json'),JSON.stringify(course,null,2)+'\n');
console.log('Migrated 12 lessons and 12 separate assessment banks.');
