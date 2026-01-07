import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./Schedules.module.css";

import { fetchServices, type Service } from "../../services/doula.service";
import {
  fetchAvailableDoulas,
  type AvailableDoula,
} from "../../services/availability.service";
import { useToast } from "../../shared/ToastContext";
import { FaArrowLeft } from "react-icons/fa6";

const CheckAvailability = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [availStartDate, setAvailStartDate] = useState("");
  const [availEndDate, setAvailEndDate] = useState("");
  const [availShift, setAvailShift] = useState("");
  const [availService, setAvailService] = useState("");

  const [availableDoulas, setAvailableDoulas] = useState<AvailableDoula[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const handleCheckAvailability = async () => {
    if (!availStartDate || !availEndDate) {
      showToast("Please select start and end date", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchAvailableDoulas({
        startDate: availStartDate,
        endDate: availEndDate,
        shift: availShift as any,
        serviceId: availService || undefined,
      });
      setAvailableDoulas(data);
    } catch {
      showToast("Failed to fetch availability", "error");
    } finally {
      setLoading(false);
    }
  };

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
              <FaArrowLeft /> Back to Schedules
            </button>
          <h2 className={styles.title}>Check Doula Availability</h2>

          {/* Filters */}
          <div className={styles.availabilityCard}>
            <div className={styles.filterRow}>
              <div className={styles.filterSelect}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={availStartDate}
                  onChange={(e) => setAvailStartDate(e.target.value)}
                />
              </div>

              <div className={styles.filterSelect}>
                <label>End Date</label>
                <input
                  type="date"
                  value={availEndDate}
                  onChange={(e) => setAvailEndDate(e.target.value)}
                />
              </div>

              <div className={styles.filterSelect}>
                <label>Shift</label>
                <select
                  value={availShift}
                  onChange={(e) => setAvailShift(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="MORNING">Morning</option>
                  <option value="NIGHT">Night</option>
                  <option value="FULLDAY">Full Day</option>
                </select>
              </div>

              <div className={styles.filterSelect}>
                <label>Service</label>
                <select
                  value={availService}
                  onChange={(e) => setAvailService(e.target.value)}
                >
                  <option value="">All</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className={styles.searchBtn} onClick={handleCheckAvailability}>
                Search Availability
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <p>Loading availability...</p>
          ) : availableDoulas.length === 0 ? (
            <p>No doulas available</p>
          ) : (
            <div className={styles.availabilityColumnList}>
              {availableDoulas.map((d) => (
                <div key={d.doulaName} className={styles.availabilityCardItem}>
                  <h4>{d.doulaName}</h4>
                  <p>
                    <strong>Shifts:</strong> {d.shift.join(", ")}
                  </p>
                  <p>
                    <strong>Unavailable Days:</strong>{" "}
                    {d.noOfUnavailableDaysInThatPeriod}
                  </p>
                  <p>
                    <strong>Services:</strong>{" "}
                    {d.availableServices.join(", ") || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckAvailability;
