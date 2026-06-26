// 制作依頼フォームが扱うデータの型定義


// SNS / 既存ウェブサイト
export type SnsPlatform = 'instagram' | 'x' | 'line' | 'facebook' | 'website';

export interface SnsLinkInput {
  platform: SnsPlatform;
  url: string;
}

// 画像素材
export interface ImageInput {
  id: string; // 画面内で一意に扱うためのID
  fileName: string; // 表示用のファイル名
  previewUrl: string;
  sizeBytes: number;
}

// メニュー / プラン
export interface MenuItemInput {
  id: string;
  name: string;
  priceText: string;
  description: string;
  photos: ImageInput[];
}

// 基本情報
export interface BasicInfoInput {
  storeName: string;
  repName: string;
  phone: string;
  postalCode: string;
  address: string;
  nearestStation: string;
  businessHours: string; // 営業時間
  holidays: string; // 定休日
  otherInfo: string; // その他記載したい内容
}

// ご希望があれば
export interface OptionalInput {
  concept: string;
  brandColor: string;
}

// フォーム全体
// 上記全てを束ねたデータ
export interface RequestFormInput {
  basicInfo: BasicInfoInput;
  snsLinks: SnsLinkInput[];
  menuItems: MenuItemInput[];
  logo: ImageInput | null;
  otherAssets: ImageInput[];
  optional: OptionalInput;
}