import api from "./api";

export type Language = {
  id: string;
  name: string;
};

export const fetchLanguages = async (): Promise<Language[]> => {
  const res = await api.get("/language");
  return res.data?.data ?? [];
};
