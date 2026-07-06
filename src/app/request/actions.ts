"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import type { RequestFormInput } from "@/lib/types";

export async function submitRequest(data: RequestFormInput) {
  // ログイン確認
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // バリデーション（必須項目）
  const { basicInfo, menuItems } = data;
  if (
    !basicInfo.storeName.trim() ||
    !basicInfo.repName.trim() ||
    !basicInfo.phone.trim() ||
    !basicInfo.postalCode.trim() ||
    !basicInfo.address.trim()
  ) {
    return { error: "必須項目を入力してください。" };
  }
  if (!menuItems.some((item) => item.name.trim())) {
    return { error: "メニュー / プランを1つ以上入力してください。" };
  }
  // 名称が入力されているメニューには写真必須
  const menuWithoutPhoto = menuItems.find(
    (item) => item.name.trim() !== "" && item.photos.length === 0
  );
  if (menuWithoutPhoto) {
    return {
      error: `メニュー「${menuWithoutPhoto.name}」に写真を1枚以上添付してください。`,
    };
  }

  // 保存対象のメニュー（名称が入力されているもののみ）
  const validMenuItems = menuItems.filter((item) => item.name.trim());

  // DBに保存
  const project = await prisma.project.create({
    data: {
      clientId: user.id,
      status: "waiting",
      detail: {
        create: {
          storeName: basicInfo.storeName,
          repName: basicInfo.repName,
          phone: basicInfo.phone,
          postalCode: basicInfo.postalCode,
          address: basicInfo.address,
          nearestStation: basicInfo.nearestStation || null,
          businessHours: basicInfo.businessHours || null,
          holidays: basicInfo.holidays || null,
          otherInfo: basicInfo.otherInfo || null,
          concept: data.optional.concept || null,
          brandColor: data.optional.brandColor || null,
        },
      },
      menuItems: {
        create: validMenuItems.map((item, index) => ({
          sortOrder: index,
          name: item.name,
          priceText: item.priceText || null,
          description: item.description || null,
        })),
      },
      snsLinks: {
        create: data.snsLinks.map((sns) => ({
          platform: sns.platform,
          url: sns.url,
        })),
      },
    },
    include: {
      menuItems: { orderBy: { sortOrder: "asc" } },
    },
  });

  // --- 画像をAssetテーブルへ保存 ---

  // ロゴ
  if (data.logo) {
    await prisma.asset.create({
      data: {
        projectId: project.id,
        kind: "logo",
        blobUrl: data.logo.previewUrl,
        sizeBytes: data.logo.sizeBytes,
      },
    });
  }

  // その他の素材
  if (data.otherAssets.length > 0) {
    await prisma.asset.createMany({
      data: data.otherAssets.map((img) => ({
        projectId: project.id,
        kind: "other" as const,
        blobUrl: img.previewUrl,
        sizeBytes: img.sizeBytes,
      })),
    });
  }

  // メニュー写真（sortOrderで作成済みメニューと対応付ける）
  for (let i = 0; i < validMenuItems.length; i++) {
    const photos = validMenuItems[i].photos;
    if (photos.length === 0) continue;

    const createdMenu = project.menuItems[i];
    await prisma.asset.createMany({
      data: photos.map((img) => ({
        projectId: project.id,
        menuItemId: createdMenu.id,
        kind: "menu_photo" as const,
        blobUrl: img.previewUrl,
        sizeBytes: img.sizeBytes,
      })),
    });
  }

  return { success: true };
}