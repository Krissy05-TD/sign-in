import React, { useState } from 'react';
import './style/forgot.css'; // Assuming you have the CSS file for styling

// Function to handle OTP sending logic
export default function Forgot() {
  const [otpMethod, setOtpMethod] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOtpMethodChange = (e) => {
    setOtpMethod(e.target.value);
  };

  const handleNumberChange = (e) => {
    let input = e.target.value;
    input = input.replace(/\D/g, "");

    // Add spaces automatically as user types
    if (input.length > 3 && input.length <= 6) {
      input = input.slice(0, 3) + " " + input.slice(3);
    } else if (input.length > 6) {
      input = input.slice(0, 3) + " " + input.slice(3, 6) + " " + input.slice(6, 10);
    }

    setNumber(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpMethod === 'number' && number) {
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
      try {
        const response = await fetch('/sendOtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            otp,
            number
          })
        });

        if (response.ok) {
          alert('OTP sent successfully!');
          window.location.href = 'newotp'; // Redirect after sending OTP
        } else {
          setErrorMessage('Failed to send OTP via phone.');
        }
      } catch (error) {
        console.error('Error sending OTP via phone:', error);
        setErrorMessage('Error sending OTP.');
      }
    } else if (otpMethod === 'email' && email) {
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
      <div className="forgot">
        <form className="forgot-back" onSubmit={handleSubmit}>
          <div className="back-img">
            <img
              src="./back.png"
              alt="back arrow icon"
              className="icon arrow"
              style={{ width: '20px', height: '20px' }}
              onClick={() => window.location.href = '/login'} // Redirect to previous page
            />
          </div>
          <div className='opt'>
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
          </div>

          {otpMethod === 'number' && (
            <div id="phone-input">
              <label className='num'>Enter Phone Number:</label>
              <input
                type="tel"
                name="number"
                id="forgot-number"
                placeholder="012 345 6789"
                value={number}
                onChange={handleNumberChange}
                required
              />
            </div>
          )}

          {otpMethod === 'email' && (
            <div id="email-input">
              <label className='em'>Enter Email:</label>
              <input
                type="email"
                name="email"
                id="forgot-email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" id="for-submit">Send OTP</button>

          {/* Error Message Display */}
          {errorMessage && <p className="error" style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}
