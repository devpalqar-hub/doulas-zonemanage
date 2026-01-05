import { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";
import {
  LuCalendar,
  LuCheck,
  LuClock,
  LuUser,
} from "react-icons/lu";
import api from "../../../../services/api";

type ActivityItem = {
  id: string;
  entityType: "BOOKING" | "GALLERY" | "MEETING";
  action: string;
  title: string;
  description: string;
  date: string;
};

const getIconConfig = (item: ActivityItem) => {
  if (item.entityType === "BOOKING") {
    if (item.action === "BOOKING_COMPLETED") {
      return { icon: <LuCheck />, color: styles.green };
    }
    return { icon: <LuCalendar />, color: styles.blue };
  }

  if (item.entityType === "MEETING") {
    return { icon: <LuClock />, color: styles.orange };
  }

  if (item.entityType === "GALLERY") {
    return { icon: <LuUser />, color: styles.purple };
  }

  return { icon: <LuCalendar />, color: styles.blue };
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await api.get("/zonemanager/recent/activity");

        const sorted = (res.data.data || [])
          .sort(
            (a: ActivityItem, b: ActivityItem) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 7);

        setActivities(sorted);
      } catch (err) {
        console.error("Failed to fetch recent activity", err);
      } finally {
        setLoading(false);
      }
    };


    fetchActivity();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Recent Activity</h4>
        <span className={styles.live}>Live</span>
      </div>

      <div className={styles.list}>
        {loading && <span className={styles.time}>Loading...</span>}

        {!loading &&
          activities.map((item) => {
            const { icon, color } = getIconConfig(item);

            return (
              <div key={`${item.id}-${item.date}`} className={styles.item}>
                <div className={`${styles.icon} ${color}`}>
                  {icon}
                </div>

                <div className={styles.listdetails}>
                  <span className={styles.name}>{item.title}</span>
                  <span className={styles.detail}>
                    {item.description}
                  </span>
                  <span className={styles.time}>
                    {timeAgo(item.date)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
