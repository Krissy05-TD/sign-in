import React, { useEffect, useState } from 'react';
import './style/welcome.css';

export default function Welcome() {
  const [firstname, setFirstName] = useState('');

  useEffect(() => {
    // Retrieve the name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setFirstName(storedName);
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
      <nav id="hamburger-nav">
        <div class="hamburger-menu">
            <div class="hamburger-icon" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="menu-links">
                <li><a href="#about" onclick="toggleMenu()">About</a></li>
                <li><a href="#experience" onclick="toggleMenu()">Experience</a></li>
                <li><a href="#contact" onclick="toggleMenu()">Contact</a></li>
            </div>
        </div>
    </nav>
      <br/>
      <form className="all">
        <div className="form">
          <h1 className='wel-h1'>Hello, {firstname}
            <img
            className='star'
            src='shining.png'
            alt='star '
            />!</h1>

          <p className="welcome">Welcome to my first Project.
          <p>
            Check out my portfolio to learn more about me. <br></br>
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
