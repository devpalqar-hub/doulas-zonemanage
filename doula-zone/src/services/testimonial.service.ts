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
