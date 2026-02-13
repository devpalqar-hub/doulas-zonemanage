import api from "./api";

export interface TimeSlot {
  id: string;
  startTime: string;   
  endTime: string;     
  availabe: boolean;
  isBooked: boolean;
}

export interface DaySlot {
  id: string;
  weekday: string;     
  availabe: boolean;
  ownerRole: string;
  zoneManagerId: string;
  AvailableSlotsTimeForMeeting: TimeSlot[];
}

export interface SlotsResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}


export interface FlatSlot {
  id: string;
  weekday: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}


export const fetchSlots = async () => {
  const res = await api.get("/slots/my/availability");

  const data: DaySlot[] = res.data.data;

  const slots: FlatSlot[] = data.flatMap((day) =>
    (day.AvailableSlotsTimeForMeeting || []).map((ts) => ({
      id: ts.id,
      weekday: day.weekday,
      startTime: ts.startTime,
      endTime: ts.endTime,
      isBooked: ts.isBooked,
    }))
  );

  return slots;
};


export const createSlot = async (payload: {
  weekday: string; 
  startTime: string; 
  endTime: string;
}) => {
  
  const res = await api.post("/slots", payload);
  return res.data;
};


export const deleteSlot = async (timeSlotId: string) => {
  const res = await api.delete(`/slots/delete/${timeSlotId}`);
  return res.data;
};

export interface OffDay {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
}

export const fetchOffDays = async (): Promise<OffDay[]> => {
  const res = await api.get("/slots/mark/offdays");
  return res.data.data;
};

export const createOffDay = async (payload: {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
}) => {
  const res = await api.post("/slots/mark/offdays", payload);
  return res.data;
};

export const deleteOffDay = async (id: string) => {
  const res = await api.delete(`/slots/mark/offdays/${id}`);
  return res.data;
};

export type TimeShift = "MORNING" | "NIGHT" | "FULLDAY";

export interface AvailabilityItem {
  id: string;
  date: string;
  availability: Record<TimeShift, boolean>;
  doulaId: string;
}

export const fetchDoulaAvailability = async (
  doulaId: string
): Promise<AvailabilityItem[]> => {
  const res = await api.get("/service/availability");

  return (res.data.data || []).filter(
    (a: any) => a.doulaId === doulaId
  );
};

export const fetchAvailabilityById = async (id: string) => {
  const res = await api.get(`/service/availability/${id}`);
  return res.data.data;
};

export type AvailableDoula = {
  doulaName: string;
  shift: string[];
  noOfUnavailableDaysInThatPeriod: number;
  availableServices: string[];
};

export const fetchAvailableDoulas = async (params: {
  startDate: string;
  endDate: string;
  shift?: "MORNING" | "NIGHT" | "FULLDAY";
  serviceId?: string;
  regionId?: string;
}) => {
  const res = await api.get(
    "/service/availability/doula/available-doulas/list",
    {
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        shift: params.shift,
        serviceId: params.serviceId,
        regionId: params.regionId,
      },
    }
  );

  return res.data.data as AvailableDoula[];
};
