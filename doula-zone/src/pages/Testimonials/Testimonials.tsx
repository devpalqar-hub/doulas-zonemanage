// src/pages/Testimonials/Testimonials.tsx
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./Testimonials.module.css";
import { fetchTestimonials, type Testimonial } from "../../services/testimonial.service";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaStar,FaEye } from "react-icons/fa";

const Testimonials = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filtered, setFiltered] = useState<Testimonial[]>([]);

  // Filters
  const [service, setService] = useState("");
  const [rating, setRating] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  };

  const applyFilters = () => {
    let list = [...testimonials];

    if (service) list = list.filter(t => t.serviceName === service);
    if (rating) list = list.filter(t => t.ratings === Number(rating));
    if (fromDate) list = list.filter(t => new Date(t.createdAt) >= new Date(fromDate));
    if (toDate) list = list.filter(t => new Date(t.createdAt) <= new Date(toDate));

    setFiltered(list);
  };
    useEffect(() => {
    applyFilters();
  }, [service, rating, fromDate, toDate, testimonials]);


  const resetFilters = () => {
    setService("");
    setRating("");
    setFromDate("");
    setToDate("");
    setFiltered(testimonials);
  };

  // Stats calculations
  const stats = useMemo(() => {
    const total = testimonials.length;
    const avg =
      total > 0
        ? (testimonials.reduce((a, b) => a + b.ratings, 0) / total).toFixed(1)
        : "0";

    const fiveStar = testimonials.filter(t => t.ratings === 5).length;

    const thisMonth = testimonials.filter(t => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return { total, avg, fiveStar, thisMonth };
  }, [testimonials]);

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <h2 className={styles.title}>Testimonials</h2>
          <p className={styles.subtitle}>View and manage client testimonials and ratings</p>

          {/* FILTER CARD */}
          <div className={styles.filterCard}>
            <select
              className={styles.filterInput}
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">All Services</option>
              {[...new Set(testimonials.map(t => t.serviceName))].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className={styles.filterInput}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>

            <input
              type="date"
              className={styles.filterInput}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <input
              type="date"
              className={styles.filterInput}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

            <button
              className={styles.resetBtn}
              onClick={resetFilters}
            >
              <FiFilter /> Reset
            </button>
          </div>

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>Total Testimonials <span>{stats.total}</span></div>
            <div className={styles.statBox}>Average Rating <span>{stats.avg} <FaStar color="#FDC700"/></span></div>
            <div className={styles.statBox}>5-Star Reviews <span>{stats.fiveStar}</span></div>
            <div className={styles.statBox}>This Month <span>{stats.thisMonth}</span></div>
          </div>

          {/* TESTIMONIAL CARDS */}
          <div className={styles.cardGrid}>
            {filtered.map((t) => (
              <div key={t.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>
                    {t.clientName.split(" ").map(x => x[0]).join("")}
                  </div>
                  <div className={styles.clientInfo}>
                    <strong>{t.clientName}</strong>
                    <p>for {t.doulaName}</p>
                  </div>
                </div>

                <div className={styles.ratingRow}>
                  {"⭐".repeat(t.ratings)}
                </div>

                <p className={styles.reviewText}>{t.reviews}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.tag}>{t.serviceName}</span>

                  <button
                    className={styles.eyeBtn}
                    onClick={() => navigate(`/testimonials/${t.id}`)}
                  >
                    <FaEye color="black"/>
                  </button>
                </div>

                <p className={styles.dateText}>
                  {new Date(t.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Testimonials;
