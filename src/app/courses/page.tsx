import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourses } from '@/server/content';
import { CourseCards } from '@/components/content/course-cards';
export const metadata:Metadata={title:'コース一覧'};
export default async function Courses(){
 const courses=await getCourses();
 const count=courses.reduce((n,c)=>n+c.lessons.length,0);
 return <main id="main-content" className="page-container catalog-page" tabIndex={-1}>
  <p className="breadcrumbs"><Link href="/">ホーム</Link> / コース一覧</p>
  <section className="catalog-intro"><p className="eyebrow">COURSES / 自分のペースで、一歩ずつ。</p><h1>今日の「わかった」を、<br/>次の学びにつなげよう。</h1><p className="page-lead">PCの言葉から、AIの仕組みまで。初めての方は01から、学び直したい方は必要なコースから始められます。</p><div className="catalog-facts"><span><strong>{courses.length}</strong> コース</span><span><strong>{count}</strong> レッスン</span><span>各レッスンに確認テスト</span></div></section>
  <div className="catalog-guide"><div><h2>どこから始めるか、迷ったら。</h2><p>「PCを構成するものと言葉」で、部品と役割を整理するところから。途中で止めても、同じブラウザの学習記録から進み具合を振り返れます。</p></div><Link href="/learning-records">学習記録を見る →</Link></div>
  <CourseCards courses={courses}/>
  <aside className="catalog-next"><p className="eyebrow">これからの学び</p><h2>次は、AIに背景を伝える力へ。</h2><p>コンテキストを組み立てる練習、回答の検証、文章やWeb制作などのコースを順次準備します。</p><p className="supporting">公開中の教材はドラフト版です。準備中のコースはまだ受講できません。</p></aside>
 </main>;
}



