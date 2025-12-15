import api from "./api";

export type PaymentDetails = {
  amount: number;
  method: string;
};

export type BookingSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

export type Booking = {
  id: string;
  clientName: string;
  clientUserId: string;
  doulaName: string;
  doulaUserId: string;
  regionName: string;
  serviceName: string;

  startDate: string;
  endDate: string;
            
  createdAt: string;
  status: string;

  slots: {
    id: string;
    startTime: string;
    endTime: string;
  }[];
}

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
  const res = await api.get("/service-booked", {
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
    clientUserId: b.clientUserId,

    doulaName: b.doulaName,
    doulaUserId: b.doulaUserId,

    regionName: b.regionName,
    serviceName: b.serviceName,

    startDate: b.start_date,
    endDate: b.end_date,

    createdAt: b.createdAt,
    status: b.status,

    slots: b.timeSlots || [],
  }));

  return {
    bookings,
    meta: res.data.meta,
  };
};
