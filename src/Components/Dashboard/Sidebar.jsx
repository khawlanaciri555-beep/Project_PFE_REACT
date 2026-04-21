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
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const role = user?.role || 'tourist';

  // Navigation items based on role
  const navItems = {
    tourist: [
      { path: '/dashboard/favorites', label: 'My Favorites', icon: <FaHeart /> },
      { path: '/dashboard/my-bookings', label: 'My Bookings', icon: <FaCalendarAlt /> },
    ],
    hotel: [
      { path: '/dashboard/profile', label: 'My Profile', icon: <FaUser /> },
      { path: '/dashboard/services', label: 'My Services', icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: 'My Demandes', icon: <FaClipboardList /> },
    ],
    guide: [
      { path: '/dashboard/profile', label: 'My Profile', icon: <FaUser /> },
      { path: '/dashboard/services', label: 'Expeditions', icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: 'Incoming Requests', icon: <FaClipboardList /> },
    ],
    transport: [
      { path: '/dashboard/profile', label: 'My Profile', icon: <FaUser /> },
      { path: '/dashboard/services', label: 'Vehicles', icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: 'Ride Requests', icon: <FaClipboardList /> },
    ],
    coop: [
      { path: '/dashboard/profile', label: 'My Profile', icon: <FaUser /> },
      { path: '/dashboard/services', label: 'Products', icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: 'Visit Requests', icon: <FaClipboardList /> },
    ]
  };

  const currentNav = navItems[role] || navItems.tourist;

  return (
    <div className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle-btn desktop-only" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className="sidebar-logo desktop-only">
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo picter/logo.png" alt="VibKech" style={{ height: '50px' }} />
          {!isCollapsed && <span style={{ color: 'var(--dash-text)', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '2px' }}>VibKech</span>}
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
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer desktop-only">
        {role === 'tourist' && (
          <Link to="/dashboard/settings" className={`nav-item ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <span className="nav-icon"><FaCog /></span>
            {!isCollapsed && <span className="nav-label">Settings</span>}
          </Link>
        )}
        <button 
          onClick={logout} 
          className="nav-item" 
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="nav-icon"><FaSignOutAlt /></span>
          {!isCollapsed && <span className="nav-label">Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
