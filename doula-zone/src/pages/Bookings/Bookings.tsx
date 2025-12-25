import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./Bookings.module.css";
import { fetchBookings, type Booking } from "../../services/booking.service";
import { fetchServices, type Service } from "../../services/doula.service";
import { useToast } from "../../shared/ToastContext";
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

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

  // fetch data
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const { bookings, meta } = await fetchBookings({
          search: search.trim(),
          serviceId,
          status,
          startDate,
          endDate,
          page,
          limit,
        });

        setBookings(bookings);
        setTotal(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings.");
        showToast("Failed to load bookings", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [search, serviceId, status, startDate, endDate, page, showToast]);

  const visibleRange = useMemo(() => {
    if (total === 0) return { from: 0, to: 0 };
    const from = (page - 1) * limit + 1;
    const to = Math.min(total, page * limit);
    return { from, to };
  }, [page, limit, total]);

  const getDerivedTimeSlot = () => {
    return "09:00 AM - 06:00 PM";
  };


  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setServiceId("");
    setPage(1);
  };

  const getStatusClass = (status: string) => {
    if (status === "ACTIVE") return `${styles.statusPill} ${styles.statusActive}`;
    if (status === "COMPLETED") return `${styles.statusPill} ${styles.statusCompleted}`;
    return styles.statusPill;
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
              <h2 className={styles.title}>Booking Management</h2>
              <p className={styles.subtitle}>
                Manage all client bookings ({total} total)
              </p>
            </div>

            {/* CREATE BOOKING */}
            <button className={styles.createBtn} 
            onClick={() => navigate("/bookings/create")}>
              +  Create Booking
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
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
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
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  {/* <option value="CANCELLED">Cancelled</option> */}
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

          {/* TABLE CARD */}
          <div className={styles.tableCard}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Name</div>
                <div>Doula</div>
                <div>Service</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Time Slot</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* TABLE BODY */}
              {loading ? (
                <div className={styles.stateRow}>Loading...</div>
              ) : error ? (
                <div className={styles.stateRow}>{error}</div>
              ) : bookings.length === 0 ? (
                <div className={styles.stateRow}>No bookings found</div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className={styles.tableRow}>
                    {/* NAME */}
                    <div className={styles.mainText}>{b.clientName}</div>

                    {/* DOULA */}
                    <div className={styles.mainText}>{b.doulaName}</div>

                    {/* SERVICE */}
                    <div className={styles.mainText}>
                      <span className={styles.serviceStatusPill}>
                        {b.serviceName}
                      </span>
                    </div>

                    {/* START DATE */}
                    <div className={styles.mainText}>
                      {new Date(b.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    {/* END DATE */}
                    <div className={styles.mainText}>
                      {new Date(b.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    {/* TIME SLOT */}
                    <div className={styles.mainText}>
                      {getDerivedTimeSlot()}
                    </div>


                    {/* STATUS */}
                    <div>
                      <span className={getStatusClass(b.status)}>
                        {b.status}
                      </span>
                    </div>

                    {/* ACTION DOTS */}
                    <div className={styles.actionsCell}>
                      <button className={styles.iconBtn}>
                        <BsThreeDotsVertical />
                      </button>
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
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>

                <span className={styles.pageIndicator}>
                  Page {page} of {totalPages}
                </span>

                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
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

export default Bookings;
