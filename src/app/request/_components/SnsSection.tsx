import styles from './SnsSection.module.css';
import type { SnsLinkInput, SnsPlatform } from '@/lib/types';

type Props = {
  value: SnsLinkInput[];
  onChange: (value: SnsLinkInput[]) => void;
};

const SNS_FIELDS: {
  platform: SnsPlatform;
  label: string;
  placeholder: string;
} [] = [
  { platform: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { platform: "x", label: "X (Twitter)", placeholder: "https://x.com/..." },
  { platform: "line", label: "LINE", placeholder: "https://lin.ee/..." },
  { platform: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { platform: "website", label: "Website", placeholder: "https://..." },
];

export default function SnsSection({ value, onChange }: Props) {
  const getUrl = (platform: SnsPlatform): string => {
    return value.find((link) => link.platform === platform)?.url ?? '';
  };

  const update = (platform: SnsPlatform, url: string) => {
    const others = value.filter((link) => link.platform !== platform);
    if (url.trim() === '') {
      onChange(others);
    } else {
      onChange([...others, { platform, url }]);
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>SNS / 既存ウェブサイト</h2>
      <p className={styles.note}>お持ちのものがあれば入力してください（任意）。</p>

      {SNS_FIELDS.map((field) => (
        <div key={field.platform} className={styles.field}>
          <label className={styles.label}>{field.label}</label>
          <input
            type="url"
            className={styles.input}
            placeholder={field.placeholder}
            value={getUrl(field.platform)}
            onChange={(e) => update(field.platform, e.target.value)}
          />
        </div>
      ))}
    </section>
  );
}