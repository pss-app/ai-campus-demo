const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const c=JSON.parse(fs.readFileSync(path.join(root,'content/foundation/course.json'),'utf8'));
assert.equal(c.schemaVersion,1);
assert.equal(c.lessons.length,12);
const ids=new Set();let count=0;
function unique(id){assert(!ids.has(id),`Duplicate id: ${id}`);ids.add(id);}
for(const [index,l] of c.lessons.entries()){
 unique(l.id);assert(l.title&&l.goal&&l.practice);assert.equal(l.objectives.length,3);
 assert.deepEqual(l.prerequisites,index?[c.lessons[index-1].id]:[]);
 for(const source of l.sources)assert(fs.existsSync(path.join(root,source.split('#')[0])),`Missing source ${source}`);
 for(const o of l.objectives){unique(o.id);assert(o.body.length>=3);assert(o.body.every(x=>typeof x==='string'&&x.length>10));assert(o.example&&o.hint&&o.remediation);assert.equal(o.questions.length,3);
  for(const q of o.questions){unique(q.id);count++;assert.equal(q.objectiveId,o.id);assert.equal(q.usage,'lesson');assert(q.prompt&&q.explanation);const choices=q.choices.map(x=>x.id);assert.equal(new Set(choices).size,choices.length);assert.equal(new Set(q.choices.map(x=>x.text)).size,choices.length);assert(q.correctChoiceIds.length>0);assert(q.correctChoiceIds.every(id=>choices.includes(id)));assert.equal(new Set(q.correctChoiceIds).size,q.correctChoiceIds.length);assert(q.correctChoiceIds.length<choices.length,`Select-all loophole ${q.id}`);assert.equal(q.type,q.correctChoiceIds.length>1?'multiple_choice':'single_choice');}
 }
}
assert.equal(count,108);
console.log(`PASS: ${c.lessons.length} lessons, 36 objectives, ${count} questions; IDs, references, choices, answer sets and prerequisites validated.`);
