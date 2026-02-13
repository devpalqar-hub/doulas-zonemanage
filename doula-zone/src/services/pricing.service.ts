import api from "./api";

export interface PricingPayload {
  doulaProfileId: string;
  servicePricingId: string;
  serviceStartDate?: string; 
  servicEndDate: string;    
  visitDays?: string[];
  serviceTimeShift?: "MORNING" | "NIGHT" | "FULLDAY";
  buffer: number;
}

export const calculatePricing = async (payload: PricingPayload) => {
  const res = await api.post("/doula/calculate/pricing", 
    payload, 
  );
  return res.data.data;
};

