import { HomeHero } from '@/components/home/home-hero';
import { HomeSections } from '@/components/home/home-sections';
import styles from '@/components/home/home.module.css';

export default function Home() {
  return <main id="main-content" className={styles.home} tabIndex={-1}>
    <HomeHero />
    <HomeSections />
  </main>;
}
