import styles from "./MenuSection.module.css";
import type { MenuItemInput, ImageInput } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const MAX_MENU_ITEMS = 5;

type Props = {
  value: MenuItemInput[];
  onChange: (value: MenuItemInput[]) => void;
};

// 新しい空のメニュー項目を作る。idは時刻ベースの仮ID。
function createEmptyMenuItem(): MenuItemInput {
  return {
    id: `menu-${Date.now()}`,
    name: "",
    priceText: "",
    description: "",
    photos: [],
  };
}

export default function MenuSection({ value, onChange }: Props) {
  // 指定idのメニューの、指定項目だけ更新する
  const updateItem = (
    id: string,
    field: keyof Omit<MenuItemInput, "id" | "photos">,
    fieldValue: string
  ) => {
    onChange(
      value.map((item) =>
        item.id === id ? { ...item, [field]: fieldValue } : item
      )
    );
  };

  // メニューを1つ追加（上限未満のときのみ）
  const addItem = () => {
    if (value.length >= MAX_MENU_ITEMS) return;
    onChange([...value, createEmptyMenuItem()]);
  };

  // 指定idのメニューを削除（最低1つは残す）
  const removeItem = (id: string) => {
    if (value.length <= 1) return;
    onChange(value.filter((item) => item.id !== id));
  };

  // 指定idのメニューの写真を更新する
  const updatePhotos = (id: string, photos: ImageInput[]) => {
    onChange(
      value.map((item) => (item.id === id ? { ...item, photos } : item))
    );
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        記載メニュー / プラン<span className={styles.required}>必須</span>
      </h2>
      <p className={styles.note}>
        最大{MAX_MENU_ITEMS}項目まで登録できます。
      </p>

      {value.map((item, index) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.itemNumber}>メニュー {index + 1}</span>
            {value.length > 1 && (
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeItem(item.id)}
              >
                削除
              </button>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>名称</label>
            <input
              type="text"
              className={styles.input}
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>値段</label>
            <input
              type="text"
              className={styles.input}
              placeholder="例: ¥1,000 / 応相談 など"
              value={item.priceText}
              onChange={(e) => updateItem(item.id, "priceText", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>紹介文</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>写真（最大3枚）</label>
            <ImageUploader
              images={item.photos}
              onChange={(photos) => updatePhotos(item.id, photos)}
              maxCount={3}
            />
          </div>
        </div>
      ))}

      {value.length < MAX_MENU_ITEMS && (
        <button type="button" className={styles.addButton} onClick={addItem}>
          ＋ メニューを追加
        </button>
      )}
    </section>
  );
}