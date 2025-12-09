// src/pages/Availability/MyAvailability.tsx
import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./MyAvailability.module.css";
import AddSlotModal from "./AddSlotModal";
import {
  fetchSlots,
  deleteSlot,
  type FlatSlot,
} from "../../services/availability.service";

const REGION_ID =
  import.meta.env.VITE_REGION_ID ||
  "cd3281d9-94ed-41df-9506-4bc833c7f9e6"; 

const isoToTime = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const isoToDate = (iso: string) => iso.slice(0, 10);

const MyAvailability = () => {
  const [slots, setSlots] = useState<FlatSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
 
  
    const fetchData = async () => {
      try {
        setError(null);
        const start = new Date();
        start.setDate(start.getDate() - 7);
        
        const end = new Date();
        end.setDate(end.getDate() + 30);

        const res = await fetchSlots(REGION_ID, start, end);
        setSlots(res.slots);
      } catch (err) {
        console.error(err);
        setError("Failed to load availability.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (slotId: string) => {
    if (!confirm("Delete this time slot?")) return;
    try {
      setDeletingId(slotId);
      await deleteSlot(slotId);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <h2 className={styles.title}>My Availability</h2>
          <p className={styles.subtitle}>
            Set your availability schedule for client meetings
          </p>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.cardTitle}>Weekly Schedule</h3>
                <p className={styles.cardSubtitle}>
                  Configure your available time slots for each day
                </p>
              </div>
              <button
                className={styles.addBtn}
                onClick={() => setOpenAdd(true)}
              >
                + Add Time Slot
              </button>

              <AddSlotModal
                isOpen={openAdd}
                onClose={() => setOpenAdd(false)}
                refresh={fetchData}
              />
            </div>

            {loading ? (
              <div className={styles.empty}>Loading availability...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : slots.length === 0 ? (
              <div className={styles.empty}>
                No availability slots yet. Click “Add Time Slot” to create one.
              </div>
            ) : (
              <div className={styles.rows}>
                {slots.map((slot) => (
                  <div key={slot.id} className={styles.row}>
                    <div className={styles.fieldGroup}>
                      <label>Day</label>
                      <input
                        value={`${slot.weekday} (${isoToDate(slot.date)})`}
                        disabled
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Start Time</label>
                      <input value={isoToTime(slot.startTime)} disabled />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>End Time</label>
                      <input value={isoToTime(slot.endTime)} disabled />
                    </div>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(slot.id)}
                      disabled={deletingId === slot.id}
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAvailability;
