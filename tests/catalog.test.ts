import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { courseCatalog } from '../src/lib/course-catalog';
import { lessonPath } from '../src/lib/routes';
import { accessible, publicProgress, startAttempt, submitAttempt } from '../src/domain/assessment';
import type { Assessment, LearningSession, Lesson } from '../src/domain/types';
const read=<T>(course:string,file:string):T=>JSON.parse(readFileSync(`content/courses/${course}/${file}`,'utf8'));
const fresh=():LearningSession=>({schemaVersion:1,id:'catalog',revision:1,reviewMode:false,notes:{},confirmations:{},attempts:[]});

test('全コースのID・URL・出題対象は一意で、各論点に別問題が3問ある',()=>{
 const allIds=new Set<string>(),slugs=new Set<string>();let questions=0;
 for(const course of courseCatalog){
  course.lessons.forEach((summary,index)=>{
   assert.equal(summary.order,index+1);assert(!slugs.has(summary.slug));slugs.add(summary.slug);
   assert.equal(lessonPath(summary.slug),`/courses/${course.id}/lessons/${summary.slug}`);
   const lesson=read<Lesson>(course.id,`lessons/${summary.slug}.json`),bank=read<Assessment>(course.id,`assessments/${summary.slug}.json`);
   assert.equal(summary.id,lesson.id);assert.equal(bank.lessonId,lesson.id);assert.equal(bank.lessonVersion,lesson.version);
   assert.deepEqual(summary.objectiveIds,lesson.objectives.map(o=>o.id));
   for(const id of [lesson.id,...summary.objectiveIds,...bank.questions.map(q=>q.id)]){assert(!allIds.has(id),id);allIds.add(id);}
   for(const objective of lesson.objectives){
    assert(objective.body.length>=2);assert(objective.example&&objective.keyPoint);
    const variants=bank.questions.filter(q=>q.objectiveId===objective.id);assert.equal(variants.length,3);assert.equal(new Set(variants.map(q=>q.prompt)).size,3);
   }
   for(const question of bank.questions){
    assert(summary.objectiveIds.includes(question.objectiveId));assert(question.choices.length>=3);
    assert.equal(new Set(question.choices.map(c=>c.id)).size,question.choices.length);
    assert(question.correctChoiceIds.length>0&&question.correctChoiceIds.length<question.choices.length);
    assert(question.correctChoiceIds.every(id=>question.choices.some(c=>c.id===id)));
    assert.equal(question.type==='single_choice',question.correctChoiceIds.length===1);
    assert(question.explanation&&question.hint&&question.remediation);questions++;
   }
   assert(!JSON.stringify(lesson).includes('correctChoiceIds'));
  });
 }
 assert.equal(questions,180);
});

test('新コース8レッスンを進級でき、PCコースの到達記録と混ざらない',()=>{
 const state=fresh(),course=courseCatalog.find(c=>c.id==='file-data')!,pc=courseCatalog[0];
 assert(accessible(pc,pc.lessons[0].slug,state));assert(accessible(course,course.lessons[0].slug,state));
 assert(!accessible(course,course.lessons[1].slug,state));
 for(const summary of course.lessons){
  const lesson=read<Lesson>(course.id,`lessons/${summary.slug}.json`),bank=read<Assessment>(course.id,`assessments/${summary.slug}.json`);
  const attempt=startAttempt(state,course,lesson,bank,summary.id);
  for(const row of attempt.rows)row.selectedChoiceIds=[...bank.questions.find(q=>q.id===row.questionId)!.correctChoiceIds];
  submitAttempt(state,attempt,bank);
 }
 assert.equal(publicProgress(state).records.length,24);
 assert(!accessible(pc,pc.lessons[1].slug,state));
 assert(Object.keys(state.confirmations).every(id=>id.startsWith('FD')));
});
