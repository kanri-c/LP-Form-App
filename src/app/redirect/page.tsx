import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// ログイン直後の振り分け専用ページ。
// 案件があれば /dashboard、なければ /request へ即座にリダイレクトする。
export default async function RedirectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const project = await prisma.project.findFirst({
    where: { clientId: user.id },
    select: { id: true },
  });

  redirect(project ? "/dashboard" : "/request");
}