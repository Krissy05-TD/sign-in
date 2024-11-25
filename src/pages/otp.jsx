import React, { useState, useRef } from 'react';
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { addDoc, collection } from "@firebase/firestore";
import './style/otp.css';

export default function OTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const messageRef = useRef(); // For collecting the message
  const usersCollection = collection(firestore, "users");

  // Handle OTP input change
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

  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  // Handle OTP form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      window.location.href = '/welcome';
    }, 3000);
  };

  // Resend OTP
  const handleResend = (e) => {
    e.preventDefault();
    setOtp(new Array(6).fill(''));
    inputs.current[0].focus();
    alert('OTP resent');
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="otp">
      <div className="verification-container">
        {/* Back Navigation */}
        <div>
          <img
            src="back.png"
            alt="Back"
            className="back"
            onClick={() => (window.location.href = '/')}
          />
        </div>

        {/* OTP Form */}
        <h1>Enter the Verification Code</h1>
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

        {/* Resend Link */}
        <p>Did not receive the code?</p>
        <a href="/otp" className="otp-link" onClick={handleResend}>
          Resend
        </a>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-container">
          <div className="spinner">
            <p>Verifying OTP... Please wait.</p>
          </div>
        </div>
      )}
    </div>
  );
}
