import React, { useState } from "react";
import OtpInput from "react-otp-input";
import CustomOtpInput from "./otp"; 
import { auth } from "../firebase";
import "./style/otp.css";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onOTPVerify = () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        setStatus("Login successful!");
        setLoading(false);
        // Optionally redirect or handle success
        window.location.href = "/welcome"; // Example redirect
      })
      .catch((error) => {
        setStatus("Invalid OTP. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="otp-container">
      <h2>Enter the OTP sent to your number</h2>
      <OtpInput
        value={otp}
        onChange={setOtp}
        OTPLength={6}
        otpType="number"
        disabled={false}
        autoFocus
        className="otp-input"
      />
      <button onClick={onOTPVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      <p>{status}</p>
    </div>
  );
}
