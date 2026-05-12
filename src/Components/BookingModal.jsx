import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaPen, FaTimes, FaCheckCircle, FaBed } from 'react-icons/fa';
import api from '../api/axios';

const BookingModal = ({ isOpen, onClose, service, onConfirm }) => {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    guests: 1,
    notes: '',
    service_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [providerServices, setProviderServices] = useState([]);

  useEffect(() => {
    if (isOpen && service?.is_provider_only) {
      // Fetch provider data to get its services
      const type = service.provider_type === 'coop' ? 'cooperatives' : (service.provider_type + 's');
      api.get(`/${type}/${service.provider_id}`).then(res => {
        setProviderServices(res.data.data?.services || res.data?.services || []);
      }).catch(err => console.error(err));
    }
  }, [isOpen, service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error sending booking request. Please try again.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(26, 24, 23, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          style={{ background: '#F8F7F4', width: '100%', maxWidth: '500px', borderRadius: '32px', overflow: 'hidden', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(188, 73, 49, 0.1)' }}
        >
          {isSuccess ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                <FaCheckCircle style={{ fontSize: '5rem', color: '#10b981', marginBottom: '2rem' }} />
              </motion.div>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '1rem' }}>Demande Envoyée !</h2>
              <p style={{ color: '#524E4A' }}>Votre demande de réservation pour <strong>{service.title}</strong> a été transmise avec succès. Vous recevrez une notification dès qu'elle sera confirmée.</p>
            </div>
          ) : (
            <>
              <div style={{ background: 'var(--primary)', padding: '2rem', color: '#fff', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaTimes />
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8, display: 'block', marginBottom: '0.5rem' }}>Réservation</span>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.75rem' }}>{service.title}</h2>
                {!service.is_provider_only && <div style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.9 }}>{service.price} / expérience</div>}
              </div>

              <form onSubmit={handleSubmit} style={{ padding: '2.5rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  
                  {service.is_provider_only && (
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontWeight: '700', color: '#1A1817' }}>
                        <FaBed style={{ color: 'var(--primary)' }} /> Choisissez un service
                      </label>
                      <select 
                        required 
                        className="premium-input"
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '1rem', outline: 'none' }}
                        value={formData.service_id}
                        onChange={(e) => setFormData({...formData, service_id: e.target.value})}
                      >
                        <option value="">Sélectionnez un service...</option>
                        {providerServices.map(s => (
                          <option key={s.id} value={s.id}>{s.title} - {s.price} MAD</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontWeight: '700', color: '#1A1817' }}>
                        <FaCalendarAlt style={{ color: 'var(--primary)' }} /> Date de début
                      </label>
                      <input 
                        type="date" 
                        required 
                        className="premium-input"
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '1rem', outline: 'none' }}
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontWeight: '700', color: '#1A1817' }}>
                        <FaCalendarAlt style={{ color: 'var(--primary)' }} /> Date de fin
                      </label>
                      <input 
                        type="date" 
                        required 
                        className="premium-input"
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '1rem', outline: 'none' }}
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontWeight: '700', color: '#1A1817' }}>
                      <FaUsers style={{ color: 'var(--primary)' }} /> Nombre de personnes
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      required 
                      className="premium-input"
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '1rem', outline: 'none' }}
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', fontWeight: '700', color: '#1A1817' }}>
                      <FaPen style={{ color: 'var(--primary)' }} /> Besoins Spécifiques (Optionnel)
                    </label>
                    <textarea 
                      placeholder="Ex: Régime alimentaire, heure d'arrivée..." 
                      className="premium-input"
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: '1rem', outline: 'none', height: '100px', resize: 'none' }}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="reserve-btn-full"
                    style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Traitement...' : 'Confirmer la demande'}
                  </motion.button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
