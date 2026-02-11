import { useState } from "react";
import styles from "./Topbar.module.css";
import Modal from "../../../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");
  };
  return (
    <div className={styles.topbar}>
      <div className={styles.right}>
        {/* {!error ? (
          <img
            className={styles.brand}
            src="/doula-branding.png"
            alt="Bambini Doulas"
            onError={() => setError(true)}
          />
        ) : (
          <div className={styles.brandFallback}>
            Bambini Doulas
          </div>
        )} */}
        <button className={styles.logoutButton}
          onClick={() => setLogoutOpen(true)}
          style={{ cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <Modal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Confirm Logout"
      >
        <p>Are you sure you want to logout?</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
          <button onClick={() => setLogoutOpen(false)}>Cancel</button>
          <button
            onClick={handleLogout}
            style={{ background: "#8335A0", color: "#F7EBED", padding: "6px 14px", borderRadius: "6px" }}
          >
            Logout
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Topbar;
