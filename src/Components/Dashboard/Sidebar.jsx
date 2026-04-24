import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const location = useLocation();
  const role = user?.role || 'tourist';

  // Navigation items based on role
  const navItems = {
    tourist: [
      { path: '/dashboard', label: t('dashboard.sidebar.home'), icon: <FaHome /> },
      { path: '/dashboard/favorites', label: t('dashboard.sidebar.myFavorites'), icon: <FaHeart /> },
      { path: '/dashboard/my-bookings', label: t('dashboard.sidebar.myBookings'), icon: <FaCalendarAlt /> },
    ],
    hotel: [
      { path: '/dashboard', label: t('dashboard.sidebar.home'), icon: <FaHome /> },
      { path: '/dashboard/profile', label: t('dashboard.sidebar.myProfile'), icon: <FaUser /> },
      { path: '/dashboard/services', label: t('dashboard.sidebar.myServices'), icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: t('dashboard.sidebar.myDemandes'), icon: <FaClipboardList /> },
    ],
    guide: [
      { path: '/dashboard', label: t('dashboard.sidebar.home'), icon: <FaHome /> },
      { path: '/dashboard/profile', label: t('dashboard.sidebar.myProfile'), icon: <FaUser /> },
      { path: '/dashboard/services', label: t('dashboard.sidebar.expeditions'), icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: t('dashboard.sidebar.incomingRequests'), icon: <FaClipboardList /> },
    ],
    transport: [
      { path: '/dashboard', label: t('dashboard.sidebar.home'), icon: <FaHome /> },
      { path: '/dashboard/profile', label: t('dashboard.sidebar.myProfile'), icon: <FaUser /> },
      { path: '/dashboard/services', label: t('dashboard.sidebar.vehicles'), icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: t('dashboard.sidebar.rideRequests'), icon: <FaClipboardList /> },
    ],
    coop: [
      { path: '/dashboard', label: t('dashboard.sidebar.home'), icon: <FaHome /> },
      { path: '/dashboard/profile', label: t('dashboard.sidebar.myProfile'), icon: <FaUser /> },
      { path: '/dashboard/services', label: t('dashboard.sidebar.products'), icon: <FaBriefcase /> },
      { path: '/dashboard/bookings', label: t('dashboard.sidebar.visitRequests'), icon: <FaClipboardList /> },
    ]
  };

  const currentNav = navItems[role] || navItems.tourist;

  return (
    <div className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="sidebar-toggle-btn desktop-only" 
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? t('dashboard.sidebar.expand') : t('dashboard.sidebar.collapse')}
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
            {!isCollapsed && <span className="nav-label">{t('dashboard.sidebar.settings')}</span>}
          </Link>
        )}
        <button 
          onClick={logout} 
          className="nav-item" 
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="nav-icon"><FaSignOutAlt /></span>
          {!isCollapsed && <span className="nav-label">{t('dashboard.sidebar.logout')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
