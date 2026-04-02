import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`home-navbar ${isScrolled || !isHomePage ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <Link to="/">
          <img src="/logo picter/logo.png" alt="VibKech Logo" className="brand-logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={isHomePage ? 'active' : ''}>Home</Link>
        <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Explore</Link>
        <Link to="/planning" className={location.pathname === '/planning' ? 'active' : ''}>Planning</Link>
        <Link to="#">About</Link>
      </div>
      <div className="nav-buttons">
        <Link to="#" className="btn-logout">Logout</Link>
        <Link to="#" className="btn-login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
