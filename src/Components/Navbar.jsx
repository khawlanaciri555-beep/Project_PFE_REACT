import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/home';

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
        <Link to="/home" className={isHomePage ? 'active' : ''}>Home</Link>
        <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Explore</Link>
        <Link to="/planning" className={location.pathname === '/planning' ? 'active' : ''}>Planning</Link>
        <Link to="#">About</Link>
      </div>

      <div className="nav-buttons desktop-only">
        {user ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <span className="user-name">Hello, {user.name}</span>
            </Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">S'inscrire</Link>
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
              <Link to="/home" onClick={toggleMobileMenu}>Home</Link>
              <Link to="/explore" onClick={toggleMobileMenu}>Explore Marrakech</Link>
              <Link to="/planning" onClick={toggleMobileMenu}>Trip Planner</Link>
              <Link to="#" onClick={toggleMobileMenu}>About Us</Link>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(188, 73, 49, 0.1)', margin: '1rem 0' }} />
              {user ? (
                <>
                  <Link to="/dashboard" onClick={toggleMobileMenu}><FaUser /> Mon Dashboard</Link>
                  <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="btn-logout-mobile"><FaSignOutAlt /> Logout</button>
                </>
              ) : (
                <div className="drawer-auth">
                  <Link to="/login" className="btn-login-mobile" onClick={toggleMobileMenu}>Se connecter</Link>
                  <Link to="/register" className="btn-register-mobile" onClick={toggleMobileMenu}>Créer un compte</Link>
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
