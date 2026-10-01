import { randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { accessible, latestAttempt, LearningError, publicAttempt, publicProgress, startAttempt, submitAttempt } from '@/domain/assessment';
import { getAssessment, getCourseForLesson, getLesson } from '@/server/content';
import { withLearningSession } from '@/server/http';
import type { LearningSession } from '@/domain/types';

export const runtime='nodejs';
export const dynamic='force-dynamic';
type Context={params:Promise<{slug:string}>};
async function resources(context:Context,state:LearningSession){
  const {slug}=await context.params;
  const [course,lesson,bank]=await Promise.all([getCourseForLesson(slug),getLesson(slug),getAssessment(slug)]);
  if(!course||!lesson||!bank)throw new LearningError('レッスンが見つかりません。',404);
  if(!accessible(course,slug,state))throw new LearningError('前のレッスンの理解を確認してください。',403);
  return {course,lesson,bank};
}
export async function GET(request:NextRequest,context:Context){return withLearningSession(request,async state=>{
  const {lesson,bank}=await resources(context,state);const attempt=latestAttempt(state,lesson.slug);
  return {progress:publicProgress(state),attempt:attempt?publicAttempt(attempt,bank):null};
});}
export async function POST(request:NextRequest,context:Context){return withLearningSession(request,async state=>{
  const {course,lesson,bank}=await resources(context,state);
  const attempt=startAttempt(state,course,lesson,bank,randomUUID());
  return {progress:publicProgress(state),attempt:publicAttempt(attempt,bank)};
});}
const action=z.discriminatedUnion('action',[
  z.object({action:z.literal('answer'),attemptId:z.string().uuid(),questionId:z.string(),selectedChoiceIds:z.array(z.string()).max(20)}).strict(),
  z.object({action:z.literal('hint'),attemptId:z.string().uuid(),questionId:z.string()}).strict(),
  z.object({action:z.literal('submit'),attemptId:z.string().uuid()}).strict(),
]);
export async function PATCH(request:NextRequest,context:Context){return withLearningSession(request,async state=>{
  const input=action.parse(await request.json());const {lesson,bank}=await resources(context,state);
  const attempt=latestAttempt(state,lesson.slug);
  if(!attempt||attempt.id!==input.attemptId)throw new LearningError('別の画面でテストが更新されました。再読み込みしてください。',409);
  if(input.action==='submit')submitAttempt(state,attempt,bank);
  else{
    if(attempt.status==='graded')throw new LearningError('提出済みの回答は変更できません。',409);
    const row=attempt.rows.find(r=>r.questionId===input.questionId);
    const q=bank.questions.find(q=>q.id===input.questionId);
    if(!row||!q)throw new LearningError('このテストに含まれない問題です。');
    if(input.action==='hint')row.hintUsed=true;
    else{
      const ids=input.selectedChoiceIds;
      if(new Set(ids).size!==ids.length||ids.some(id=>!q.choices.some(c=>c.id===id))||(q.type==='single_choice'&&ids.length>1))throw new LearningError('選択肢を確認してください。');
      row.selectedChoiceIds=ids;
    }
  }
  return {progress:publicProgress(state),attempt:publicAttempt(attempt,bank)};
});}
