import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourses } from '@/server/content';
import { CourseCards } from '@/components/content/course-cards';
export const metadata:Metadata={title:'コース一覧'};
export default async function Courses(){const courses=await getCourses();return <main id="main-content" className="page-container" tabIndex={-1}><p className="breadcrumbs"><Link href="/">ホーム</Link> / コース一覧</p><h1>コースを選ぶ</h1><p className="page-lead">PCの仕組みと言葉から、資料を自分で扱う力へ。上から順に学ぶことをおすすめします。学び直したいコースから始めることもできます。</p><CourseCards courses={courses}/><p className="supporting">後続のAI、コンテキストのコースは準備中です。</p></main>;}



