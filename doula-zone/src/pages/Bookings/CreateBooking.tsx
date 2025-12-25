import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./CreateBooking.module.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../shared/ToastContext";
import { createBooking } from "../../services/booking.service";
import api from "../../services/api";

/* ================= TYPES ================= */

type DoulaListItem = {
  userId: string;
  profileid: string; // IMPORTANT: used for booking submit
  name: string;
};

type DoulaService = {
  servicePricingId: string;
  serviceName: string;
  price: string;
};

/* ================= COMPONENT ================= */

const CreateBooking = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [loadingDoulas, setLoadingDoulas] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const [doulas, setDoulas] = useState<DoulaListItem[]>([]);
  const [services, setServices] = useState<DoulaService[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    doulaProfileId: "",
    serviceId: "",
    seviceStartDate: "",
    serviceEndDate: "",
    serviceTimeSlots: "",
    buffer: 2,
    visitFrequency: 2,
  });

  /* ================= LOAD DOULAS LIST ================= */

  useEffect(() => {
    const loadDoulas = async () => {
      try {
        setLoadingDoulas(true);
        const res = await api.get("/zonemanager/doulas/list");
        setDoulas(res.data.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load doulas", "error");
      } finally {
        setLoadingDoulas(false);
      }
    };

    loadDoulas();
  }, [showToast]);

  /* ================= LOAD SERVICES FOR SELECTED DOULA ================= */

  const loadDoulaServices = async (userId: string) => {
    try {
      setLoadingServices(true);
      setServices([]);

      const res = await api.get(`/doula/${userId}`);
      setServices(res.data.data.serviceNames || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load services", "error");
    } finally {
      setLoadingServices(false);
    }
  };

  /* ================= HANDLE DOULA CHANGE ================= */

  const handleDoulaChange = (profileid: string) => {
    const selected = doulas.find((d) => d.profileid === profileid);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      doulaProfileId: selected.profileid,
      serviceId: "",
    }));

    loadDoulaServices(selected.userId); // ✅ userId here
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
  try {
    setLoading(true);
    const payload = {
      ...form,
      seviceStartDate: new Date(form.seviceStartDate).toISOString(),
      serviceEndDate: new Date(form.serviceEndDate).toISOString(),
      serviceTimeSlots: form.serviceTimeSlots.replace(/\s+/g, ""),
    };

    await createBooking(payload);
    showToast("Booking created successfully", "success");
    navigate("/bookings");
  } catch (err) {
    console.error(err);
    showToast("Failed to create booking", "error");
  } finally {
    setLoading(false);
  }
};


  /* ================= UI ================= */

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <div className={styles.formCard}>

            {/* CLIENT DETAILS */}
            <h4 className={styles.sectionTitle}>Client Details</h4>
            <div className={styles.formGrid}>
              <input
                placeholder="Client Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* DOULA & SERVICE */}
            <h4 className={styles.sectionTitle}>Doula & Service</h4>
            <div className={styles.formGrid}>
              <select
                value={form.doulaProfileId}
                onChange={(e) => handleDoulaChange(e.target.value)}
              >
                <option value="">Select Doula</option>
                {loadingDoulas && <option>Loading...</option>}
                {!loadingDoulas &&
                  doulas.map((d) => (
                    <option key={d.profileid} value={d.profileid}>
                      {d.name}
                    </option>
                  ))}
              </select>

              <select
                value={form.serviceId}
                disabled={!services.length || loadingServices}
                onChange={(e) =>
                  setForm({ ...form, serviceId: e.target.value })
                }
              >
                <option value="">
                  {loadingServices ? "Loading services..." : "Select Service"}
                </option>
                {services.map((s) => (
                  <option
                    key={s.servicePricingId}
                    value={s.servicePricingId}
                  >
                    {s.serviceName} — ₹{s.price}
                  </option>
                ))}
              </select>
            </div>

            {/* SCHEDULE */}
            <h4 className={styles.sectionTitle}>Schedule</h4>
            <div className={styles.formGrid}>
              <input
                type="date"
                onChange={(e) =>
                  setForm({ ...form, seviceStartDate: e.target.value })
                }
              />
              <input
                type="date"
                onChange={(e) =>
                  setForm({ ...form, serviceEndDate: e.target.value })
                }
              />
              <input
                placeholder="Time Slot (10:00-11:00)"
                onChange={(e) =>
                  setForm({ ...form, serviceTimeSlots: e.target.value })
                }
              />
            </div>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                className={styles.createBtn}
                disabled={loading}
                onClick={handleSubmit}
              >
                Create Booking
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
