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
  serviceName?: string;
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
      serviceName: filters.serviceName || undefined,
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

/* =====================
   CREATE BOOKING (ZONE)
===================== */
export interface CreateBookingPayload {
  name: string;
  email: string;
  phone: string;
  address: string;

  doulaProfileId: string;
  serviceId: string;

  seviceStartDate: string;
  serviceEndDate: string;

  visitFrequency?: number;
  serviceTimeShift?: "MORNING" | "NIGHT" | "FULLDAY";
  buffer: number;
}

export const createZoneBooking = async (
  payload: CreateBookingPayload
) => {
  const res = await api.post("/intake/forms", payload);
  return res.data;
};

