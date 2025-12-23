import styles from "./PendingMeetingRequests.module.css";
import { LuClock } from "react-icons/lu";

export default function PendingMeetingRequests() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <h4>Pending Meeting Requests</h4>
          <span className={styles.count}>2 Urgent</span>
        </div>
        <span className={styles.viewAll}>View All</span>
      </div>

      <div className={styles.list}>
        {/* Card 1 */}
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.avatar}>JM</div>

            <div className={styles.info}>
              <p className={styles.name}>Jessica Miller</p>
              <p className={styles.type}>Postpartum Care</p>

              <div className={styles.meta}>
                <LuClock />
                <span>2 hours ago</span>
                
                <span>Nov 28 - Dec 10, 2025</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}>Schedule Meeting</button>
                <button className={styles.secondaryBtn}>View Details</button>
              </div>
            </div>

            <span className={styles.urgent}>Urgent</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.avatar}>AT</div>

            <div className={styles.info}>
              <p className={styles.name}>Amanda Thompson</p>
              <p className={styles.type}>Birth Support</p>

              <div className={styles.meta}>
                <LuClock />
                <span>5 hours ago</span>
                
                <span>Dec 15 - Dec 20, 2025</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}>Schedule Meeting</button>
                <button className={styles.secondaryBtn}>View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.avatar}>LD</div>

            <div className={styles.info}>
              <p className={styles.name}>Laura Davis</p>
              <p className={styles.type}>Lactation Support</p>

              <div className={styles.meta}>
                <LuClock />
                <span>1 day ago</span>
                
                <span>Nov 25 - Nov 27, 2025</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}>Schedule Meeting</button>
                <button className={styles.secondaryBtn}>View Details</button>
              </div>
            </div>

            <span className={styles.urgent}>Urgent</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className={styles.card}>
          <div className={styles.row}>
            <div className={styles.avatar}>SW</div>

            <div className={styles.info}>
              <p className={styles.name}>Sarah Wilson</p>
              <p className={styles.type}>Overnight Care</p>

              <div className={styles.meta}>
                <LuClock />
                <span>1 day ago</span>
                
                <span>Dec 1 - Dec 14, 2025</span>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}>Schedule Meeting</button>
                <button className={styles.secondaryBtn}>View Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
