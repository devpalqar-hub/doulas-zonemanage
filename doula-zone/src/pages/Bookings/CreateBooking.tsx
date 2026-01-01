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

type ServiceType = "POSTPARTUM" | "BIRTH";

type DoulaItem = {
  userId: string;     
  profileId: string;  
  name: string;
};

type ServicePricing = {
  servicePricingId: string;
  serviceName: string;
  priceLabel: string;
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
  timeShift?: string;
  visitDates: string[];
  serviceName: string;
};

/* ================= COMPONENT ================= */

const CreateBooking = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  /* ================= STATE ================= */

  const [serviceType, setServiceType] = useState<ServiceType | "">("");

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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [visitFrequency, setVisitFrequency] = useState(1);
  const [timeShift, setTimeShift] =
    useState<"MORNING" | "NIGHT" | "FULLDAY">("MORNING");

  const [availability, setAvailability] =
    useState<AvailabilityResponse | null>(null);

  const [pricing, setPricing] = useState<PricingResponse | null>(null);


  const buffer = 0;


  useEffect(() => {
      if (serviceType === "BIRTH") {
        setTimeShift("FULLDAY")
      }
  })
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
    }, [serviceType]);


  /* ================= LOAD SERVICES ================= */

  const loadServices = async (userId: string) => {
    try {
      setServices([]);
      setServicePricingId("");

      const res = await api.get(`/doula/${userId}`);
      const raw = res.data.data.serviceNames || [];

      const normalized: ServicePricing[] = raw.map((s: any) => ({
        servicePricingId: s.servicePricingId,
        serviceName: s.serviceName,
        // priceLabel:
        //   typeof s.price === "object"
        //     ? `M ₹${s.price.morning} | N ₹${s.price.night} | F ₹${s.price.fullday}`
        //     : `₹${s.price}`,
      }));

      setServices(normalized);
    } catch {
      showToast("Failed to load services", "error");
    }
  };

  /* ================= AVAILABILITY ================= */

  const checkAvailability = async () => {
    if (!selectedDoula || !startDate || !endDate) {
      showToast("Select doula and dates first", "error");
      return;
    }

    if (!serviceType) {
      showToast("Select service type first", "error");
      return;
    }

    try {
      const res = await api.get(
        `/doula/${selectedDoula.profileId}/available-shifts`,
        {
          params: {
            startDate,
            endDate,
            visitFrequency:
              serviceType === "POSTPARTUM" ? visitFrequency || 1 : 1,
          },
        }
      );

      setAvailability(res.data.data);
    } catch {
      showToast("Failed to check availability", "error");
    }
  };

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
      serviceType === "POSTPARTUM" ? timeShift : "FULLDAY",
    ...(serviceType === "POSTPARTUM" && {
      visitFrequency: visitFrequency || 1,
    }),
  };

  try {
    const res = await calculatePricing(payload);

    if (!res.available) {
      showToast("Doula not available for selected dates", "error");
      setPricing(null);
      return;
    }

    setPricing(res);
    showToast("Price calculated successfully", "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to calculate price", "error");
  }
};






  /* ================= SUBMIT ================= */

const handleSubmit = async () => {
  if (!pricing || !selectedDoula) return;

  const payload = {
    name: client.name,
    email: client.email,
    phone: client.phone,
    address: client.address,

    doulaProfileId: selectedDoula.profileId,
    serviceId: servicePricingId,

    seviceStartDate: new Date(startDate).toISOString(),
    serviceEndDate: new Date(endDate).toISOString(),
    buffer,

    serviceTimeShift:
      serviceType === "POSTPARTUM" ? timeShift : "FULLDAY",

    ...(serviceType === "POSTPARTUM" && {
      visitFrequency,
    }),
  };

  try {
    await createZoneBooking(payload);
    showToast("Booking created & confirmed", "success");
    navigate("/bookings");
  } catch (err) {
    console.error(err);
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
          <FaArrowLeft />   Back to List
          </button>
          <div className={styles.formCard}>
            <h3>Create Booking</h3>

            {/* SERVICE TYPE */}
            <select value={serviceType} onChange={(e) =>
              setServiceType(e.target.value as ServiceType)
            }>
              <option value="">Service Type</option>
              <option value="POSTPARTUM">Postpartum Doula</option>
              <option value="BIRTH">Birth Doula</option>
            </select>

            {/* CLIENT */}
            <input placeholder="Client Name"
              onChange={(e)=>setClient({...client,name:e.target.value})}/>
            <input placeholder="Email"
              onChange={(e)=>setClient({...client,email:e.target.value})}/>
            <input placeholder="Phone"
              onChange={(e)=>setClient({...client,phone:e.target.value})}/>
            <input placeholder="Address"
              onChange={(e)=>setClient({...client,address:e.target.value})}/>

            {/* DOULA */}
            <select
              value={selectedDoula?.userId || ""}
              onChange={(e) => {
                const doula = doulas.find(
                  d => d.userId === e.target.value
                );
                if (!doula) return;

                setSelectedDoula(doula);
                loadServices(doula.userId);
              }}
            >
              <option value="">Select Doula</option>
              {doulas.map(d => (
                <option key={d.userId} value={d.userId}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* SERVICE */}
            <select
              value={servicePricingId}
              onChange={(e)=>setServicePricingId(e.target.value)}
              disabled={!services.length}
            >
              <option value="">Select Service</option>
              {services.map(s => (
                <option key={s.servicePricingId} value={s.servicePricingId}>
                  {s.serviceName} 
                </option>
              ))}
            </select>

            {/* DATES */}
            <input type="date" onChange={(e)=>setStartDate(e.target.value)} />
            <input type="date" onChange={(e)=>setEndDate(e.target.value)} />

            {/* POSTPARTUM OPTIONS */}
            {serviceType === "POSTPARTUM" && (
              <>
                <input type="number" min={1}
                  value={visitFrequency}
                  onChange={(e)=>setVisitFrequency(+e.target.value)} />
                <select value={timeShift}
                  onChange={(e)=>setTimeShift(e.target.value as any)}>
                  <option value="MORNING">Morning</option>
                  <option value="NIGHT">Night</option>
                  <option value="FULLDAY">Full Day</option>
                </select>
              </>
            )}

            <button onClick={checkAvailability}>Check Availability</button>
            {availability && (
              <div className={styles.availabilityBox}>
                <p><strong>Visit Dates</strong></p>

                <div className={styles.dates}>
                  {availability.visitDates.map(date => (
                    <span key={date}>{date}</span>
                  ))}
                </div>

                <p><strong>Shift Availability</strong></p>

                <div className={styles.shifts}>
                  <span className={availability.availability.morning ? styles.ok : styles.no}>
                    Morning
                  </span>
                  <span className={availability.availability.night ? styles.ok : styles.no}>
                    Night
                  </span>
                  <span className={availability.availability.fullday ? styles.ok : styles.no}>
                    Full Day
                  </span>
                </div>
              </div>
            )}

            <button onClick={handleCalculatePrice}>Calculate Price</button>
            {pricing && (
              <div className={styles.priceBox}>
                <h4>Price Summary</h4>

                <div className={styles.priceRow}>
                  <span>Service: </span>
                  <span>{pricing.serviceName}</span>
                </div>

                <div className={styles.priceRow}>
                  <span>Visits: </span>
                  <span>{pricing.numberOfVisits}</span>
                </div>

                <div className={styles.priceRow}>
                  <span>Price / Visit: </span>
                  <span>${pricing.pricePerVisit}</span>
                </div>

                <div className={styles.totalRow}>
                  <span>Total Amount: </span>
                  <span>${pricing.totalAmount}</span>
                </div>
              </div>
            )}

            <button className={styles.primary}
              disabled={!pricing}
              onClick={handleSubmit}>
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;
