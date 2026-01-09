import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Dashboard/components/sidebar/Sidebar";
import Topbar from "../../Dashboard/components/topbar/Topbar";
import styles from "./ScheduleMeetingPage.module.css";

import {
  fetchZoneManagerDoulas,
  type DoulaListItem,
} from "../../../services/doula.service";
import { scheduleMeeting } from "../../../services/meetings.service";
import { useToast } from "../../../shared/ToastContext";
import { FaArrowLeft } from "react-icons/fa";

export default function ScheduleMeetingPage() {
  const { enquiryId } = useParams<{ enquiryId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [doulas, setDoulas] = useState<DoulaListItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZoneManagerDoulas()
    .then((res) => {
      setDoulas(res.doulas); 
    })
      .catch(() => showToast("Failed to load doulas", "error"));
  }, []);

  const toggleDoula = (profileId: string | null) => {
    if (!profileId) return;

    setSelected((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = async () => {
    if (!enquiryId || !date || !time || selected.length === 0) {
      showToast("All required fields must be filled", "error");
      return;
    }

    try {
      setLoading(true);

      const formattedTime = time.length === 5 ? `${time}:00` : time;

      await scheduleMeeting({
        enquiryId,
        date,
        time: formattedTime,
        notes,
        doulaIds: selected,
      });

      showToast("Meeting scheduled successfully", "success");
      navigate(-1);
    } catch (err) {
      console.error(err);
      showToast("Failed to schedule meeting", "error");
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
          {/* Back */}
            <button
              type="button"
              className={styles.backLink}
              onClick={() => window.history.back()}
            >
              <FaArrowLeft /> Back to Meetings
            </button>

          <h2 className={styles.title}>Schedule Meeting</h2>

          {/* Form */}
          <div className={styles.formCard}>
            <div className={styles.formGrid}>
              <div>
                <label>Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label>Time *</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <label>Meeting Notes (Optional)</label>
            <textarea
              placeholder="Add notes about the meeting"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <h4>Select Doulas ({selected.length} selected)</h4>

            <div className={styles.doulaGrid}>
              {doulas.map((d) => (
                <div
                  key={d.userId}
                  className={`${styles.doulaCard} ${
                    selected.includes(d.profileId ?? "")
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => toggleDoula(d.profileId)}
                >
                  <div className={styles.avatar}>
                    {d.profileImage ? (
                      <img
                        src={
                          d.profileImage.startsWith("http")
                            ? d.profileImage
                            : `${import.meta.env.VITE_IMAGE_BASE_URL}/${d.profileImage}`
                        }
                        alt={d.name}
                      />
                    ) : (
                      <span>{d.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>


                  <div className={styles.info}>
                    <strong>{d.name}</strong>
                    <span className={styles.yoe}>{d.yoe} yrs experience</span>
                    <p>{(d.serviceNames ?? []).join(", ")}</p>
                  </div>

                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Scheduling..." : "Send Meeting Invites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
