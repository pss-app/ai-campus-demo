'use client';
import Link from 'next/link';
import type { Course } from '@/domain/types';
import { accessible, lessonComplete } from '@/domain/assessment';
import { lessonPath } from '@/lib/routes';
import { useLearning } from './learning-provider';

export function CourseProgress({course}:{course:Course}){const {progress,error,refresh}=useLearning();
 if(error)return <div role="alert"><p>{error}</p><button onClick={()=>void refresh()}>再読み込み</button></div>;
 if(!progress)return <p role="status">学習記録を読み込んでいます…</p>;
 const next=course.lessons.find(l=>!lessonComplete(l,progress.confirmations))??course.lessons[0];
 return <><div className="button-row"><Link href={lessonPath(next.slug)} className="button">{course.lessons.some(l=>lessonComplete(l,progress.confirmations))?'続きから学ぶ':'最初のレッスンへ'}</Link></div><ol className="lesson-cards">{course.lessons.map(l=><li key={l.id}><div><p className="eyebrow">第{l.order}レッスン</p><h2>{l.title}</h2><p>{l.goal}</p></div>{accessible(course,l.slug,progress)?<Link className="button secondary" href={lessonPath(l.slug)}>{lessonComplete(l,progress.confirmations)?'復習する':'学ぶ'}</Link>:<p className="supporting">前のレッスンを確認すると開きます。</p>}</li>)}</ol></>;
}
