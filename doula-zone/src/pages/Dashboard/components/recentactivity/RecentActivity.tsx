import styles from "./RecentActivity.module.css";
import {
  LuCalendar,
  LuCheck,
  LuClock,
  LuUser,
} from "react-icons/lu";

export default function RecentActivity() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Recent Activity</h4>
        <span className={styles.live}>Live</span>
      </div>

      <div className={styles.list}>
        <div className={styles.item}>
          <div className={`${styles.icon} ${styles.blue}`}>
            <LuCalendar />
          </div>
          <div className={styles.listdetails}>
            <span className={styles.name}>Sarah Johnson</span>
            <span className={styles.detail}>Updated availability for next week</span>
            <span className={styles.time}>5 minutes ago</span>
          </div>
        </div>

        <div className={styles.item}>
          <div className={`${styles.icon} ${styles.green}`}>
            <LuCheck />
          </div>
          <div className={styles.listdetails}>
            <span className={styles.name}>Emily Chen</span>
            <span className={styles.detail}>Completed check-in for booking #1234</span>
            <span className={styles.time}>15 minutes ago</span>
          </div>
        </div>

        <div className={styles.item}>
          <div className={`${styles.icon} ${styles.orange}`}>
            <LuClock />
          </div>
          <div className={styles.listdetails}>
            <span className={styles.name}>Maria Garcia</span>
            <span className={styles.detail}>Marked unavailable for Dec 1–5</span>
            <span className={styles.time}>1 hour ago</span>
          </div>
        </div>

        <div className={styles.item}>
          <div className={`${styles.icon} ${styles.purple}`}>
            <LuUser />
          </div>
          <div className={styles.listdetails}>
            <span className={styles.name}>Lisa Wong</span>
            <span className={styles.detail}>Updated profile and qualifications</span>
            <span className={styles.time}>2 hours ago</span>
          </div>
        </div>

        <div className={styles.item}>
          <div className={`${styles.icon} ${styles.green}`}>
            <LuCheck />
          </div>
          <div className={styles.listdetails}>
            <span className={styles.name}>Rachel Brown</span>
            <span className={styles.detail}>Completed check-out for booking #1230</span>
            <span className={styles.time}>3 hours ago</span>
          </div>
        </div>

        <div className={styles.item}>
          <div className={`${styles.icon} ${styles.blue}`}>
            <LuCalendar />
          </div>
          <div className={styles.listdetails}>
            <span className={styles.name}>Amanda Lee</span>
            <span className={styles.detail}>Added new availability slots</span>
            <span className={styles.time}>4 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
