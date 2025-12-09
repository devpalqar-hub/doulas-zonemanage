import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { createSlot } from "../../services/availability.service";
import { useToast } from "../../shared/ToastContext";
import styles from "./AddSlotModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddSlotModal = ({ isOpen, onClose, refresh }: Props) => {
  const { showToast } = useToast();
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  // VALIDATION LOGIC
 
  const validate = () => {
    if (!date || !start || !end) {
      showToast("Please fill all fields", "warning");
      return false;
    }

    const startTime = new Date(`${date}T${start}:00`);
    const endTime = new Date(`${date}T${end}:00`);

    if (endTime <= startTime) {
      showToast("End time must be later than start time", "error");
      return false;
    }

    return true;
  };


  // HANDLE ADD SLOT

  const handleAdd = async () => {
    if (!validate()) return;

    setLoading(true);

    try {

      await createSlot({
        date,
        startTime: start,
        endTime: end,
      });

      showToast("Slot added successfully", "success");

      onClose();
      refresh();

      // clear fields
      setDate("");
      setStart("");
      setEnd("");

    } catch (err: any) {
      console.error(err);
      showToast("Failed to create slot", "error");
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Time Slot">
      <div className={styles.form}>

        <div className={styles.field}>
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Start Time</label>
            <input 
              type="time" 
              value={start} 
              onChange={(e) => setStart(e.target.value)} 
            />
          </div>

          <div className={styles.field}>
            <label>End Time</label>
            <input 
              type="time" 
              value={end} 
              onChange={(e) => setEnd(e.target.value)} 
            />
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
