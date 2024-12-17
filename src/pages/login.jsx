import React, { useState } from "react";
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { collection, getDocs, query, where } from "@firebase/firestore";
import "./style/login.css";

export default function Login() {
  const ref = collection(firestore, "users"); // Assuming "users" collection stores registered accounts

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username and password are required!");
      return;
    }

    try {
      // Check if the username exists
      const usernameQuery = query(ref, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (usernameSnapshot.empty) {
        alert("This user does not exist. Please create an account.");
        return;
      }

      // Check if the password matches
      const loginQuery = query(
        ref,
        where("username", "==", username),
        where("password", "==", password)
      );
      const loginSnapshot = await getDocs(loginQuery);

      if (loginSnapshot.empty) {
        alert("Incorrect username or password.");
        return;
      }

      // Redirect to the welcome page if login is successful
      console.log("Login successful for:", username);
      window.location.href = "/welcome";
    } catch (err) {
      console.error("Error during login:", err);
      alert("An error occurred. Please try again.");
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
        <form id="login-form" onSubmit={handleSave}>
          <div className="one">
            <label htmlFor="username" className="user">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="two">
            <div className="login-password-container">
              <label htmlFor="password" className="pass-bel">
                Password
              </label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="log-pass"
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
            <div className="l-checkbox">
              <label htmlFor="remember-me">
                <input type="checkbox" id="remember-me" />
                Remember Me
              </label>
            </div>
          </div>
        </form>
        <div className="button-container">
          <button id="login-submitButton" type="submit" onClick={handleSave}>
            Login
          </button>
          <a href="/forgot" className="forgot-password">
            Forgot your password?
          </a>
        </div>
        <p className="login-link">
          Don't have an account yet?{" "}
          <a href="/create" className="login-a">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
