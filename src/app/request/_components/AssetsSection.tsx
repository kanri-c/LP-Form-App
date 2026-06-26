import styles from "./AssetsSection.module.css";
import type { ImageInput } from "@/lib/types";
import ImageUploader from "./ImageUploader";

type Props = {
  logo: ImageInput | null;
  otherAssets: ImageInput[];
  onLogoChange: (logo: ImageInput | null) => void;
  onOtherAssetsChange: (assets: ImageInput[]) => void;
};

export default function AssetsSection({
  logo,
  otherAssets,
  onLogoChange,
  onOtherAssetsChange,
}: Props) {
  // ロゴは1枚だけなので ImageUploader の結果から先頭の1枚だけ取り出す
  const handleLogoChange = (images: ImageInput[]) => {
    onLogoChange(images.length > 0 ? images[0] : null);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>写真素材</h2>

      <div className={styles.field}>
        <label className={styles.label}>ロゴ</label>
        <p className={styles.note}>店舗・会社のロゴがあれば添付してください。</p>
        <ImageUploader
          images={logo ? [logo] : []}
          onChange={handleLogoChange}
          maxCount={1}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>その他の素材</label>
        <p className={styles.note}>
          使用したい写真・素材があれば添付してください。
        </p>
        <ImageUploader
          images={otherAssets}
          onChange={onOtherAssetsChange}
          maxCount={20}
        />
      </div>
    </section>
  );
}