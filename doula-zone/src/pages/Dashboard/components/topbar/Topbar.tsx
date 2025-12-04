import styles from "./Topbar.module.css";
import { HiOutlineBell } from "react-icons/hi2";

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <input
        className={styles.search}
        placeholder="Search doulas, clients, bookings..."
      />

      <div className={styles.right}>
        <div className={styles.bell}>
          <span className={styles.badge}>3</span>
          <HiOutlineBell className={styles.bellIcon} size={20}/>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
