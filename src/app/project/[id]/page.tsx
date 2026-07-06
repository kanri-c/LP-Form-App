import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import styles from "./page.module.css";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { STATUS_CONFIG } from "@/lib/types";
import CompleteButton from "./CompleteButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  // ログイン確認
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // 案件取得（自分の案件のみ）
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      detail: true,
      revisions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // 存在しない or 他人の案件はnotFound
  if (!project || project.clientId !== user.id) notFound();

  // 修正依頼ボタンを表示するか
  const showActions = project.status === "draft_submitted";
  const showPostRevision = project.status === "published";

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.back}>
          ← ダッシュボードへ戻る
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>{project.detail?.storeName}</h1>
          <span
            className={styles.statusBadge}
            style={{
              color: STATUS_CONFIG[project.status].color,
              backgroundColor: STATUS_CONFIG[project.status].bgColor,
            }}
          >
            {STATUS_CONFIG[project.status].label}
          </span>
        </div>

        {/* 初稿URL */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>プレビューURL</h2>
          {project.previewUrl ? (
            <a
              href={project.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.previewLink}
            >
              {project.previewUrl} ↗
            </a>
          ) : (
            <p className={styles.empty}>
              まだ初稿が届いていません。制作完了までお待ちください。
            </p>
          )}
        </section>

        {/* 修正履歴 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>修正履歴</h2>
          {project.revisions.length > 0 ? (
            <ul className={styles.revisionList}>
              {project.revisions.map((rev) => (
                <li key={rev.id} className={styles.revisionItem}>
                  <div className={styles.revisionHeader}>
                    <span className={styles.revisionNo}>
                      修正依頼 {rev.seqNo}回目
                      （{rev.phase === "pre" ? "公開前" : "公開後"}）
                    </span>
                    <span
                      className={`${styles.revisionStatus} ${
                        rev.status === "done"
                          ? styles.revisionDone
                          : styles.revisionOpen
                      }`}
                    >
                      {rev.status === "done" ? "対応済み" : "対応中"}
                    </span>
                  </div>
                  {rev.targetArea && (
                    <p className={styles.revisionArea}>
                      該当箇所: {rev.targetArea}
                    </p>
                  )}
                  <p className={styles.revisionContent}>{rev.content}</p>
                  <p className={styles.revisionDate}>
                    {rev.createdAt.toLocaleDateString("ja-JP")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>修正履歴はありません。</p>
          )}
        </section>

        {/* 初稿提出済みのときのアクション */}
        {showActions && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>確認結果</h2>
            <p className={styles.actionNote}>
              初稿をご確認いただき、修正依頼または完了をお選びください。
            </p>
            <div className={styles.actions}>
              <Link
                href={`/project/${project.id}/revision`}
                className={styles.revisionButton}
              >
                修正依頼をする
              </Link>
              <CompleteButton projectId={project.id} />
            </div>
          </section>
        )}

        {/* 公開済みのときの公開後修正 */}
        {showPostRevision && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>公開後の修正</h2>
            <p className={styles.actionNote}>
              軽微なテキスト修正のみ対応可能です（年2回まで）。
            </p>
            <Link
              href={`/project/${project.id}/revision`}
              className={styles.revisionButton}
            >
              修正依頼をする
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}