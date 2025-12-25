import api from "./api";

export type Booking = {
  id: string;
  clientName: string;
  clientUserId: string;

  doulaName: string;
  doulaUserId: string;

  serviceName: string;
  startDate: string;
  endDate: string;

  status: string;
};

export type BookingMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type BookingFilters = {
  search?: string;
  serviceId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export const fetchBookings = async (filters: BookingFilters) => {
  const res = await api.get("/zonemanager/booked-services/list", {
    params: {
      search: filters.search || undefined,
      serviceId: filters.serviceId || undefined,
      status: filters.status || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
    },
  });

  const bookings: Booking[] = res.data.data.map((b: any) => ({
    id: b.bookingId,
    clientName: b.clientName,
    clientUserId: b.clientId,

    doulaName: b.doulaName,
    doulaUserId: b.doulaId,

    serviceName: b.serviceName,
    startDate: b.startDate,
    endDate: b.endDate,

    status: b.status,
  }));

  return {
    bookings,
    meta: res.data.meta,
  };
};

export const createBooking = async (payload: any) => {
  const res = await api.post("/intake/forms", payload);
  return res.data;
};
