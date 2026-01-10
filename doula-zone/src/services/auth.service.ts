import axios from "axios";

const API_URL = "https://staging.bambinidoulas.com/backend/v1";

export const sendOtp = async (email: string) => {
  return await axios.post(`${API_URL}/auth/send/otp`, 
    { email: email},
    { headers: { "Content-Type": "application/json" } }
  );
};

export const verifyOtp = async (email:string, otp:string) => {
  const res = await axios.post(`${API_URL}/auth/verify/otp/zonemanager`, {
    email: email,
    otp: otp
  });
  return res.data;
};



