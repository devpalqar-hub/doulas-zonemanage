import api from "./api";

export type Meeting = {
  id: string;
  link: string | null;
  slot: { startTime: string; endTime: string } | null;
  status: string;
  remarks?: string | null;
  bookedBy?: { id: string; userId?: string } | null;
};

export const fetchMeetings = async (params: {
  search?: string;
  serviceId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/meetings", { params });
  return { meetings: res.data.data, meta: res.data.meta };
};
