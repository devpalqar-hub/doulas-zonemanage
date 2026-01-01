import { useEffect, useState } from "react";
import styles from "./RecentTestimonials.module.css";
import { LuStar } from "react-icons/lu";

import {
  fetchRecentTestimonials,
  type RecentTestimonial,
} from "../../../../services/testimonial.service";


const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function RecentTestimonials() {
  const [testimonials, setTestimonials] = useState<RecentTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchRecentTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error("Failed to load testimonials", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Recent Testimonials</h4>
        <span className={styles.viewAll}>View All</span>
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>Loading testimonials…</div>
        ) : testimonials.length === 0 ? (
          <div className={styles.empty}>No testimonials yet</div>
        ) : (
          testimonials.map((t, index) => (
            <div key={t.id} className={styles.card}>
              <div className={styles.top}>
                <div
                  className={`${styles.avatar} ${
                    index % 3 === 0
                      ? styles.green
                      : index % 3 === 1
                      ? styles.teal
                      : styles.blue
                  }`}
                >
                  {getInitials(t.clientName)}
                </div>

                <div>
                  <p className={styles.name}>{t.clientName}</p>
                  <p className={styles.for}>for {t.doulaName}</p>
                </div>

                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <LuStar
                      key={i}
                      color={i < t.ratings ? "#FACC15" : "#E5E7EB"}
                    />
                  ))}
                </div>
              </div>

              <p className={styles.message}>{t.reviews}</p>

              <div className={styles.footer}>
                <span>{t.serviceName}</span>
                <span>{formatDate(t.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
