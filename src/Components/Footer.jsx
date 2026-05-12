import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTwitter, FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-premium">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-section">
            <img src="/logo picter/logo.png" alt="VibKech" />
            <span className="brand-name">VibKech</span>
          </div>
          <p>
            VibKech provides a curated set of experiences and luxury planning tools to help you discover Marrakech 
            in its most beautiful and authentic way, quickly and efficiently.
          </p>
          <div className="social-links-premium">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-group">
            <h5>{t('footer.product') || 'PRODUCT'}</h5>
            <Link to="/explore">Features</Link>
            <Link to="/planning">Pricing</Link>
            <Link to="/services">Integrations</Link>
            <Link to="/explore">Updates</Link>
          </div>
          <div className="footer-group">
            <h5>{t('footer.company') || 'COMPANY'}</h5>
            <Link to="/about">About</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-group">
            <h5>{t('footer.resources') || 'RESOURCES'}</h5>
            <Link to="/docs">Docs</Link>
            <Link to="/community">Community</Link>
            <Link to="/support">Support</Link>
            <Link to="/security">Security</Link>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <p>© 2024 VibKech Marrakech. All rights reserved.</p>
        <div className="legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
