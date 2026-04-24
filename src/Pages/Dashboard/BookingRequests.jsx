import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import BookingCard from '../../Components/Dashboard/BookingCard';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';

const BookingRequests = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      const dataArray = response.data.data !== undefined ? response.data.data : response.data;
      setRequests(Array.isArray(dataArray) ? dataArray : []);
    } catch (err) {
      console.error('Error fetching requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      alert(t('dashboard.requests.updateError'));
    }
  };

  const pending = requests.filter(r => r.status === 'pending');
  const past = requests.filter(r => r.status !== 'pending');

  return (
    <DashboardLayout>
      <div className="dashboard-title-section">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {t('dashboard.requests.title')}
        </motion.h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>{t('dashboard.requests.subtitle')}</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid var(--dash-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {t('dashboard.requests.pendingTitle')} <span style={{ background: 'var(--dash-accent)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '50px' }}>{pending.length}</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <AnimatePresence>
                {pending.map(req => (
                  <BookingCard key={req.id} request={req} onStatusChange={handleStatusChange} />
                ))}
              </AnimatePresence>
              {pending.length === 0 && <p style={{ color: 'var(--dash-text-muted)' }}>{t('dashboard.requests.noPending')}</p>}
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--dash-text-muted)' }}>{t('dashboard.requests.historyTitle')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', opacity: 0.8 }}>
              {past.map(req => (
                <BookingCard key={req.id} request={req} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default BookingRequests;
