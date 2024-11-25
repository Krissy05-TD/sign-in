import React, { useState, useRef } from 'react';
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { addDoc, collection } from "@firebase/firestore";
import './style/newotp.css';

export default function NewOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const messageRef = useRef(); // For collecting the message
  const usersCollection = collection(firestore, "users");

  // Function to handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if the current one is filled
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate an OTP verification process
    setTimeout(() => {
      window.location.href = '/new';
    }, 3000);
  };

  // Function to resend OTP (for demonstration purposes)
  const handleResend = () => {
    alert('OTP resent');
  };

  return (
    <div className="otp">
      <div className="verification-container">
      <div>
            <img class="back" src='back.png' alt='back' onClick={() => window.location.href = '/public/forgot'} >
            </img>
        </div>
        <h1>Enter the Verification Code</h1>
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
            </div>
          </form>
        </div>

        <button type="submit" id="otp-button" onClick={() => window.location.href = '/new'}  disabled={otp.includes('')}>Verify
        </button>
        <p>Did not receive the code?</p>
        <a href="/newotp" onClick={handleResend}>Resend</a>
      </div>

      {loading && (
        <div className="loading-container" id="loading-container">
          <div className="spinner"></div>
          <p>Verifying OTP... Please wait.</p>
        </div>
      )}
    </div>
  );
}
