import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./CreateBooking.module.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../shared/ToastContext";
import api from "../../services/api";
import { calculatePricing } from "../../services/pricing.service";
import { createZoneBooking } from "../../services/booking.service";
import { FaArrowLeft } from "react-icons/fa6";

/* ================= TYPES ================= */

type DoulaItem = {
  userId: string;
  profileId: string;
  name: string;
};

type ServicePricing = {
  servicePricingId: string;
  serviceName: string;
};

type AvailabilityResponse = {
  visitDates: string[];
  availability: {
    morning: boolean;
    night: boolean;
    fullday: boolean;
  };
};

type PricingResponse = {
  available: boolean;
  totalAmount: number;
  currency: string;
  numberOfVisits: number;
  pricePerVisit: number;
  visitDates: string[];
  serviceName: string;
};

/* ================= COMPONENT ================= */

const CreateBooking = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const today = new Date().toISOString().split("T")[0];


  /* ================= STATE ================= */

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [doulas, setDoulas] = useState<DoulaItem[]>([]);
  const [selectedDoula, setSelectedDoula] = useState<DoulaItem | null>(null);

  const [services, setServices] = useState<ServicePricing[]>([]);
  const [servicePricingId, setServicePricingId] = useState("");
  const [derivedServiceType, setDerivedServiceType] =
    useState<"POSTPARTUM" | "BIRTH" | "">("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [visitFrequency, setVisitFrequency] = useState(1);
  const [timeShift, setTimeShift] =
    useState<"MORNING" | "NIGHT" | "FULLDAY">("MORNING");

  const [availability, setAvailability] =
    useState<AvailabilityResponse | null>(null);

  const [pricing, setPricing] = useState<PricingResponse | null>(null);

  const buffer = 0;

  /* ================= LOAD DOULAS ================= */

  useEffect(() => {
    (async () => {
      const res = await api.get("/zonemanager/doulas/list");

      const normalized = res.data.data.map((d: any) => ({
        userId: d.userId,
        profileId: d.profileid,
        name: d.name,
      }));

      setDoulas(normalized);
    })();
  }, []);

  /* ================= LOAD SERVICES ================= */

  const loadServices = async (userId: string) => {
    try {
      setServices([]);
      setServicePricingId("");
      setDerivedServiceType("");
      setAvailability(null);
      setPricing(null);

      const res = await api.get(`/doula/${userId}`);
      const raw = res.data.data.serviceNames || [];

      const normalized: ServicePricing[] = raw.map((s: any) => ({
        servicePricingId: s.servicePricingId,
        serviceName: s.serviceName,
      }));

      setServices(normalized);
    } catch {
      showToast("Failed to load services", "error");
    }
  };

  /* ================= AUTO AVAILABILITY ================= */

  useEffect(() => {
    if (
      derivedServiceType !== "POSTPARTUM" ||
      !selectedDoula ||
      !startDate ||
      !endDate ||
      !visitFrequency
    )
      return;

    (async () => {
      try {
        const res = await api.get(
          `/doula/${selectedDoula.profileId}/available-shifts`,
          {
            params: {
              startDate,
              endDate,
              visitFrequency,
            },
          }
        );
        setAvailability(res.data.data);
      } catch {
        showToast("Failed to fetch availability", "error");
      }
    })();
  }, [derivedServiceType, selectedDoula, startDate, endDate, visitFrequency]);

  /* ================= PRICE ================= */

  const handleCalculatePrice = async () => {
    if (!selectedDoula || !servicePricingId || !startDate || !endDate) {
      showToast("Complete previous steps first", "error");
      return;
    }

    const payload = {
      doulaProfileId: selectedDoula.profileId,
      servicePricingId,
      serviceStartDate: startDate,
      servicEndDate: endDate,
      buffer,
      serviceTimeShift:
        derivedServiceType === "POSTPARTUM" ? timeShift : "FULLDAY",
      ...(derivedServiceType === "POSTPARTUM" && {
        visitFrequency,
      }),
    };

    try {
      const res = await calculatePricing(payload);

      if (!res.available) {
        showToast("Doula not available", "error");
        setPricing(null);
        return;
      }

      setPricing(res);
      showToast("Price calculated successfully", "success");
    } catch(err: any){
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to calculate price";
      showToast(msg, "error");
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!pricing || !selectedDoula) return;

    const payload = {
      ...client,
      doulaProfileId: selectedDoula.profileId,
      serviceId: servicePricingId,
      seviceStartDate: new Date(startDate).toISOString(),
      serviceEndDate: new Date(endDate).toISOString(),
      buffer,
      serviceTimeShift:
        derivedServiceType === "POSTPARTUM" ? timeShift : "FULLDAY",
      ...(derivedServiceType === "POSTPARTUM" && {
        visitFrequency,
      }),
    };

    try {
      await createZoneBooking(payload);
      showToast("Booking created & confirmed", "success");
      navigate("/bookings");
    } catch {
      showToast("Failed to create booking", "error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          <button
            type="button"
            className={styles.backLink}
            onClick={() => window.history.back()}
          >
            <FaArrowLeft /> Back to List
          </button>

          <div className={styles.formCard}>
            <h3>Create Booking</h3>

            {/* GRID START */}
            <div className={styles.formGrid}>

              {/* CLIENT */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Client Name</label>
                <input
                  placeholder="Client Name"
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email ID</label>
                <input
                  placeholder="Email"
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  placeholder="Phone"
                  onChange={(e) =>
                    setClient({ ...client, phone: e.target.value })
                  }
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Address</label>
                <input
                  placeholder="Address"
                  onChange={(e) =>
                    setClient({ ...client, address: e.target.value })
                  }
                />
              </div>

              {/* DOULA */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Doula</label>
                <select
                  value={selectedDoula?.userId || ""}
                  onChange={(e) => {
                    const doula = doulas.find(d => d.userId === e.target.value);
                    if (!doula) return;
                    setSelectedDoula(doula);
                    loadServices(doula.userId);
                  }}
                >
                  <option value="">Select Doula</option>
                  {doulas.map(d => (
                    <option key={d.userId} value={d.userId}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* SERVICE */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Service</label>
                <select
                  value={servicePricingId}
                  disabled={!services.length}
                  onChange={(e) => {
                    const selected = services.find(
                      s => s.servicePricingId === e.target.value
                    );

                    setServicePricingId(e.target.value);

                    const name = selected?.serviceName.toLowerCase() || "";
                    if (name.includes("post partum") || name.includes("postnatal")) {
                      setDerivedServiceType("POSTPARTUM");
                    } else {
                      setDerivedServiceType("BIRTH");
                    }

                    setVisitFrequency(1);
                    setAvailability(null);
                    setPricing(null);
                  }}
                >
                  <option value="">Select Service</option>
                  {services.map(s => (
                    <option key={s.servicePricingId} value={s.servicePricingId}>
                      {s.serviceName}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATES */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Start Date</label>
                <input type="date" min={today} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>End Date</label>
                <input type="date" min={startDate || today} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              {/* POSTPARTUM ONLY */}
              {derivedServiceType === "POSTPARTUM" && (
                <>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Frequency</label>
                    <input
                      type="number"
                      min={1}
                       max={
                        startDate && endDate
                          ? Math.floor(
                              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) + 1
                          : 1
                      }
                      value={visitFrequency}
                      onChange={(e) => setVisitFrequency(+e.target.value)}
                    />
                  </div>

                  {availability && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Time Shift</label>
                      <select
                        value={timeShift}
                        onChange={(e) => setTimeShift(e.target.value as any)}
                      >
                        {availability.availability.morning && (
                          <option value="MORNING">Morning</option>
                        )}
                        {availability.availability.night && (
                          <option value="NIGHT">Night</option>
                        )}
                        {availability.availability.fullday && (
                          <option value="FULLDAY">Full Day</option>
                        )}
                      </select>
                    </div>
                  )}
                </>
              )}

            </div>
            {/* GRID END */}

            <button onClick={handleCalculatePrice}>Calculate Price</button>

            {pricing && (
              <div className={styles.priceBox}>
                <div>Total Amount: ${pricing.totalAmount}</div>
              </div>
            )}

            <button
              className={styles.primary}
              disabled={!pricing}
              onClick={handleSubmit}
            >
              Confirm Booking
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
