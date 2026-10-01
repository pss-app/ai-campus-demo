import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourse, getLesson } from '@/server/content';
import { lessonPath } from '@/lib/routes';
import { LessonGate } from '@/components/learning/lesson-gate';
import { QuizPanel } from '@/components/assessment/quiz-panel';
type Props={params:Promise<{courseId:string;slug:string}>};
async function resources({params}:Props){const {courseId,slug}=await params;const course=await getCourse(courseId);if(!course.lessons.some(l=>l.slug===slug))notFound();const lesson=await getLesson(slug);if(!lesson)notFound();return {course,lesson};}
export async function generateMetadata(props:Props){return {title:`確認問題：${(await resources(props)).lesson.title}`};}
export default async function QuizPage(props:Props){const {course,lesson}=await resources(props);return <><p className="breadcrumbs"><Link href={lessonPath(lesson.slug)}>{lesson.title}</Link> / 確認問題</p><p className="eyebrow">理解を確かめる</p><h1>{lesson.title}の確認問題</h1><LessonGate course={course} slug={lesson.slug}><QuizPanel key={lesson.id} slug={lesson.slug} course={course}/></LessonGate></>;}
