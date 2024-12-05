import React, { useRef, useState } from "react";
import axios from "axios";

const Apps = () => {
  const [status, setStatus] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const numberRef = useRef();
  const emailRef = useRef();
  const sendOtpNumberRef = useRef();
  const sendOtpEmailRef = useRef();

  const handleSendOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    setGeneratedOtp(otp); // Save locally for testing

    if (sendOtpNumberRef.current.checked) {
      const number = numberRef.current.value;
      if (!/^\+?\d{10,15}$/.test(number)) {
        setStatus("Please provide a valid phone number.");
        return;
      }
      try {
        const response = await axios.post("http://localhost:5000/send-otp", {
          method: "number",
          destination: number,
          otp,
        });
        setStatus(response.data.message || "Error sending OTP.");
      } catch (error) {
        console.error("Error:", error.message);
        setStatus("Failed to send OTP via phone number.");
      }
    } else if (sendOtpEmailRef.current.checked) {
      const email = emailRef.current.value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus("Please provide a valid email.");
        return;
      }
      try {
        const response = await axios.post("http://localhost:5000/send-otp", {
          method: "email",
          destination: email,
          otp,
        });
        setStatus(response.data.message || "Error sending OTP.");
      } catch (error) {
        console.error("Error:", error.message);
        setStatus("Failed to send OTP via email.");
      }
    } else {
      setStatus("Please select a method to send the OTP.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Send OTP</h2>
      <div>
        <input type="radio" ref={sendOtpNumberRef} name="otpMethod" /> Send via Phone
        <input type="text" ref={numberRef} placeholder="Enter phone number" />
      </div>
      <div>
        <input type="radio" ref={sendOtpEmailRef} name="otpMethod" /> Send via Email
        <input type="text" ref={emailRef} placeholder="Enter email address" />
      </div>
      <button onClick={handleSendOtp}>Send OTP</button>
      <p>{status}</p>
    </div>
  );
};

export default Apps;
