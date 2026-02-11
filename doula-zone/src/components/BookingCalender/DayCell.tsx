import styles from "./calendarStyles.module.css";

type Props = {
  date: string;
  label: string;
  state: string;
  onClick: () => void;
};

export default function DayCell({ label, state, onClick }: Props) {
  const isClickable = state !== "blocked" && state !== "outside";
  
  return (
    <div
      className={`${styles.day} ${styles[state]} ${isClickable ? styles.clickable : ""}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <span className={styles.dayLabel}>{label}</span>
      {state === "visit" && <span className={styles.visitMarker}>●</span>}
    </div>
  );
}