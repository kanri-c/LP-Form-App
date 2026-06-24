import Link from 'next/link';
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.title}>LP制作依頼フォーム</h1>
      </div>
      <Link href="/request" className={styles.loginButton}>Googleでログイン</Link>
    </main>
  );
}
