import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./MyAvailability.module.css";

import AddSlotModal from "./AddSlotModal";
import AddOffDayModal from "./AddOffDayModal";
import { useToast } from "../../shared/ToastContext";

import {
  fetchSlots,
  deleteSlot,
  fetchOffDays,
  deleteOffDay,
  type FlatSlot,
  type OffDay,
} from "../../services/availability.service";

import { FiTrash } from "react-icons/fi";
import Modal from "../../components/Modal/Modal";

/* ================= HELPERS ================= */

const timeOnly = (time?: string | null) => {
  if (!time) return "--";
  return time.slice(11, 16); 
};

const isoToDate = (iso: string) => iso.slice(0, 10);

/* ================= COMPONENT ================= */

const MyAvailability = () => {
  const { showToast } = useToast();
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"slot" | "offday" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);


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
                      <input value={timeOnly(slot.startTime)} disabled />
                      <input value={timeOnly(slot.endTime)} disabled />

                      <button
                        onClick={() => {
                          setConfirmType("slot");
                          setConfirmId(slot.id);
                          setConfirmOpen(true);
                        }}
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
                          d.startTime ? timeOnly(d.startTime) : "Full Day"
                        }
                        disabled
                      />
                      <input
                        value={d.endTime ? timeOnly(d.endTime) : "Off"}
                        disabled
                      />
                     <button
                      onClick={() => {
                        setConfirmType("offday");
                        setConfirmId(d.id);
                        setConfirmOpen(true);
                      }}
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
          <Modal
            isOpen={confirmOpen}
            onClose={() => {
              setConfirmOpen(false);
              setConfirmId(null);
              setConfirmType(null);
            }}
            title="Confirm Deletion"
          >
            <p>
              {confirmType === "slot"
                ? "Are you sure you want to delete this time slot?"
                : "Are you sure you want to delete this off day?"}
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                className={styles.secondaryBtn}
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmId(null);
                  setConfirmType(null);
                }}
              >
                Cancel
              </button>

              <button
                className={styles.dangerBtn}
                onClick={async () => {
                  if (!confirmId || !confirmType) return;

                  try {
                    if (confirmType === "slot") {
                      setDeletingSlotId(confirmId);
                      await deleteSlot(confirmId);
                      setSlots(prev => prev.filter(s => s.id !== confirmId));
                      showToast("Slot deleted", "success");
                    } else {
                      setDeletingOffDayId(confirmId);
                      await deleteOffDay(confirmId);
                      setOffDays(prev => prev.filter(d => d.id !== confirmId));
                      showToast("Off day deleted", "success");
                    }
                  } catch (err: any) {
                    const msg =
                      err?.response?.data?.message || "Failed to delete";
                    showToast(msg, "error");
                  } finally {
                    setDeletingSlotId(null);
                    setDeletingOffDayId(null);
                    setConfirmOpen(false);
                    setConfirmId(null);
                    setConfirmType(null);
                  }
                }}
              >
                Yes, Delete
              </button>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default MyAvailability;
