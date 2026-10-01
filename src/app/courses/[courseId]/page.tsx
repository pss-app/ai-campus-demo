import Link from 'next/link';
import { getCourse } from '@/server/content';
import { CourseProgress } from '@/components/learning/course-progress';
type Props={params:Promise<{courseId:string}>};
export async function generateMetadata({params}:Props){return {title:(await getCourse((await params).courseId)).title};}
export default async function CoursePage({params}:Props){
 const course=await getCourse((await params).courseId);
 return <><p className="breadcrumbs"><Link href="/courses">コース一覧</Link> / {course.title}</p><h1>{course.title}</h1><p className="page-lead">{course.description}</p><p>対象：{course.audience}</p><section className="lesson-outline"><h2>このコースの進め方</h2><p>各レッスンは解説と確認問題に分かれています。理解を確認すると、このコースの次のレッスンが開きます。コース間の受講制限は設けていません。</p><p>ヒントを使って正解しても進めます。学習の過程は記録に残り、後から振り返れます。</p></section><CourseProgress course={course}/></>;
}
