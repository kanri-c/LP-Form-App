"use client";

import { useState } from "react";
import styles from "./page.module.css";
import BasicInfoSection from "./_components/BasicInfoSection";
import SnsSection from "./_components/SnsSection";
import MenuSection from "./_components/MenuSection";
import AssetsSection from "./_components/AssetsSection";
import OptionalSection from "./_components/OptionalSection";
import type {
  BasicInfoInput,
  SnsLinkInput,
  MenuItemInput,
  ImageInput,
  OptionalInput,
} from "@/lib/types";

const initialBasicInfo: BasicInfoInput = {
  storeName: "",
  repName: "",
  phone: "",
  postalCode: "",
  address: "",
  nearestStation: "",
  businessHours: "",
  holidays: "",
  otherInfo: "",
};

const initialMenuItems: MenuItemInput[] = [
  {
    id: "menu-initial",
    name: "",
    priceText: "",
    description: "",
    photos: [],
  },
];

const initialOptional: OptionalInput = {
  concept: "",
  brandColor: "",
};

// バリデーション。エラーがあればメッセージを返す。なければ空配列。
function validate(
  basicInfo: BasicInfoInput,
  menuItems: MenuItemInput[]
): string[] {
  const errors: string[] = [];

  if (!basicInfo.storeName.trim()) errors.push("店舗名 / 企業名は必須です。");
  if (!basicInfo.repName.trim()) errors.push("代表者名は必須です。");
  if (!basicInfo.phone.trim()) errors.push("電話番号は必須です。");
  if (!basicInfo.postalCode.trim()) errors.push("郵便番号は必須です。");
  if (!basicInfo.address.trim()) errors.push("住所は必須です。");

  const hasMenuName = menuItems.some((item) => item.name.trim() !== "");
  if (!hasMenuName) {
    errors.push("メニュー / プランの名称を1つ以上入力してください。");
  }

  return errors;
}

export default function RequestPage() {
  const [basicInfo, setBasicInfo] = useState<BasicInfoInput>(initialBasicInfo);
  const [snsLinks, setSnsLinks] = useState<SnsLinkInput[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemInput[]>(initialMenuItems);
  const [logo, setLogo] = useState<ImageInput | null>(null);
  const [otherAssets, setOtherAssets] = useState<ImageInput[]>([]);
  const [optional, setOptional] = useState<OptionalInput>(initialOptional);

  // エラーメッセージの一覧。空配列 = エラーなし。
  const [errors, setErrors] = useState<string[]>([]);
  // 送信中フラグ（モックでは見た目だけ）
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 送信完了フラグ
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    // バリデーション実行
    const newErrors = validate(basicInfo, menuItems);
    setErrors(newErrors);

    // エラーがあれば先頭へスクロールして止める
    if (newErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // モック: 実際の送信の代わりに1秒待って完了にする
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // 送信完了画面
  if (isSubmitted) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.submitted}>
            <p className={styles.submittedIcon}>✓</p>
            <h1 className={styles.submittedTitle}>制作依頼を受け付けました</h1>
            <p className={styles.submittedText}>
              内容を確認の上、担当者よりご連絡いたします。
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>制作依頼フォーム</h1>
        <p className={styles.lead}>
          LP制作に必要な情報を入力してください。
        </p>

        <div className={styles.sections}>
          <BasicInfoSection value={basicInfo} onChange={setBasicInfo} />
          <SnsSection value={snsLinks} onChange={setSnsLinks} />
          <MenuSection value={menuItems} onChange={setMenuItems} />
          <AssetsSection
            logo={logo}
            otherAssets={otherAssets}
            onLogoChange={setLogo}
            onOtherAssetsChange={setOtherAssets}
          />
          <OptionalSection value={optional} onChange={setOptional} />
        </div>
        {/* 送信ボタン */}
        <div className={styles.submitArea}>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "送信中..." : "制作依頼を送信する"}
          </button>
        </div>
      </div>
    </main>
  );
}