import styles from "./WeeklyActivity.module.css";
import WeeklyActivityChart from "./WeeklyActivityChart";
import type { WeeklyActivityItem } from "./WeeklyActivityChart";

const weeklyActivityData: WeeklyActivityItem[] = [
  { day: "Mon", bookings: 6, meetings: 4 },
  { day: "Tue", bookings: 5, meetings: 3 },
  { day: "Wed", bookings: 8, meetings: 5 },
  { day: "Thu", bookings: 7, meetings: 7 },
  { day: "Fri", bookings: 9, meetings: 6 },
  { day: "Sat", bookings: 4, meetings: 2 },
  { day: "Sun", bookings: 3, meetings: 1 },
];

export default function WeeklyActivity() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>Weekly Activity</h3>
          <p>Meetings and bookings overview</p>
        </div>
      </div>

      <WeeklyActivityChart data={weeklyActivityData} />
    </div>
  );
}
