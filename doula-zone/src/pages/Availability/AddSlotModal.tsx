import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { createSlot } from "../../services/availability.service";
import { useToast } from "../../shared/ToastContext";
import styles from "./AddSlotModal.module.css";

const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddSlotModal = ({ isOpen, onClose, refresh }: Props) => {
  const { showToast } = useToast();
  const [weekday, setWeekday] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // VALIDATION LOGIC
 
  const validate = () => {
    if (!weekday || !start || !end) {
      showToast("Please fill all fields", "warning");
      return false;
    }

    if (end <= start) {
      showToast("End time must be later than start time", "error");
      return false;
    }

    return true;
  };


  // HANDLE ADD SLOT

  const handleAdd = async () => {
    if (!validate()) return;

    try {
    setLoading(true);
      await createSlot({
        weekday,
        startTime: start,
        endTime: end,
      });

      showToast("Slot added successfully", "success");

      onClose();
      refresh();

      // clear fields
      setWeekday("");
      setStart("");
      setEnd("");

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to add slot";

      showToast(
        Array.isArray(message) ? message[0] : message,
        "error"
      );
    }


    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Time Slot">
      <div className={styles.form}>
        <div className={styles.field}>
          <label>Weekday</label>
          <select value={weekday} onChange={(e) => setWeekday(e.target.value)}>
            <option value="">Select day</option>
            {WEEKDAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Start Time</label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label>End Time</label>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={loading}
          className={styles.saveBtn}
        >
          {loading ? "Saving…" : "Add Slot"}
        </button>
      </div>
    </Modal>
  );
};

export default AddSlotModal;
