import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };




  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            Math Practice Hub
          </Link>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="menu-icon"></span>
          </button>

          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/topics" onClick={() => setIsMenuOpen(false)}>
                  Topics
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

    </>
  );
};

export default Header;