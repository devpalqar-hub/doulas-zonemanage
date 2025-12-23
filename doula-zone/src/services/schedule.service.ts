import api from "./api";

/* =====================
   TYPES
   ===================== */

export interface Schedule {
  scheduleId: string;
  clientId: string;
  clientName: string;
  doulaId: string | null;
  doulaName: string | null;
  serviceName: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
}

/* =====================
   FETCH SCHEDULES
   ===================== */

export const fetchSchedules = async (params: {
  page: number;
  limit: number;
  search?: string;
  serviceId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const cleanParams: any = {};

  if (params.page) cleanParams.page = params.page;
  if (params.limit) cleanParams.limit = params.limit;
  if (params.search?.trim()) cleanParams.search = params.search;
  if (params.serviceId) cleanParams.serviceId = params.serviceId;
  if (params.status) cleanParams.status = params.status;
  if (params.startDate) cleanParams.startDate = params.startDate;
  if (params.endDate) cleanParams.endDate = params.endDate;

  const res = await api.get("/zonemanager/schedules/list", {
    params: cleanParams,
  });

  return {
    schedules: res.data.data as Schedule[],
    meta: res.data.meta,
  };
};
