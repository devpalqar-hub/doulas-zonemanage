import api from "./api";

export type EnquiryMeeting = {
  id: string;
  meetingId: string;
  name: string;
  meetingsDate: string;
  meetingsTimeSlots: string;
  serviceName: string;
  status: string;
  additionalNotes?: string | null;
};


export const fetchMeetings = async (params: {
  search?: string;
  serviceName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const cleanParams: any = {};

  if (params.search?.trim()) cleanParams.search = params.search;
  if (params.page) cleanParams.page = params.page;
  if (params.limit) cleanParams.limit = params.limit;
  if (params.serviceName) cleanParams.serviceName = params.serviceName;
  if (params.status) cleanParams.status = params.status;
  if (params.startDate) cleanParams.startDate = params.startDate;
  if (params.endDate) cleanParams.endDate = params.endDate;

  const res = await api.get("/zonemanager/meetings/list", { params: cleanParams });

  const normalized = res.data.data.map((m: any) => {
    const start = new Date(m.startDate);
    const end = new Date(m.endDate);

    return {
      meetingId: m.meetingId,
      name: m.clientName,
      meetingsDate: m.startDate,
      meetingsTimeSlots: `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}-${
        end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }`,
      serviceName: m.serviceName,
      status: m.status === "CANCELED" ? "CANCELLED" : m.status,
      additionalNotes: null,
    };
  });

  return {
    meetings: normalized,
    meta: res.data.meta,
  };
};



export type MeetingDetails = {
  meetingId: string;
  enquiryId: string;
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


export const updateMeetingStatus = async (
  meetingId: string, status: "SCHEDULED" | "COMPLETED" | "CANCELED"
) => {
  const res = await api.patch("/meetings/status", {
    meetingId,
    status
  })
  return res.data.data as MeetingDetails;
}

export const scheduleMeeting = async (payload: {
  enquiryId: string;
  date: string;
  time: string;
  notes?: string;
  doulaIds: string[];
}) => {
  const res = await api.post("/meetings/doula/schedule", payload);
  return res.data.data;
};


