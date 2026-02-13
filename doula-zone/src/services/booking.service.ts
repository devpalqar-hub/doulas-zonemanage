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
  timeshift: string;
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
    timeshift: b.timeshift,
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

  serviceStartDate: string;
  serviceEndDate: string;

  visitDays?: string[];
  serviceTimeShift?: "MORNING" | "NIGHT" | "FULLDAY";
  buffer: number;
}

export const createZoneBooking = async (
  payload: CreateBookingPayload
) => {
  const res = await api.post("/intake/forms", payload);
  return res.data;
};

export const updateBookingStatus = async (
  bookingId: string,
  status: "COMPLETED" | "CANCELED" | "ACTIVE"
) => {
  const res = await api.patch(`/service-booked/bookings/${bookingId}/status`, 
    { status }
  );
  return res.data;
}

