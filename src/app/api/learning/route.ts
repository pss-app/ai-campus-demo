import { NextRequest } from 'next/server';
import { z } from 'zod';
import { accessible, LearningError, publicProgress } from '@/domain/assessment';
import { getCourseForLesson } from '@/server/content';
import { withLearningSession } from '@/server/http';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){return withLearningSession(request,state=>publicProgress(state));}
const update=z.discriminatedUnion('action',[
  z.object({action:z.literal('reviewMode'),enabled:z.boolean()}).strict(),
  z.object({action:z.literal('note'),lessonSlug:z.string().max(80),text:z.string().max(20000)}).strict(),
  z.object({action:z.literal('visit'),lessonSlug:z.string().max(80)}).strict(),
]);
export async function PATCH(request:NextRequest){return withLearningSession(request,async state=>{
  const input=update.parse(await request.json());
  if(input.action==='reviewMode')state.reviewMode=input.enabled;
  else{
    const course=await getCourseForLesson(input.lessonSlug);
    if(!course)throw new LearningError('レッスンが見つかりません。',404);
    const lesson=course.lessons.find(l=>l.slug===input.lessonSlug);
    if(!lesson)throw new LearningError('レッスンが見つかりません。',404);
    if(!accessible(course,lesson.slug,state))throw new LearningError('前のレッスンを確認してください。',403);
    if(input.action==='note')state.notes[lesson.id]=input.text;
    state.lastLessonSlug=lesson.slug;
  }
  return publicProgress(state);
});}
