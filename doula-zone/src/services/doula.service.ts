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
  price: number;
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

export interface DoulaListItem {
  userId: string;
  name: string;
  email: string;
  profileId: string;
  profileImage: string | null;
  yoe: number;
  serviceNames: string[];
  regionNames: string[];
  ratings: number | null;
  reviewsCount: number;
  nextImmediateAvailabilityDate: string | null;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
}


export const fetchDoulas = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
  service?: string;
  availability?: "AVAILABLE" | "UNAVAILABLE";
  status?: "ACTIVE" | "INACTIVE";
}) => {
  const cleanParams: any = {};

  if (params?.search?.trim()) cleanParams.search = params.search;
  if (params?.page) cleanParams.page = params.page;
  if (params?.limit) cleanParams.limit = params.limit;
  if (params?.service) cleanParams.service = params.service;
  if (params?.availability) cleanParams.availability = params.availability;
  if (params?.status) cleanParams.status = params.status;

  const res = await api.get("/doula", { params: cleanParams });

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  const doulas: DoulaListItem[] = res.data.data.map((d: any) => ({
    userId: d.userId,
    name: d.name,
    email: d.email,
    profileId: d.profileId,
    yoe: d.yoe ?? 0,

    serviceNames: Array.from(
      new Set((d.serviceNames ?? []).map((s: any) => s.serviceName))
    ),

    regionNames: (d.regionNames ?? []).map((r: any) => r.name),

    ratings: d.ratings ?? null,
    reviewsCount: d.reviewsCount ?? 0,
    nextImmediateAvailabilityDate: d.nextImmediateAvailabilityDate ?? null,

    profileImage: d.profile_image
      ? d.profile_image.startsWith("http")
        ? d.profile_image
        : `${IMAGE_BASE_URL}/${d.profile_image}`
      : null,

    isActive: d.isActive,
  }));

  return {
    doulas,
    total: res.data.meta?.total ?? doulas.length,
    totalPages: res.data.meta?.totalPages ?? 1,
  };
};

/* =====================
   OTHER APIs (UNCHANGED)
   ===================== */

export const deleteDoula = async (id: string) => {
  const res = await api.delete(`/doula/${id}`);
  return res.data;
};

export const fetchServices = async (): Promise<Service[]> => {
  const res = await api.get("/services");
  return res.data.data as Service[];
};

export const updateDoulaStatus = async (id: string, isActive: boolean) => {
  const res = await api.patch(`/doula/${id}`, { is_active: isActive });
  return res.data;
};

export const createDoula = async (formData: FormData) => {
  const res = await api.post("/doula", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const fetchZonemanagerDoulas = async (): Promise<DoulaListItem[]> => {
  const res = await api.get("/zonemanager/doulas/list");
  return res.data.data;
};


/* =====================
   Edit Types
===================== */

export interface DoulaGalleryImage {
  id: string;
  url: string;
  isPrimary?: boolean;
}

export interface DoulaProfileResponse {
  userId: string;
  name: string;
  email: string;
  yoe: number;
  description: string;
  qualification: string;
  achievements: string;
  specialities: string[];
  ratings: number | null;
  reviewsCount: number;
  profileImage: string | null;
  isActive: boolean;
  services: {
    servicePricingId: string;
    serviceId: string;
    serviceName: string;
    price: number;
  }[];
  regions: string[];
  galleryImages: DoulaGalleryImage[];
}

/* =====================
   FETCH DOULA PROFILE
===================== */

export const fetchDoulaProfile = async (
  doulaId: string
): Promise<DoulaProfileResponse> => {
  const res = await api.get(`/doula/${doulaId}`);
  const d = res.data.data;

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  return {
    userId: d.userId,
    name: d.name,
    email: d.email,
    yoe: d.yoe ?? 0,
    description: d.description ?? "",
    qualification: d.qualification ?? "",
    achievements: d.achievements ?? "",
    specialities: d.specialities ?? [],
    ratings: d.ratings ?? null,
    reviewsCount: d.reviewsCount ?? 0,
    isActive: d.isActive ?? true,

    profileImage: d.profileImage
      ? d.profileImage.startsWith("http")
        ? d.profileImage
        : `${IMAGE_BASE_URL}/${d.profileImage}`
      : null,

    services: (d.serviceNames ?? []).map((s: any) => ({
      servicePricingId: s.servicePricingId,
      serviceId: s.serviceId,
      serviceName: s.serviceName,
      price: Number(s.price),
    })),

    regions: (d.regionNames ?? []).map((r: any) => r.name),

    galleryImages: (d.galleryImages ?? []).map((g: any) => ({
      id: g.id,
      url: g.url.startsWith("http")
        ? g.url
        : `${IMAGE_BASE_URL}/${g.url}`,
    })),
  };
};

/* =====================
   UPDATE DOULA PROFILE
===================== */

export const updateDoulaProfile = async (
  doulaId: string,
  payload: {
    name: string;
    is_active: boolean;
    description: string;
    achievements: string;
    qualification: string;
    yoe: number;
    specialities: string[];
  }
) => {
  const res = await api.patch(
    "/zonemanager/doulas/profile",
    payload,
    { params: { doulaId } }
  );
  return res.data;
};

/* =====================
   GALLERY
===================== */

export const uploadDoulaGalleryImages = async (
  doulaId: string,
  files: File[]
) => {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));

  const res = await api.post(
    "/zonemanager/doulas/gallery/images",
    formData,
    {
      params: { doulaId },
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};

export const deleteDoulaGalleryImage = async (
  doulaId: string,
  imageId: string
) => {
  const res = await api.delete(
    "/zonemanager/doulas/gallery/images",
    { params: { doulaId, imageId } }
  );
  return res.data;
};
