'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main-content" className="page-container"><h1>ページを読み込めませんでした</h1><p>通信や保存の状態を確認し、もう一度お試しください。</p><button className="button" onClick={reset}>もう一度読み込む</button></main>;}
