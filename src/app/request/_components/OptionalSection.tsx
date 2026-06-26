import styles from "./OptionalSection.module.css";
import type { OptionalInput } from "@/lib/types";

type Props = {
  value: OptionalInput;
  onChange: (value: OptionalInput) => void;
};

export default function OptionalSection({ value, onChange }: Props) {
  const update = (field: keyof OptionalInput, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>ご希望があれば</h2>
      <p className={styles.note}>
        希望がある場合のみ入力してください（任意）。
      </p>

      <div className={styles.field}>
        <label className={styles.label}>コンセプト</label>
        <p className={styles.hint}>
          サイトのイメージや伝えたいことがあれば教えてください。
        </p>
        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="例: 落ち着いた雰囲気で、高級感のある仕上がりにしたい"
          value={value.concept}
          onChange={(e) => update("concept", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>使用カラー</label>
        <p className={styles.hint}>
          希望の色やカラーコードがあれば入力してください。
        </p>
        <input
          type="text"
          className={styles.input}
          placeholder="例: 深緑・ゴールド / #2f5d50"
          value={value.brandColor}
          onChange={(e) => update("brandColor", e.target.value)}
        />
      </div>
    </section>
  );
}