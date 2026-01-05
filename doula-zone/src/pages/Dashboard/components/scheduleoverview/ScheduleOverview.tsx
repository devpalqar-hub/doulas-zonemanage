import { useEffect, useState } from "react";
import CalendarDay from "./CalendarDay";
import styles from "./ScheduleOverview.module.css";
import api from "../../../../services/api";

type CalendarSummary = {
  date: string;
  appointmentCount: number;
  scheduleCount: number;
};

export default function ScheduleOverview() {
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [summary, setSummary] = useState<Record<string, CalendarSummary>>({});

  const today = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${daysInMonth}`;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(
          `/analytics/calender/summary?startDate=${startDate}&endDate=${endDate}`
        );

        const map: Record<string, CalendarSummary> = {};
        res.data.data.forEach((item: CalendarSummary) => {
          map[item.date] = item;
        });

        setSummary(map);
      } catch (err) {
        console.error("Failed to fetch calendar summary", err);
      }
    };

    fetchSummary();
  }, [startDate, endDate]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>Schedule Overview</h4>
        {/* <span>View Full Calendar</span> */}
      </div>

      <div className={styles.monthRow}>
        <h5>
          {date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h5>
        <div>
          <button onClick={() => setDate(new Date(year, month - 1))}>‹</button>
          <button onClick={() => setDate(new Date(year, month + 1))}>›</button>
        </div>
      </div>

      <div className={styles.calendarScroll}>
        <div className={styles.weekdays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className={styles.grid}>
          {Array(startDay)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

            return (
              <CalendarDay
                key={day}
                day={day}
                meetingCount={summary[key]?.appointmentCount || 0}
                scheduleCount={summary[key]?.scheduleCount || 0}
                isToday={
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear()
                }
                isSelected={day === selectedDay}
                onSelect={() => setSelectedDay(day)}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div>
          <span className={styles.meetingDot} /> Meetings
        </div>
        <div>
          <span className={styles.bookingDot} /> Schedule
        </div>
        <div>
          <span className={styles.todayDot} /> Today
        </div>
      </div>
    </div>
  );
}
