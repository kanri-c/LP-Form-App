import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import styles from "./ImageUploader.module.css";
import type { ImageInput } from "@/lib/types";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type Props = {
  images: ImageInput[];
  onChange: (images: ImageInput[]) => void;
  maxCount: number;
};

export default function ImageUploader({ images, onChange, maxCount }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = maxCount - images.length;
    const selected = Array.from(files).slice(0, remaining);

    setIsUploading(true);
    const newImages: ImageInput[] = [];

    for (const file of selected) {
      if (file.size > MAX_SIZE_BYTES) {
        alert(`「${file.name}」は5MBを超えているため追加できません。`);
        continue;
      }

      try {
        // ブラウザからVercel Blobへ直接アップロード
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });

        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          previewUrl: blob.url,
          sizeBytes: file.size,
        });
      } catch {
        alert(`「${file.name}」のアップロードに失敗しました。`);
      }
    }

    onChange([...images, ...newImages]);
    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const canAddMore = images.length < maxCount && !isUploading;

  return (
    <div className={styles.uploader}>
      <div className={styles.previewList}>
        {images.map((img) => (
          <div key={img.id} className={styles.preview}>
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

        {isUploading && (
          <div className={styles.uploading}>
            <span className={styles.uploadingText}>アップロード中...</span>
          </div>
        )}

        {canAddMore && (
          <label className={styles.addLabel}>
            <input
              ref={inputRef}
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