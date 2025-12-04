import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./Login.module.css";
import { sendOtp, verifyOtp } from "../../services/auth.service";
import { useToast } from "../../shared/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Send OTP
  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp(email);
      setOtpSent(true);
      showToast("OTP sent to your email!","success");
    } catch (err) {
      showToast("Failed to send OTP","error");
    }

    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await verifyOtp(email, otp);
      localStorage.setItem("token", res.token);
      window.location.href = "/dashboard";
    } catch (err) {
      showToast("Invalid OTP","error");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <img className={styles.logoCircle} src="/D-icon.png"></img>
        <h2>Doula Service Management</h2>
        <p>
          Comprehensive platform for managing doula services, appointments, and
          client relationships in your zone.
        </p>

        <div className={styles.checkItem}>
          <img src="/green-tick-icon.png"/> Streamlined Operations
        </div>
        <p className={styles.subtext}>Manage all aspects of your zone in one place</p>

        <div className={styles.checkItem}>
          <img src="/green-tick-icon.png"/> Real-time Insights
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

          {/* OTP Field (shown only after sending OTP) */}
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
            
                <img src="/lock-icon.png" className={styles.lockIcon}/>
            Your credentials are encrypted and stored securely. We take your privacy seriously.
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
