import styles from "./Topbar.module.css";
// import { HiOutlineBell } from "react-icons/hi2";

const Topbar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.right}>
          <img className={styles.brand} src="/doula-branding.png" alt="Notifications" />
        </div>
    </div>
  );
};

export default Topbar;
