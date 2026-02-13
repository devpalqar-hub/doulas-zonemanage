import styles from "./calendarStyles.module.css";

type Props = {
  date: string;
  label: string;
  state: string[]; 
  onClick: () => void;
};


export default function DayCell({ label, state, onClick }: Props) {
  const isClickable = !state.includes("blocked") 
  && !state.includes("outside")
   && !state.includes("disabled");

  return (
    <div
      className={`${styles.day} ${state.map(s => styles[s]).join(" ")} ${isClickable ? styles.clickable : ""}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <span className={styles.dayLabel}>{label}</span>
      {state.includes("visit") && <span className={styles.visitMarker}>●</span>}
    </div>
  );
}
