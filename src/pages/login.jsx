import React, { useState, useRef } from "react";
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { addDoc, collection } from "@firebase/firestore";
import "./style/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(false);
  const usersCollection = collection(firestore, "users");

  const messageRef = useRef();
  const ref = collection(firestore, "messages");

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(messageRef.current.value);

    // Example validation logic (customize as needed)
    if (!username || !password) {
      setError(true);
      return;
    }

    setError(false);

    // You can optionally log user data or perform actions on successful login
    const data = {
      username,
      password,
    };

    try {
      addDoc(ref,data);
    }catch (e) {
        console.log(e);
    };

    try {
      console.log("Login data:", data); // Log user login attempt
      window.location.href = "/welcome"; // Redirect to welcome page
    } catch (e) {
      console.error("Error during login:", e);
    }
  };

  return (
    <div className="login">
      {/* Left Section */}
      <div className="login-left">
        <div>
          <h1>
            <img src="logo.jpeg" alt="Four Leaf Clover" /> Project 1
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <form
          className="login-form-grid"
          id="login-form"
          onSubmit={handleFormSubmit}
        >
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="login-password-container">
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}"
            />
            <img
              id="login-img"
              src={passwordVisible ? "open.png" : "closed.png"}
              alt="Toggle Password"
              width="20"
              height="20"
              onClick={togglePasswordVisibility}
            />
          </div>

          {error && (
            <p className="error" style={{ color: "red" }}>
              * Username and password are required!
            </p>
          )}

          <div className="login-with-container">
            <p className="login-icons">Or you can login with</p>
            <div className="icon-container">
              <img
                className="gmail-icon"
                src="gmail.png"
                alt="Gmail"
                onClick={() => window.location.href = "https://gmail.com/"}
              />
              <img
                className="facebook-icon"
                src="facebook.png"
                alt="Facebook"
                onClick={() => window.location.href = "https://facebook.com/"}
              />
              <img
                className="apple-icon"
                src="apple.png"
                alt="Apple"
                onClick={() => window.location.href = "https://appleid.apple.com/"}
              />
            </div>
          </div>
        </form>

        <button
          id="login-submitButton"
          type="submit"
          onClick={handleFormSubmit}
        >
          Login
        </button>
        <a href="/forgot" className="forgot-password">
          Forgot your password?
        </a>
        <p className="login-link">
          Don't have an account yet? <a href="/create">Create Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
