import { useState } from "react";
import Sidebar from "../../Dashboard/components/sidebar/Sidebar";
import Topbar from "../../Dashboard/components/topbar/Topbar";
import StepProgress from "../components/StepProgress";
import StepPersonalInfo from "../steps/StepPersonalInfo";
import ProfessionalInfoStep from "../steps/ProfessionalInfoStep";
import styles from "./CreateDoula.module.css";
import { FaArrowLeft } from "react-icons/fa6";
import PricingServicesStep from "../steps/PricingServicesStep";
import GalleryStep from "../steps/GalleryStep";
import ReviewSubmitStep from "../steps/ReviewSubmitStep";

export type Certificate = {
  name: string;
  issuedBy: string;
  year: string;
};

export type DoulaFormData = {
  fullName: string;
  email: string;
  phone: string;

  profileImageFile: File | null;
  profileImagePreview: string | null;

  description: string;
  qualification: string;
  yoe: number | null;

  languages: string[];
  regionId: string;

  specialities: string[];
  certificates: Certificate[];

  services?: Array<{ serviceId: string; price: string; serviceName?: string }>;
  availabilitySlots?: any[];

  galleryImages: File[];
  galleryPreviews: string[];
};


const initialFormData: DoulaFormData = {
  fullName: "",
  email: "",
  phone: "",

  profileImageFile: null,
  profileImagePreview: null,

  description: "",
  qualification: "",
  yoe: null,

  languages: [],
  regionId: "",

  specialities: [],
  certificates: [],

  services: [],
  availabilitySlots: [],

  galleryImages: [],
  galleryPreviews: [],
};


const steps = [
  "Personal Information",
  "Professional Information",
  "Services",
  "Gallery",
  "Review & Submit",
];

const CreateDoula = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DoulaFormData>(initialFormData);

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const goPrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
          {/* Back link */}
          <button
            type="button"
            className={styles.backLink}
            onClick={() => window.history.back()}
          >
          <FaArrowLeft />   Back to List
          </button>

          <h2 className={styles.title}>Create New Doula</h2>
          <p className={styles.subtitle}>
            Add a new doula to your zone
          </p>

          {/* Step progress bar */}
          <StepProgress currentStep={currentStep} steps={steps} />
          {/* Card */}
          <div className={styles.card}>     
            {/* Step content */}
            <div className={styles.stepBody}>
              {currentStep === 1 && (
                <StepPersonalInfo
                  data={formData}
                  onChange={setFormData}
                  onNext={goNext}
                />
              )}

              {currentStep === 2 && (
                <ProfessionalInfoStep
                  data={{
                    description: formData.description,
                    qualification: formData.qualification,
                    yoe: formData.yoe,
                    languages: formData.languages,
                    regionId: formData.regionId,
                    specialities: formData.specialities,
                    certificates: formData.certificates,
                  }}
                  setFormData={(updater) =>
                    setFormData((prev) => {
                      const updated = updater(prev);

                      return {
                        ...prev,
                        description: updated.description,
                        qualification: updated.qualification,
                        yoe: updated.yoe,
                        languages: updated.languages,
                        regionId: updated.regionId,
                        specialities: updated.specialities,
                        certificates: updated.certificates,
                      };
                    })
                  }
                  onNext={goNext}
                  onPrev={goPrev}
                />
              )}



              {currentStep === 3 && (
                <PricingServicesStep
                  data={{ services: formData.services ?? [] }}
                  setFormData={(updater) =>
                    setFormData((prev) => {
                      const updated = updater(prev);
                      return { ...prev, services: updated.services };
                    })
                  }
                  onNext={goNext}
                  onPrev={goPrev}
                />
              )}


              {currentStep === 4 && (
                <div className={styles.placeholderStep}>
                  <GalleryStep
                    data={formData}
                    onChange={setFormData}
                  />
                  <div className={styles.stepNavRow}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={goPrev}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={goNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className={styles.placeholderStep}>
                  <ReviewSubmitStep 
                  data={formData}
                  onPrev={goPrev}/>
                  {/* <div className={styles.stepNavRow}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={goPrev}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                    >
                      Submit (later)
                    </button>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDoula;
