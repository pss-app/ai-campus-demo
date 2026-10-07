import Link from 'next/link';
import { getCourse } from '@/server/content';
import { CourseProgress } from '@/components/learning/course-progress';
import { coursePresentation } from '@/lib/course-presentation';
import { HomeIcon } from '@/components/home/home-icon';
type Props={params:Promise<{courseId:string}>};
export async function generateMetadata({params}:Props){return {title:(await getCourse((await params).courseId)).title};}
export default async function CoursePage({params}:Props){
 const course=await getCourse((await params).courseId);
 return <><p className="breadcrumbs"><Link href="/courses">コース一覧</Link> / {course.title}</p>
  <div className="course-intro-label"><HomeIcon name={coursePresentation(course.id).icon}/>基礎から学ぶ / COURSE GUIDE</div>
  <h1>{course.title}</h1><p className="page-lead">{course.description}</p>
  <div className="course-stats"><span>全{course.lessons.length}レッスン</span><span>解説＋確認テスト</span><span>自分のペースで受講</span></div>
  <p>こんな方に：{course.audience}</p>
  <section className="lesson-outline"><h2>このコースの進め方</h2><p>解説を読み、短い確認問題へ。理解を確認すると、このコースの次のレッスンが開きます。コース間の受講制限は設けていません。</p><p>間違えたところは、補足とヒントで復習できます。学習の過程は記録に残り、後から振り返れます。</p></section>
  <CourseProgress course={course}/>
  {course.finalTask&&<section className="course-completion-task"><p className="eyebrow">コースを学んだら / 自分で振り返る練習</p><h2>{course.finalTask.title}</h2><p>{course.finalTask.description}</p><p>この練習は自動採点・提出の対象ではありません。自分のメモにまとめ、各レッスンと照らして振り返ってください。</p></section>}
 </>;
}
