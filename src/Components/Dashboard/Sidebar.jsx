import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaHome, 
  FaHeart, 
  FaCalendarAlt, 
  FaUser, 
  FaCog, 
  FaClipboardList, 
  FaBriefcase, 
  FaStar,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const role = user?.role || 'tourist';

  // Navigation items based on role
  const navItems = {
    tourist: [
      { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
      { path: '/dashboard/favorites', label: 'My Favorites', icon: <FaHeart /> },
      { path: '/dashboard/my-bookings', label: 'My Bookings', icon: <FaCalendarAlt /> },
      { path: '/explore', label: 'Explore Marrakech', icon: <FaStar /> },
    ],
    hotel: [
      { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
      { path: '/dashboard/bookings', label: 'Booking Requests', icon: <FaClipboardList /> },
      { path: '/dashboard/properties', label: 'My Properties', icon: <FaBriefcase /> },
    ],
    guide: [
      { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
      { path: '/dashboard/bookings', label: 'Incoming Requests', icon: <FaClipboardList /> },
      { path: '/dashboard/services', label: 'Expeditions', icon: <FaBriefcase /> },
    ],
    transporteur: [
      { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
      { path: '/dashboard/bookings', label: 'Ride Requests', icon: <FaClipboardList /> },
      { path: '/dashboard/services', label: 'Vehicles', icon: <FaBriefcase /> },
    ],
    cooperative: [
      { path: '/dashboard', label: 'Overview', icon: <FaHome /> },
      { path: '/dashboard/bookings', label: 'Visit Requests', icon: <FaClipboardList /> },
      { path: '/dashboard/services', label: 'Products/Workshops', icon: <FaBriefcase /> },
    ]
  };

  const currentNav = navItems[role] || navItems.tourist;

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-logo desktop-only">
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo picter/logo.png" alt="VibKech" style={{ height: '50px' }} />
          <span style={{ color: 'var(--dash-text)', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '2px' }}>VibKech</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {currentNav.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer desktop-only">
        <Link to="/dashboard/settings" className={`nav-item ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}>
          <span className="nav-icon"><FaCog /></span>
          <span className="nav-label">Settings</span>
        </Link>
        <button 
          onClick={logout} 
          className="nav-item" 
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="nav-icon"><FaSignOutAlt /></span>
          <span className="nav-label">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
