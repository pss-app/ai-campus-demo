import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { accessible, grade, lessonComplete, publicAttempt, publicProgress, startAttempt, submitAttempt } from '../src/domain/assessment';
import type { Assessment, Course, LearningSession, Lesson } from '../src/domain/types';

const root=path.join(process.cwd(),'content/courses/pc-foundations');
const read=<T>(file:string):T=>JSON.parse(readFileSync(path.join(root,file),'utf8'));
const course=read<Course>('course.json');
const lesson=read<Lesson>('lessons/components.json');
const bank=read<Assessment>('assessments/components.json');
const fresh=():LearningSession=>({schemaVersion:1,id:'test',revision:1,reviewMode:false,notes:{},confirmations:{},attempts:[]});

test('全教材の参照整合性と、公開本文への正答混入を検査',()=>{
 const ids=new Set<string>();let total=0;
 for(const summary of course.lessons){
  const l=read<Lesson>(`lessons/${summary.slug}.json`);const b=read<Assessment>(`assessments/${summary.slug}.json`);
  assert.deepEqual(summary.objectiveIds,l.objectives.map(o=>o.id));assert.equal(b.lessonId,l.id);assert.equal(b.lessonVersion,l.version);
  assert(!JSON.stringify(l).includes('correctChoiceIds'));assert(!JSON.stringify(l).includes('questions'));
  for(const o of l.objectives){assert(o.keyPoint&&o.body.length&&o.example);assert.equal(b.questions.filter(q=>q.objectiveId===o.id).length,3);}
  for(const q of b.questions){assert(!ids.has(q.id));ids.add(q.id);total++;assert(summary.objectiveIds.includes(q.objectiveId));assert(q.correctChoiceIds.every(id=>q.choices.some(c=>c.id===id)));assert(q.correctChoiceIds.length<q.choices.length);assert(q.hint&&q.remediation);}
 }
 assert.equal(total,108);
});
test('全選択・不足・不明選択肢・重複の扱い',()=>{
 const q=bank.questions.find(q=>q.type==='multiple_choice')!;
 assert.equal(grade(q,q.correctChoiceIds).correct,true);
 assert.equal(grade(q,q.choices.map(c=>c.id)).correct,false);
 assert.equal(grade(q,[q.correctChoiceIds[0]]).correct,false);
 assert.throws(()=>grade(q,[]));assert.throws(()=>grade(q,['invalid']));assert.throws(()=>grade(q,[q.correctChoiceIds[0],q.correctChoiceIds[0]]));
});
test('未解放の出題拒否、正答を隠した出題、再開と誤答論点だけの再出題',()=>{
 const state=fresh();const second=read<Lesson>('lessons/information-flow.json');const secondBank=read<Assessment>('assessments/information-flow.json');
 assert.throws(()=>startAttempt(state,course,second,secondBank,'locked'));
 const a=startAttempt(state,course,lesson,bank,'first',()=>0);
 assert.equal(startAttempt(state,course,lesson,bank,'duplicate').id,'first');assert.equal(state.attempts.length,1);
 const publicData=publicAttempt(a,bank);assert(!JSON.stringify(publicData).includes('correctChoiceIds'));assert(publicData.questions.every(q=>!q.result&&!q.explanation&&!q.hint));
 a.rows.forEach((r,i)=>{const q=bank.questions.find(q=>q.id===r.questionId)!;r.selectedChoiceIds=i===1?[q.choices.find(c=>!q.correctChoiceIds.includes(c.id))!.id]:[...q.correctChoiceIds];});
 submitAttempt(state,a,bank);assert.equal(lessonComplete(course.lessons[0],state.confirmations),false);assert.equal(accessible(course,second.slug,state),false);
 const retry=startAttempt(state,course,lesson,bank,'retry',()=>0);assert.equal(retry.rows.length,1);assert.notEqual(retry.rows[0].questionId,a.rows[1].questionId);assert.equal(retry.rows[0].supported,true);
 const row=retry.rows[0];row.hintUsed=true;row.selectedChoiceIds=[...bank.questions.find(q=>q.id===row.questionId)!.correctChoiceIds];
 submitAttempt(state,retry,bank);const snapshot=JSON.stringify(state);submitAttempt(state,retry,bank);assert.equal(JSON.stringify(state),snapshot);
 assert.equal(lessonComplete(course.lessons[0],state.confirmations),true);assert.equal(accessible(course,second.slug,state),true);assert.equal(state.confirmations[row.objectiveId].assisted,true);
 assert.equal(publicProgress(state).records.length,4);assert.equal(publicAttempt(retry,bank).questions[0].hintUsed,true);
});
test('未回答があると部分採点も進級もしない',()=>{
 const state=fresh();const a=startAttempt(state,course,lesson,bank,'pending');a.rows[0].selectedChoiceIds=[...bank.questions.find(q=>q.id===a.rows[0].questionId)!.correctChoiceIds];
 assert.throws(()=>submitAttempt(state,a,bank));assert.deepEqual(state.confirmations,{});assert.equal(a.status,'pending');assert(a.rows.every(r=>!r.result));
});
test('12レッスンを進め、ヒント使用と再出題履歴を保持',()=>{
 const state=fresh();
 for(const summary of course.lessons){const l=read<Lesson>(`lessons/${summary.slug}.json`);const b=read<Assessment>(`assessments/${summary.slug}.json`);const a=startAttempt(state,course,l,b,summary.id,()=>0);a.rows.forEach(r=>r.selectedChoiceIds=[...b.questions.find(q=>q.id===r.questionId)!.correctChoiceIds]);submitAttempt(state,a,b);assert(lessonComplete(summary,state.confirmations));}
 assert.equal(publicProgress(state).records.length,36);
 const review=startAttempt(state,course,lesson,bank,'review',()=>0);assert(review.rows.every(r=>!state.attempts[0].rows.some(old=>old.questionId===r.questionId)));
});
test('教材確認モードは閲覧だけで合格を作らない',()=>{
 const state=fresh();state.reviewMode=true;assert(accessible(course,course.lessons.at(-1)!.slug,state));assert.deepEqual(state.confirmations,{});state.reviewMode=false;assert.equal(accessible(course,course.lessons.at(-1)!.slug,state),false);
});
