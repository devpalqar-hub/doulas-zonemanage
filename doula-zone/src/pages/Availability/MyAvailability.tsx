import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./MyAvailability.module.css";

import AddSlotModal from "./AddSlotModal";
import AddOffDayModal from "./AddOffDayModal";

import {
  fetchSlots,
  deleteSlot,
  fetchOffDays,
  deleteOffDay,
  type FlatSlot,
  type OffDay,
} from "../../services/availability.service";

import { FiTrash } from "react-icons/fi";

/* ================= HELPERS ================= */

const isoToTime = (iso?: string | null) => {
  if (!iso) return "--";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

const isoToDate = (iso: string) => iso.slice(0, 10);

/* ================= COMPONENT ================= */

const MyAvailability = () => {
  const [tab, setTab] = useState<"slots" | "offdays">("slots");

  // slots
  const [slots, setSlots] = useState<FlatSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [openAddSlot, setOpenAddSlot] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  // off days
  const [offDays, setOffDays] = useState<OffDay[]>([]);
  const [loadingOffDays, setLoadingOffDays] = useState(true);
  const [openOffDay, setOpenOffDay] = useState(false);
  const [deletingOffDayId, setDeletingOffDayId] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      const data = await fetchSlots();
      setSlots(data);
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadOffDays = async () => {
    try {
      setLoadingOffDays(true);
      const data = await fetchOffDays();
      setOffDays(data);
    } finally {
      setLoadingOffDays(false);
    }
  };

  useEffect(() => {
    loadSlots();
    loadOffDays();
  }, []);

  /* ================= DELETE ================= */

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Delete this time slot?")) return;
    try {
      setDeletingSlotId(id);
      await deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeletingSlotId(null);
    }
  };

  const handleDeleteOffDay = async (id: string) => {
    if (!confirm("Delete this off day?")) return;
    try {
      setDeletingOffDayId(id);
      await deleteOffDay(id);
      setOffDays((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeletingOffDayId(null);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <h2 className={styles.title}>My Availability</h2>

          {/* ===== TABS + ACTION ===== */}
          <div className={styles.tabsRow}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  tab === "slots" ? styles.activeTab : ""
                }`}
                onClick={() => setTab("slots")}
              >
                Time Slots
              </button>

              <button
                className={`${styles.tab} ${
                  tab === "offdays" ? styles.activeTab : ""
                }`}
                onClick={() => setTab("offdays")}
              >
                Off Days
              </button>
            </div>

            <button
              className={styles.addBtn}
              onClick={() =>
                tab === "slots"
                  ? setOpenAddSlot(true)
                  : setOpenOffDay(true)
              }
            >
              {tab === "slots" ? "+ Add Time Slot" : "+ Mark Off Day"}
            </button>
          </div>

          {/* ================= TIME SLOTS ================= */}
          {tab === "slots" && (
            <>
              <AddSlotModal
                isOpen={openAddSlot}
                onClose={() => setOpenAddSlot(false)}
                refresh={loadSlots}
              />

              {loadingSlots ? (
                <div>Loading…</div>
              ) : slots.length === 0 ? (
                <div className={styles.empty}>No time slots added.</div>
              ) : (
                <div className={styles.rows}>
                  {slots.map((slot) => (
                    <div key={slot.id} className={styles.row}>
                      <input value={slot.weekday} disabled />
                      <input value={isoToTime(slot.startTime)} disabled />
                      <input value={isoToTime(slot.endTime)} disabled />

                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={deletingSlotId === slot.id}
                        className={styles.deleteBtn}
                      >
                        <FiTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ================= OFF DAYS ================= */}
          {tab === "offdays" && (
            <>
              <AddOffDayModal
                isOpen={openOffDay}
                onClose={() => setOpenOffDay(false)}
                refresh={loadOffDays}
              />

              {loadingOffDays ? (
                <div>Loading…</div>
              ) : offDays.length === 0 ? (
                <div className={styles.empty}>No off days marked.</div>
              ) : (
                <div className={styles.rows}>
                  {offDays.map((d) => (
                    <div key={d.id} className={styles.row}>
                      <input value={isoToDate(d.date)} disabled />
                      <input
                        value={
                          d.startTime ? isoToTime(d.startTime) : "Full Day"
                        }
                        disabled
                      />
                      <input
                        value={d.endTime ? isoToTime(d.endTime) : "Off"}
                        disabled
                      />

                      <button
                        onClick={() => handleDeleteOffDay(d.id)}
                        disabled={deletingOffDayId === d.id}
                        className={styles.deleteBtn}
                      >
                        <FiTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAvailability;
