import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../services/api";
import DayCell from "./DayCell";
import {generateMonthMatrix, getDayState} from "./calendarUtils";
import styles from "./calendarStyles.module.css";

type Props = {
  profileId?: string;
  serviceType?: string;
  visitDays: string[];
  onRangeSelect: (start: string, end: string) => void;
};

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingCalendar({
  profileId,
  serviceType,
  visitDays,
  onRangeSelect,
}: Props) {
  const [month, setMonth] = useState(dayjs());
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const isSingleMode = serviceType === "Birth Doula";

  /* FETCH AVAILABILITY */
  const monthKey = month.format("YYYY-MM");

  useEffect(() => {
    if (!profileId) return;

    const startDate = month.startOf("month").format("YYYY-MM-DD");
    const endDate = month.clone().add(2, "month").endOf("month").format("YYYY-MM-DD");

    Promise.all([
        api.get(`/doula/${profileId}/booked-dates`, {
        params: { startDate, endDate, filter: "UNBOOKED", serviceName: serviceType },
        }),
        api.get(`/doula/${profileId}/booked-dates`, {
        params: { startDate, endDate, filter: "BOOKED", serviceName: serviceType },
        }),
    ]).then(([unbookedRes, bookedRes]) => {

        const map: Record<string, boolean> = {};

          // Only UNBOOKED dates are truly available
          unbookedRes.data.data.unbookedDates?.forEach((d: string) => {
            map[d] = true;
          });

          // BOOKED explicitly unavailable
          bookedRes.data.data.bookedDates?.forEach((d: string) => {
            map[d] = false;
          });

        setAvailability(map);
    });

  }, [profileId, monthKey, serviceType]);

  useEffect(() => {
    setStart(null);
    setEnd(null);
  }, [serviceType]);

  /* CLICK HANDLER */
  const handleClick = (date: string) => {
    // BIRTH DOULA → single date mode
    if (serviceType === "Birth Doula") {
      if (availability[date] !== true) return;
      setStart(date);
      setEnd(date);
      onRangeSelect(date, date);
      return;
    }

    // POSTPARTUM → free range mode (NO BLOCKING)
    if (!start || end) {
      setStart(date);
      setEnd(null);
      return;
    }

    if (dayjs(date).isBefore(start)) {
      setStart(date);
      return;
    }

    // No validation here anymore
    setEnd(date);
    onRangeSelect(start, date);
  };


  /* MONTH/YEAR SELECTION */
  const currentYear = dayjs().year();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + i);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setMonth(month.month(newMonth));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setMonth(month.year(newYear));
  };

  const days = generateMonthMatrix(month);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={() => setMonth(month.subtract(1, "month"))}>‹</button>
        
        <div className={styles.monthYearSelector}>
          <select 
            className={styles.monthSelect}
            value={month.month()} 
            onChange={handleMonthChange}
          >
            {months.map((monthName, idx) => (
              <option key={idx} value={idx}>
                {monthName}
              </option>
            ))}
          </select>
          
          <select 
            className={styles.yearSelect}
            value={month.year()} 
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <button onClick={() => setMonth(month.add(1, "month"))}>›</button>
      </div>

      {/* Selection Info Banner */}
      {(start || end) && (
        <div className={styles.selectionInfo}>
          {serviceType === "Birth Doula" ? (
            <div className={styles.infoContent}>
              <span className={styles.infoIcon}>📅</span>
              <span>Selected: <strong>{dayjs(start).format("MMM D, YYYY")}</strong></span>
            </div>
          ) : (
            <div className={styles.infoContent}>
              <span className={styles.infoIcon}>📅</span>
              {!end ? (
                <span>Start: <strong>{dayjs(start).format("MMM D, YYYY")}</strong> → Pick end date</span>
              ) : (
                <span>
                  <strong>{dayjs(start).format("MMM D")}</strong> to <strong>{dayjs(end).format("MMM D, YYYY")}</strong>
                  <span className={styles.dayCount}> ({dayjs(end).diff(dayjs(start), "day") + 1} days)</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Weekday Headers */}
      <div className={styles.weekdayHeaders}>
        {WEEKDAY_HEADERS.map((day) => (
          <div key={day} className={styles.weekdayHeader}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map((d) => {
         const state = getDayState(d, availability, start, end, visitDays, month.format("YYYY-MM"), isSingleMode);

          return (
            <DayCell
              key={d}
              date={d}
              label={dayjs(d).date().toString()}
              state={state}
              onClick={() => handleClick(d)}
            />
          );
        })}
      </div>

      {/* Legend - Simplified and clear */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendAvailable}`}></div>
          <span>Available</span>
        </div>
        
        {/* Show "Selected" for Birth Doula, "Range" for Postpartum */}
        {serviceType === "Birth Doula" ? (
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendSelected}`}></div>
            <span>Selected</span>
          </div>
        ) : (
          <>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.legendSelected}`}></div>
              <span>Start/End</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.legendRange}`}></div>
              <span>In Range</span>
            </div>
          </>
        )}
        
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendBlocked}`}></div>
          <span>Unavailable</span>
        </div>
        
        {visitDays.length > 0 && (
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendVisit}`}></div>
            <span>Visit Day</span>
          </div>
        )}
      </div>
    </div>
  );
}