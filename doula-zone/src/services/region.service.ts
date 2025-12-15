import api from "./api";

export type Region = {
  id: string;
  regionName: string;
  pincode: string;
  district: string;
  state: string;
  country: string;
};

export const fetchAllRegions = async (): Promise<Region[]> => {
  const res = await api.get("/regions");
  return res.data.data; // adjust if needed
};


export const fetchRegionById = async (id: string): Promise<Region | null> => {
  if (!id) return null;
  const res = await api.get(`/regions/${id}`);
  return res.data?.data ?? null;
};
