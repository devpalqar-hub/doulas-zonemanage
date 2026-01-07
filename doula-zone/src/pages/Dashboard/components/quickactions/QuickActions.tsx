import styles from "./QuickActions.module.css";
import { LuUserPlus , LuCalendar, LuBookOpen  } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <p className={styles.title}>Quick Actions</p>

      <div className={styles.actions}>
        <button className={`${styles.button}`} onClick={() => navigate("/doulas/create")}>
          <LuUserPlus className={styles.icon} />
          Create Doula
        </button>

        <button className={styles.button} onClick={() => navigate("/meetings")}>
          <LuCalendar className={styles.icon} />
          Meetings
        </button>

        <button className={styles.button} onClick={() => navigate("/bookings/create")}>
          <LuBookOpen  className={styles.icon} />
          Add Booking
        </button>
      </div>
    </div>
  );
}
