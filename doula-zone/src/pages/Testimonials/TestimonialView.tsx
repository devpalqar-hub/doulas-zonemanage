// src/pages/Testimonials/TestimonialView.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./TestimonialView.module.css";
import { fetchTestimonialById, type Testimonial } from "../../services/testimonial.service";
import { FaStar } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";

const TestimonialView = () => {
  const { id } = useParams();
  const [t, setT] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (id) load(id);
  }, [id]);

  const load = async (id: string) => {
    try {
      const data = await fetchTestimonialById(id);
      setT(data);
    } catch (err) {
      console.error("Failed to load testimonial:", err);
    }
  };

  if (!t) return <p>Loading...</p>;

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => window.history.back()}
          >
          <FaArrowLeft />   Back 
          </button>
          <h2>Testimonial Details</h2>

          <div className={styles.viewCard}>
            <h3>{t.clientName} → {t.doulaName}</h3>

            <p><strong>Service:</strong> {t.serviceName}</p>
            <p><strong>Rating:</strong> {t.ratings} <FaStar color="#FDC700"/></p>
            <p><strong>Review:</strong> {t.reviews}</p>

            <p className={styles.date}>
              {new Date(t.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialView;
