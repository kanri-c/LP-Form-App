import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { MAX_ASSET_SIZE_BYTES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  // ログイン確認
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ファイルが選択されていません。" }, { status: 400 });
  }

  // 5MB上限チェック
  if (file.size > MAX_ASSET_SIZE_BYTES) {
    return NextResponse.json(
      { error: "ファイルサイズが上限（5MB）を超えています。" },
      { status: 400 }
    );
  }

  // Vercel Blobにアップロード
  const blob = await put(file.name, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}