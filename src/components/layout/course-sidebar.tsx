'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Course } from '@/domain/types';
import { accessible, lessonComplete } from '@/domain/assessment';
import { lessonPath, courseUrl } from '@/lib/routes';
import { useLearning } from '@/components/learning/learning-provider';
import { ReviewMode } from './review-mode';

export function CourseSidebar({course}:{course:Course}){
 const {progress}=useLearning();const pathname=usePathname();const count=progress?course.lessons.filter(l=>lessonComplete(l,progress.confirmations)).length:0;
 return <aside className="course-sidebar"><Link className="sidebar-title" href={courseUrl(course.id)}>{course.title}</Link><p className="supporting">確認済み {count} / {course.lessons.length} レッスン</p><progress value={count} max={course.lessons.length} aria-label="レッスンの進捗"/><details className="course-menu" open><summary>レッスンを選ぶ</summary><nav aria-label="レッスン一覧"><ol>{course.lessons.map(l=>{const ready=progress&&accessible(course,l.slug,progress);const selected=pathname.startsWith(lessonPath(l.slug));const complete=progress&&lessonComplete(l,progress.confirmations);return <li key={l.id}>{ready?<Link href={lessonPath(l.slug)} aria-current={selected?'page':undefined}><span className="lesson-number">{l.order}</span><span>{l.title}</span>{complete&&<span className="nav-state" aria-label="確認済み">✓</span>}</Link>:<span className="locked-nav"><span className="lesson-number">{l.order}</span><span>{l.title}</span><span className="nav-state">未解放</span></span>}</li>;})}</ol></nav></details><ReviewMode/></aside>;
}
