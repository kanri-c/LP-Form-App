import styles from "./ImageUploader.module.css";
import type { ImageInput } from "@/lib/types";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type Props = {
  images: ImageInput[];
  onChange: (images: ImageInput[]) => void;
  maxCount: number; // 添付できる最大枚数
};

export default function ImageUploader({ images, onChange, maxCount }: Props) {
  // ファイルが選択されたとき
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxCount - images.length;
    const selected = Array.from(files).slice(0, remaining);

    const newImages: ImageInput[] = [];
    for (const file of selected) {
      // 5MB超は受け付けない（モックでは簡易チェック）
      if (file.size > MAX_SIZE_BYTES) {
        alert(`「${file.name}」は5MBを超えているため追加できません。`);
        continue;
      }
      newImages.push({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file), // ブラウザ内の一時プレビューURL
        sizeBytes: file.size,
      });
    }

    onChange([...images, ...newImages]);
    // 同じファイルを連続で選べるよう入力欄をリセット
    e.target.value = "";
  };

  // 指定idの画像を削除
  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const canAddMore = images.length < maxCount;

  return (
    <div className={styles.uploader}>
      <div className={styles.previewList}>
        {images.map((img) => (
          <div key={img.id} className={styles.preview}>
            {/* プレビュー表示。next/imageではなく素のimgでよい（一時URLのため） */}
            <img src={img.previewUrl} alt={img.fileName} className={styles.previewImg} />
            <button
              type="button"
              className={styles.removeImg}
              onClick={() => removeImage(img.id)}
              aria-label="画像を削除"
            >
              ×
            </button>
          </div>
        ))}

        {canAddMore && (
          <label className={styles.addLabel}>
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.fileInput}
              onChange={handleSelect}
            />
            <span className={styles.addIcon}>＋</span>
            <span className={styles.addText}>写真を追加</span>
          </label>
        )}
      </div>
      <p className={styles.hint}>
        {images.length} / {maxCount} 枚（1枚あたり5MBまで）
      </p>
    </div>
  );
}