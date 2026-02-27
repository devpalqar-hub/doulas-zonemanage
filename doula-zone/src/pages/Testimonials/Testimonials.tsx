import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./Testimonials.module.css";
import {
  fetchTestimonials,
  type Testimonial,
} from "../../services/testimonial.service";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaStar, FaEye } from "react-icons/fa";

const Testimonials = () => {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [service, setService] = useState("");
  const [rating, setRating] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const { data, meta } = await fetchTestimonials({
          page,
          limit,
          serviceName: service || undefined,
          ratings: rating ? Number(rating) : undefined,
          startDate: fromDate || undefined,
          endDate: toDate || undefined,
        });

        setTestimonials(data);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, service, rating, fromDate, toDate]);

  const resetFilters = () => {
    setService("");
    setRating("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const stats = useMemo(() => {
    const avg =
      testimonials.length > 0
        ? (
            testimonials.reduce((a, b) => a + b.ratings, 0) /
            testimonials.length
          ).toFixed(1)
        : "0";

    const fiveStar = testimonials.filter((t) => t.ratings === 5).length;

    return { total, avg, fiveStar };
  }, [testimonials, total]);

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <h2 className={styles.title}>Testimonials</h2>
          <p className={styles.subtitle}>
            View and manage client testimonials and ratings
          </p>

          {/* FILTER CARD */}
          <div className={styles.filterCard}>
            <select
              className={styles.filterInput}
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Services</option>
              <option value="Birth Doula">Birth Doula</option>
              <option value="Post Partum Doula">Post Partum Doula</option>
            </select>

            <select
              className={styles.filterInput}
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>

            <input
              type="date"
              className={styles.filterInput}
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />

            <input
              type="date"
              className={styles.filterInput}
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />

            <button className={styles.resetBtn} onClick={resetFilters}>
              <FiFilter /> Reset
            </button>
          </div>

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              Total Testimonials <span>{stats.total}</span>
            </div>
            <div className={styles.statBox}>
              Average Rating{" "}
              <span>
                {stats.avg} <FaStar color="#FDC700" />
              </span>
            </div>
            <div className={styles.statBox}>
              5-Star Reviews <span>{stats.fiveStar}</span>
            </div>
          </div>

          {/* TESTIMONIAL CARDS */}
          <div className={styles.cardGrid}>
            {loading ? (
              <p>Loading...</p>
            ) : testimonials.length === 0 ? (
              <p>No testimonials found</p>
            ) : (
              testimonials.map((t) => (
                <div key={t.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                      {t.clientName
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
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
                    <span className={styles.tag}>
                      {t.serviceName}
                    </span>

                    <button
                      className={styles.eyeBtn}
                      onClick={() =>
                        navigate(`/testimonials/${t.id}`)
                      }
                    >
                      <FaEye color="black" />
                    </button>
                  </div>

                  <p className={styles.dateText}>
                    {new Date(t.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;