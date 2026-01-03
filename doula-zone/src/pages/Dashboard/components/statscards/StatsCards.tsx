import styles from "./StatsCards.module.css";
import type { CardsStats } from "../../../../services/analytics.services";
import { TbUsers } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { FiBookOpen } from "react-icons/fi";
import { LuClock4 } from "react-icons/lu";

interface Props {
  data: CardsStats | null;
  loading: boolean;
}

const StatsCards = ({ data, loading }: Props) => {
  if (loading || !data) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className={`${styles.card} ${styles.skeleton}`} />
        ))}
      </div>
    );
  }

  const {
    totalDoulas,
    // totalDoulasChange,
    activeClients,
    // activeClientsChange,
    todaysMeetings,
    // todaysUpcoming,
    activeBookings,
    // bookingsEndingSoon,
    pendingMeetings,
    // pendingUrgent,
  } = data;

  return (
    <div className={styles.grid}>
      {/* Total Doulas */}
      <div className={styles.card}>
        <div className={styles.iconBlue}>
          <TbUsers size={24} color="white" />
        </div>
        <div className={styles.label}>Total Doulas</div>
        <div className={styles.value}>{totalDoulas}</div>
        {/* <div className={styles.subPositive}>+{totalDoulasChange} this month</div> */}
      </div>

      {/* Active Clients */}
      <div className={styles.card}>
        <div className={styles.iconPurple}>
          <TbUsers size={24} color="white" />
        </div>
        <div className={styles.label}>Active Clients</div>
        <div className={styles.value}>{activeClients}</div>
        {/* <div className={styles.subPositive}>+{activeClientsChange} this month</div> */}
      </div>

      {/* Today's Meetings */}
      <div className={styles.card}>
        <div className={styles.iconGreen}>
          <SlCalender color="white" size={20}/>
        </div>
        <div className={styles.label}>Today's Meetings</div>
        <div className={styles.value}>{todaysMeetings}</div>
        {/* <div className={styles.subMuted}>{todaysUpcoming} upcoming</div> */}
      </div>

      {/* Active Bookings */}
      <div className={styles.card}>
        <div className={styles.iconOrange}>
          <FiBookOpen color="white" size={20}/>
        </div>
        <div className={styles.label}>Active Bookings</div>
        <div className={styles.value}>{activeBookings}</div>
        {/* <div className={styles.subMuted}>{bookingsEndingSoon} ending soon</div> */}
      </div>

      {/* Pending Meeting */}
      <div className={styles.card}>
        <div className={styles.iconRed}>
          <LuClock4 color="white" size={20}/>
        </div>
        <div className={styles.label}>Pending Meeting</div>
        <div className={styles.value}>{pendingMeetings}</div>
        {/* <div className={styles.subNegative}>{pendingUrgent} urgent</div> */}
      </div>
    </div>
  );
};

export default StatsCards;
