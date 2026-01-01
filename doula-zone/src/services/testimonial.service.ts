import api from "./api";

export type Testimonial = {
  id: string;
  ratings: number;
  reviews: string;
  doulaName: string;
  serviceName: string;
  clientName: string;
  createdAt: string;
};

export const fetchTestimonials = async () => {
  const res = await api.get("/testimonials");
  return res.data.data as Testimonial[];
};

export const fetchTestimonialById = async (id: string) => {
  const res = await api.get(`/testimonials/${id}`);
  return res.data.data as Testimonial;
};

export interface RecentTestimonial {
  id: string;
  ratings: number;
  reviews: string;
  createdAt: string;

  clientName: string;
  doulaName: string;
  serviceName: string;
}

export const fetchRecentTestimonials = async (): Promise<RecentTestimonial[]> => {
  const res = await api.get("/testimonials/recent/testimonials");

  return (res.data.data ?? []).map((t: any) => ({
    id: t.id,
    ratings: t.ratings,
    reviews: t.reviews,
    createdAt: t.createdAt,

    clientName: t.client?.user?.name ?? "—",
    doulaName: t.DoulaProfile?.user?.name ?? "—",
    serviceName: t.ServicePricing?.service?.name ?? "—",
  }));
};
