import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-topbar">
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: '#f1f1f1', padding: '0.6rem 1.25rem', borderRadius: '12px' }}>
        <FaSearch style={{ color: 'var(--dash-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search in dashboard..." 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--dash-text)', 
            marginLeft: '1rem', 
            outline: 'none', 
            fontSize: '0.9rem'
          }} 
        />
      </div>

      <div className="topbar-actions">
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--dash-text-muted)', 
            fontSize: '1.2rem', 
            cursor: 'pointer', 
            marginRight: '1.5rem',
            position: 'relative'
          }}
        >
          <FaBell />
          <span 
            style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              background: 'var(--dash-accent)', 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%',
              border: '2px solid #fff'
            }}
          />
        </button>

        <div className="user-info-group">
          <div style={{ textAlign: 'right', marginRight: '1rem' }}>
            <p style={{ margin: 0, fontWeight: '800', fontSize: '0.9rem', color: 'var(--dash-text)' }}>{user?.name || 'Guest User'}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dash-text-muted)', textTransform: 'capitalize', fontWeight: '600' }}>{user?.role || 'tourist'}</p>
          </div>
          <div className="user-avatar">
            {user?.name ? user.name[0].toUpperCase() : <FaUserCircle style={{ fontSize: '2rem' }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
