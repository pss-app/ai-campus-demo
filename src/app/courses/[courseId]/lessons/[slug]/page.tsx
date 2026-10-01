import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourse, getLesson } from '@/server/content';
import { courseUrl, quizPath } from '@/lib/routes';
import { LessonGate } from '@/components/learning/lesson-gate';
import { LessonRenderer } from '@/components/content/lesson-renderer';
import { PracticeNote } from '@/components/learning/practice-note';
type Props={params:Promise<{courseId:string;slug:string}>};
async function resources({params}:Props){
 const {courseId,slug}=await params;const course=await getCourse(courseId);
 const summary=course.lessons.find(l=>l.slug===slug);if(!summary)notFound();
 const lesson=await getLesson(slug);if(!lesson)notFound();return {course,lesson,summary};
}
export async function generateMetadata(props:Props){return {title:(await resources(props)).lesson.title};}
export default async function LessonPage(props:Props){
 const {course,lesson,summary}=await resources(props);const slug=lesson.slug;
 return <><nav className="breadcrumbs" aria-label="現在の場所"><Link href="/courses">コース一覧</Link> / <Link href={courseUrl(course.id)}>{course.title}</Link> / 第{summary.order}レッスン</nav><p className="eyebrow">第{summary.order}レッスン / 全{course.lessons.length}レッスン</p><h1>{lesson.title}</h1><p className="page-lead">{lesson.goal}</p><LessonGate course={course} slug={slug}><LessonRenderer lesson={lesson}/><PracticeNote key={lesson.id} lesson={lesson}/><section className="lesson-end"><h2>理解を確かめましょう</h2><p>確認問題は{lesson.objectives.length}問です。時間制限はなく、必要ならヒントを見られます。</p><div className="button-row"><Link className="button" href={quizPath(slug)}>理解した・確認へ進む</Link><Link className="button secondary" href={courseUrl(course.id)}>カリキュラムに戻る</Link></div></section></LessonGate></>;
}
