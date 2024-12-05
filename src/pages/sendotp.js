import React, { useState, useRef } from "react"; // Import React and required hooks
import axios from "axios"; // Import axios for API calls

export default function SendOtp() {
  const [status, setStatus] = useState(""); // State for status messages
  const sendOtpNumberRef = useRef(null); // Ref for phone number checkbox
  const sendOtpEmailRef = useRef(null); // Ref for email checkbox
  const emailRef = useRef(null); // Ref for email input
  const numberRef = useRef(null); // Ref for phone number input

  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    if (sendOtpNumberRef.current.checked) {
      const number = numberRef.current.value; // Get phone number input value
      if (!/^\d{10}$/.test(number)) {
        setStatus("Please provide a valid 10-digit phone number.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/send-otp-sms", {
          number: number,
          otp: generatedOtp,
        });
        if (response.data.success) {
          setStatus("OTP sent successfully via number.");
        } else {
          setStatus("Failed to send OTP via number.");
        }
      } catch (error) {
        console.error("Error sending OTP via number:", error.message);
        setStatus("Error sending OTP via number.");
      }
    } else if (sendOtpEmailRef.current.checked) {
      const email = emailRef.current.value; // Get email input value
      if (!/\S+@\S+\.\S+/.test(email)) {
        setStatus("Please provide a valid email.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/send-otp-email", {
          email: email,
          otp: generatedOtp,
        });
        if (response.data.success) {
          setStatus("OTP sent successfully via email.");
        } else {
          setStatus("Failed to send OTP via email.");
        }
      } catch (error) {
        console.error("Error sending OTP via email:", error.message);
        setStatus("Error sending OTP via email.");
      }
    } else {
      setStatus("Please select a method to send the OTP.");
    }
  };

  return (
    <div>
      <h2>Send OTP</h2>
      <div>
        <label>
          <input type="radio" name="otpMethod" ref={sendOtpNumberRef} /> Send via Number
        </label>
        <input type="text" placeholder="Phone Number" ref={numberRef} />
      </div>
      <div>
        <label>
          <input type="radio" name="otpMethod" ref={sendOtpEmailRef} /> Send via Email
        </label>
        <input type="email" placeholder="Email" ref={emailRef} />
      </div>
      <button onClick={sendOtp}>Send OTP</button>
      <p>{status}</p> {/* Display status messages */}
    </div>
  );
}
