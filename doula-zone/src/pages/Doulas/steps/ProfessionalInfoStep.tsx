import { useEffect, useRef, useState } from "react";
import styles from "../CreateDoula/CreateDoula.module.css";
import { fetchRegionById, type Region } from "../../../services/region.service";

export type ProfessionalInfoData = {
  description: string;
  achievements: string;
  qualification: string;
  yoe: number | null;
  languages: string[];  
  regionId: string;    
};

type Props = {
  data: ProfessionalInfoData;
  setFormData: (updater: (prev: any) => any) => void;
  onNext: () => void;
  onPrev: () => void;
};

const AVAILABLE_LANGUAGES = ["English", "Hindi", "Malayalam"];

const ProfessionalInfoStep = ({ data, setFormData, onNext, onPrev }: Props) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [loadingRegion, setLoadingRegion] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasSyncedRegion = useRef(false);
 // load region from regionId in formData OR localStorage
  useEffect(() => {
    if (hasSyncedRegion.current) 
        return;

    const regionIdFromState = data.regionId;
    const regionIdFromStorage = localStorage.getItem("regionId") || "";

    const idToUse = regionIdFromState || regionIdFromStorage;
    if (!idToUse) return;

    hasSyncedRegion.current = true;

    setFormData(prev => ({ ...prev, regionId: idToUse }));

    const loadRegion = async () => {
      try {
        setLoadingRegion(true);
        const reg = await fetchRegionById(idToUse);
        setRegion(reg);
      } catch (e) {
        console.error("Failed to load region", e);
      } finally {
        setLoadingRegion(false);
      }
    };

    loadRegion();
  }, []);

  const updateField = (field: keyof ProfessionalInfoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleLanguage = (lang: string) => {
    const selected = data.languages || []
    const updated = selected.includes(lang)
      ? selected.filter(l => l !== lang)
      : [...selected, lang];

    updateField("languages", updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!data.qualification?.trim()) {
      newErrors.qualifications = "Qualifications are required";
    }
    if (data.yoe === null || (data.yoe) < 0) {
      newErrors.yoe = "Years of experience is required";
    }

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
            placeholder="Describe your experience and approach to doula care..."
            value={data.description}
            onChange={e => updateField("description", e.target.value)}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>

        {/* Achievements */}
        <div className={styles.fieldGroupFull}>
          <label>Achievements</label>
          <textarea
            className={styles.textarea}
            placeholder="List your achievements, certifications, awards..."
            value={data.achievements}
            onChange={e => updateField("achievements", e.target.value)}
          />
        </div>

        {/* Qualifications */}
        <div className={styles.fieldGroupFull}>
          <label>
            Qualifications <span className={styles.req}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="List your qualifications and certifications..."
            value={data.qualification}
            onChange={e => updateField("qualification", e.target.value)}
          />
          {errors.qualifications && (
            <p className={styles.errorText}>{errors.qualifications}</p>
          )}
        </div>

        {/* Years of Experience + Region */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label>
              Years of Experience <span className={styles.req}>*</span>
            </label>
            <input
              type="number"
              min={0}
              className={styles.input}
              placeholder="0"
              value={data.yoe ?? ""}
              onChange={e =>
                updateField(
                  "yoe",
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
            {errors.yoe && (
              <p className={styles.errorText}>{errors.yoe}</p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label>Region</label>
            <input
              className={styles.input}
              value={
                loadingRegion
                  ? "Loading..."
                  : region?.regionName || "Not assigned"
              }
              disabled
            />
          </div>
        </div>

        {/* Languages */}
        <div className={styles.fieldGroupFull}>
          <label>Languages Spoken</label>
          <div className={styles.langChips}>
            {AVAILABLE_LANGUAGES.map(lang => {
              const selected = data.languages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  className={
                    selected
                      ? `${styles.langChip} ${styles.langChipActive}`
                      : styles.langChip
                  }
                  onClick={() => toggleLanguage(lang)}
                >
                {lang}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
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

export default ProfessionalInfoStep;
