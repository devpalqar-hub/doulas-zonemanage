import styles from "./ScheduleOverview.module.css";

interface CalendarDayProps {
  day: number;
}

export default function CalendarDay({ day }: CalendarDayProps) {
  const meetings = [24, 26, 28];
  const bookings = [25, 27, 29];
  const today = new Date().getDate();

  return (
    <div className={`${styles.day} ${day === today ? styles.today : ""}`}>
      <span>{day}</span>

      <div className={styles.bars}>
        {meetings.includes(day) && <div className={styles.meeting} />}
        {bookings.includes(day) && <div className={styles.booking} />}
      </div>
    </div>
  );
}
