import Link from 'next/link';
export default function NotFound(){return <main id="main-content" className="page-container"><h1>ページが見つかりません</h1><p>URLを確認するか、コース一覧から開き直してください。</p><Link className="button" href="/courses">コース一覧へ</Link></main>;}
