'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Course } from '@/domain/types';
import { lessonPath } from '@/lib/routes';
import { useAssessment } from '@/hooks/use-assessment';
import { QuestionField } from './question-field';
import { QuestionFeedback } from './question-feedback';

export function QuizPanel({slug,course}:{slug:string;course:Course}){
 const {attempt,loading,busy,error,reload,start,answer,hint,submit}=useAssessment(slug);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(attempt?.status==='graded')heading.current?.focus();},[attempt?.status]);
 const next=course.lessons[course.lessons.findIndex(l=>l.slug===slug)+1];
 if(loading)return <p role="status">確認問題を読み込んでいます…</p>;
 return <>{error&&<div className="callout warning" role="alert"><p>{error}</p><button className="button secondary" type="button" onClick={()=>void reload()}>保存済みの状態を読み直す</button></div>}
 {!attempt?<section className="panel"><h2>理解を確かめましょう</h2><p>今回の項目から1問ずつ出題します。時間制限はありません。迷ったときはヒントを見られます。</p><button className="button" disabled={busy} onClick={()=>void start()}>{busy?'準備中…':'確認問題を始める'}</button><p><Link href={lessonPath(slug)}>解説へ戻る</Link></p></section>:attempt.status==='pending'?<form onSubmit={e=>{e.preventDefault();void submit();}}><p className="supporting">回答は選ぶたびに保存します。再読み込みしても同じ問題の続きから再開できます。</p>{attempt.questions.map((q,i)=><QuestionField key={q.id} question={q} index={i} total={attempt.questions.length} busy={busy} onAnswer={ids=>void answer(q.id,ids)} onHint={()=>void hint(q.id)}/>)}<p role="status" className="save-status">{busy?'保存・確認中…':'回答を選んだら、まとめて確認してください。'}</p><div className="button-row"><Link className="button secondary" href={lessonPath(slug)}>解説に戻る</Link><button type="submit" className="button" disabled={busy}>回答を確認する</button></div></form>:<>
 <section className="result-heading"><h2 ref={heading} tabIndex={-1}>{attempt.questions.every(q=>q.result?.correct)?'確認できました。次の一歩へ。':'ここをもう一度、確認しましょう。'}</h2><p>{attempt.questions.every(q=>q.result?.correct)?'別の場面でも使えるか、少しずつ確かめていきましょう。':'正解した項目はそのままに、つまずいた項目だけ補足と別の問題で確認します。'}</p></section>
 {attempt.questions.map(q=><QuestionFeedback key={q.id} question={q} slug={slug}/>)}
 <div className="button-row">{attempt.questions.some(q=>!q.result?.correct)?<button className="button" disabled={busy} onClick={()=>void start()}>補足を確認した・別の問題で試す</button>:<><Link className="button" href={next?lessonPath(next.slug):'/learning-records#records-'+course.id}>{next?'次のレッスンへ':'学習記録と修了課題を見る'}</Link><button className="button secondary" disabled={busy} onClick={()=>void start()}>別の問題で復習する</button></>}</div><p className="supporting">ここで終了しても記録は保存されています。</p>
 </>}
 </>;
}

