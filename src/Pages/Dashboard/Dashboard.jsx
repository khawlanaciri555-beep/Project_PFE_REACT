import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import {
  FaHeart, FaCalendarCheck, FaClock, FaStar,
  FaBriefcase, FaListUl, FaUserTie
} from 'react-icons/fa';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import api from '../../api/axios';

const StatCard = ({ icon, value, label, delay, loading }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card"
  >
    <div className="stat-card-header">
      <div className="stat-icon-box">{icon}</div>
      {!loading && <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '600' }}>+12%</div>}
    </div>
    {loading ? (
      <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ height: '2.2rem', width: '60px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '0.5rem' }} />
    ) : (
      <span className="stat-value">{value}</span>
    )}
    <span className="stat-label">{label}</span>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = user?.role || 'tourist';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
        // Fallback to empty stats if API fails
        setStats({ favorites: 0, bookings: 0, pending: 0, rating: 4.8, services: 0, requests: 0, clients: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderTouristDashboard = () => (
    <>
      <div className="dashboard-title-section">
        <h1>Welcome Back, {user?.name || 'Explorer'}!</h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>Here's what's happening with your Marrakech adventures today.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaHeart />} value={stats?.favorites || 0} label="My Favorites" delay={0.1} loading={loading} />
        <StatCard icon={<FaCalendarCheck />} value={stats?.bookings || 0} label="Booked Trips" delay={0.2} loading={loading} />
        <StatCard icon={<FaClock />} value={stats?.pending || 0} label="Pending Requests" delay={0.3} loading={loading} />
        <StatCard icon={<FaStar />} value={stats?.rating || 4.8} label="Your Rating" delay={0.4} loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card-glass" style={{ background: 'white', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--dash-accent)' }}>Recent Recommendations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[1, 2, 3].map(i => (
               <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                 <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: '#f1f1f1' }} />
                 <div>
                   <h4 style={{ margin: 0 }}>Palais de la Bahia</h4>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--dash-text-muted)' }}>Recommended based on your visit to Koutoubia</p>
                 </div>
                 <button style={{ marginLeft: 'auto', background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>View</button>
               </div>
             ))}
          </div>
        </div>

        <div className="card-glass" style={{ background: 'white', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--dash-accent)' }}>Upcoming Bookings</h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--dash-text-muted)' }}>
            No upcoming bookings for today. <br/> <br/>
            <button style={{ color: 'var(--dash-accent)', background: 'none', border: '1px solid var(--dash-accent)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Browse Places</button>
          </div>
        </div>
      </div>
    </>
  );

  const renderProfessionalDashboard = () => (
    <>
      <div className="dashboard-title-section">
        <h1>Welcome, {user?.name || 'Partner'}!</h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>Overview of your business performance in Marrakech.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaBriefcase />} value={stats?.services || 0} label="Total Services" delay={0.1} loading={loading} />
        <StatCard icon={<FaListUl />} value={stats?.requests || 0} label="Total Requests" delay={0.2} loading={loading} />
        <StatCard icon={<FaUserTie />} value={stats?.clients || 0} label="Active Clients" delay={0.3} loading={loading} />
        <StatCard icon={<FaStar />} value={stats?.rating || 4.9} label="Rating" delay={0.4} loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card-glass" style={{ background: 'white', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--dash-accent)' }}>Pending Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[1, 2].map(i => (
               <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                 <div className="user-avatar" style={{ width: '40px', height: '40px' }}>T</div>
                 <div>
                   <h4 style={{ margin: 0 }}>Tourist {i}</h4>
                   <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--dash-text-muted)' }}>Requested for Oct 12, 2024</p>
                 </div>
                 <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button style={{ background: '#10b981', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Accept</button>
                    <button style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="card-glass" style={{ background: 'white', border: '1px solid var(--glass-border)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--dash-accent)' }}>Recent Reviews</h3>
          <p style={{ color: 'var(--dash-text-muted)', fontStyle: 'italic' }}>"Amazing service, very professional and friendly. Highly recommended!"</p>
          <span style={{ fontSize: '0.8rem', color: 'var(--dash-accent)', fontWeight: '600' }}>- Sarah Muller (Tourist)</span>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      {role === 'tourist' ? renderTouristDashboard() : renderProfessionalDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
