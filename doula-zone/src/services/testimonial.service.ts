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

type FetchTestimonialsParams = {
  page: number;
  limit: number;
  serviceName?: string;
  ratings?: number;
  startDate?: string;
  endDate?: string;
};

export const fetchTestimonials = async (
  filters: FetchTestimonialsParams
) => {
  const params: any = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.serviceName) params.serviceName = filters.serviceName;
  if (filters.ratings) params.ratings = filters.ratings;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  const res = await api.get(
    "/testimonials/all/testimonials",
    { params }
  );

  return {
    data: res.data.data.map((t: any) => ({
      id: t.servicePricingId + "-" + t.testimonialCreatedAt, 
      ratings: t.ratings,
      reviews: t.reviews,
      doulaName: t.doulaName,
      serviceName: t.serviceName,
      clientName: t.clientName,
      createdAt: t.testimonialCreatedAt,
    })) as Testimonial[],
    meta: res.data.meta,
  };
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
