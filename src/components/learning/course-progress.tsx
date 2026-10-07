'use client';
import Link from 'next/link';
import type { Course } from '@/domain/types';
import { accessible, lessonComplete } from '@/domain/assessment';
import { lessonPath } from '@/lib/routes';
import { useLearning } from './learning-provider';

export function CourseProgress({course}:{course:Course}){const {progress,error,refresh}=useLearning();
 if(error)return <div role="alert"><p>{error}</p><button onClick={()=>void refresh()}>再読み込み</button></div>;
 if(!progress)return <p role="status">学習記録を読み込んでいます…</p>;
 const count=course.lessons.filter(l=>lessonComplete(l,progress.confirmations)).length;
 const complete=count===course.lessons.length;
 const next=course.lessons.find(l=>!lessonComplete(l,progress.confirmations))??course.lessons[0];
 return <><section className="course-progress-panel"><h2>{complete?'このコースの確認問題を終えました':'あなたの学習状況'}</h2><p>確認済み {count} / {course.lessons.length} レッスン</p><progress value={count} max={course.lessons.length} aria-label="このコースの完了数"/><div className="button-row"><Link href={lessonPath(next.slug)} className="button">{complete?'最初から振り返る':count?'続きから学ぶ':'最初のレッスンへ'}</Link><Link href="/learning-records" className="button secondary">学習記録を見る</Link></div></section><ol className="lesson-cards">{course.lessons.map(l=><li key={l.id}><div><p className="eyebrow">LESSON {String(l.order).padStart(2,'0')} / 第{l.order}レッスン{lessonComplete(l,progress.confirmations)&&' · 確認済み'}</p><h2>{l.title}</h2><p>{l.goal}</p></div>{accessible(course,l.slug,progress)?<Link className="button secondary" href={lessonPath(l.slug)}>{lessonComplete(l,progress.confirmations)?'復習する':'学ぶ'}</Link>:<p className="supporting">前のレッスンを確認すると開きます。</p>}</li>)}</ol></>;
}
