import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Dashboard/components/sidebar/Sidebar";
import Topbar from "../../Dashboard/components/topbar/Topbar";
import styles from "./ManageDoulas.module.css";
import {
  fetchDoulas,
  fetchServices,
  type Doula,
  type Service,
} from "../../../services/doula.service";
import { useToast } from "../../../shared/ToastContext";
import { FiFilter } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
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
  const [doulas, setDoulas] = useState<Doula[]>([]);
  const [total, setTotal] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
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
        setError(null);
        setLoading(true);

        const [doulaRes, serviceRes] = await Promise.all([
          fetchDoulas(),
          fetchServices(),
        ]);

        setDoulas(doulaRes.doulas);
        setTotal(doulaRes.total);
        setServices(serviceRes);
      } catch (err) {
        console.error(err);
        setError("Failed to load doulas. Please try again.");
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

  const filteredDoulas = useMemo(() => {
    const q = search.trim().toLowerCase();

    return doulas.filter((doula) => {
      // search
      if (q) {
        const hay =
          `${doula.name} ${doula.email} ${doula.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      const profile = doula.doulaProfile;

      // service filter
      if (serviceFilter !== "ALL") {
        const hasService =
          profile?.ServicePricing?.some(
            (sp) => sp.serviceId === serviceFilter
          ) ?? false;
        if (!hasService) return false;
      }

      // availability filter
      if (availabilityFilter !== "ALL") {
        const hasSlots = (profile?.AvailableSlotsForService?.length ?? 0) > 0;
        if (availabilityFilter === "AVAILABLE" && !hasSlots) return false;
        if (availabilityFilter === "UNAVAILABLE" && hasSlots) return false;
      }

      // status filter
      if (statusFilter === "ACTIVE" && !doula.is_active) return false;
      if (statusFilter === "INACTIVE" && doula.is_active) return false;

      return true;
    });
  }, [doulas, search, serviceFilter, availabilityFilter, statusFilter]);

  const getServiceNamesForDoula = (doula: Doula) => {
  const profile = doula.doulaProfile;
  if (!profile?.ServicePricing) return [];

  return profile.ServicePricing.map((sp) => {
    const svc = services.find((s) => s.id === sp.serviceId);
    return {
      id: sp.serviceId,
      name: svc?.name || "Service"
    };
  });
};


  const getRegionLabel = (doula: Doula): string => {
    const region = doula.doulaProfile?.Region?.[0];
    if (!region) return "Not assigned";
    return `${region.regionName}, ${region.state}`;
  };

  const getNextAvailable = (doula: Doula) => {
    const slots = doula.doulaProfile?.AvailableSlotsForService || [];
    if (!slots.length) return null;
    const sorted = [...slots].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted[0];
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
                View and manage doulas in your zone ({total} total).
              </p>
            </div>

            <button
              className={styles.createBtn}
              onClick={() => {
                navigate("/doulas/create");
              }}
            >
              + Create Doula
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filtersCard}>
            {/* Search */}
            <div className={styles.searchInput}>
              <FiSearch className={styles.inputIcon} color="#90A1B9"/>
              <input
                type="text"
                placeholder="Search by name, email or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterRow}>
                {/* Service filter */}
            <div className={styles.filterSelect}>
              <label>Service</label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="ALL">All services</option>
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability filter */}
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

            {/* Status filter */}
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
              <FiFilter className={styles.filterIcon}/> Reset filters
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
              <div className={styles.loadingState}>Loading doulas...</div>
            ) : error ? (
              <div className={styles.errorState}>{error}</div>
            ) : filteredDoulas.length === 0 ? (
              <div className={styles.emptyState}>
                No doulas match the selected filters.
              </div>
            ) : (
              filteredDoulas.map((doula) => {
                const servicesNames = getServiceNamesForDoula(doula);
                const regionLabel = getRegionLabel(doula);
                const next = getNextAvailable(doula);

                const initials =
                  doula.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?";

                return (
                  <div key={doula.id} className={styles.tableRow}>
                    {/* Doula */}
                    <div className={styles.doulaCell}>
                      <div className={styles.avatar}>{initials}</div>
                      <div className={styles.doulaText}>
                        <span className={styles.doulaName}>{doula.name}</span>
                        <span className={styles.doulaEmail}>
                          {doula.email}
                        </span>
                      </div>
                    </div>

                    {/* Services */}
                    <div className={styles.servicesCell}>
                      {servicesNames.length === 0 ? (
                        <span className={styles.subMuted}>No services set</span>
                      ) : (
                       servicesNames.map((svc) => (
                        <span
                          key={`${doula.id}-${svc.id}`}
                          className={styles.serviceTag}
                        >
                          {svc.name}
                        </span>
                      ))
                      )}
                    </div>

                    {/* Region */}
                    <div>
                      <div className={styles.regionText}>{regionLabel}</div>
                      {/* {doula.doulaProfile?.yoe != null && (
                        <div className={styles.subMuted}>
                          {doula.doulaProfile.yoe} yrs experience
                        </div>
                      )} */}
                    </div>

                    {/* Next Available */}
                    <div className={styles.nextAvail}>
                      {next ? (
                        <>
                          <span>{formatDate(next.date)}</span>
                          <span className={styles.subMuted}>
                            {next.weekday}
                          </span>
                        </>
                      ) : (
                        <span className={styles.subMuted}>
                          No availability
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        className={`${styles.statusBadge} ${
                          doula.is_active
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {doula.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        onClick={() => {
                          console.log("View doula", doula.id);
                          // later: navigate(`/doulas/${doula.id}`)
                        }}
                      >
                         <MdOutlineRemoveRedEye size={15} color="black"/>
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => {
                        
                        }}
                      >
                        <FiEdit size={15} color="black"/>
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => {
                      
                        }}
                      >
                        ⋯
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
