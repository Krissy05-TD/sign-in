import React, { useRef, useState, useEffect } from "react";
import { firestore } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
import axios from "axios";
import "./style/create.css";

export default function Create() {
  const ref = collection(firestore, "users");

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const numberRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const sendOtpNumberRef = useRef();
  const sendOtpEmailRef = useRef();
  const response = useRef();
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");
  const [firstname, setFirstName] = useState(""); // Add state for the user's name

  // States to manage visibility of passwords
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // useEffect to load stored name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setFirstName(storedName); // Set the name in state if it exists in localStorage
    } 
  }, []);

  const handleCheckboxChange = (type) => {
    if (type === "number") {
      if (sendOtpNumberRef.current.checked) {
        sendOtpEmailRef.current.checked = false; // Uncheck the email checkbox
      }
    } else if (type === "email") {
      if (sendOtpEmailRef.current.checked) {
        sendOtpNumberRef.current.checked = false; // Uncheck the number checkbox
      }
    }
  };

  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
    if (sendOtpNumberRef.current.checked) {
      if (!/^\d{10}$/.test(number)) { // Ensure the phone number is valid
        setStatus("Please provide a valid 10-digit phone number.");
        return;
      }
      try {
        const response = await axios.post("http://localhost:5000/send-otp", {
          method: "number",
          destination: number,
          otp: generatedOtp,
        });
        if (response.data.success) {
          setStatus("OTP sent successfully via number.");
          localStorage.setItem("otp", generatedOtp); // Store OTP temporarily
        } else {
          setStatus("Failed to send OTP via number.");
        }
      } catch (error) {
        console.error("Error sending OTP via number:", error.message);
        setStatus("Error sending OTP via number.");
      }
    } else if (sendOtpEmailRef.current.checked) {
      const email = emailRef.current.value;
      if (!/\S+@\S+\.\S+/.test(email)) { // Ensure the email is valid
        setStatus("Please provide a valid email.");
        return;
      }
      try {
        const response = await axios.post("http://localhost:5000/send-otp", {
          method: "email",
          destination: email,
          otp: generatedOtp,
        });
        if (response.data.success) {
          setStatus("OTP sent successfully via email.");
          localStorage.setItem("otp", generatedOtp); // Store OTP temporarily
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
    console.log("Backend Response:", response.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    const otpMethod = sendOtpNumberRef.current.checked
      ? "number"
      : sendOtpEmailRef.current.checked
      ? "email"
      : "none";
  
    const data = {
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      number: numberRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      otpMethod,
    };
  
    // Validations
    if (!data.firstname || !data.lastname || !data.number || !data.email || !data.password) {
      alert("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      alert("Invalid email format.");
      return;
    }
    if (!/^\d{10}$/.test(data.number)) {
      alert("Invalid phone number format.");
      return;
    }
  
    try {
      // Save data to Firestore
      await addDoc(ref, data);
      console.log("Data saved to Firestore:", data);
  
      // Save to localStorage (optional, can be removed for security)
      localStorage.setItem("userName", firstname);
      localStorage.setItem("firstname", data.firstname);
      localStorage.setItem("lastname", data.lastname);
      localStorage.setItem("number", data.number);
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);
  
      // Send OTP after data is saved
      await sendOtp(); // Call sendOtp to send the OTP to the selected method
  
      // Redirect to OTP page
      window.location.href = "/otp";
    } catch (e) {
      console.error("Error saving data to Firestore:", e.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible((prev) => !prev);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible((prev) => !prev);
    }
  };

  return (
    <div>
      <div className="create">
        <div className="create-left">
          <h1>
            <img src="/logo.jpeg" alt="Four Leaf Clover" />
            Project 1
          </h1>
        </div>
        <div className="create-right">
          <form className="create-form-grid" onSubmit={handleSave}>
            <div>
              <label className="firstname">
                First Name
                <input
                  type="text"
                  placeholder="Enter First Name"
                  ref={firstnameRef}
                  id="firstname"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label className="lastname">
                Last Name
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  ref={lastnameRef}
                  id="lastname"
                  required
                />
              </label>
            </div>

            <div>
              <label htmlFor="number">
                Cellphone Number
                <input
                  type="tel"
                  placeholder="012 345 6789"
                  ref={numberRef}
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </label>
              <div className="c-checkbox">
                <input
                  type="checkbox"
                  name="otp_method[]"
                  value="number"
                  id="send-otp-num"
                  ref={sendOtpNumberRef}
                  onChange={() => handleCheckboxChange("number")}
                />
                <label htmlFor="send-otp-num">Send OTP via number</label>
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                name="email"
                id="email"
                ref={emailRef}
                required
              />
              <div className="c-checkbox">
                <input
                  type="checkbox"
                  name="otp_method[]"
                  value="email"
                  id="send-otp-mail"
                  ref={sendOtpEmailRef}
                  onChange={() => handleCheckboxChange("email")}
                />
                <label htmlFor="send-otp-mail">Send OTP via mail</label>
              </div>
            </div>

            <div className="create-password-container">
              <label className="c-password">
                Password
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  ref={passwordRef}
                  id="c-password"
                  required
                />
                <img
                  id="create-img"
                  src={passwordVisible ? "open.png" : "closed.png"}
                  alt="Show Password"
                  width="20px"
                  height="20px"
                  onClick={() => togglePasswordVisibility("password")}
                />
              </label>
            </div>
            <div className="create-password-container">
              <label className="c-confirm-password">
                Confirm Password
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  id="c-confirm-password"
                  required
                />
                <img
                  id="create-c-img"
                  src={confirmPasswordVisible ? "open.png" : "closed.png"}
                  alt="Show Password"
                  width="20px"
                  height="20px"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                />
              </label>
            </div>

            <div className="create-with-container">
              <p className="create-icons">Or you can login with</p>
              <div className="icon-container">
                <img
                  className="gmail-icon"
                  src="./gmail.png"
                  alt="Gmail"
                  onClick={() => (window.location.href = "https://gmail.com/")}
                />
                <img
                  className="facebook-icon"
                  src="./facebook.png"
                  alt="Facebook"
                  onClick={() => (window.location.href = "https://facebook.com/")}
                />
                <img
                  className="apple-icon"
                  src="./apple.png"
                  alt="Apple"
                  onClick={() => (window.location.href = "https://appleid.apple.com/")}
                />
              </div>
            </div>
          </form>
          <button type="button" id="cre-button" onClick={sendOtp}>
            Send Verification Code
          </button>
            <div style={{ marginTop: status ? "0px" : "0", marginLeft: status ? "30px" : "0",color: "rgb(236, 107, 129)" }}>
                {status && <p>{status}</p>}
            </div>
          <p className="create-p">
            Already have an account?
            <a href="/login" className="create-link">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

