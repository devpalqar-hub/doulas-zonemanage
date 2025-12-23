import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./MeetingDetails.module.css";
import { fetchMeetingById, type MeetingDetails } from "../../services/meetings.service";
import { FaArrowLeft } from "react-icons/fa";

const MeetingDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<MeetingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchMeetingById(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.state}>Loading...</div>;
  if (!data) return <div className={styles.state}>Meeting not found</div>;

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
            <FaArrowLeft />   Back to Meetings
            </button>

          {/* Header */}
          <div className={styles.header}>
            <h2>Meeting Information</h2>
            <span className={`${styles.status} ${styles.scheduled}`}>
              {data.meetingStatus.toLowerCase()}
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
                    {new Date(data.meetingStartTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
a
                    {" - "}
                    {new Date(data.meetingEndTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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

              <div className={styles.block}>
                <label>Meeting Link</label>
                <div className={styles.linkRow}>
                  <input readOnly value={data.meetingLink || ""} />
                  {data.meetingLink && (
                    <button
                      onClick={() => navigator.clipboard.writeText(data.meetingLink!)}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className={styles.sideCard}>
              <h4>Actions</h4>

              <a
                href={data.meetingLink || "#"}
                target="_blank"
                rel="noreferrer"
                className={styles.joinBtn}
              >
                Join Meeting
              </a>

              <button className={styles.secondaryBtn}>Mark as Completed</button>
              <button className={styles.dangerBtn}>Cancel Meeting</button>
            </div>
          </div>

          {/* Client */}
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

          {/* Notes */}
          {data.remarks && (
            <div className={styles.card}>
              <h4>Internal Notes</h4>
              <p>{data.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
