import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaHourglassHalf, FaRegCreditCard } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const styles = {
    completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: t('bookings.status.completed', 'Completed') },
    confirmed: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: t('bookings.status.confirmed', 'Confirmed') },
    accepted: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: t('bookings.status.accepted', 'Accepted') },
    pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: t('bookings.status.pending', 'Pending') },
    rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: t('bookings.status.rejected', 'Rejected') }
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
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem'
    }}>
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>•</span> {config.label}
    </span>
  );
};

const MyBookings = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/my-bookings');
      const dataArray = response.data.data !== undefined ? response.data.data : response.data;
      setBookings(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      if (err.response) {
        setError(t('common.error_status', { status: err.response.status }));
      } else if (err.request) {
        setError(t('common.connection_error', 'Connection refused. Please start your Laravel server.'));
      } else {
        setError(t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className={`my-bookings-container ${isRTL ? 'rtl-mode' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="dashboard-title-section" style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <motion.h1 initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}>
            {t('nav.bookings', 'My Bookings')}
          </motion.h1>
          <p style={{ color: 'var(--dash-text-muted)' }}>
            {t('bookings.subtitle', 'Follow your confirmed trips and pending service requests.')}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid var(--dash-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#ef4444' }}>
             <p>{error}</p>
             <button onClick={fetchBookings} style={{ background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '10px', cursor: 'pointer', marginTop: '1rem' }}>
               {t('common.retry', 'Retry')}
             </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {bookings.map((booking, index) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
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
                    boxShadow: 'var(--shadow-sm)',
                    flexDirection: isRTL ? 'row-reverse' : 'row'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(188, 73, 49, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dash-accent)', fontSize: '1.5rem' }}>
                      <FaCalendarAlt />
                    </div>
                    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{booking.service?.title || t('common.service')}</h3>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--dash-text-muted)' }}>
                        {t('bookings.providedBy', 'Provided by')} {booking.provider?.name || t('common.host')}
                      </p>
                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaHistory /> {booking.date || booking.start_date}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaRegCreditCard /> {booking.service?.price || '0'} {t('common.mad')}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <StatusBadge status={booking.status} />
                    <button style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}>
                      {t('common.details', 'Details')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {bookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
                <FaHourglassHalf style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                <h3>{t('bookings.noResults', 'No bookings found yet.')}</h3>
                <p>{t('bookings.startJourney', 'Start your journey by choosing a service in Marrakech!')}</p>
              </div>
            )}
          </div>
        )
      }
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;
