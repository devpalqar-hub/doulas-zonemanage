import styles from "./ScheduleOverview.module.css";

interface CalendarDayProps {
  day: number;
  meetingCount: number;
  scheduleCount: number;
  isToday: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export default function CalendarDay({
  day,
  meetingCount,
  scheduleCount,
  isToday,
  isSelected,
  onSelect,
}: CalendarDayProps) {
  return (
    <div
      className={`${styles.day} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <span>{day}</span>

      <div className={styles.bars}>
        {meetingCount > 0 && <div className={styles.meeting} />}
        {scheduleCount > 0 && <div className={styles.booking} />}
        {isToday && <div className={styles.todayBar} />}
      </div>
    </div>
  );
}
