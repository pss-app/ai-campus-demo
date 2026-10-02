import Link from 'next/link';
import type { Course } from '@/domain/types';
import { courseUrl } from '@/lib/routes';

export function CourseCards({courses}:{courses:Course[]}){
 return <div className="catalog-grid">{courses.map((course,index)=><article className="course-card" key={course.id}>
  <p className="eyebrow">基礎 {index+1} · {course.lessons.length}レッスン · 教材ドラフト</p>
  <h2>{course.title}</h2>
  <p>{course.description}</p>
  <p className="supporting">{course.audience}</p>
  <Link className="button" href={courseUrl(course.id)}>{course.title}のカリキュラムを見る</Link>
 </article>)}</div>;
}
