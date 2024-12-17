import React, { useState } from 'react';
import './style/forgot.css'; // Assuming you have the CSS file for styling

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

  const generateAndSendOTP = async (otp, method) => {
    try {
      console.log('OTP generation triggered');
      console.log('Generated OTP:', otp); // Log OTP to console for now
  
      // Save OTP in localStorage
      localStorage.setItem('generatedOtp', otp);
      localStorage.setItem('otpMethod', method);
  
      // Simulate sending OTP (you can integrate actual OTP sending logic here)
      alert('OTP sent successfully!');
      window.location.href = '/newotp'; // Redirect to OTP verification page
    } catch (error) {
      console.error('Error generating OTP:', error);
      setErrorMessage('Error generating OTP.');
    }
  };  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted'); // Log to verify form submission
  
    if (!otpMethod) return setErrorMessage('Please select an OTP method.');
  
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    console.log('Generated OTP:', otp); // Log OTP before passing to the function
  
    if (otpMethod === 'number' && number) {
      await generateAndSendOTP(otp, 'number');
    } else if (otpMethod === 'email' && email) {
      await generateAndSendOTP(otp, 'email');
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
