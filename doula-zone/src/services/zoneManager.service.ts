import api from "./api";

export const getZoneManagerProfile = async (id: string) => {
    const res = await api.get(`/zonemanager/${id}`);
    return res.data.data;
};