import { FiUpload, FiX } from "react-icons/fi";
import type { DoulaFormData } from "../CreateDoula/CreateDoula";
import styles from "../CreateDoula/CreateDoula.module.css";
import { useToast } from "../../../shared/ToastContext";

type Props = {
    data: DoulaFormData;
    onChange: (data: DoulaFormData) => void;
};

const GalleryStep = ({ data, onChange }: Props) => {
    const { showToast } = useToast();
    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const incomingFiles = Array.from(files);
  
        if (data.galleryImages.length + incomingFiles.length > 6) {
            showToast("Maximum 6 gallery images allowed","error");
            return;
        }

        const MAX_SIZE_MB = 2;

        const validFiles = incomingFiles.filter(
            (file) => file.size <= MAX_SIZE_MB * 1024 * 1024
        );

        if (validFiles.length !== incomingFiles.length) {
            showToast("Some images exceeded 2MB and were skipped");
        }

        const previews = validFiles.map((f) => URL.createObjectURL(f));

        onChange({
            ...data,
            galleryImages: [...data.galleryImages, ...validFiles],
            galleryPreviews: [...data.galleryPreviews, ...previews],
        });
        };


    const removeImage = (index: number) => {
        const imgs = [...data.galleryImages];
        const previews = [...data.galleryPreviews];

        imgs.splice(index, 1);
        previews.splice(index, 1);

        onChange({
            ...data,
            galleryImages: imgs,
            galleryPreviews: previews,
        });
    };

return (
    <div className={styles.stepCard}>
        <h3 className={styles.sectionTitle}>Gallery</h3>

        {/* UPLOAD BOX */}
        <div className={styles.uploadBox}
            onClick={() => 
                document.getElementById("gallery-upload")?.click()
            }
        >
            <FiUpload size={40} />
            <p>Upload gallery images</p>
            <span>JPG / PNG • Multiple allowed</span>
        </div>

        <input
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
        />

        {/* PREVIEW GRID */}
        {data.galleryPreviews.length > 0 && (
            <div className={styles.galleryGrid}>
                {data.galleryPreviews.map((src, idx) => (
                    <div key={idx} className={styles.galleryItem}>
                        <img src={src} alt={`Gallery ${idx}`}/>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeImage(idx)}    
                        >
                            <FiX size={40}/>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
)
}

export default GalleryStep