import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../Dashboard/components/sidebar/Sidebar";
import Topbar from "../Dashboard/components/topbar/Topbar";
import styles from "./EditDoula.module.css";

import {
  fetchDoulaProfile,
  updateDoulaProfile,
  uploadDoulaGalleryImages,
  deleteDoulaGalleryImage,
} from "../../services/doula.service";

import { useToast } from "../../shared/ToastContext";
import { FiTrash } from "react-icons/fi";

const EditDoula = () => {
  const { doulaId } = useParams<{ doulaId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [yoe, setYoe] = useState(0);
  const [description, setDescription] = useState("");
  const [qualification, setQualification] = useState("");
  const [achievements, setAchievements] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const [gallery, setGallery] = useState<
    { id: string; url: string }[]
  >([]);

  /* =====================
     LOAD PROFILE
  ===================== */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchDoulaProfile(doulaId!);

        setName(data.name);
        setYoe(data.yoe);
        setDescription(data.description);
        setQualification(data.qualification);
        setAchievements(data.achievements);
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

  /* =====================
     SAVE
  ===================== */
  const handleSave = async () => {
    try {
      await updateDoulaProfile(doulaId!, {
        name,
        is_active: isActive,
        description,
        achievements,
        qualification,
        yoe,
        specialities,
      });

      showToast("Doula updated successfully", "success");
      navigate("/doulas");
    } catch {
      showToast("Failed to update doula", "error");
    }
  };

  /* =====================
     GALLERY
  ===================== */
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !doulaId) return;

    try {
      await uploadDoulaGalleryImages(
        doulaId,
        Array.from(e.target.files)
      );

      const refreshed = await fetchDoulaProfile(doulaId);
      setGallery(refreshed.galleryImages);

      showToast("Images uploaded", "success");
      e.currentTarget.value = "";
    } catch {
      showToast("Failed to upload images", "error");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteDoulaGalleryImage(doulaId!, imageId);
      setGallery((prev) => prev.filter((g) => g.id !== imageId));
      showToast("Image deleted", "success");
    } catch {
      showToast("Failed to delete image", "error");
    }
  };

  if (loading) {
    return <div className={styles.state}>Loading…</div>;
  }

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />

        <div className={styles.pageContent}>
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
                  value={yoe}
                  onChange={(e) => setYoe(Number(e.target.value))}
                />
              </div>

              <div className={styles.full}>
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label>Qualification</label>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>

              <div>
                <label>Achievements</label>
                <input
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                />
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
              <input type="file" multiple onChange={handleUpload} />

              <div className={styles.galleryGrid}>
                {gallery.map((g) => (
                  <div key={g.id} className={styles.galleryItem}>
                    <img src={g.url} />
                    <button onClick={() => handleDeleteImage(g.id)}>
                      <FiTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
