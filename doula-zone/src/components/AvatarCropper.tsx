import Cropper from "react-easy-crop";
import { useState } from "react";

type Props = {
  image: string;
  onCropComplete: (croppedBlob: Blob) => void;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9);
  });
};

const AvatarCropper = ({ image, onCropComplete }: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  return (
    <div style={{ width: 300, height: 300, position: "relative" }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape="round"
        showGrid={false}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, areaPixels) =>
          setCroppedAreaPixels(areaPixels)
        }
      />

      <button
        disabled={!croppedAreaPixels}
        style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: !croppedAreaPixels ? 0.6 : 1,
            cursor: !croppedAreaPixels ? "not-allowed" : "pointer",
            borderRadius: "8px",
            padding: "8px 16px",
            background: "#EF4444",
            color: "#fff",
            border: "none",
        }}
        onClick={async () => {
            if (!croppedAreaPixels) return;
            const blob = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(blob);
        }}
        >
        Crop & Save
        </button>

    </div>
  );
};

export default AvatarCropper;
