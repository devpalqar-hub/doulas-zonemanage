import { useEffect, useState } from "react";
import styles from "../CreateDoula/CreateDoula.module.css";
import { fetchServices } from "../../../services/doula.service";

type Service = {
  id: string;
  name: string;
  description?: string;
};

type Props = {
  data: {
    services: Array<{ serviceId: string; 
      serviceName: string;
      price: string }>;
  };
  setFormData: (fn: (prev: any) => any) => void;
  onNext: () => void;
  onPrev: () => void;
};

const PricingServicesStep = ({ data, setFormData, onNext, onPrev }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchServices();
        setServices(res);
      } catch (e) {
        console.error("Failed to load services", e);
      }
    };
    load();
  }, []);

  const toggleService = (service: Service) => {
    const selected = data.services || [];
    const exists = selected.find((s) => s.serviceId === service.id);

    const updated = exists
      ? selected.filter((s) => s.serviceId !== service.id)
      : [...selected, { serviceId: service.id,
        serviceName: service.name,
        price: "" }];

    setFormData((prev) => ({
      ...prev,
      services: updated,
    }));
  };

  const updatePrice = (serviceId: string, price: string) => {
    const updated = data.services.map((s) =>
      s.serviceId === serviceId ? { ...s, price } : s
    );

    setFormData((prev) => ({ ...prev, services: updated }));
  };

  const validate = () => {
    if (data.services.length === 0) {
      setErrors("Select at least one service");
      return false;
    }

    for (const s of data.services) {
      if (!s.price || Number(s.price) <= 0) {
        setErrors("Enter valid pricing for all selected services");
        return false;
      }
    }

    setErrors("");
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  return (
    <div className={styles.stepCard}>
      <h3 className={styles.sectionTitle}>Services & Pricing</h3>

      {/* Select Services */}
      <label className={styles.label}>
        Select Services <span className={styles.req}>*</span>
      </label>

      <div className={styles.servicesGrid}>
        {services.map((service) => {
          const selected = data.services.some((s) => s.serviceId === service.id);
          return (
            <button
              key={service.id}
              type="button"
              className={
                selected
                  ? `${styles.serviceCard} ${styles.serviceCardActive}`
                  : styles.serviceCard
              }
              onClick={() => toggleService(service)}
            >
              {service.name}
            </button>
          );
        })}

        {services.length === 0 && (
          <p className={styles.subtleText}>No services available</p>
        )}
      </div>

      {/* Pricing Section */}
      {data.services.length > 0 && (
        <>
          <label className={styles.label}>
            Pricing per Service <span className={styles.req}>*</span>
          </label>

          <div className={styles.pricingList}>
            {data.services.map((s) => {
              const service = services.find((srv) => srv.id === s.serviceId);
              return (
                <div key={s.serviceId} className={styles.pricingRow}>
                  <span className={styles.pricingServiceName}>
                    {service?.name}
                  </span>
                  <div className={styles.pricingInputWrapper}>
                    <span className={styles.currency}>₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      min={0}
                      className={styles.pricingInput}
                      placeholder="0"
                      value={s.price}
                      onChange={(e) =>
                        updatePrice(s.serviceId, e.target.value)
                      }
                    />
                    <span className={styles.unit}>/ hour</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {errors && <p className={styles.errorText}>{errors}</p>}

      {/* Footer */}
      <div className={styles.stepFooter}>
        <button type="button" className={styles.secondaryBtn} onClick={onPrev}>
          Previous
        </button>
        <button type="button" className={styles.primaryBtn} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PricingServicesStep;
