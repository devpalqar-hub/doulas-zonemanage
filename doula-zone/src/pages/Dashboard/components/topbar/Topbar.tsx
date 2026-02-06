import { useState } from "react";
import styles from "./Topbar.module.css";

const Topbar = () => {
  const [error, setError] = useState(false);

  return (
    <div className={styles.topbar}>
      <div className={styles.right}>
        {!error ? (
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
        )}
      </div>
    </div>
  );
};

export default Topbar;
