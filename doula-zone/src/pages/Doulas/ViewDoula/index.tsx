import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../../Dashboard/components/sidebar/Sidebar";
import Topbar from "../../Dashboard/components/topbar/Topbar";
import ViewDoula from "./ViewDoula";
import styles from "./ViewDoula.module.css";

import { useToast } from "../../../shared/ToastContext";
import api from "../../../services/api";

const mapBackendToView = (d: any) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  return {
    userId: d.userId,
    name: d.name,
    yoe: d.yoe ?? 0,

    profileImage: d.profileImage
      ? `${baseUrl}/${d.profileImage}`
      : null,

    galleryImages: d.galleryImages?.length
      ? d.galleryImages.map((img: any) => ({
          id: img.id,
          url: `${baseUrl}/${img.url}`,
        }))
      : [],

    description: d.description ?? "—",
    regionNames: d.regionNames?.map((r: any) => r.name) ?? [],

    services: d.serviceNames?.map((s: any) => ({
      serviceId: s.serviceId,
      serviceName: s.serviceName,
      price: s.price,
    })) ?? [],

    specialities: d.specialities ?? [],
    testimonials: d.testimonials ?? [],

    ratings: d.ratings,
    reviewsCount: d.reviewsCount ?? 0,
  };
};


const ViewDoulaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/doula/${id}`);
        setData(res.data.data);
      } catch (error) {
        console.error(error);
        showToast("Failed to load doula details", "error");
        navigate("/doulas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate, showToast]);

  if (loading) return <p style={{ padding: 24 }}>Loading…</p>;
  if (!data) return null;

  return (
    <div className={styles.root}>
      <Sidebar />
      <div className={styles.contentArea}>
        <Topbar />
        <div className={styles.pageContent}>
          <ViewDoula data={mapBackendToView(data)} />
        </div>
      </div>
    </div>
  );
};

export default ViewDoulaPage;
