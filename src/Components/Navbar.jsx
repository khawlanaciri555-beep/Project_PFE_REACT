import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`home-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <img src="/logo picter/logo.png" alt="VibKech Logo" className="brand-logo" />
      </div>
      <div className="nav-links">
        <Link to="/" className="active">Explore</Link>
        <Link to="#">About</Link>
        <Link to="#">Services</Link>
      </div>
      <div className="nav-buttons">
        <Link to="#" className="btn-logout">Logout</Link>
        <Link to="#" className="btn-login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
