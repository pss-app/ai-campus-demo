import { z } from 'zod';
import { accessible, latestAttempt, LearningError, publicAttempt, publicProgress, startAttempt, submitAttempt } from '@/domain/assessment';
import type { LearningSession } from '@/domain/types';
import { findLessonCourse } from '@/lib/course-catalog';
import { materials } from './materials';

const storageKey='ai-campus-pages-learning-v1';
const actionSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('reviewMode'),enabled:z.boolean()}),
 z.object({action:z.literal('note'),lessonSlug:z.string(),text:z.string().max(20000)}),
 z.object({action:z.literal('visit'),lessonSlug:z.string()}),
 z.object({action:z.literal('answer'),attemptId:z.string(),questionId:z.string(),selectedChoiceIds:z.array(z.string())}),
 z.object({action:z.literal('hint'),attemptId:z.string(),questionId:z.string()}),
 z.object({action:z.literal('submit'),attemptId:z.string()}),
]);
let queue:Promise<unknown>=Promise.resolve();

function transact(url:string,method:string,body:unknown){
 let raw:string|null;
 try{raw=localStorage.getItem(storageKey);}catch{throw Error('ブラウザの保存機能を利用できません。サイトの保存設定を確認してください。');}
 let state:LearningSession;
 try{
  state=raw?JSON.parse(raw):{schemaVersion:1,id:crypto.randomUUID(),revision:0,reviewMode:false,notes:{},confirmations:{},attempts:[]};
  if(state.schemaVersion!==1||!Array.isArray(state.attempts)||!state.notes||!state.confirmations)throw Error();
 }catch{throw Error('保存したデモの記録を読み込めません。別のブラウザでもお試しいただけます。');}
 state.revision++;
 let result:unknown;
 if(url==='/api/learning'){
  if(method!=='GET'){
   const input=actionSchema.parse(body);
   if(input.action==='reviewMode')state.reviewMode=input.enabled;
   else if(input.action==='note'||input.action==='visit'){
    const course=findLessonCourse(input.lessonSlug),lesson=course?.lessons.find(l=>l.slug===input.lessonSlug);
    if(!course||!lesson)throw new LearningError('レッスンが見つかりません。',404);
    if(!accessible(course,lesson.slug,state))throw new LearningError('前のレッスンを確認してください。',403);
    if(input.action==='note')state.notes[lesson.id]=input.text;
    state.lastLessonSlug=lesson.slug;
   }else throw new LearningError('この操作は利用できません。');
  }
  result=publicProgress(state);
 }else{
  const slug=/^\/api\/lessons\/([a-z0-9-]+)\/attempt$/.exec(url)?.[1];
  const course=slug?findLessonCourse(slug):undefined,material=slug?materials[slug]:undefined;
  if(!slug||!course||!material)throw new LearningError('レッスンが見つかりません。',404);
  const {lesson,bank}=material;
  if(!accessible(course,slug,state))throw new LearningError('前のレッスンを確認してください。',403);
  let attempt=latestAttempt(state,slug);
  if(method==='POST')attempt=startAttempt(state,course,lesson,bank,crypto.randomUUID());
  else if(method==='PATCH'){
   const input=actionSchema.parse(body);
   if(!('attemptId' in input)||!attempt||attempt.id!==input.attemptId)throw new LearningError('回答の状態が変わりました。再読み込みしてください。',409);
   if(input.action==='submit')submitAttempt(state,attempt,bank);
   else if(input.action==='answer'||input.action==='hint'){
    if(attempt.status==='graded')throw new LearningError('提出済みの回答は変更できません。',409);
    const row=attempt.rows.find(r=>r.questionId===input.questionId),q=bank.questions.find(q=>q.id===input.questionId);
    if(!row||!q)throw new LearningError('対象の問題が見つかりません。');
    if(input.action==='hint')row.hintUsed=true;
    else{
     const ids=input.selectedChoiceIds;
     if(new Set(ids).size!==ids.length||ids.some(id=>!q.choices.some(c=>c.id===id))||(q.type==='single_choice'&&ids.length>1))throw new LearningError('選択肢を確認してください。');
     row.selectedChoiceIds=ids;
    }
   }
  }
  result={progress:publicProgress(state),attempt:attempt?publicAttempt(attempt,bank):null};
 }
 try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{throw Error('ブラウザに記録を保存できませんでした。保存容量や設定を確認してください。');}
 return result;
}

/** Public demonstration only: answers and records are intentionally browser-side. */
export async function demoApi<T>(url:string,method:string,body?:unknown):Promise<T>{
 const run=()=>transact(url,method,body);
 const task=queue.catch(()=>{}).then(()=>navigator.locks?navigator.locks.request(storageKey,run):run());
 queue=task;return await task as T;
}
