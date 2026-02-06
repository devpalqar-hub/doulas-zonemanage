import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./EditDoula.module.css";
import AvatarCropper from "../../components/AvatarCropper";

type CertificateForm = {
  certificateId?: string;
  name: string;
  issuedBy: string;
  year: string;
};

import {
  fetchDoulaProfile,
  updateDoulaProfile,
  uploadDoulaGalleryImages,
  deleteDoulaGalleryImage,
  // deleteDoulaCertificate,
} from "../../services/doula.service";

import { useToast } from "../../shared/ToastContext";
import { FiTrash } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa6";

const EditDoula = () => {
  const { doulaId } = useParams<{ doulaId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentCrop, setCurrentCrop] = useState<string | null>(null);
  const [croppedFiles, setCroppedFiles] = useState<File[]>([]);


  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [yoe, setYoe] = useState<string>("0");
  const [description, setDescription] = useState("");
  const [qualification, setQualification] = useState("");
  const [certificates, setCertificates] = useState<CertificateForm[]>([]);
  // const [achievements, setAchievements] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const [fileInputKey, setFileInputKey] = useState(0);


  const [gallery, setGallery] = useState<
    { id: string; url: string }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDoulaProfile(doulaId!);

        setName(data.name);
        setUserId(data.userId);
        setYoe(String(data.experience ?? 0));
        setDescription(data.about);
        setQualification(data.qualification);
        setCertificates(
          (data.certificates ?? []).map((c: any) => ({
            certificateId: c.certificateId ?? c.id, 
            name: c.data?.name ?? c.name ?? "",
            issuedBy: c.data?.issuedBy ?? c.issuedBy ?? "",
            year: c.data?.year ?? c.year ?? "",
          }))
        );
        setSpecialities(data.specialities);
        setIsActive(data.isActive);
        setGallery(data.galleryImages);
      } catch {
        showToast("Failed to load doula profile", "error");
        navigate("/doulas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [doulaId, navigate, showToast]);

  const handleSave = async () => {
    const experienceValue = Number(yoe);
      if (Number.isNaN(experienceValue)) {
          showToast("Years of experience is invalid", "error");
          return;
        }
    try {
      await updateDoulaProfile(doulaId!, {
        name,
        is_active: isActive,
        about: description,
        qualification,
        experience: experienceValue,
        specialities,
        certificates: certificates.map((c) => ({
        certificateId: c.certificateId, 
        data: {
          name: c.name,
          issuedBy: c.issuedBy,
          year: c.year,
        },
      })),
      });

      showToast("Doula updated successfully", "success");
      navigate("/doulas");
    } catch {
      showToast("Failed to update doula", "error");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (!input.files) return;

    const files = Array.from(input.files);

    const validFiles = files.filter(
      (f) => f.size <= 2 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      showToast("Some images exceeded 2MB and were skipped", "error");
    }

    setCropQueue(validFiles);

    if (validFiles.length > 0) {
      setCurrentCrop(URL.createObjectURL(validFiles[0]));
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    const file = new File([blob], `gallery_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    setCroppedFiles(prev => [...prev, file]);

    URL.revokeObjectURL(currentCrop!);

    const remaining = cropQueue.slice(1);
    setCropQueue(remaining);

    if (remaining.length > 0) {
      setCurrentCrop(URL.createObjectURL(remaining[0]));
    } else {
      setCurrentCrop(null);

      if (!userId || !doulaId) return;

      try {
        await uploadDoulaGalleryImages(userId, [...croppedFiles, file]);
        showToast("Images uploaded", "success");

        const refreshed = await fetchDoulaProfile(doulaId);
        setGallery(refreshed.galleryImages);
      } catch {
        showToast("Failed to upload images", "error");
      } finally {
        setCroppedFiles([]);
        setFileInputKey(k => k + 1);
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if(!userId) return;
    try {
      await deleteDoulaGalleryImage(userId, imageId);
      setGallery((prev) => prev.filter((g) => g.id !== imageId));
      showToast("Image deleted", "success");
    } catch {
      showToast("Failed to delete image", "error");
    }
  };

  if (loading) {
    return <div className={styles.state}>Loading…</div>;
  }

//   const handleDeleteCertificate = async (idx: number) => {
//   const cert = certificates[idx];

//   if (cert.certificateId) {
//     try {
//       await deleteDoulaCertificate(cert.certificateId);
//       showToast("Certificate deleted", "success");
//     } catch {
//       showToast("Failed to delete certificate", "error");
//       return;
//     }
//   }

//   setCertificates((prev) => prev.filter((_, i) => i !== idx));
// };


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
          <div className={styles.card}>
            <h2>Edit Doula</h2>

            <div className={styles.formGrid}>
              <div>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label>Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={yoe}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setYoe("");
                      return;
                    }

                    if (/^\d+$/.test(value)) {
                      setYoe(value);
                    }
                  }}
                  onBlur={() => {
                    if (yoe === "") {
                      setYoe("0");
                    }
                  }}
                />

              </div>

              <div className={styles.full}>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.full}>
                <label>Qualification</label>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>

              {/* <div>
                <label>Achievements</label>
                <input
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                />
              </div> */}

              {/* Certificates */}
              <div className={styles.section}>
                <h4>Certificates</h4>

                {certificates.map((c, idx) => (
                  <div key={c.certificateId ?? idx} className={styles.certificateRow}>
                    <input
                      placeholder="Certificate Name"
                      value={c.name}
                      onChange={(e) => {
                        const copy = [...certificates];
                        copy[idx].name = e.target.value;
                        setCertificates(copy);
                      }}
                    />

                    <input
                      placeholder="Issued By"
                      value={c.issuedBy}
                      onChange={(e) => {
                        const copy = [...certificates];
                        copy[idx].issuedBy = e.target.value;
                        setCertificates(copy);
                      }}
                    />

                    <input
                      placeholder="Year"
                      value={c.year}
                      onChange={(e) => {
                        const copy = [...certificates];
                        copy[idx].year = e.target.value;
                        setCertificates(copy);
                      }}
                    />

                    {/* <button
                      type="button"
                      onClick={() => handleDeleteCertificate(idx)}
                    >
                      Remove
                    </button> */}
                  </div>
                ))}

                {/* <button
                  type="button"
                  className={styles.addCertificateBtn}
                  onClick={() =>
                    setCertificates([
                      ...certificates,
                      { name: "", issuedBy: "", year: "" },
                    ])
                  }
                >
                  + Add Certificate
                </button> */}
              </div>

              <div className={styles.full}>
                <label>Specialities (comma separated)</label>
                <input
                  value={specialities.join(", ")}
                  onChange={(e) =>
                    setSpecialities(
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                />
              </div>
            </div>

            {/* Gallery */}
            <div className={styles.gallery}>
              <h4>Gallery Images</h4>
              <div className={styles.uploadRow}>
                <label className={styles.uploadBtn}>
                  Choose Images
                  <input
                    type="file"
                    key={fileInputKey}
                    multiple
                    onChange={handleUpload}
                    hidden
                  />
                </label>

                <span className={styles.uploadHint}>
                  JPG / PNG • Max 2MB per image
                </span>
              </div>


              <div className={styles.galleryGrid}>
                {gallery.map((g) => (
                  <div key={g.id} className={styles.galleryItem}>
                    <img src={g.url} alt="" />
                    <button onClick={() => handleDeleteImage(g.id)}>
                      <FiTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {currentCrop && (
              <div className={styles.cropOverlay}>
                <div className={styles.cropModal}>
                  <h3>Crop Image</h3>

                  <AvatarCropper
                    image={currentCrop}
                    aspect={4 / 3}
                    shape="rect"
                    onCropComplete={handleCropComplete}
                  />

                  <button
                    className={styles.cancelCrop}
                    onClick={() => {
                      URL.revokeObjectURL(currentCrop);
                      setCropQueue([]);
                      setCurrentCrop(null);
                      setCroppedFiles([]);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button className={styles.secondary} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button className={styles.primary} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDoula;
