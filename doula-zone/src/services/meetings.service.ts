import api from "./api";

export type EnquiryMeeting = {
  id: string;
  meetingsId: string;
  name: string;
  email: string;
  phone: string;
  additionalNotes: string | null;
  meetingsDate: string;         
  meetingsTimeSlots: string;     
  serviceName: string;
  serviceId: string;
  clientId: string;
  createdAt: string;
};

export const fetchMeetings = async (params: {
  search?: string;
  serviceId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const res = await api.get("/enquiry/form", { params });

  return {
    meetings: res.data.data as EnquiryMeeting[],
    meta: res.data.meta,
  };
};

export type MeetingDetails = {
  meetingId: string;
  meetingLink: string | null;
  meetingStatus: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  meetingDate: string;
  meetingStartTime: string;
  meetingEndTime: string;
  weekday: string;
  serviceName: string;
  remarks?: string | null;
  client: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  };
};

export const fetchMeetingById = async (id: string) => {
  const res = await api.get(`/meetings/${id}`);
  return res.data.data as MeetingDetails;
};


