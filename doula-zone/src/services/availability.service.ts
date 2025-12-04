import api from "./api";

export interface TimeSlot {
  id: string;
  startTime: string;   
  endTime: string;     
  availabe: boolean;
  isBooked: boolean;
  dateId: string;
}

export interface DaySlot {
  id: string;
  date: string;
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
  dateId: string;
  date: string;
  weekday: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}


const formatDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const fetchSlots = async (
  regionId: string,
  startDate: Date,
  endDate: Date,
  page = 1,
  limit = 20
) => {
  try {
    const res = await api.get("/slots", {
      params: {
        regionId,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        page,
        limit,
      },
    });

    const data: DaySlot[] = res.data.data;
    const meta: SlotsResponseMeta = res.data.meta;

    const slots: FlatSlot[] = data.flatMap((day) =>
      (day.AvailableSlotsTimeForMeeting || []).map((ts) => ({
        id: ts.id,
        dateId: day.id,
        date: day.date,
        weekday: day.weekday,
        startTime: ts.startTime,
        endTime: ts.endTime,
        isBooked: ts.isBooked,
      }))
    );

    return { slots, meta };
  } catch (err: any) {

    if (err?.response?.status === 404) {
      return {
        slots: [],
        meta: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    throw err; 
  }
};


export const createSlot = async (payload: {
  date: string; 
  startTime: string; 
  endTime: string;
}) => {
  const res = await api.post("/slots", {
    date: payload.date,
    timeslot: {
      startTime: payload.startTime,
      endTime: payload.endTime,
      available: true,
    },
  });
  return res.data;
};


export const deleteSlot = async (timeSlotId: string) => {
  const res = await api.delete(`/slots/${timeSlotId}`);
  return res.data;
};
