import { useState } from "react";
import styles from "./ViewDoula.module.css";
import { FiCheck } from "react-icons/fi";
import { SlBadge } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { FaArrowLeft } from "react-icons/fa"

type Props = {
  data: any;
};

const ViewDoula = ({ data }: Props) => {
  const images =
    data.galleryImages?.length > 0
      ? [data.profileImage, ...data.galleryImages.map((g: any) => g.url)]
      : [data.profileImage];

  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className={styles.container}>
      {/* ================= TOP GRID ================= */}
      <button
        type="button"
        className={styles.backLink}
        onClick={() => window.history.back()}
      >
        <FaArrowLeft />   Back to List
        </button>
      <div className={styles.topGrid}>
        {/* LEFT : HERO SLIDER */}
        <div className={styles.leftCol}>
          <div className={styles.heroSlider}>
            <img
              src={images[index]}
              alt="Doula"
              className={styles.heroImage}
            />

            {images.length > 1 && (
              <div className={styles.heroControls}>
                <button onClick={prev} className={styles.heroArrow}>
                  ‹
                </button>
                <span className={styles.heroCounter}>
                  {index + 1} / {images.length}
                </span>
                <button onClick={next} className={styles.heroArrow}>
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT : QUICK INFO */}
        <div className={styles.rightCol}>
          <h2 className={styles.name}>{data.name}</h2>

          {/* META */}
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <SlBadge className={styles.metaIcon} />
              <span>{data.yoe}+ years experience</span>
            </span>

            {data.ratings !== null ? (
              <span className={styles.metaItem}>
                <TiStarFullOutline
                  size={18}
                  color="#FDC700"
                  className={styles.metaIcon}
                />
                <span className={styles.rating}>
                  {data.ratings.toFixed(1)}
                </span>
                <span className={styles.reviewCount}>
                  ({data.reviewsCount} reviews)
                </span>
              </span>
            ) : (
              <span className={styles.metaItem}>
                <TiStarFullOutline
                  size={18}
                  color="#FDC700"
                  className={styles.metaIcon}
                />
                <span className={styles.noRating}>No ratings yet</span>
              </span>
            )}
          </div>

          {/* LOCATION */}
          <div className={styles.location}>
            <IoLocationOutline className={styles.locationIcon} />
            <span>
              {data.regionNames?.length
                ? data.regionNames.join(", ")
                : "—"}
            </span>
          </div>

          {/* SERVICES */}
          <div className={`${styles.section} ${styles.services}`}>
            <h4>Services Offered</h4>
            <div className={styles.tags}>
              {data.services.map((s: any) => (
                <span key={s.serviceId} className={styles.tag}>
                  {s.serviceName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div className={styles.bottomGrid}>
        <div className={styles.section}>
          <h4>About</h4>
          <p>{data.description}</p>
        </div>

        {data.specialities?.length > 0 && (
          <div className={styles.section}>
            <h4>Certifications & Training</h4>
            <ul className={styles.list}>
              {data.specialities.map((s: string, idx: number) => (
                <li key={idx}>
                  <FiCheck className={styles.checkIcon} /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.testimonials?.length > 0 && (
          <div className={styles.section}>
            <h4>Client Testimonials</h4>
            <div className={styles.testimonials}>
              {data.testimonials.map((t: any, idx: number) => (
                <div key={idx} className={styles.testimonialCard}>
                  <p>“{t.comment}”</p>
                  <span>{t.clientName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDoula;
