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

  const stats = [
    {
      icon: <TbUsers size={24} color="white" />,
      iconClass: styles.iconBlue,
      label: "Total Doulas",
      value: totalDoulas,
      // sub: `+${totalDoulasChange} this month`,
      // subClass: styles.subPositive,
    },
    {
      icon: <TbUsers size={24} color="white" />,
      iconClass: styles.iconPurple,
      label: "Active Clients",
      value: activeClients,
      // sub: `+${activeClientsChange} this month`,
      // subClass: styles.subPositive,
    },
    {
      icon: <SlCalender color="white" size={20} />,
      iconClass: styles.iconGreen,
      label: "Today's Meetings",
      value: todaysMeetings,
      // sub: `${todaysUpcoming} upcoming`,
      // subClass: styles.subMuted,
    },
    {
      icon: <FiBookOpen color="white" size={20} />,
      iconClass: styles.iconOrange,
      label: "Active Bookings",
      value: activeBookings,
      // sub: `${bookingsEndingSoon} ending soon`,
      // subClass: styles.subMuted,
    },
    {
      icon: <LuClock4 color="white" size={20} />,
      iconClass: styles.iconRed,
      label: "Pending Meeting",
      value: pendingMeetings,
      // sub: `${pendingUrgent} urgent`,
      // subClass: styles.subNegative,
    },
  ];

  return (
    <div className={styles.grid}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.card}>
          <div className={stat.iconClass}>{stat.icon}</div>
          <div className={styles.cardContent}>
            <div className={styles.label}>{stat.label}</div>
            <div className={styles.value}>{stat.value}</div>
            {/* {stat.sub && <div className={stat.subClass}>{stat.sub}</div>} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;