import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./Meetings.module.css";
import { fetchMeetings, type EnquiryMeeting  } from "../../services/meetings.service";
import { fetchServices, type Service } from "../../services/doula.service";
import { useToast } from "../../shared/ToastContext";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Meetings = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<EnquiryMeeting []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const result = await fetchServices();
        setServices(result);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { meetings: items, meta } = await fetchMeetings({
          search: search.trim(),
          serviceName,
          status,
          startDate,
          endDate,
          page,
          limit,
        });

        setMeetings(items);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load meetings.");
        showToast("Failed to load meetings", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, serviceName, status, startDate, endDate, page]);

  const visibleRange = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 };
    const from = (page - 1) * limit + 1;
    const to = Math.min(total, page * limit);
    return { from, to };
  }, [page, limit, total]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setServiceName("");
    setPage(1);
  };

  // const getStatusClass = (st: string) => {
  //   switch (st) {
  //     case "SCHEDULED":
  //       return `${styles.statusPill} ${styles.scheduled}`;
  //     case "COMPLETED":
  //       return `${styles.statusPill} ${styles.completed}`;
  //     case "CANCELLED":
  //       return `${styles.statusPill} ${styles.cancelled}`;
  //     default:
  //       return styles.statusPill;
  //   }
  // };

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Customer Appointments</h2>
              {/* <p className={styles.subtitle}>Manage your scheduled client meetings ({total} total)</p> */}
            </div>
          </div>

                   {/* FILTERS CARD */}
          <div className={styles.filtersCard}>
            {/* Search Input */}
            <div className={styles.searchRow}>
              <div className={styles.searchInput}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by client or doula name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className={styles.filterRow}>
              {/* SERVICE – dropdown */}
              <div className={styles.filterSelect}>
                <label>Service</label>
                <select
                  value={serviceName}
                  onChange={(e) => {
                    setServiceName(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div className={styles.filterSelect}>
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

              </div>

              {/* DATE RANGE – start */}
              <div className={styles.filterSelect}>
                <label>Date Range</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* DATE RANGE – end */}
              <div className={styles.filterSelect}>
                <label style={{ opacity: 0 }}>hidden</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* RESET */}
              <div className={styles.resetContainer}>
                <button className={styles.resetBtn} onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className={styles.listCard}>
            {loading ? (
              <div className={styles.stateRow}>Loading meetings...</div>
            ) : error ? (
              <div className={styles.stateRow}>{error}</div>
            ) : meetings.length === 0 ? (
              <div className={styles.stateRow}>No meetings found.</div>
            ) : (
              meetings.map((m) => {
                const [start, end] = m.meetingsTimeSlots.split("-");

                return (
                  <div key={m.id} className={styles.meetingRow}>
                    <div className={styles.meetingLeft}>
                      <div className={styles.avatar}>
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className={styles.meetingInfo}>
                        <div className={styles.metaRow}>
                          <div className={styles.clientName}>{m.name}</div>
                            {/* <span
                              className={`${styles.statusPill} ${
                                m.status === "COMPLETED"
                                  ? styles.completed
                                  : m.status === "CANCELLED"
                                  ? styles.cancelled
                                  : styles.scheduled
                              }`}
                            >
                              {m.status}
                            </span> */}

                          </div>

                          {/* <span className={styles.meetingId}>
                            ID: {m.id.slice(0, 8)}
                          </span> */}
                          {/* <span className={styles.mode}>Virtual</span> */}

                        <div className={styles.whenRow}>
                          <div className={styles.date}>
                            {new Date(m.meetingsDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className={styles.time}>
                            {start} - {end}
                          </div>
                                                  
                          <span className={styles.service}>
                            {m.serviceName}
                          </span>

                        </div>

                        {m.additionalNotes && (
                          <div className={styles.remarks}>
                            {m.additionalNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.meetingRight}>
                      <button
                          className={styles.viewBtn}
                          onClick={() => navigate(`/meetings/${m.meetingsId}`)}
                        >
                          View Details
                        </button>
                      <button className={styles.joinBtn} disabled>
                        Join Meeting
                      </button>
                    </div>
                  </div>
                );
              })

            )}

            {/* Footer */}
            <div className={styles.footerRow}>
              <div className={styles.rowsInfo}>Showing {visibleRange.from} of {total}</div>

              <div className={styles.pagination}>
                <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                <span className={styles.pageIndicator}>Page {page} of {totalPages}</span>
                <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;

