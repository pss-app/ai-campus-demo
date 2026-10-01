import Link from 'next/link';
import { ReadingSettings } from './reading-settings';

export function SiteHeader(){return <><a className="skip-link" href="#main-content">本文へ進む</a><header className="site-header"><div className="header-inner"><Link className="brand" href="/" aria-label="AI CAMPUS ホーム"><span aria-hidden="true">✳</span>AI CAMPUS</Link><nav aria-label="サイトメニュー"><Link href="/courses">コース一覧</Link><Link href="/learning-records">学習記録</Link></nav><ReadingSettings/></div></header><div className="demo-notice">{process.env.NEXT_PUBLIC_PAGES_DEMO==='true'?'公開デモ：ログイン・決済は未接続です。学習記録はこのブラウザ内に保存され、他の端末には引き継がれません。':'教材確認版：ログイン・決済は未接続です。学習記録はこのブラウザ用の識別情報で、ローカルサーバーに保存します。'}</div></>;}

