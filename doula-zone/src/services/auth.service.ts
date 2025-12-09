import axios from "axios";

const API_URL = "http://31.97.237.63/doulas/backend/v1";

//  Send OTP
export const sendOtp = async (email: string) => {
  return await axios.post(`${API_URL}/auth/send/otp`, 
    { email: email},
    { headers: { "Content-Type": "application/json" } }
  );
};

//  Verify OTP
export const verifyOtp = async (email:string, otp:string) => {
  const res = await axios.post(`${API_URL}/auth/verify/otp`, {
    email: email,
    otp: otp
  });

  return res.data;
};



