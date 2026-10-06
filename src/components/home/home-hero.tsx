import Link from 'next/link';
import { courseCatalog } from '@/lib/course-catalog';
import { lessonPath } from '@/lib/routes';
import { HomeIcon } from './home-icon';
import styles from './home.module.css';

export const trialLesson = lessonPath(courseCatalog[0].lessons[0].slug);
export function HomeHero() {
  const lessonCount = courseCatalog.reduce((total, course) => total + course.lessons.length, 0);
  const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? '';
  return <section className={styles.hero} aria-labelledby="home-title">
    <div className={styles.heroVisual}>
      <div className={styles.photoWrap}>
        <img className={styles.heroPhoto} src={`${base}/images/campus-learning.webp`} width="1536" height="1024" alt="ノートを手元に、パソコンで学習するイメージ" fetchPriority="high" />
        <div className={styles.photoCaption}><span>今日の「わかった」が、</span><br/><span>明日の自信になる。</span></div>
        <span className={styles.photoCredit}>学習イメージ / AI生成</span>
      </div>
      <div className={styles.heroActions}>
        <Link className={styles.primary} href={trialLesson}><HomeIcon name="book"/>レッスンを体験する<HomeIcon name="arrow"/></Link>
        <Link className={styles.secondary} href="/courses">コースを選ぶ<HomeIcon name="arrow"/></Link>
      </div>
      <p className={styles.actionNote}>登録不要。最初の解説と確認テストを、そのまま体験できます。</p>
    </div>
    <div className={styles.heroCopy}>
      <p className={styles.heroPill}><HomeIcon name="globe"/>自分のペースで、一歩ずつ。</p>
      <h1 id="home-title"><em>AIを学ぶ、</em><br/>その一歩を<br/><span className={styles.underline}>ここから。</span></h1>
      <p className={styles.heroDescription}>言葉を知る。仕組みがわかる。<br/>PCの基礎から始める、<br/><strong>大人のための学習サイト。</strong></p>
      <div className={styles.heroBadges}>
        <div><span>基礎から学ぶ</span><strong>{courseCatalog.length}<small>コース</small></strong></div>
        <div><span>ひとつずつ進む</span><strong>{lessonCount}<small>レッスン</small></strong></div>
        <div><span>理解を確かめる</span><strong className={styles.badgeWords}>ミニ<br/>テスト付き</strong></div>
      </div>
      <p className={styles.heroFootnote}>現在は基礎教材の公開デモです。</p>
    </div>
  </section>;
}
