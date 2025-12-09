import api from "./api";

export interface Language {
    id: string;
    name: string;
}

export interface AvailableSlot {
    id: string;
    date: string;
    weekday: string;
    available: boolean;
    isBooked: boolean;
}

export interface ServicePricing {
    id: string;
    serviceId: string;
    doulaProfileId: string;
    price: string;
}

export interface Region {
    id: string;
    regionName: string;
    pincode: string;
    district: string;
    state: string;
    country: string;
}

export interface DoulaProfile {
    id: string;
    userId: string;
    regionId: string | null;
    profileImage: string | null;
    description: string | null;
    achievements: string | null;
    qualification: string | null;
    yoe: number;
    Region: Region[];
    ServicePricing: ServicePricing[];
    AvailableSlotsForService: AvailableSlot[];
    Languages: Language[];
}

export interface Doula {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "DOULA";
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    doulaProfile: DoulaProfile | null;
}

export interface Service {
    id: string;
    name: string;
}

export const fetchDoulas = async (): Promise<{
    doulas: Doula[];
    total: number;
}> => {
    const res = await api.get("/doula");
    const data = res.data;
    return {
        doulas: data.data as Doula[],
        total: data.meta?.total ?? (data.data?.length || 0),
    };
};

export const fetchServices = async (): Promise<Service[]> => {
    const res = await api.get("/services");
    return res.data.data as Service[];
}

export const updateDoulaStatus = async (id: string, isActive: boolean) => {
    const res = await api.patch(`/doula/${id}`, { is_active: isActive});
    return res.data;
}

export const createDoula = async(formData: FormData) => {
    const res = await api.post("/doula", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
}