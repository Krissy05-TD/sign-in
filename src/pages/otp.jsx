import React, { useState, useRef } from 'react';
import './style/otp.css';

export default function OTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

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
      inputs.current[index - 1].focus(); // Focus on previous input if current is empty
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    // Simulate a 2-second verification process
    setTimeout(() => {
      setLoading(false); // Hide spinner
      window.location.href = '/welcome'; // Redirect to the welcome page
    }, 2000);
  };

  // Function to resend OTP
  const handleResend = () => {
    setOtp(new Array(6).fill('')); // Reset OTP fields
    inputs.current[0].focus(); // Focus on the first input
    alert('OTP resent');
  };

  // Check if all fields are filled
  const isOtpComplete = otp.every((digit) => digit !== '');

  return (
    <div className="otp">
      <div className="verification-container">
        <div>
          <img
            className="back"
            src="back.png"
            alt="back"
            onClick={() => window.location.href = '/forgot'} // Adjust URL as needed
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
                disabled={!isOtpComplete} // Button is disabled unless all fields are filled
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
