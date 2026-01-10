import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./login.module.css";
import { sendOtp, verifyOtp } from "../../services/auth.service";
import { useToast } from "../../shared/ToastContext";
import { getZoneManagerProfile } from "../../services/zoneManager.service";
import {  LuCircleCheckBig, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  // Send OTP
const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  console.log("Sending OTP for:", email);

  try {
    const res = await sendOtp(email);
    console.log("OTP SENT SUCCESS:", res);
    setOtpSent(true);
    showToast("OTP sent to your email!", "success");
  } catch (err) {
    console.error("OTP SEND FAILED:", err);
    showToast("Failed to send OTP", "error");
  }

  setLoading(false);
};


  // Verify OTP
const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await verifyOtp(email, otp);

    // Store auth data
    localStorage.setItem("userId", res.data.user.id);
    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Fetch profile
    const profileRes = await getZoneManagerProfile(res.data.user.id);
    const zm = profileRes;

    if (!zm) {
      showToast("Zone Manager profile not found", "error");
      setLoading(false);
      return;
    }

    localStorage.setItem("zoneManagerProfileId", zm.profileId);

    if (zm.regions && zm.regions.length > 0) {
      localStorage.setItem("regionId", zm.regions[0].id);
    } 

    navigate("/dashboard", { replace: true });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    showToast("Login failed. Please try again.", "error");
  }

  setLoading(false);
};



  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <img className={styles.avatar} src="/doula-branding.png" alt="" ></img>
        <h2>Doula Service Management</h2>
        <p>
          Comprehensive platform for managing doula services, appointments, and
          client relationships in your zone.
        </p>

        <div className={styles.checkItem}>
          <LuCircleCheckBig color="green" size={20} /> Streamlined Operations
        </div>
        <p className={styles.subtext}>Manage all aspects of your zone in one place</p>

        <div className={styles.checkItem}>
          <LuCircleCheckBig color="green" size={20} /> Real-time Insights
        </div>
        <p className={styles.subtext}>Track performance and availability instantly</p>
      </div>

      {/* Right Section */}
      <div className={styles.rightCard}>
        <h2>Zone Manager Login</h2>
        <p>{otpSent ? "Enter the OTP sent to your email" : "Enter your email to receive OTP"}</p>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          {/* Email */}
          <label>Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpSent} 
          />

          {/* OTP Field */}
          {otpSent && (
            <>
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </>
          )}

          <button type="submit" className={styles.loginBtn} disabled={loading}>    
            {loading ? <div className={styles.spinner}></div> : (otpSent ? "Verify OTP" : "Send OTP")}
          </button>
          <div className={styles.footerNote}>
            
                <LuLock size={20} style={{marginRight: "5px"}}/>
            Your credentials are encrypted and stored securely. We take your privacy seriously.
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;