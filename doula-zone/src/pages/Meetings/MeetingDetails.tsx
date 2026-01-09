import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./MeetingDetails.module.css";
import {
  fetchMeetingById,
  updateMeetingStatus,
  type MeetingDetails,
} from "../../services/meetings.service";
import { FaArrowLeft } from "react-icons/fa";
import { useToast } from "../../shared/ToastContext";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";

type ActionType = "COMPLETED" | "CANCELED" | null;

const MeetingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [data, setData] = useState<MeetingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  // modal state
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);

  useEffect(() => {
    if (!id) return;

    fetchMeetingById(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  const confirmUpdate = async () => {
    if (!data || !confirmAction) return;

    try {
      setUpdating(true);

      await updateMeetingStatus(data.meetingId, confirmAction);

      const refreshed = await fetchMeetingById(data.meetingId);
      setData(refreshed);

      showToast(
        confirmAction === "COMPLETED"
          ? "Meeting marked as completed"
          : "Meeting cancelled successfully",
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to update meeting status", "error");
    } finally {
      setUpdating(false);
      setConfirmAction(null);
    }
  };

  if (loading) return <div className={styles.state}>Loading...</div>;
  if (!data) return <div className={styles.state}>Meeting not found</div>;

const canJoinMeeting = data.meetingStatus === "SCHEDULED";
const formatTime = (iso: string) => {
  const time = iso.split("T")[1].slice(0, 5); // "10:30"
  const [h, m] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(h, m, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  return (
    <>
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

            {/* Header */}
            <div className={styles.header}>
              <h2>Meeting Information</h2>
              <span
                className={`${styles.status} ${
                  data.meetingStatus === "COMPLETED"
                    ? styles.completed
                    : data.meetingStatus === "CANCELLED"
                    ? styles.cancelled
                    : styles.scheduled
                }`}
              >
                {data.meetingStatus}
              </span>
            </div>

            {/* Main Grid */}
            <div className={styles.grid}>
              {/* Left */}
              <div className={styles.card}>
                <div className={styles.infoRow}>
                  <div>
                    <label>Date</label>
                    <p>{new Date(data.meetingDate).toDateString()}</p>
                  </div>

                  <div>
                    <label>Time</label>
                    
                    <p>
                      {formatTime(data.meetingStartTime)}
                      {" - "}
                      {formatTime(data.meetingEndTime)}
                    </p>
                  </div>
                </div>

                <div className={styles.block}>
                  <label>Service</label>
                  <span className={styles.pill}>{data.serviceName}</span>
                </div>

                <div className={styles.block}>
                  <label>Mode</label>
                  <p>Virtual Meeting</p>
                </div>
              </div>

              {/* Right */}
              <div className={styles.sideCard}>
                <h4>Actions</h4>

              <button
                className={`${styles.joinBtn} ${
                  !canJoinMeeting ? styles.disabledBtn : ""
                }`}
                onClick={() => navigate(`/joinmeeting/${data.meetingId}`)}
                disabled={!canJoinMeeting}
              >
                Join Meeting
              </button>

                <button
                  className={styles.secondaryBtn}
                  onClick={() => setConfirmAction("COMPLETED")}
                  disabled={updating || data.meetingStatus !== "SCHEDULED"}
                >
                  Mark as Completed
                </button>

                <button
                  className={styles.dangerBtn}
                  onClick={() => setConfirmAction("CANCELED")}
                  disabled={updating || data.meetingStatus !== "SCHEDULED"}
                >
                  Cancel Meeting
                </button>
                <button 
                  className={styles.scheduleBtn}
                  onClick={() => navigate(`/meetings/${data.enquiryId}/schedule`)}>
                  Schedule Meeting
                </button>
              </div>
            </div>

            {/* Client Details */}
            <div className={styles.card}>
              <h4>Client Details</h4>
              <div className={styles.clientRow}>
                <div className={styles.avatar}>
                  {data.client.clientName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{data.client.clientName}</strong>
                  <p>{data.client.clientEmail}</p>
                  <p>{data.client.clientPhone}</p>
                </div>
              </div>
            </div>

            {data.remarks && (
              <div className={styles.card}>
                <h4>Internal Notes</h4>
                <p>{data.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title="Confirm Action"
      >
        <p>
          {confirmAction === "COMPLETED"
            ? "Are you sure you want to mark this meeting as completed?"
            : "Are you sure you want to cancel this meeting?"}
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            className={styles.secondaryBtn}
            onClick={() => setConfirmAction(null)}
          >
            No
          </button>

          <button
            className={
              confirmAction === "COMPLETED"
                ? styles.secondaryBtn
                : styles.secondaryBtn
            }
            onClick={confirmUpdate}
            disabled={updating}
          >
            {updating ? "Processing..." : "Yes, Confirm"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MeetingDetailsPage;
