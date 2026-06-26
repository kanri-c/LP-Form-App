// 制作依頼フォームが扱うデータの型定義


// SNS / 既存ウェブサイト
export type SnsPlatform = 'instagram' | 'x' | 'line' | 'facebook' | 'website';

export interface SnsLinkInput {
  platform: SnsPlatform;
  url: string;
}

// 画像素材
export interface ImageInput {
  id: string;
  fileName: string;
  previewUrl: string;
  sizeBytes: number;
}