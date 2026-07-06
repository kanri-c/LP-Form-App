"use client";
import { submitRequest } from "./actions";
import { useState } from "react";
import Link from "next/link";
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

  // 名称が入力されているメニューには写真を必須にする（最低1枚）
  menuItems.forEach((item, index) => {
    if (item.name.trim() !== "" && item.photos.length === 0) {
      errors.push(
        `写真を添付してください。`
      );
    }
  });

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
    const newErrors = validate(basicInfo, menuItems);
    setErrors(newErrors);

    if (newErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    const result = await submitRequest({
      basicInfo,
      snsLinks,
      menuItems,
      logo,
      otherAssets,
      optional,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setErrors([result.error]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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
              <br />
              進捗はダッシュボードからご確認いただけます。
            </p>
            <Link href="/dashboard" className={styles.dashboardButton}>
              ダッシュボードを確認する
            </Link>
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

        {/* エラー一覧。送信を押してエラーがあれば表示 */}
        {errors.length > 0 && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>入力内容を確認してください</p>
            <ul className={styles.errorList}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </div>
      </div>
    </main>
  );
}