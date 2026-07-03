import styles from "./page.module.css";
import { signIn } from "@/auth";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.title}>LP制作依フォーム</h1>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button type="submit" className={styles.loginButton}>
            Googleでログイン
          </button>
        </form>
      </div>
    </main>
  );
}