import type { Assessment, Attempt, Course, Grade, LearningSession, Lesson, PublicAttempt, PublicProgress, Question } from './types';

export class LearningError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function grade(question: Question, selected: string[]): Grade {
  if(!selected.length || new Set(selected).size!==selected.length || selected.some(id=>!question.choices.some(c=>c.id===id))) throw new LearningError('選択肢を正しく選んでください。');
  if(question.type==='single_choice' && selected.length!==1) throw new LearningError('この問題では回答を一つ選んでください。');
  return {correct:selected.length===question.correctChoiceIds.length&&question.correctChoiceIds.every(id=>selected.includes(id)),itemResults:question.choices.map(c=>({choiceId:c.id,selected:selected.includes(c.id),expected:question.correctChoiceIds.includes(c.id),matched:selected.includes(c.id)===question.correctChoiceIds.includes(c.id)}))};
}
export function lessonComplete(lesson: {objectiveIds:string[]}, confirmations: LearningSession['confirmations']): boolean {
  return lesson.objectiveIds.length>0 && lesson.objectiveIds.every(id=>!!confirmations[id]);
}
export function accessible(course: Course, slug: string, state: Pick<LearningSession,'reviewMode'|'confirmations'>): boolean {
  const index=course.lessons.findIndex(l=>l.slug===slug);
  return index>=0 && (state.reviewMode || course.lessons.slice(0,index).every(l=>lessonComplete(l,state.confirmations)));
}
export function latestAttempt(state: LearningSession, slug: string): Attempt | undefined {return state.attempts.findLast(a=>a.lessonSlug===slug);}
export function startAttempt(state: LearningSession, course: Course, lesson: Lesson, bank: Assessment, id: string, random=Math.random): Attempt {
  if(!accessible(course,lesson.slug,state))throw new LearningError('前のレッスンの理解を確認してから進んでください。',403);
  const previous=latestAttempt(state,lesson.slug);
  if(previous?.status==='pending')return previous;
  const failed=previous?.rows.filter(r=>r.result&&!r.result.correct).map(r=>r.objectiveId)??[];
  const objectives=failed.length?lesson.objectives.filter(o=>failed.includes(o.id)):lesson.objectives;
  const history=state.attempts.flatMap(a=>a.rows);
  const attempt: Attempt={id,lessonId:lesson.id,lessonSlug:lesson.slug,lessonVersion:lesson.version,status:'pending',startedAt:new Date().toISOString(),rows:objectives.map(o=>{
    const questions=bank.questions.filter(q=>q.objectiveId===o.id);
    const counts=questions.map(q=>history.filter(r=>r.questionId===q.id).length);
    let pool=questions.filter((_,i)=>counts[i]===Math.min(...counts));
    const last=history.findLast(r=>r.objectiveId===o.id)?.questionId;
    if(pool.some(q=>q.id!==last))pool=pool.filter(q=>q.id!==last);
    const question=pool[Math.floor(random()*pool.length)];
    if(!question)throw new LearningError('この項目の問題が登録されていません。',500);
    return {questionId:question.id,questionVersion:question.version,objectiveId:o.id,choiceOrder:shuffle(question.choices,random).map(c=>c.id),selectedChoiceIds:[],hintUsed:false,supported:history.some(r=>r.objectiveId===o.id&&r.result?.correct===false)};
  })};
  state.attempts.push(attempt);state.lastLessonSlug=lesson.slug;return attempt;
}
export function submitAttempt(state: LearningSession, attempt: Attempt, bank: Assessment): void {
  if(attempt.status==='graded')return;
  const results=attempt.rows.map(row=>{
    const q=bank.questions.find(q=>q.id===row.questionId&&q.version===row.questionVersion);
    if(!q)throw new LearningError('問題が更新されました。講師にお知らせください。',409);
    return grade(q,row.selectedChoiceIds);
  });
  const at=new Date().toISOString();
  attempt.rows.forEach((row,i)=>{row.result=results[i];if(results[i].correct)state.confirmations[row.objectiveId]={assisted:row.hintUsed||row.supported,at,lessonVersion:attempt.lessonVersion};});
  attempt.status='graded';attempt.answeredAt=at;
}
export function publicAttempt(attempt: Attempt, bank: Assessment): PublicAttempt {
  return {id:attempt.id,lessonSlug:attempt.lessonSlug,status:attempt.status,startedAt:attempt.startedAt,answeredAt:attempt.answeredAt,questions:attempt.rows.map(row=>{
    const q=bank.questions.find(q=>q.id===row.questionId);
    if(!q)throw new LearningError('問題を読み込めません。',500);
    return {id:q.id,objectiveId:q.objectiveId,objectiveTitle:q.objectiveTitle,type:q.type,prompt:q.prompt,choices:row.choiceOrder.map(id=>q.choices.find(c=>c.id===id)!),selectedChoiceIds:row.selectedChoiceIds,hintUsed:row.hintUsed,supported:row.supported,
      ...(row.hintUsed?{hint:q.hint}:{}),
      ...(attempt.status==='graded'?{result:row.result,explanation:q.explanation,...(!row.result?.correct?{remediation:q.remediation,example:q.example}:{})}:{})};
  })};
}
export function publicProgress(state: LearningSession): PublicProgress {
  return {revision:state.revision,reviewMode:state.reviewMode,notes:state.notes,confirmations:state.confirmations,lastLessonSlug:state.lastLessonSlug,records:state.attempts.filter(a=>a.status==='graded').flatMap(a=>a.rows.map(r=>({attemptId:a.id,lessonId:a.lessonId,objectiveId:r.objectiveId,questionId:r.questionId,questionVersion:r.questionVersion,lessonVersion:a.lessonVersion,presentedChoiceOrder:r.choiceOrder,selectedChoiceIds:r.selectedChoiceIds,correct:r.result!.correct,hintUsed:r.hintUsed,supported:r.supported,itemResults:r.result!.itemResults,presentedAt:a.startedAt,answeredAt:a.answeredAt!})))};
}
