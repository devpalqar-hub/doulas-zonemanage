import { useState } from "react";
import type { FormEvent } from "react";
import type { DoulaFormData } from "../CreateDoula/CreateDoula";
import styles from "../CreateDoula/CreateDoula.module.css";
import { FiUpload } from "react-icons/fi";

interface Props {
  data: DoulaFormData;
  onChange: (data: DoulaFormData) => void;
  onNext: () => void;
}

const StepPersonalInfo = ({ data, onChange, onNext }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: keyof DoulaFormData,
    value: string | File | null
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    onChange({
      ...data,
      profileImageFile: file,
      profileImagePreview: preview,
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (!/^\+91\d{10}$/.test(data.phone)) {
      newErrors.phone = "Phone number must be valid.";
    }

    if (!data.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className={styles.sectionTitle}>Personal Information</h3>

      <div className={styles.formGrid}>
        <div className={styles.fieldGroup}>
          <label>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            value={data.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={errors.fullName ? styles.inputError : undefined}
          />
          {errors.fullName && (
            <p className={styles.errorText}>{errors.fullName}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            value={data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? styles.inputError : undefined}
          />
          {errors.email && (
            <p className={styles.errorText}>{errors.email}</p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label>
            Phone Number <span className={styles.required}>*</span>
          </label>

          <div className={styles.phoneInputWrapper}>
            <span className={styles.phonePrefix}>+91</span>

            <input
              type="tel"
              placeholder="9876543243"
              value={data.phone.startsWith("+91") ? data.phone.slice(3) : data.phone}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleInputChange("phone", `+91${digitsOnly}`);
              }}
              className={errors.phone ? styles.inputError : undefined}
            />

          </div>

          {errors.phone && (
            <p className={styles.errorText}>{errors.phone}</p>
          )}
        </div>


        <div className={styles.fieldGroup}>
          <label>
            Password <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={data.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? styles.inputError : undefined}
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}
        </div>
      </div>

      {/* Profile picture upload */}
      <div className={styles.fieldGroup}>
        <label>Profile Picture</label>
        <div
          className={styles.uploadBox}
          onClick={() => {
            const el = document.getElementById(
              "doula-profile-upload"
            ) as HTMLInputElement | null;
            el?.click();
          }}
        >
          {data.profileImagePreview ? (
            <div className={styles.uploadPreviewWrapper}>
              <img
                src={data.profileImagePreview}
                alt="Profile preview"
                className={styles.uploadPreviewImg}
              />
              <span className={styles.uploadChangeText}>Change image</span>
            </div>
          ) : (
            <div className={styles.uploadPlaceholder}>
              <FiUpload size={50} className={styles.uploadIcon}/>
              <p>Click to upload or drag and drop</p>
              <span>PNG, JPG up to 5MB</span>
            </div>
          )}
        </div>
        <input
          id="doula-profile-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
        />
      </div>

      {/* Actions */}
      <div className={styles.stepNavRow}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button type="submit" className={styles.primaryBtn}>
          Next
        </button>
      </div>
    </form>
  );
};

export default StepPersonalInfo;
