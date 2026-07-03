import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 未ログインの場合、トップページ以外はトップへリダイレクト
  if (!isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // トップページ（/）は常にログイン画面を表示する（振り分けしない）
  // 振り分けはログイン直後のコールバック側で行う
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};