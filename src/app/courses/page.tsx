import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourses } from '@/server/content';
import { courseUrl } from '@/lib/routes';
export const metadata:Metadata={title:'コース一覧'};
export default async function Courses(){const courses=await getCourses();return <main id="main-content" className="page-container" tabIndex={-1}><p className="breadcrumbs"><Link href="/">ホーム</Link> / コース一覧</p><h1>コースを選ぶ</h1><p className="page-lead">PCの仕組みと言葉から、資料を自分で扱う力へ。上から順に学ぶことをおすすめします。学び直したいコースから始めることもできます。</p><div className="catalog-grid">{courses.map((c,i)=><article className="course-card" key={c.id}><p className="eyebrow">基礎 {i+1} · {c.lessons.length}レッスン · 教材ドラフト</p><h2>{c.title}</h2><p>{c.description}</p><p className="supporting">{c.audience}</p><Link className="button" href={courseUrl(c.id)}>{c.title}のカリキュラムを見る</Link></article>)}</div><p className="supporting">後続のWeb・HTML、インターネット、AI、コンテキストのコースは準備中です。</p></main>;}
