import styles from "./LanguageSelector.module.css";

const AVAILABLE_LANGUAGES = ["English", "Hindi", "Malayalam", "Spanish", "Portuguese", "German", "French"];

type Props = {
  value: string[];
  onChange: (langs: string[]) => void;
};

export default function LanguageSelector({ value, onChange }: Props) {
  const toggleLanguage = (lang: string) => {
    if (value.includes(lang)) {
      onChange(value.filter(l => l !== lang));
    } else {
      onChange([...value, lang]);
    }
  };

  return (
    <div className={styles.wrapper}>
      {AVAILABLE_LANGUAGES.map(lang => (
        <button
          key={lang}
          type="button"
          className={
            value.includes(lang)
              ? `${styles.chip} ${styles.active}`
              : styles.chip
          }
          onClick={() => toggleLanguage(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
