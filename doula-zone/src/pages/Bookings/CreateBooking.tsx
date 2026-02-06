import { useEffect, useState } from "react";
import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./CreateBooking.module.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../shared/ToastContext";
import api from "../../services/api";
import { calculatePricing, type PricingPayload } from "../../services/pricing.service";
import { createZoneBooking, type CreateBookingPayload } from "../../services/booking.service";
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
    MORNING: boolean;
    NIGHT: boolean;
    FULLDAY: boolean;
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
  const [timeShift, setTimeShift] =
    useState<"MORNING" | "NIGHT" | "FULLDAY">("MORNING");

  const [availability, setAvailability] =
    useState<AvailabilityResponse | null>(null);

  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [buffer, setBuffer] = useState(0);
  const [visitDays, setVisitDays] = useState<string[]>([]);

  const isInvalidDateRange = (start: string, end: string) => {
    if (!start || !end) return false;
    return new Date(start) > new Date(end);
  };

  /* ================= LOAD DOULAS ================= */

  useEffect(() => {
    (async () => {
      const res = await api.get("/zonemanager/doulas/list");

      const normalized = res.data.data.map((d: any) => ({
        userId: d.userId,
        profileId: d.profileId,
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
      !endDate 
    )
      return;
    if (derivedServiceType === "POSTPARTUM" && isInvalidDateRange(startDate, endDate)) {
      showToast("Start date must be before end date", "error");
      setAvailability(null);
      return;
    }
    (async () => {
      try {
        const res = await api.get(
          `/doula/${selectedDoula.profileId}/available-shifts`,
          {
            params: {
              startDate,
              endDate,
              visitDays,
            },
          }
        );
        setAvailability(res.data.data);
      } catch {
        showToast("Failed to fetch availability", "error");
      }
    })();
  }, [derivedServiceType, selectedDoula, startDate, endDate]);

  useEffect(() => {
    setVisitDays([]);
  },[startDate, endDate]);
//======Visit Days Calculation for Postpartum Booking======//

    const WEEK_DAYS = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const getAvailableWeekDays = (start: string, end: string): string[] => {
    if (!start || !end) return [];

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    const daysSet = new Set<string>();
    const current = new Date(startDateObj);

    while (current <= endDateObj) {
      daysSet.add(WEEK_DAYS[current.getDay()]);
      current.setDate(current.getDate() + 1);
    }

    return Array.from(daysSet);
  };

  /* ================= PRICE ================= */

  const handleCalculatePrice = async () => {
    if (!selectedDoula || !servicePricingId) {
      showToast("Complete previous steps first", "error");
      return;
    }

    if (
      derivedServiceType === "POSTPARTUM" &&
      (!startDate || !endDate)
    ) {
      showToast("Please select start and end dates", "error");
      return;
    }

    if (
      derivedServiceType === "BIRTH" &&
      !endDate
    ) {
      showToast("Please select birth date", "error");
      return;
    }
    if (
      derivedServiceType === "POSTPARTUM" &&
      startDate !== endDate &&
      visitDays.length === 0
    ) {
      showToast("Please select at least one visit day", "error");
      return;
    }


    const payload: PricingPayload =
    derivedServiceType === "POSTPARTUM"
      ? {
          doulaProfileId: selectedDoula.profileId,
          servicePricingId,
          serviceStartDate: startDate,
          servicEndDate: endDate,
          buffer,
          serviceTimeShift: timeShift,
          visitDays,
        }
      : {
          doulaProfileId: selectedDoula.profileId,
          servicePricingId,
          serviceStartDate: endDate,
          servicEndDate: endDate, 
          buffer,
          serviceTimeShift: "FULLDAY",
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
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        showToast(backendMessage.join(", "), "error");
      } else if (typeof backendMessage === "string") {
        showToast(backendMessage, "error");
      } else {
        showToast("Failed to calculate price", "error");
      }
    }

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (
      derivedServiceType === "POSTPARTUM" &&
      isInvalidDateRange(startDate, endDate)
    ) {
      showToast("Start date must be before end date", "error");
      return;
    }

    if (!pricing || !selectedDoula) return;

    const payload: CreateBookingPayload =
      derivedServiceType === "POSTPARTUM"
        ? {
            ...client,
            doulaProfileId: selectedDoula.profileId,
            serviceId: servicePricingId,
            seviceStartDate: new Date(startDate).toISOString(),
            serviceEndDate: new Date(endDate).toISOString(),
            buffer,
            serviceTimeShift: timeShift,
            visitDays,
          }
        : {
            ...client,
            doulaProfileId: selectedDoula.profileId,
            serviceId: servicePricingId,
            seviceStartDate: new Date(endDate).toISOString(),
            serviceEndDate: new Date(endDate).toISOString(),
            buffer,
            serviceTimeShift: "FULLDAY",
          };


    try {
      await createZoneBooking(payload);
      showToast("Booking created & confirmed", "success");
      navigate("/bookings");
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        showToast(backendMessage.join(", "), "error");
      } else if (typeof backendMessage === "string") {
        showToast(backendMessage, "error");
      } else {
        showToast("Failed to create booking", "error");
      }
    }

  };

  /* ================= UI ================= */
const hasAnyShift =
  availability?.availability.MORNING ||
  availability?.availability.NIGHT ||
  availability?.availability.FULLDAY;

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
                    setBuffer(0);
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
                            
              {derivedServiceType === "POSTPARTUM" ? (
                <>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Start Date</label>
                    <input
                      type="date"
                      min={today}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>End Date</label>
                    <input
                      type="date"
                      min={startDate || today}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Birth Date</label>
                  <input
                    type="date"
                    min={today}
                    onChange={(e) => {
                      setEndDate(e.target.value);   
                      setStartDate("");             
                    }}
                  />
                </div>
              )}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Buffer (days)</label>
                  <input
                    type="number"
                    min={0}
                    value={buffer}
                    onChange={(e) => setBuffer(Number(e.target.value))}
                    placeholder="Enter buffer days"
                  />
                </div>

              {/* POSTPARTUM ONLY */}
              {derivedServiceType === "POSTPARTUM" && (
                <>
                  {derivedServiceType === "POSTPARTUM" &&
                    startDate &&
                    endDate &&
                    startDate !== endDate && (
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Visit Days</label>

                        <div className={styles.chipsContainer}>
                          {WEEK_DAYS.map((day) => {
                            const allowedDays = getAvailableWeekDays(startDate, endDate);
                            const isEnabled = allowedDays.includes(day);
                            const isSelected = visitDays.includes(day);

                            return (
                              <button
                                key={day}
                                type="button"
                                disabled={!isEnabled}
                                className={`${styles.chip} ${
                                  isSelected ? styles.chipActive : ""
                                }`}
                                onClick={() => {
                                  if (!isEnabled) return;

                                  setVisitDays((prev) =>
                                    prev.includes(day)
                                      ? prev.filter((d) => d !== day)
                                      : [...prev, day]
                                  );
                                }}
                              >
                                {day.slice(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {availability && (
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Time Shift</label>
                      <select
                        value={timeShift}
                        disabled={!hasAnyShift}
                        onChange={(e) => setTimeShift(e.target.value as any)}
                      >
                        {!hasAnyShift && (
                          <option value="">
                            No shifts available for selected dates
                          </option>
                        )}
                        {availability.availability.MORNING && (
                          <option value="MORNING">Morning</option>
                        )}
                        {availability.availability.NIGHT && (
                          <option value="NIGHT">Night</option>
                        )}
                        {availability.availability.FULLDAY && (
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
