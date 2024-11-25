import React, { useEffect, useState,useRef } from 'react';
import { firestore } from "../firebase"; // Ensure you have the firebase.js setup
import { addDoc, collection } from "@firebase/firestore";
import './style/welcome.css';

export default function Welcome() {
  const [name, setName] = useState('');

  const messageRef = useRef(); // For collecting the message
  const usersCollection = collection(firestore, "users");

  useEffect(() => {
    // Retrieve the name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleSignOut = () => {
    // Clear the name from localStorage (optional)
    localStorage.removeItem('userName');
    // Redirect to login page
    window.location.href = '/login';
  };

  const handlePortfolioClick = () => {
    // Open the portfolio in a new tab
    window.open('/public/Portfolio.html', '_blank', 'noopener noreferrer');
  };

  return (
    <div className="welcome">
      <button type="button" id="wel-mit" onClick={handleSignOut}>
        Sign Out
      </button>
      <form className="all">
        <div className="form">
          <h1>Welcome, {name}!</h1>
          <p className="welcome">We're glad to have you here.
          <p>
            Check this out to know more about me. 
            <button type='button' onClick={ () => window.location.href="https://krissy05-td.github.io/kristensfolio/"} target="_blank" rel="noopener noreferrer"> 
              My Portfolio
            </button>
          </p>
          </p>
        </div>
      </form>
    </div>
  );
}
