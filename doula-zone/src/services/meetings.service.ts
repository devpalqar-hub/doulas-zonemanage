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
  createdby: "DOULA" | "ZONE_MANAGER" | null;
};


export const fetchMeetings = async (params: {
  search?: string;
  serviceName?: string;
  date1?: string;
  date2?: string;
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
  if (params.date1) cleanParams.date1 = params.date1;
  if (params.date2) cleanParams.date2 = params.date2;

  const res = await api.get("/zonemanager/meetings/list", { params: cleanParams });

  const normalized = res.data.data.map((m: any) => {
    const isEnquiry = m.enquiry !== null;

    return {
      meetingId: m.meetingId,
      name: isEnquiry ? m.enquiry.name : m.clientName,
      meetingsDate: m.meetingDate,
      meetingsTimeSlots: `${m.startDate}-${m.endDate}`,
      serviceName: m.serviceName,
      status: m.status === "CANCELED" ? "CANCELLED" : m.status,
      additionalNotes: null,
      createdby: m.createdby ?? null,
    };
  });

  return {
    meetings: normalized,
    meta: res.data.meta,
  };
};



export type MeetingDetails = {
  createdby: "DOULA" | "ZONE_MANAGER" | null;
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


