import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/home';
  const { t } = useTranslation();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={`home-navbar ${isScrolled || !isHomePage ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <Link to="/home">
          <img src="/logo picter/logo.png" alt="VibKech Logo" className="brand-logo" />
        </Link>
      </div>

      <div className="nav-links desktop-only">
        <Link to="/home" className={isHomePage ? 'active' : ''}>{t('nav.home')}</Link>
        <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>{t('nav.explore')}</Link>
        <Link to="/planning" className={location.pathname === '/planning' ? 'active' : ''}>{t('nav.planning')}</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>{t('nav.about')}</Link>
      </div>

      <div className="nav-buttons desktop-only">
        <button onClick={toggleTheme} className="theme-toggle-btn" style={{ background: 'transparent', border: 'none', color: isScrolled || !isHomePage ? 'var(--text-dark)' : '#fff', cursor: 'pointer', fontSize: '1.2rem', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
          {isDarkMode ? <FaSun color="#F59E0B" /> : <FaMoon />}
        </button>
        <LanguageSwitcher />
        {user ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <span className="user-name">{t('nav.hello')}, {user.name}</span>
            </Link>
            <button onClick={handleLogout} className="btn-logout">{t('nav.logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">{t('nav.login')}</Link>
            <Link to="/register" className="btn-register">{t('nav.register')}</Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-drawer"
          >
            <div className="drawer-header">
               <img src="/logo picter/logo.png" alt="Logo" style={{ height: '40px' }} />
               <button onClick={toggleMobileMenu}><FaTimes /></button>
            </div>

            <div className="drawer-links">
              <Link to="/home" onClick={toggleMobileMenu}>{t('nav.home')}</Link>
              <Link to="/explore" onClick={toggleMobileMenu}>{t('nav.explore')}</Link>
              <Link to="/planning" onClick={toggleMobileMenu}>{t('nav.planning')}</Link>
              <Link to="/about" onClick={toggleMobileMenu}>{t('nav.about')}</Link>
              <button 
                onClick={toggleTheme} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', fontSize: '1.2rem', margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                {isDarkMode ? <><FaSun color="#F59E0B" /> {t('nav.light_mode') || 'Light Mode'}</> : <><FaMoon /> {t('nav.dark_mode') || 'Dark Mode'}</>}
              </button>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(188, 73, 49, 0.1)', margin: '1rem 0' }} />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={toggleMobileMenu}><FaUser /> {t('nav.dashboard')}</Link>
                  <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="btn-logout-mobile"><FaSignOutAlt /> {t('nav.logout')}</button>
                </>
              ) : (
                <div className="drawer-auth">
                  <Link to="/login" className="btn-login-mobile" onClick={toggleMobileMenu}>{t('nav.login')}</Link>
                  <Link to="/register" className="btn-register-mobile" onClick={toggleMobileMenu}>{t('nav.register')}</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
