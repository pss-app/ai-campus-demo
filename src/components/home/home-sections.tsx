import Link from 'next/link';
import { courseCatalog } from '@/lib/course-catalog';
import { courseUrl } from '@/lib/routes';
import { HomeIcon } from './home-icon';
import { coursePresentation } from '@/lib/course-presentation';
import { trialLesson } from './home-hero';
import styles from './home.module.css';

const steps = [
  { icon: 'book' as const, title: '読んで、理解する', text: '言葉の意味を知り、図や身近な例で仕組みを学びます。自分のペースで読み進められます。' },
  { icon: 'check' as const, title: 'ミニテストで確かめる', text: '「理解した」ボタンから確認問題へ。覚えた言葉や仕組みを、具体的な場面で確かめます。' },
  { icon: 'arrow' as const, title: '復習して、次の一歩へ', text: '間違えたところは解説とヒントで復習。別の問題で確認できたら、次のレッスンへ進みます。' },
];
const questions = [
  ['PCに詳しくなくても始められますか？', 'はい。普段なんとなく使っているPCの部品や用語から学べます。初めての方は「PCを構成するものと言葉」から始めてください。わからないところは何度でも読み直せます。'],
  ['動画を見て学ぶサイトですか？', '現在は文字・図・具体例で学ぶ教材です。余白やURLの仕組みなど、画面を操作して確かめるレッスンもあります。動画がなくても、自分の速さで読み、理解を確かめられます。'],
  ['確認テストを間違えたら、どうなりますか？', '間違えた項目の補足とヒントを確認し、別の問題に取り組みます。正解した項目を最初からやり直す必要はありません。時間制限もありません。'],
  ['スマートフォンでも学べますか？', 'はい。スマートフォンでも解説を読んで確認テストに取り組めます。文字サイズは画面上部の「標準・大・特大」から選べます。PCを実際に操作する練習には、PCの利用をおすすめします。'],
  ['料金や会員登録は必要ですか？', '現在の公開デモは、会員登録・支払いなしで体験できます。正式サービスの料金と法人向けの提供条件は準備中です。'],
  ['途中から再開できますか？', '学習記録から進み具合を確認できます。公開デモの記録は利用しているブラウザ内に保存されます。同じ端末・ブラウザでご利用ください。別の端末への引き継ぎや、ブラウザのデータ削除後の復元はできません。'],
];

function SectionHeading({ label, title, text }: { label: string; title: string; text?: string }) {
  return <div className={styles.sectionHeading}><p className={styles.kicker}>{label}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function HomeSections() {
  return <>
    <section className={styles.worries} aria-labelledby="worries-title"><div className={styles.container}>
      <p className={styles.kicker}>こんなところで、止まっていませんか？</p>
      <h2 id="worries-title">「学んでみたい」を、<br className={styles.mobileBreak}/>最初の一歩につなげる。</h2>
      <div className={styles.worryGrid}>
        <article><span>01</span><h3>知らない言葉が出てくると、<br/>そこで止まってしまう。</h3><p>AIやPCの説明が、<br/>何のことかわからない。</p></article>
        <article><span>02</span><h3>何から勉強すればいいか、<br/>順番がわからない。</h3><p>情報はたくさんあるけれど、<br/>自分に必要なものを選べない。</p></article>
        <article><span>03</span><h3>読んだつもりでも、<br/>理解できたか不安。</h3><p>操作をまねできても、<br/>仕組みを説明するのは難しい。</p></article>
      </div>
      <p className={styles.worryAnswer}>AI CAMPUSなら、<strong>言葉・仕組み・確認</strong>をひとつずつ。</p>
    </div></section>

    <section id="about" className={styles.section}><div className={styles.container}>
      <SectionHeading label="ABOUT AI CAMPUS" title="わかったつもりを、確かな理解へ。" text="読むだけで終わらない。理解を確かめながら進める学習です。"/>
      <div className={styles.aboutGrid}>
        <div className={styles.lessonPreview}>
          <div className={styles.previewBar}><span>✳ AI CAMPUS</span><span>教材のイメージ</span></div>
          <p className={styles.previewEyebrow}>PCの基礎 / LESSON 01</p><h3>PCを構成するもの</h3>
          <div className={styles.previewPoint}><span>今回のポイント</span><p>機器・ソフトウェア・情報。<br/>まずは、3つの役割を知りましょう。</p></div>
          <div className={styles.previewParts}><div><HomeIcon name="screen"/><strong>機器</strong><span>触れられる部品</span></div><div><HomeIcon name="code"/><strong>ソフトウェア</strong><span>動かす仕組み</span></div><div><HomeIcon name="folder"/><strong>情報</strong><span>扱う中身</span></div></div>
          <Link href={trialLesson} className={styles.previewLink}>このレッスンを読んでみる<HomeIcon name="arrow"/></Link>
        </div>
        <div className={styles.featureList}>
          <article><span>01</span><div><h3>必要な言葉から、順番に。</h3><p>「メモリって何？」「サーバーとは？」。土台になる言葉を知ってから、仕組みへ進みます。</p></div></article>
          <article><span>02</span><div><h3>文字と図で、じっくり学べる。</h3><p>大事なポイントと具体例を整理。読み返したり、文字を大きくしたり、自分に合う読み方で。</p></div></article>
          <article><span>03</span><div><h3>つまずいたところを、そのままにしない。</h3><p>確認問題で理解を確かめ、必要なところを復習。学習記録で自分の歩みも振り返れます。</p></div></article>
        </div>
      </div>
    </div></section>

    <section id="home-courses" className={`${styles.section} ${styles.courseSection}`}><div className={styles.container}>
      <SectionHeading label="COURSES" title={`基礎からつながる、${courseCatalog.length}つのコース。`} text="初めての方は01から。内容を確かめて、自分に必要な学びを選べます。"/>
      <div className={styles.courseGrid}>{courseCatalog.map((course, index) => {
        const visual = coursePresentation(course.id);
        return <article key={course.id} className={styles.courseCard}>
          <div className={styles.courseArt} data-tone={index}><span className={styles.courseNumber}>COURSE 0{index + 1}</span><HomeIcon name={visual.icon}/><strong>{visual.label}</strong></div>
          <div className={styles.courseBody}><p className={styles.courseMeta}>基礎コース<span>{course.lessons.length}レッスン</span></p><h3>{course.title}</h3><p>{course.description}</p><ul className={styles.terms}>{visual.terms.map(term => <li key={term}>{term}</li>)}</ul><Link href={courseUrl(course.id)}>カリキュラムを見る<span className="sr-only">：{course.title}</span><HomeIcon name="arrow"/></Link></div>
        </article>;
      })}</div>
      <p className={styles.sectionNote}>現在公開している教材はドラフト版です。内容を確認しながら、順次整えています。</p>
    </div></section>

    <section id="how-to-learn" className={styles.section}><div className={styles.container}>
      <SectionHeading label="HOW TO LEARN" title="学び方は、シンプルな3ステップ。" text="急がなくて大丈夫。ひとつ理解できたら、次へ進みましょう。"/>
      <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><p>STEP <strong>0{index + 1}</strong></p><HomeIcon name={step.icon}/><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
      <div className={styles.recordStrip}><HomeIcon name="clock"/><div><h3>今日の続きは、学習記録から。</h3><p>進み具合や確認問題の結果、学習メモを振り返れます。</p></div><Link href="/learning-records">学習記録を見る<HomeIcon name="arrow"/></Link></div>
    </div></section>

    <section id="for-business" className={styles.business}><div className={styles.container}>
      <div><p className={styles.kicker}>FOR BUSINESS</p><h2>職場のAI活用も、<br/>共通の基礎づくりから。</h2><p>「わからない言葉」が人によって違うからこそ、<br/>同じ教材で、ひとつずつ確かめる。<br/>社内で学ぶ内容を検討する際にも、ぜひ教材をご覧ください。</p><Link className={styles.secondary} href="/courses">研修に使える内容を見る<HomeIcon name="arrow"/></Link></div>
      <aside><span className={styles.preparing}>法人向けサービスは準備中</span><h3>まずは、教材をご体験ください。</h3><p>料金・導入支援・管理者向けの機能は、正式な提供内容が決まり次第ご案内します。</p><p className={styles.businessNote}>現在のデモでは、社員アカウントの管理や、会社単位での進捗集計はできません。</p></aside>
    </div></section>

    <section id="faq" className={styles.section}><div className={styles.faqContainer}>
      <SectionHeading label="FAQ" title="よくあるご質問"/>
      <div className={styles.faqList}>{questions.map(([question, answer]) => <details key={question}><summary><span aria-hidden="true">Q</span>{question}<span className={styles.faqToggle} aria-hidden="true"/></summary><p>{answer}</p></details>)}</div>
    </div></section>

    <section className={styles.finalCta}><p>まずは、ひとつの「わかった」から。</p><h2>最初のレッスンを、<br className={styles.mobileBreak}/>開いてみませんか。</h2><Link className={styles.primary} href={trialLesson}><HomeIcon name="book"/>レッスンを体験する<HomeIcon name="arrow"/></Link><span>登録不要・確認テストまで体験できます</span></section>
  </>;
}
