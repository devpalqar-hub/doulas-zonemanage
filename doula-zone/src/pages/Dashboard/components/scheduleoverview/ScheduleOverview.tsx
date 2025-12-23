import { useState } from "react";
import CalendarDay from "./CalendarDay";
import styles from "./ScheduleOverview.module.css";

export default function ScheduleOverview() {
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>Schedule Overview</h4>
        <span>View Full Calendar</span>
      </div>

      <div className={styles.monthRow}>
        <h5>{date.toLocaleString("default", { month: "long", year: "numeric" })}</h5>
        <div>
          <button onClick={() => setDate(new Date(year, month - 1))}>‹</button>
          <button onClick={() => setDate(new Date(year, month + 1))}>›</button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {Array(startDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}


        {Array.from({ length: daysInMonth }, (_, i) => (
          <CalendarDay key={i} day={i + 1} />
        ))}
      </div>
    </div>
  );
}
