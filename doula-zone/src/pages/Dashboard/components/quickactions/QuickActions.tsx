import styles from "./QuickActions.module.css";
import { LuPlus,LuUserPlus , LuCalendar, LuBookOpen  } from "react-icons/lu";

export default function QuickActions() {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Quick Actions</p>

      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.active}`}>
          <LuUserPlus className={styles.icon} />
          Create Doula
        </button>

        <button className={styles.button}>
          <LuCalendar className={styles.icon} />
          Schedule Meeting
        </button>

        <button className={styles.button}>
          <LuBookOpen  className={styles.icon} />
          Add Booking
        </button>

        <button className={styles.button}>
          <LuPlus className={styles.icon} />
          View All Actions
        </button>
      </div>
    </div>
  );
}
