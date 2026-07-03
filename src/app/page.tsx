import styles from "./page.module.css";
import { signIn } from "@/auth";

export default async function Home() {

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.title}>LP制作依頼フォーム</h1>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/redirect" });
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