import styles from "./BasicInfoSection.module.css";
import type { BasicInfoInput } from "@/lib/types";

type Props = {
  value: BasicInfoInput;
  onChange: (value: BasicInfoInput) => void;
};

export default function BasicInfoSection({ value, onChange }: Props) {
  // 各入力欄が変更されたとき、該当項目だけ更新して親へ渡す
  const update = (field: keyof BasicInfoInput, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>基本情報</h2>

      <div className={styles.field}>
        <label className={styles.label}>
          店舗名 / 企業名<span className={styles.required}>必須</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={value.storeName}
          onChange={(e) => update("storeName", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          代表者名<span className={styles.required}>必須</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={value.repName}
          onChange={(e) => update("repName", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          電話番号<span className={styles.required}>必須</span>
        </label>
        <input
          type="tel"
          className={styles.input}
          value={value.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          郵便番号<span className={styles.required}>必須</span>
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="例: 1000001"
          value={value.postalCode}
          onChange={(e) => update("postalCode", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          住所<span className={styles.required}>必須</span>
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="地番以降は手入力してください"
          value={value.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>最寄駅</label>
        <input
          type="text"
          className={styles.input}
          value={value.nearestStation}
          onChange={(e) => update("nearestStation", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>営業時間</label>
        <input
          type="text"
          className={styles.input}
          value={value.businessHours}
          onChange={(e) => update("businessHours", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>定休日</label>
        <input
          type="text"
          className={styles.input}
          value={value.holidays}
          onChange={(e) => update("holidays", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>その他記載したい店舗情報</label>
        <textarea
          className={styles.textarea}
          rows={4}
          value={value.otherInfo}
          onChange={(e) => update("otherInfo", e.target.value)}
        />
      </div>
    </section>
  );
}