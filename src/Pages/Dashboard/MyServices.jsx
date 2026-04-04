import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { mockUserServices } from '../../data/dashboardData';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEllipsisV, FaChartLine, FaTrash, FaEdit } from 'react-icons/fa';

import api from '../../api/axios';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: '', price: '', type: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data);
      setError(null);
    } catch (err) {
      setError('Unable to load services. Make sure your Laravel server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/services', {
        ...newService,
        status: 'active'
      });
      setServices([response.data, ...services]);
      setIsModalOpen(false);
      setNewService({ title: '', price: '', type: '' });
    } catch (err) {
      alert('Error creating service: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>My Services</motion.h1>
          <p style={{ color: 'var(--dash-text-muted)' }}>Manage your offers and track their performance.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--dash-accent)', 
            color: '#fff', 
            border: 'none', 
            padding: '1rem 2rem', 
            borderRadius: '12px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: '600',
            boxShadow: '0 8px 25px var(--dash-gold-glow)'
          }}
        >
          <FaPlus /> Add New Service
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '40px', height: '40px', border: '4px solid var(--dash-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#ef4444' }}>
           <h3>Oops! {error}</h3>
           <button onClick={fetchServices} style={{ marginTop: '1rem', background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '10px', cursor: 'pointer' }}>Try Again</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-glass"
                style={{ 
                  background: 'white', 
                  border: '1px solid var(--glass-border)', 
                  padding: '1.5rem', 
                  borderRadius: '24px',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ background: 'rgba(188, 73, 49, 0.05)', color: 'var(--dash-accent)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {service.type || 'Activity'}
                  </span>
                  <FaEllipsisV style={{ color: 'var(--dash-text-muted)', cursor: 'pointer' }} />
                </div>

                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{service.title}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--dash-accent)', margin: '0.5rem 0' }}>{service.price}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <FaChartLine style={{ color: '#10b981' }} />
                      <span>{service.bookings_count || 0} Bookings</span>
                   </div>
                   <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'rgba(188, 73, 49, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--dash-accent)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                      <button style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Service Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: 'white', border: '1px solid var(--glass-border)', padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
            >
              <h2 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Define New Service</h2>
              <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)' }}>Service Title</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'var(--dash-text)', outline: 'none' }}
                    value={newService.title}
                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)' }}>Price</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 500 MAD"
                            required
                            style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'var(--dash-text)', outline: 'none' }}
                            value={newService.price}
                            onChange={(e) => setNewService({...newService, price: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dash-text-muted)' }}>Category</label>
                        <select 
                            style={{ width: '100%', background: '#F8F7F4', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'var(--dash-text)', outline: 'none' }}
                            value={newService.type}
                            onChange={(e) => setNewService({...newService, type: e.target.value})}
                        >
                            <option value="">Select...</option>
                            <option value="Hébergement">Hébergement</option>
                            <option value="Guide">Guide</option>
                            <option value="Transport">Transport</option>
                            <option value="Activités">Activités</option>
                        </select>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" style={{ flex: 2, background: 'var(--dash-accent)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Create Service</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'none', border: '1px solid var(--glass-border)', color: 'var(--dash-text)', padding: '1rem', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyServices;
