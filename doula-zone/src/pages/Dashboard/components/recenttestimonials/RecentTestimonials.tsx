import styles from "./RecentTestimonials.module.css";
import { LuStar } from "react-icons/lu";

export default function RecentTestimonials() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Recent Testimonials</h4>
        <span className={styles.viewAll}>View All</span>
      </div>

      <div className={styles.list}>
        {/* Testimonial 1 */}
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={`${styles.avatar} ${styles.green}`}>ER</div>
            <div>
              <p className={styles.name}>Emily Roberts</p>
              <p className={styles.for}>for Sarah Johnson</p>
            </div>
            <div className={styles.stars}>
              <LuStar /><LuStar /><LuStar /><LuStar /><LuStar />
            </div>
          </div>

          <p className={styles.message}>
            Sarah was absolutely amazing! She provided exceptional care and support.
          </p>

          <div className={styles.footer}>
            <span>Postpartum Care</span>
            <span>Nov 22, 2025</span>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={`${styles.avatar} ${styles.teal}`}>MA</div>
            <div>
              <p className={styles.name}>Michelle Anderson</p>
              <p className={styles.for}>for Maria Garcia</p>
            </div>
            <div className={styles.stars}>
              <LuStar /><LuStar /><LuStar /><LuStar /><LuStar />
            </div>
          </div>

          <p className={styles.message}>
            Maria’s expertise and calming presence made all the difference.
          </p>

          <div className={styles.footer}>
            <span>Birth Support</span>
            <span>Nov 21, 2025</span>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={`${styles.avatar} ${styles.blue}`}>JL</div>
            <div>
              <p className={styles.name}>Jennifer Lee</p>
              <p className={styles.for}>for Lisa Wong</p>
            </div>
            <div className={styles.stars}>
              <LuStar /><LuStar /><LuStar /><LuStar />
            </div>
          </div>

          <p className={styles.message}>
            Very professional and knowledgeable. Lisa was wonderful.
          </p>

          <div className={styles.footer}>
            <span>Lactation Support</span>
            <span>Nov 20, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
