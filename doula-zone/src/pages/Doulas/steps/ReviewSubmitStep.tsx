import styles from "../CreateDoula/CreateDoula.module.css";
import { FaCheckCircle } from "react-icons/fa";
import { createDoula } from "../../../services/doula.service";
import { useToast } from "../../../shared/ToastContext";

type Props = {
  data: any;
  onPrev: () => void;
};

const ReviewSubmitStep = ({ data, onPrev }: Props) => {
  const { showToast } = useToast();

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      // BASIC USER INFO
      form.append("name", data.fullName);
      form.append("email", data.email);
      form.append("phone", data.phone);
      form.append("password", data.password);

      // PROFILE IMAGE IF UPLOADED
      if (data.profileImageFile) {
        form.append("profileImage", data.profileImageFile);
      }

      // PROFESSIONAL INFO
      form.append("description", data.description);
      form.append("qualification", data.qualification);
      form.append("achievements", data.achievements || "");
      form.append("yoe", String(data.yoe || 0));
      form.append("languages", JSON.stringify(data.languages)); // array of strings

      // REGION
      form.append("regionId", data.regionId);

      // SERVICES (array of { serviceId, price })
      form.append("services", JSON.stringify(data.services || []));

      // CREATE DOULA
      const res = await createDoula(form);
      console.log("Created",res);

      showToast("Doula created successfully!", "success");

      // REDIRECT
      window.location.href = "/doulas";
    } catch (err) {
      console.error("DOULA CREATE ERROR:", err);
      showToast("Failed to create doula", "error");
    }
  };

  return (
    <div className={styles.stepCard}>
      <h3 className={styles.sectionTitle}>Review & Submit</h3>

      {/* PERSONAL INFO */}
      <div className={styles.reviewCard}>
        <h4>Personal Information</h4>

        {data.profileImagePreview && (
          <img
            src={data.profileImagePreview}
            className={styles.reviewProfileImg}
          />
        )}

        <p><strong>Name:</strong> {data.fullName}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
      </div>

      {/* PROFESSIONAL INFO */}
      <div className={styles.reviewCard}>
        <h4>Professional Information</h4>

        <p><strong>Description:</strong> {data.description}</p>
        <p><strong>Qualification:</strong> {data.qualification}</p>
        <p><strong>Achievements:</strong> {data.achievements || "—"}</p>
        <p><strong>Years of Experience:</strong> {data.yoe || "0"}</p>

        <p><strong>Languages:</strong>
          {data.languages.length > 0
            ? " " + data.languages.join(", ")
            : " None"}
        </p>
      </div>

      {/* SERVICES */}
      <div className={styles.reviewCard}>
        <h4>Services & Pricing</h4>

        {data.services?.length > 0 ? (
          data.services.map((srv: any, i: number) => (
            <div key={i} className={styles.reviewServiceRow}>
              <span>{srv.serviceName}</span>
              <span className={styles.reviewServicePrice}>₹{srv.price}</span>
            </div>
          ))
        ) : (
          <p>No services added.</p>
        )}
      </div>

      {/* SUBMIT FOOTER */}
      <div className={styles.stepFooter}>
        <button type="button" className={styles.secondaryBtn} onClick={onPrev}>
          Previous
        </button>

        <button type="button" className={styles.primaryBtn} onClick={handleSubmit}>
          <FaCheckCircle style={{ marginRight: 6 }} />
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
