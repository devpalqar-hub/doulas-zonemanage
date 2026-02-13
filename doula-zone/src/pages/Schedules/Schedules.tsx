import { useEffect, useMemo, useState, useRef } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./Schedules.module.css";

import { fetchSchedules, type Schedule } from "../../services/schedule.service";
import { fetchServices, type Service } from "../../services/doula.service";
import { useToast } from "../../shared/ToastContext";

import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { updateScheduleStatus } from "../../services/schedule.service";
import { useNavigate } from "react-router-dom";

const Schedules = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

const [openMenuId, setOpenMenuId] = useState<string | null>(null);
const [updatingId, setUpdatingId] = useState<string | null>(null);
const menuRef = useRef<HTMLDivElement | null>(null);



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

        const { schedules, meta } = await fetchSchedules({
          page,
          limit,
          search,
          serviceName,
          status,
          startDate,
          endDate,
        });

        setSchedules(schedules);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load schedules");
        showToast("Failed to load schedules", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, search, serviceName, status, startDate, endDate, showToast]);

  const resetFilters = () => {
    setSearch("");
    setServiceName("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const visibleRange = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 };
    const from = (page - 1) * limit + 1;
    const to = Math.min(total, page * limit);
    return { from, to };
  }, [page, limit, total]);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setOpenMenuId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

const getNextScheduleStatuses = (current: string) => {
  switch (current) {
    case "PENDING":
      return ["IN_PROGRESS", "CANCELED", "COMPLETED"];
    case "IN_PROGRESS":
      return ["COMPLETED", "CANCELED", "PENDING"];
    case "COMPLETED":
      return ["PENDING", "CANCELED", "IN_PROGRESS"];
    case "CANCELED":
      return ["PENDING", "IN_PROGRESS", "COMPLETED"];
    default:
      return [];
  }
};


const getScheduleStatusClass = (status: string) => {
  switch (status) {
    // case "ACTIVE":
    //   return `${styles.statusPill} ${styles.statusActive}`;
    case "COMPLETED":
      return `${styles.statusPill} ${styles.statusCompleted}`;
    case "CANCELED":
      return `${styles.statusPill} ${styles.statusCancelled}`;
    case "PENDING":
      return `${styles.statusPill} ${styles.statusPending}`;
    case "IN_PROGRESS":
      return `${styles.statusPill} ${styles.statusInProgress}`;
    default:
      return styles.statusPill;
  }
};

const handleScheduleStatusChange = async (
  scheduleId: string,
  newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
) => {
  try {
    setUpdatingId(scheduleId);

    await updateScheduleStatus(scheduleId, newStatus);

    setSchedules((prev) =>
      prev.map((s) =>
        s.scheduleId === scheduleId
          ? { ...s, status: newStatus }
          : s
      )
    );

    showToast("Schedule status updated", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to update schedule status", "error");
  } finally {
    setUpdatingId(null);
    setOpenMenuId(null);
  }
};


  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Schedule Management</h2>
              <p className={styles.subtitle}>
                Manage all client schedules ({total} total)
              </p>
            </div>
          <button
            className={styles.checkAvailabilityBtn}
            onClick={() => navigate("/schedules/check-availability")}
          >
            Check Availability
          </button>
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
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="CANCELED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
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

          <div className={styles.tableCard}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Name</div>
                <div>Doula</div>
                <div>Service</div>
                <div>Start Date</div>
                <div>Time shift</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {loading ? (
                <div className={styles.stateRow}>Loading...</div>
              ) : error ? (
                <div className={styles.stateRow}>{error}</div>
              ) : schedules.length === 0 ? (
                <div className={styles.stateRow}>No schedules found</div>
              ) : (
                schedules.map((s) => (
                  <div key={s.scheduleId} className={styles.tableRow}>
                    <div className={styles.mainText}>{s.clientName}</div>
                    <div className={styles.mainText}>
                      {s.doulaName || "—"}
                    </div>

                    <div>
                      <span className={styles.serviceStatusPill}>
                        {s.serviceName}
                      </span>
                    </div>

                    <div className={styles.mainText}>
                      {new Date(s.scheduleDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <div className={styles.mainText}>{s.serviceTimeshift}</div>

                    <div>
                      <span className={getScheduleStatusClass(s.status)}>
                        {s.status.replace("_", " ")}
                      </span>
                    </div>


                    <div className={styles.actionsCell}>
                      <div
                        className={styles.actionWrapper}
                        ref={openMenuId === s.scheduleId ? menuRef : null}
                      >
                        <button
                          className={styles.iconBtn}
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === s.scheduleId ? null : s.scheduleId
                            )
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {openMenuId === s.scheduleId && (
                          <div className={styles.dropdown}>
                            {getNextScheduleStatuses(s.status).map((st) => (
                              <button
                                key={st}
                                className={`${styles.dropdownItem} ${
                                  styles[st.toLowerCase()]
                                }`}
                                disabled={updatingId === s.scheduleId}
                                onClick={() =>
                                  handleScheduleStatusChange(
                                    s.scheduleId,
                                    st as any
                                  )
                                }
                              >
                                {updatingId === s.scheduleId ? "Updating..." : st}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className={styles.tableFooter}>
              <div className={styles.rowsInfo}>
                Showing {visibleRange.from} of {total}
              </div>

              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>

                <span className={styles.pageIndicator}>
                  Page {page} of {totalPages}
                </span>

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
