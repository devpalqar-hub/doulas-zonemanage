import { useState } from "react";
import styles from "./ViewDoula.module.css";
import { FiCheck } from "react-icons/fi";
import { SlBadge } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { FaArrowLeft } from "react-icons/fa";

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
    <div className={styles.root}>
      <div className={styles.contentArea}>
        <div className={styles.pageContent}>
          <div className={styles.container}>
            {/* ================= BACK BUTTON ================= */}
            <button className={styles.backLink} onClick={() => window.history.back()}>
              <FaArrowLeft />
              Back to List
            </button>

            {/* ================= TOP GRID ================= */}
            <div className={styles.topGrid}>
              {/* LEFT : HERO SLIDER */}
              <div className={styles.leftCol}>
                <div className={styles.heroSlider}>
                  <img
                    src={images[index]}
                    alt={data.name}
                    className={styles.heroImage}
                  />
                  {images.length > 1 && (
                    <div className={styles.heroControls}>
                      <button className={styles.heroArrow} onClick={prev}>
                        ‹
                      </button>
                      <span className={styles.heroCounter}>
                        {index + 1} / {images.length}
                      </span>
                      <button className={styles.heroArrow} onClick={next}>
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT : QUICK INFO */}
              <div className={styles.rightCol}>
                <h1 className={styles.name}>{data.name}</h1>

                {/* META */}
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <SlBadge className={styles.metaIcon} />
                    <strong>{data.yoe}+ years</strong> experience
                  </span>
                  {data.ratings !== null ? (
                    <span className={styles.metaItem}>
                      <TiStarFullOutline className={styles.metaIcon} />
                      <span className={styles.rating}>
                        {data.ratings.toFixed(1)}
                      </span>
                      <span className={styles.reviewCount}>
                        ({data.reviewsCount} reviews)
                      </span>
                    </span>
                  ) : (
                    <span className={`${styles.metaItem} ${styles.noRating}`}>
                      <TiStarFullOutline className={styles.metaIcon} />
                      No ratings yet
                    </span>
                  )}
                </div>

                {/* LOCATION */}
                <div className={styles.location}>
                  <IoLocationOutline className={styles.locationIcon} />
                  {data.regionNames?.length ? data.regionNames.join(", ") : "—"}
                </div>

                {/* Contact INFO */}
                <div className={styles.section}>
                  <h4>Contact Information</h4>
                  <div className={styles.infoGrid}>
                    <div>
                      <strong>Email:</strong> {data.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {data.phone}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span style={{ color: data.isActive ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                        {data.isActive ? "✓ Active" : "✗ Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CONTENT SECTIONS ================= */}

            {/* ABOUT */}
            <div className={styles.section}>
              <h4>About</h4>
              <p>{data.description}</p>
            </div>

            {/* ACHIEVEMENTS */}
            {data.achievements && (
              <div className={styles.section}>
                <h4>Achievements</h4>
                <p>{data.achievements}</p>
              </div>
            )}

            {/* QUALIFICATION */}
            {data.qualification && data.qualification !== "—" && (
              <div className={styles.section}>
                <h4>Qualification</h4>
                <p>{data.qualification}</p>
              </div>
            )}

            {/* SERVICES & PRICING */}
            {data.services?.length > 0 && (
              <div className={styles.section}>
                <h4>Services & Pricing</h4>
                <div className={styles.servicesGrid}>
                  {data.services.map((s: any, idx: number) => (
                    <div key={idx} className={styles.serviceCard}>
                      <h5>{s.name}</h5>
                      {s.price && (
                        <div className={styles.priceList}>
                          {s.price.morning !== undefined && (
                            <div>
                              <span>Morning:</span>
                              <strong>₹{s.price.morning}</strong>
                            </div>
                          )}
                          {s.price.night !== undefined && (
                            <div>
                              <span>Night:</span>
                              <strong>₹{s.price.night}</strong>
                            </div>
                          )}
                          {s.price.fullday !== undefined && (
                            <div>
                              <span>Full Day:</span>
                              <strong>₹{s.price.fullday}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUAGES */}
            {data.languages?.length > 0 && (
              <div className={styles.section}>
                <h4>Languages Spoken</h4>
                <div className={styles.tags}>
                  {data.languages.map((l: string, idx: number) => (
                    <span key={idx} className={styles.tag}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATES */}
            {data.certificates?.length > 0 && (
              <div className={styles.section}>
                <h4>Certificates</h4>
                <ul className={styles.certificateList}>
                  {data.certificates.map((c: any, idx: number) => (
                    <li key={idx} className={styles.certificateItem}>
                      <SlBadge style={{ color: "#8335A0", fontSize: "20px", marginTop: "2px" }} />
                      <div>
                        <div style={{ fontWeight: 600, color: "#0F172B", fontSize: "15px" }}>
                          {c.name}
                        </div>
                        <div className={styles.certificateMeta}>
                          Issued by {c.issuedBy} • {c.year}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SPECIALITIES */}
            {data.specialities?.length > 0 && (
              <div className={styles.section}>
                <h4>Specialities</h4>
                <ul className={styles.list}>
                  {data.specialities.map((s: string, idx: number) => (
                    <li key={idx}>
                      <FiCheck className={styles.checkIcon} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TESTIMONIALS */}
            {data.testimonials?.length > 0 && (
              <div className={styles.section}>
                <h4>Client Testimonials</h4>
                <div className={styles.testimonials}>
                  {data.testimonials.map((t: any, idx: number) => (
                    <div key={idx} className={styles.testimonialCard}>
                      {/* Header */}
                      <div className={styles.testimonialHeader}>
                        <span className={styles.clientName}>{t.clientName}</span>
                        <div className={styles.stars}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <TiStarFullOutline
                              key={i}
                              style={{ color: "#f59e0b", fontSize: "16px" }}
                            />
                          ))}
                        </div>
                      </div>
                      {/* Review */}
                      <p className={styles.testimonialText}>{t.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoula;