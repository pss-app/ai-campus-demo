'use client';
import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import type { Course } from '@/domain/types';
import { accessible, lessonComplete } from '@/domain/assessment';
import { lessonPath } from '@/lib/routes';
import { useLearning } from './learning-provider';

export function LessonGate({course,slug,children}:{course:Course;slug:string;children:ReactNode}){
 const {progress,error,refresh,update}=useLearning();const allowed=!!progress&&accessible(course,slug,progress);
 useEffect(()=>{if(allowed)void update({action:'visit',lessonSlug:slug}).catch(()=>{});},[allowed,slug,update]);
 if(error)return <div role="alert" className="callout warning"><h2>学習記録を読み込めませんでした</h2><p>{error}</p><button onClick={()=>void refresh()}>もう一度読み込む</button></div>;
 if(!progress)return <p role="status">学習記録を確認しています…</p>;
 if(!allowed){const previous=course.lessons.find(l=>!lessonComplete(l,progress.confirmations));return <section className="callout"><h2>前のレッスンから進めましょう</h2><p>解説と確認問題を終えると、このレッスンが開きます。教材を見比べる場合は「教材確認モード」を使えます。</p>{previous&&<Link className="button" href={lessonPath(previous.slug)}>続きから学ぶ</Link>}</section>;}
 return <>{progress.reviewMode&&<p className="review-banner">教材確認モードで閲覧中です。これは講師権限の認証ではなく、試作用の閲覧設定です。</p>}{children}</>;
}
