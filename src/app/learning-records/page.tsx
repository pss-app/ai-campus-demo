import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourses, getLesson } from '@/server/content';
import { LearningRecords } from '@/components/learning/learning-records';
export const metadata:Metadata={title:'学習記録'};
export default async function RecordsPage(){
 const courses=await getCourses();const lessons=await Promise.all(courses.flatMap(c=>c.lessons.map(l=>getLesson(l.slug))));
 const titles=Object.fromEntries(lessons.flatMap(l=>l?.objectives.map(o=>[o.id,o.title])??[]));
 return <main id="main-content" className="page-container" tabIndex={-1}><p className="breadcrumbs"><Link href="/courses">コース一覧</Link> / 学習記録</p><h1>学んだ過程を振り返る</h1><p className="page-lead">正解数だけでなく、つまずいた項目や補足を使った記録も振り返れます。</p><nav className="button-row" aria-label="コース別の学習記録">{courses.map(c=><a className="button secondary" key={c.id} href={`#records-${c.id}`}>{c.title}</a>)}</nav>{courses.map(c=><section key={c.id} id={`records-${c.id}`} className="course-record-group"><h2>{c.title}</h2><LearningRecords course={c} titles={titles}/></section>)}</main>;
}
