import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 未ログインの場合、トップページ以外はトップへリダイレクト
  if (!isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // ログイン済みの場合の処理
  if (isLoggedIn && req.auth?.user?.email) {
    // トップページへのアクセスは振り分け処理へ
    if (pathname === "/") {
      const user = await prisma.user.findFirst({
        where: { email: req.auth.user.email },
      });

      if (user) {
        const project = await prisma.project.findFirst({
          where: { clientId: user.id },
          select: { id: true },
        });

        // 案件がなければ制作依頼フォームへ、あればダッシュボードへ
        return NextResponse.redirect(
          new URL(project ? "/dashboard" : "/request", req.nextUrl.origin)
        );
      }
    }
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};