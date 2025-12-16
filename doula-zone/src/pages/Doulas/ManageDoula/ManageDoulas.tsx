import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Dashboard/components/sidebar/Sidebar";
import Topbar from "../../Dashboard/components/topbar/Topbar";
import styles from "./ManageDoulas.module.css";
import { fetchDoulas, type DoulaListItem } from "../../../services/doula.service";
import { useToast } from "../../../shared/ToastContext";
import { FiFilter, FiSearch, FiEdit } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type AvailabilityFilter = "ALL" | "AVAILABLE" | "UNAVAILABLE";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ManageDoulas = () => {
  const [doulas, setDoulas] = useState<DoulaListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchDoulas();
        setDoulas(res.doulas);
        setTotal(res.total);
      } catch (err) {
        console.error(err);
        setError("Failed to load doulas");
        showToast("Failed to load doulas", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showToast]);

  const resetFilters = () => {
    setSearch("");
    setServiceFilter("ALL");
    setAvailabilityFilter("ALL");
    setStatusFilter("ALL");
  };

  // Collect unique service names for filter dropdown
  const allServiceNames = useMemo(() => {
    const set = new Set<string>();
    doulas.forEach((d) => d.serviceNames.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [doulas]);

  const filteredDoulas = useMemo(() => {
    const q = search.trim().toLowerCase();

    return doulas.filter((d) => {
      // search
      if (q) {
        const hay = `${d.name} ${d.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // service filter
      if (serviceFilter !== "ALL" && !d.serviceNames.includes(serviceFilter)) {
        return false;
      }

      // availability filter
      if (availabilityFilter !== "ALL") {
        const hasAvailability = Boolean(d.nextImmediateAvailabilityDate);
        if (availabilityFilter === "AVAILABLE" && !hasAvailability) return false;
        if (availabilityFilter === "UNAVAILABLE" && hasAvailability) return false;
      }

      // status filter (if backend sends status later, hook here)
      // if (statusFilter === "ACTIVE" && !d.is_active) return false;
      // if (statusFilter === "INACTIVE" && d.is_active) return false;


      return true;
    });
  }, [doulas, search, serviceFilter, availabilityFilter, statusFilter]);

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* Header */}
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>Manage Doulas</h2>
              <p className={styles.subtitle}>
                View and manage doulas in your zone ({total} total)
              </p>
            </div>

            <button
              className={styles.createBtn}
              onClick={() => navigate("/doulas/create")}
            >
              + Create Doula
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filtersCard}>
            <div className={styles.searchInput}>
              <FiSearch className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterSelect}>
                <label>Service</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="ALL">All services</option>
                  {allServiceNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) =>
                    setAvailabilityFilter(e.target.value as AvailabilityFilter)
                  }
                >
                  <option value="ALL">All</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                >
                  <option value="ALL">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>


              <div className={styles.resetContainer}>
                <button className={styles.resetBtn} onClick={resetFilters}>
                  <FiFilter /> Reset filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>Doula</div>
              <div>Services</div>
              <div>Region</div>
              <div>Next available</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div className={styles.loadingState}>Loading doulas…</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : filteredDoulas.length === 0 ? (
              <div className={styles.emptyState}>
                No doulas match the selected filters
              </div>
            ) : (
              filteredDoulas.map((d) => {
                const initials =
                  d.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?";

                return (
                  <div key={d.userId} className={styles.tableRow}>
                    {/* Doula */}
                    <div className={styles.doulaCell}>
                      <div className={styles.avatar}>
                        {d.profileImage ? (
                          <img
                            src={d.profileImage}
                            alt={d.name}
                            className={styles.avatarImg}
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className={styles.doulaText}>
                        <span className={styles.doulaName}>{d.name}</span>
                        <span className={styles.doulaEmail}>{d.email}</span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className={styles.servicesCell}>
                      {d.serviceNames.length === 0 ? (
                        <span className={styles.subMuted}>
                          No services set
                        </span>
                      ) : (
                        d.serviceNames.map((name) => (
                          <span
                            key={`${d.userId}-${name}`}
                            className={styles.serviceTag}
                          >
                            {name}
                          </span>
                        ))
                      )}
                    </div>

                    {/* Region */}
                    <div className={styles.regionText}>
                      {d.regionNames.join(", ") || "Not assigned"}
                    </div>

                    {/* Availability */}
                    <div className={styles.nextAvail}>
                      {d.nextImmediateAvailabilityDate ? (
                        <span>
                          {formatDate(d.nextImmediateAvailabilityDate)}
                        </span>
                      ) : (
                        <span className={styles.subMuted}>
                          No availability
                        </span>
                      )}
                    </div>

                    <div>
                      <span
                        className={`${styles.statusBadge} ${
                          d.is_active ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        {d.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>


                    {/* Actions */}
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}>
                        <MdOutlineRemoveRedEye size={15} />
                      </button>
                      <button className={styles.actionBtn}>
                        <FiEdit size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDoulas;
