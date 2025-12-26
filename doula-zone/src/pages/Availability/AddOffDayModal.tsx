import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { createOffDay } from "../../services/availability.service";
import { useToast } from "../../shared/ToastContext";
import styles from "./AddSlotModal.module.css"; // reuse styles

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddOffDayModal = ({ isOpen, onClose, refresh }: Props) => {
  const { showToast } = useToast();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!startDate || !endDate) {
      showToast("Please select date range", "warning");
      return;
    }

    try {
      setLoading(true);

      await createOffDay({
        startDate,
        endDate,
        ...(startTime && endTime ? { startTime, endTime } : {}),
      });

      showToast("Off day marked successfully", "success");
      refresh();
      onClose();

      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      showToast("Failed to mark off day", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark Off Day">
      <div className={styles.form}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Start Time (optional)</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>End Time (optional)</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
          {loading ? "Saving…" : "Mark Off Day"}
        </button>
      </div>
    </Modal>
  );
};

export default AddOffDayModal;
