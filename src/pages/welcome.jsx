import React, { useEffect, useState } from 'react';
import './style/welcome.css';

export default function Welcome() {
  const [firstname, setName] = useState('');

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
    window.open('https://krissy05-td.github.io/kristensfolio/', '_blank', 'noopener noreferrer');
  };

  return (
    <div className="welcome">
      <button type="button" id="wel-mit" onClick={handleSignOut}>
        Sign Out
      </button>
      <form className="all">
        <div className="form">
          <h1>Welcome, {firstname}!</h1>
          <p className="welcome">We're glad to have you here.
          <p>
            Check out my portfolio to know more about me. <br></br>
            <button type='button' onClick={handlePortfolioClick} target="_blank" rel="noopener noreferrer"> 
              My Portfolio
            </button>
          </p>
          </p>
        </div>
      </form>
    </div>
  );
}
