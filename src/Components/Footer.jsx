import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="footer-top">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src="/logo picter/logo.png" alt="VibKech Logo" className="brand-logo" />
          </div>
          <p>Experience the soul of Marrakech with curated journeys that blend tradition and modern luxury.</p>
          <div className="social-icons">
            <span>🌍</span>
            <span>🔗</span>
            <span>✉️</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Contact Details</h4>
          <ul>
            <li>✉ contact@alriad.com</li>
            <li>📞 +212 524 430000</li>
            <li>📍 Medina Quarter, Marrakech 44000</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Useful Links</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/explore">Explore Marrakech</Link></li>
            <li><Link to="/planning">Trip Planning</Link></li>
            <li><Link to="/login">Login / Sign Up</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2024 VibKech Marrakech. All rights reserved.</div>
        <div className="footer-bottom-links">
          <span>Majorelle Foundation Partner</span>
          <span>ISO 9001 Certified</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
