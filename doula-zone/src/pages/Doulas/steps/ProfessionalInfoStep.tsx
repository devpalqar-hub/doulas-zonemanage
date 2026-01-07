import { useEffect, useRef, useState } from "react";
import styles from "../CreateDoula/CreateDoula.module.css";
import { type Region, fetchAllRegions } from "../../../services/region.service";

export type Certificate = {
  name: string;
  issuedBy: string;
  year: string;
};

export type ProfessionalInfoData = {
  description: string;
  qualification: string;
  yoe: number | null;
  languages: string[];
  regionId: string;
  specialities: string[];
  certificates: Certificate[];
};

type Props = {
  data: ProfessionalInfoData;
  setFormData: (updater: (prev: any) => any) => void;
  onNext: () => void;
  onPrev: () => void;
};

const AVAILABLE_LANGUAGES = ["English", "Hindi", "Malayalam"];

const ProfessionalInfoStep = ({ data, setFormData, onNext, onPrev }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const hasSyncedRegion = useRef(false);

  const [specialityInput, setSpecialityInput] = useState("");

  useEffect(() => {
    if (hasSyncedRegion.current) return;

    const storedRegionId = localStorage.getItem("regionId") || "";
    const idToUse = data.regionId || storedRegionId;

    if (!idToUse) return;

    hasSyncedRegion.current = true;
    setFormData(prev => ({ ...prev, regionId: idToUse }));
  }, []);

  // Load regions
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingRegions(true);
        const list = await fetchAllRegions();
        setRegions(list);
      } catch (err) {
        console.error("Failed to load regions", err);
      } finally {
        setLoadingRegions(false);
      }
    };

    loadRegions();
  }, []);

  /* ================= HELPERS ================= */

  const updateField = (field: keyof ProfessionalInfoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /* ===== LANGUAGES ===== */

  const toggleLanguage = (lang: string) => {
    const current = data.languages || [];
    const updated = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];

    updateField("languages", updated);
  };

  /* ===== SPECIALITIES (DYNAMIC) ===== */

  const addSpeciality = () => {
    const value = specialityInput.trim();
    if (!value) return;

    if (!data.specialities.includes(value)) {
      updateField("specialities", [...data.specialities, value]);
    }

    setSpecialityInput("");
  };

  const removeSpeciality = (spec: string) => {
    updateField(
      "specialities",
      data.specialities.filter(s => s !== spec)
    );
  };

  /* ===== CERTIFICATES ===== */

  const addCertificate = () => {
    updateField("certificates", [
      ...(data.certificates || []),
      { name: "", issuedBy: "", year: "" },
    ]);
  };

  const updateCertificate = (
    index: number,
    field: keyof Certificate,
    value: string
  ) => {
    const updated = [...data.certificates];
    updated[index] = { ...updated[index], [field]: value };
    updateField("certificates", updated);
  };

  const removeCertificate = (index: number) => {
    updateField(
      "certificates",
      data.certificates.filter((_, i) => i !== index)
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.description.trim()) newErrors.description = "Description is required";
    if (!data.qualification.trim()) newErrors.qualification = "Qualifications are required";
    if (data.yoe === null || data.yoe < 0) newErrors.yoe = "Years of experience is required";
    if (!data.regionId) newErrors.regionId = "Region is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    onNext();
  };

  return (
    <div className={styles.stepCard}>
      <h3 className={styles.sectionTitle}>Professional Information</h3>

      <div className={styles.formGrid}>
        {/* Description */}
        <div className={styles.fieldGroupFull}>
          <label>
            About / Description <span className={styles.req}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={data.description}
            onChange={e => updateField("description", e.target.value)}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>

        {/* Qualifications */}
        <div className={styles.fieldGroupFull}>
          <label>
            Qualifications <span className={styles.req}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={data.qualification}
            onChange={e => updateField("qualification", e.target.value)}
          />
          {errors.qualification && (
            <p className={styles.errorText}>{errors.qualification}</p>
          )}
        </div>

        {/* Experience + Region */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label>
              Years of Experience <span className={styles.req}>*</span>
            </label>
            <input
              type="number"
              min={0}
              className={styles.input}
              value={data.yoe ?? ""}
              onChange={e =>
                updateField(
                  "yoe",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
            {errors.yoe && <p className={styles.errorText}>{errors.yoe}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label>
              Region <span className={styles.req}>*</span>
            </label>
            <select
              className={styles.input}
              value={data.regionId}
              disabled={loadingRegions}
              onChange={e => updateField("regionId", e.target.value)}
            >
              <option value="" disabled>
                {loadingRegions ? "Loading regions..." : "Select a region"}
              </option>
              {regions.map(r => (
                <option key={r.id} value={r.id}>
                  {r.regionName}
                </option>
              ))}
            </select>
            {errors.regionId && (
              <p className={styles.errorText}>{errors.regionId}</p>
            )}
          </div>
        </div>

        {/* Specialities */}
        <div className={styles.fieldGroupFull}>
          <label>Specialities</label>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              className={styles.input}
              placeholder="Enter speciality"
              value={specialityInput}
              onChange={e => setSpecialityInput(e.target.value)}
            />
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={addSpeciality}
            >
              Add
            </button>
          </div>

          <div className={styles.langChips}>
            {data.specialities.map(spec => (
              <button
                key={spec}
                type="button"
                className={`${styles.langChip} ${styles.langChipActive}`}
                onClick={() => removeSpeciality(spec)}
              >
                {spec} ✕
              </button>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className={styles.fieldGroupFull}>
          <label>Certificates</label>

          <div className={styles.certificatesList}>
            {data.certificates.map((cert, idx) => (
              <div key={idx} className={styles.certificateRow}>
                <input
                  className={styles.input}
                  placeholder="Certificate Name"
                  value={cert.name}
                  onChange={e =>
                    updateCertificate(idx, "name", e.target.value)
                  }
                />
                <input
                  className={styles.input}
                  placeholder="Issued By"
                  value={cert.issuedBy}
                  onChange={e =>
                    updateCertificate(idx, "issuedBy", e.target.value)
                  }
                />
                <input
                  className={styles.input}
                  placeholder="Year"
                  value={cert.year}
                  onChange={e =>
                    updateCertificate(idx, "year", e.target.value)
                  }
                />
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => removeCertificate(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.addCertificateBtn}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={addCertificate}
            >
              + Add Certificate
            </button>
          </div>
        </div>

        {/* Languages */}
        <div className={styles.fieldGroupFull}>
          <label>Languages Spoken</label>
          <div className={styles.langChips}>
            {AVAILABLE_LANGUAGES.map(lang => (
              <button
                key={lang}
                type="button"
                className={
                  data.languages.includes(lang)
                    ? `${styles.langChip} ${styles.langChipActive}`
                    : styles.langChip
                }
                onClick={() => toggleLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.stepFooter}>
        <button className={styles.secondaryBtn} onClick={onPrev}>
          Previous
        </button>
        <button className={styles.primaryBtn} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;
