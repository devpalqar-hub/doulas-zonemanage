import { useEffect, useState } from "react";
import styles from "./WeeklyActivity.module.css";

import WeeklyActivityChart,{
  type WeeklyActivityItem,
} from "./WeeklyActivityChart";

import { fetchWeeklyActivity, type DailyActivityResponse } from "../../../../services/analytics.services";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const normalizeWeeklyData = (
  data: DailyActivityResponse[]
): WeeklyActivityItem[] => {
  const map = new Map<string, DailyActivityResponse>();

  data.forEach((d) => {
    map.set(d.weekday, d);
  });

  return WEEK_DAYS.map((day) => ({
    day,
    bookings: map.get(day)?.noOfBookings ?? 0,
    meetings: map.get(day)?.noOfMeetings ?? 0,
  }));
};

export default function WeeklyActivity() {
  const [data, setData] = useState<WeeklyActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchWeeklyActivity();
        setData(normalizeWeeklyData(res));
      } catch (err) {
        console.error("Failed to load weekly activity", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>Weekly Activity</h3>
          <p>Meetings and bookings overview</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading chart…</div>
      ) : (
        <WeeklyActivityChart data={data} />
      )}
    </div>
  );
}
