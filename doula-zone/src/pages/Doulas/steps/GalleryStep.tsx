import { FiUpload, FiX } from "react-icons/fi";
import type { DoulaFormData } from "../CreateDoula/CreateDoula";
import styles from "../CreateDoula/CreateDoula.module.css";
import { useToast } from "../../../shared/ToastContext";
import { useState } from "react";
import AvatarCropper from "../../../components/AvatarCropper";

type Props = {
  data: DoulaFormData;
  onChange: (data: DoulaFormData) => void;
};

const MAX_IMAGES = 6;
const MAX_SIZE_MB = 2;

const GalleryStep = ({ data, onChange }: Props) => {
  const { showToast } = useToast();

  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentCrop, setCurrentCrop] = useState<string | null>(null);

  const revoke = (url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  };

  /* ---------------- FILE SELECT ---------------- */
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const incoming = Array.from(files);

    const remainingSlots =
      MAX_IMAGES - (data.galleryImages.length + cropQueue.length);

    if (remainingSlots <= 0) {
      showToast("Maximum 6 images allowed", "error");
      return;
    }

    const validFiles = incoming
      .slice(0, remainingSlots)
      .filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);

    if (incoming.length > remainingSlots) {
      showToast("Only 6 images allowed", "error");
    }

    if (validFiles.length !== incoming.length) {
      showToast("Some images exceeded 2MB and were skipped");
    }

    setCropQueue((prev) => {
      const updated = [...prev, ...validFiles];

      if (!currentCrop && updated.length > 0) {
        setCurrentCrop(URL.createObjectURL(updated[0]));
      }

      return updated;
    });
  };

  /* ---------------- CROP COMPLETE ---------------- */
  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], `gallery_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    const preview = URL.createObjectURL(file);

    onChange({
      ...data,
      galleryImages: [...data.galleryImages, file],
      galleryPreviews: [...data.galleryPreviews, preview],
    });

    revoke(currentCrop);

    const remaining = cropQueue.slice(1);
    setCropQueue(remaining);

    if (remaining.length > 0) {
      setCurrentCrop(URL.createObjectURL(remaining[0]));
    } else {
      setCurrentCrop(null);
    }
  };

  /* ---------------- REMOVE IMAGE ---------------- */
  const removeImage = (index: number) => {
    const imgs = [...data.galleryImages];
    const previews = [...data.galleryPreviews];

    URL.revokeObjectURL(previews[index]);

    imgs.splice(index, 1);
    previews.splice(index, 1);

    onChange({
      ...data,
      galleryImages: imgs,
      galleryPreviews: previews,
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <div className={styles.stepCard}>
      <h3 className={styles.sectionTitle}>Gallery</h3>

      <div
        className={styles.uploadBox}
        onClick={() => document.getElementById("gallery-upload")?.click()}
      >
        <FiUpload size={40} />
        <p>Upload gallery images</p>
        <span>JPG / PNG • Max 6 • Max 2MB</span>
      </div>

      <input
        id="gallery-upload"
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {data.galleryPreviews.length > 0 && (
        <div className={styles.galleryGrid}>
          {data.galleryPreviews.map((src, idx) => (
            <div key={idx} className={styles.galleryItem}>
              <img src={src} alt={`Gallery ${idx}`} />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeImage(idx)}
              >
                <FiX size={22} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* -------- CROP MODAL -------- */}
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
                revoke(currentCrop);
                setCropQueue([]);
                setCurrentCrop(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryStep;
