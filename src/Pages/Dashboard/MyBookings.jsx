import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaHourglassHalf, FaRegCreditCard } from 'react-icons/fa';

const StatusBadge = ({ status }) => {
  const styles = {
    completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Completed' },
    confirmed: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Confirmed' },
    pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Pending' }
  };
  const config = styles[status] || styles.pending;
  
  return (
    <span style={{ 
      background: config.bg, 
      color: config.color, 
      padding: '0.4rem 0.8rem', 
      borderRadius: '50px', 
      fontSize: '0.75rem', 
      fontWeight: '700',
      textTransform: 'uppercase'
    }}>
      ● {config.label}
    </span>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-bookings');
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Connection refused. Please start your Laravel server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-title-section">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>My Bookings</motion.h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>Follow your confirmed trips and pending service requests.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid var(--dash-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#ef4444' }}>
           <p>{error}</p>
           <button onClick={fetchBookings} style={{ background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'pointer', marginTop: '1rem' }}>Retry</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence>
            {bookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="card-glass"
                style={{ 
                  background: 'white', 
                  border: '1px solid var(--glass-border)', 
                  padding: '1.5rem 2rem', 
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '2rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(188, 73, 49, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dash-accent)', fontSize: '1.5rem' }}>
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{booking.service?.title || 'Service Title'}</h3>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--dash-text-muted)' }}>Provided by {booking.provider?.name || 'Local Host'}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaHistory /> {booking.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaRegCreditCard /> {booking.service?.price || '0 MAD'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <StatusBadge status={booking.status} />
                  <button style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>Details</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {bookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
              <FaHourglassHalf style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <h3>No bookings found yet.</h3>
              <p>Start your journey by choosing a service in Marrakech!</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyBookings;
