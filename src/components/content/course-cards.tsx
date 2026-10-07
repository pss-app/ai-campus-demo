import Link from 'next/link';
import type { Course } from '@/domain/types';
import { courseUrl } from '@/lib/routes';
import { coursePresentation } from '@/lib/course-presentation';
import { HomeIcon } from '@/components/home/home-icon';
import styles from './course-cards.module.css';

export function CourseCards({courses}:{courses:Course[]}){
 return <div className={styles.grid}>{courses.map((course,index)=>{
  const presentation = coursePresentation(course.id);
  return <article className={`course-card ${styles.card}`} key={course.id}>
   <div className={styles.cover} data-tone={presentation.tone}><span>COURSE {String(index+1).padStart(2,'0')}</span><HomeIcon name={presentation.icon}/><strong>{presentation.label}</strong></div>
   <div className={styles.body}>
    <p className={styles.meta}>基礎から学ぶ<span>{course.lessons.length}レッスン</span></p>
    <h2>{course.title}</h2><p>{course.description}</p>
    <ul className={styles.terms}>{presentation.terms.map(term=><li key={term}>{term}</li>)}</ul>
    <p className="supporting">こんな方に：{course.audience}</p>
    <Link className="button secondary" href={courseUrl(course.id)}>カリキュラムを見る<span className="sr-only">：{course.title}</span><HomeIcon name="arrow"/></Link>
   </div>
  </article>;
 })}</div>;
}
