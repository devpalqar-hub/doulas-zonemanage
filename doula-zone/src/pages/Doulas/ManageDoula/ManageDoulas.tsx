import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Dashboard/components/sidebar/Sidebar";
import Topbar from "../../Dashboard/components/topbar/Topbar";
import styles from "./ManageDoulas.module.css";

import {
  fetchDoulas,
  deleteDoula,
  type DoulaListItem,
} from "../../../services/doula.service";

import { useToast } from "../../../shared/ToastContext";
import ConfirmationModal from "../../../shared/ConfirmationModal";

import { FiFilter, FiSearch, FiEdit, FiTrash } from "react-icons/fi";
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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  // Filters
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  // Delete modal
  const [deleteTarget, setDeleteTarget] =
    useState<DoulaListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  /* =========================
     LOAD DATA (BACKEND FILTERING)
     ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchDoulas({
          search,
          page,
          limit,
          service: serviceFilter !== "ALL" ? serviceFilter : undefined,
          availability:
            availabilityFilter !== "ALL" ? availabilityFilter : undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        });

        setDoulas(res.doulas);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error(err);
        setError("Failed to load doulas");
        showToast("Failed to load doulas", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [
    search,
    page,
    serviceFilter,
    availabilityFilter,
    statusFilter,
    showToast,
  ]);

  const resetFilters = () => {
    setSearch("");
    setServiceFilter("ALL");
    setAvailabilityFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  // Unique service names (from current page only – correct)
  const allServiceNames = useMemo(() => {
    const set = new Set<string>();
    doulas.forEach((d) => d.serviceNames.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [doulas]);

  // Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteDoula(deleteTarget.userId);

      setDoulas((prev) =>
        prev.filter((d) => d.userId !== deleteTarget.userId)
      );
      setTotal((prev) => prev - 1);

      showToast("Doula deleted successfully!", "success");
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      showToast("Failed to delete doula", "error");
    } finally {
      setDeleting(false);
    }
  };

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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className={styles.filterRow}>
              <div className={styles.filterSelect}>
                <label>Service</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value);
                    setPage(1);
                  }}
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
                  onChange={(e) => {
                    setAvailabilityFilter(
                      e.target.value as AvailabilityFilter
                    );
                    setPage(1);
                  }}
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
                  onChange={(e) => {
                    setStatusFilter(e.target.value as StatusFilter);
                    setPage(1);
                  }}
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
            ) : doulas.length === 0 ? (
              <div className={styles.emptyState}>
                No doulas match the selected filters
              </div>
            ) : (
              doulas.map((d) => {
                const initials =
                  d.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?";

                return (
                  <div key={d.userId} className={styles.tableRow}>
                    <div className={styles.doulaCell}>
                      <div className={styles.avatar}>
                        {d.profileImage ? (
                          <img
                            src={d.profileImage}
                            className={styles.avatarImg}
                            alt=""
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

                    <div className={styles.regionText}>
                      {d.regionNames.join(", ") || "Not assigned"}
                    </div>

                    <div className={styles.nextAvail}>
                      {d.nextImmediateAvailabilityDate ? (
                        formatDate(d.nextImmediateAvailabilityDate)
                      ) : (
                        <span className={styles.subMuted}>
                          No availability
                        </span>
                      )}
                    </div>

                    <div>
                      <span
                        className={`${styles.statusBadge} ${
                          d.isActive
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {d.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/doulas/${d.userId}`)}
                      >
                        <MdOutlineRemoveRedEye size={15} />
                      </button>

                      <button className={styles.actionBtn}
                        onClick={() => navigate(`/doulas/${d.userId}/edit`)}
                      >
                        <FiEdit size={15} />
                      </button>

                      <button
                        className={styles.actionBtn}
                        onClick={() => setDeleteTarget(d)}
                      >
                        <FiTrash size={15} color="red" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <span className={styles.pageInfo}>
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
          )}
        </div>
      </div>

      <ConfirmationModal
        open={!!deleteTarget}
        title="Delete Doula"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ManageDoulas;
