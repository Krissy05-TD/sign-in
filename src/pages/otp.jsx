import React, { useState, useRef } from 'react';
import { collection, query, where, getDocs } from "@firebase/firestore";
import { firestore } from "../firebase";
import './style/otp.css';

export default function OTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // Retrieve the correct OTP from localStorage
  const correctOtp = localStorage.getItem('generatedOtp');

  // Function to handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  // Function to handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const userOtp = otp.join("");
    console.log("User OTP entered:", userOtp);
  
    try {
      // Fetch OTP from Firestore
      const otpRef = collection(firestore, "otp");
      const q = query(otpRef, where("otp", "==", userOtp));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        console.log("OTP verified successfully.");
        setLoading(false);
        window.location.href = "/welcome";
      } else {
        alert("The OTP you entered is incorrect. Please try again.");
        setOtp(new Array(6).fill(""));
        inputs.current[0].focus();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      alert("An error occurred while verifying the OTP.");
      setLoading(false);
    }
  };

  // Function to resend OTP
  const handleResend = () => {
    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('New OTP:', newOtp); // Show new OTP in the console

    // Save the new OTP in localStorage
    localStorage.setItem('generatedOtp', newOtp);

    // Reset input fields
    setOtp(new Array(6).fill(''));
    inputs.current[0].focus();

    alert('A new OTP has been sent.');
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="otp">
      <div className="verification-container">
        <div>
          <img
            className="back"
            src="back.png"
            alt="back"
            onClick={() => window.location.href = '/create'}
          />
        </div>
        <h1 className="otp-h1">Enter the Verification Code</h1>
        <div className="otp-container">
          <form id="otp-form" onSubmit={handleSubmit}>
            <div className="otp-field">
              <div className="otp-input-group">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    className="otp-input"
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputs.current[index] = el)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button
                type="submit"
                id="otp-btn"
                disabled={!isOtpComplete}
              >
                Verify
              </button>
            </div>
          </form>
        </div>
        <p className="otp-text">Did not receive the code?</p>
        <a href="/otp" className="a-o" onClick={handleResend}>
          Resend
        </a>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Verifying OTP... Please wait.</p>
        </div>
      )}
    </div>
  );
}
