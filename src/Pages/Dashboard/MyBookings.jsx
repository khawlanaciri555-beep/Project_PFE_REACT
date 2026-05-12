import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaHistory, FaCheckCircle, FaHourglassHalf, FaRegCreditCard, FaTimes } from 'react-icons/fa';
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
  const [plannings, setPlannings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsRes, planningsRes] = await Promise.all([
        api.get('/my-bookings'),
        api.get('/plannings')
      ]);
      
      const bData = bookingsRes.data.data !== undefined ? bookingsRes.data.data : bookingsRes.data;
      const pData = planningsRes.data.data !== undefined ? planningsRes.data.data : planningsRes.data;
      
      setBookings(Array.isArray(bData) ? bData : []);
      setPlannings(Array.isArray(pData) ? pData : []);
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

  const handleCancelBooking = async (id) => {
    if (!window.confirm(t('bookings.confirmCancel', 'Are you sure you want to cancel this booking?'))) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
      setSelectedBooking(null);
      alert(t('bookings.cancelSuccess', 'Booking cancelled successfully.'));
    } catch (err) {
      alert(t('bookings.cancelError', 'Error cancelling booking.'));
    }
  };

  return (
    <DashboardLayout>
      <div className={`my-bookings-container ${isRTL ? 'rtl-mode' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="dashboard-title-section" style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '2rem' }}>
          <motion.h1 initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}>
            {t('nav.bookings', 'My Trips')}
          </motion.h1>
          <p style={{ color: 'var(--dash-text-muted)' }}>
            {t('bookings.subtitle', 'Follow your confirmed trips and pending service requests.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
           <button 
             onClick={() => setActiveTab('bookings')}
             style={{
               background: activeTab === 'bookings' ? 'var(--dash-accent)' : 'none',
               color: activeTab === 'bookings' ? '#fff' : 'var(--dash-text)',
               border: 'none',
               padding: '0.6rem 1.5rem',
               borderRadius: '12px',
               cursor: 'pointer',
               fontWeight: '700',
               transition: '0.3s'
             }}
           >
             {t('bookings.tabs.bookings', 'Bookings')}
           </button>
           <button 
             onClick={() => setActiveTab('plannings')}
             style={{
               background: activeTab === 'plannings' ? 'var(--dash-accent)' : 'none',
               color: activeTab === 'plannings' ? '#fff' : 'var(--dash-text)',
               border: 'none',
               padding: '0.6rem 1.5rem',
               borderRadius: '12px',
               cursor: 'pointer',
               fontWeight: '700',
               transition: '0.3s'
             }}
           >
             {t('bookings.tabs.plannings', 'My Plannings')}
           </button>
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
            <AnimatePresence mode="wait">
              {activeTab === 'bookings' ? (
                <motion.div key="bookings-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {bookings.map((booking, index) => (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                        marginBottom: '1.5rem',
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
                            {t('bookings.providedBy', 'Provided by')} {booking.service?.hotel?.name || booking.service?.transport?.name || booking.service?.cooperative?.name || t('common.host')}
                          </p>
                          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaHistory /> {booking.start_date}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaRegCreditCard /> {booking.service?.price || '0'} {t('common.mad')}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <StatusBadge status={booking.status} />
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
                        >
                          {t('common.details', 'Details')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {bookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
                      <FaHourglassHalf style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                      <h3>{t('bookings.noResults', 'No bookings found yet.')}</h3>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="plannings-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {plannings.map((plan, index) => (
                    <motion.div 
                      key={plan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-glass"
                      style={{ 
                        background: 'white', 
                        border: '1px solid var(--glass-border)', 
                        padding: '2rem', 
                        borderRadius: '25px',
                        marginBottom: '2rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                         <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                            <h3 style={{ margin: 0, color: 'var(--dash-accent)', fontSize: '1.4rem' }}>{t('bookings.planning.tripTitle', 'Trip to Marrakech')} #{plan.id}</h3>
                            <p style={{ margin: '0.5rem 0', color: 'var(--dash-text-muted)', fontWeight: '600' }}>
                               <FaCalendarAlt /> {plan.start_date} → {plan.end_date}
                            </p>
                         </div>
                         <div style={{ background: 'rgba(188,73,49,0.1)', color: 'var(--dash-accent)', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '800' }}>
                            {plan.items?.length || 0} {t('bookings.planning.stops', 'Stops')}
                         </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                         {plan.items?.map((item, i) => (
                           <div key={i} style={{ minWidth: '200px', background: 'var(--dash-bg)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--dash-accent)', fontWeight: '800', textTransform: 'uppercase' }}>{t('common.stop')} {i + 1}</span>
                              <h4 style={{ margin: '0.3rem 0', fontSize: '0.95rem' }}>{item.place?.name || item.place?.title}</h4>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dash-text-muted)' }}>{item.time?.substring(0, 5) || '10:00'}</p>
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  ))}
                  {plannings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.5 }}>
                      <FaHourglassHalf style={{ fontSize: '3rem', marginBottom: '1rem' }} />
                      <h3>{t('bookings.noPlannings', 'No saved plannings found.')}</h3>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      }
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '25px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <h2 style={{ margin: 0, color: 'var(--dash-accent)' }}>{t('bookings.detailsTitle', 'Booking Details')}</h2>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}><FaTimes /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: isRTL ? 'right' : 'left' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)', display: 'block' }}>{t('common.service')}</label>
                  <p style={{ margin: '0.2rem 0', fontWeight: '700', fontSize: '1.1rem' }}>{selectedBooking.service?.title}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)', display: 'block' }}>{t('bookings.providedBy', 'Provided by')}</label>
                  <p style={{ margin: '0.2rem 0', fontWeight: '600' }}>{selectedBooking.service?.hotel?.name || selectedBooking.service?.transport?.name || selectedBooking.service?.cooperative?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)', display: 'block' }}>{t('bookings.start_date', 'Start Date')}</label>
                    <p style={{ margin: '0.2rem 0', fontWeight: '600' }}>{selectedBooking.start_date}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)', display: 'block' }}>{t('bookings.end_date', 'End Date')}</label>
                    <p style={{ margin: '0.2rem 0', fontWeight: '600' }}>{selectedBooking.end_date}</p>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--dash-text-muted)', display: 'block' }}>{t('bookings.statusLabel', 'Status')}</label>
                  <div style={{ marginTop: '0.3rem' }}><StatusBadge status={selectedBooking.status} /></div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <button 
                    onClick={() => setSelectedBooking(null)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'none', cursor: 'pointer', fontWeight: '700' }}
                  >
                    {t('common.close', 'Close')}
                  </button>
                  {selectedBooking.status === 'pending' && (
                    <button 
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontWeight: '700' }}
                    >
                      {t('bookings.cancel', 'Cancel Booking')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyBookings;
