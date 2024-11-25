import React, { useState, useRef } from 'react';
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { addDoc, collection } from "@firebase/firestore";
import './style/forgot.css'; // Assuming you have the CSS file for styling

// Function to handle OTP sending logic
const ResendOTP = () => {
  const [otpMethod, setOtpMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messageRef = useRef(); // For collecting the message
  const usersCollection = collection(firestore, "users");

  const handleOtpMethodChange = (e) => {
    setOtpMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpMethod === 'number' && phoneNumber) {
      // Send OTP via phone using Twilio (client-side call)
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
      try {
        const response = await fetch('/sendOtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            otp,
            phoneNumber
          })
        });

        window.location.href= '/newotp'

        if (response.ok) {
          setOtpSent(true);
          alert('OTP sent successfully!');
        } else {
          setErrorMessage('Failed to send OTP via phone.');
        }
      } catch (error) {
        console.error('Error sending OTP via phone:', error);
        setErrorMessage('Error sending OTP.');
      }
    } else if (otpMethod === 'email' && email) {
      // Send OTP via email (client-side logic)
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
      try {
        const response = await fetch('/sendOtpEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            otp,
            email
          })
        });

        if (response.ok) {
          setOtpSent(true);
          alert('OTP sent successfully!');
        } else {
          setErrorMessage('Failed to send OTP via email.');
        }
      } catch (error) {
        console.error('Error sending OTP via email:', error);
        setErrorMessage('Error sending OTP.');
      }
    } else {
      setErrorMessage('Please fill in the required fields.');
    }
  };

  return (
    <div>
      <form className="forgot-back" onSubmit={handleSubmit}>
        <div className="back-img">
          <img
            src="/public/back.png"
            alt="back arrow icon"
            className="icon arrow"
            style={{ width: '20px', height: '20px' }}
            onClick={() => window.location.href = '/login'} // Redirect to previous page
          />
        </div>

        <label>Send OTP via:</label>
        <select
          name="otp"
          id="forgot-otp"
          value={otpMethod}
          onChange={handleOtpMethodChange}
          required
        >
          <option value="">Select an Option</option>
          <option value="number">Phone Number</option>
          <option value="email">Email</option>
        </select>

        {/* Phone Number Input */}
        {otpMethod === 'number' && (
          <div id="phone-input">
            <label>Enter Phone Number:
            <input
              type="tel"
              name="number"
              id="forgot-number"
              placeholder="012 345 6789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            </label>
          </div>
        )}

        {/* Email Input */}
        {otpMethod === 'email' && (
          <div id="email-input">
            <label>Enter Email:</label>
            <input
              type="email"
              name="email"
              id="forgot-email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <button type="submit" id="for-submit" onClick={() => window.location.href = '/newotp'}>Send OTP</button>
      </form>
    </div>
  );
};

export default ResendOTP;
