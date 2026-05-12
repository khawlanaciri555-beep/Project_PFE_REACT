import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEllipsisV, FaTrash, FaEdit, FaMapMarkerAlt, FaBed, FaHotel } from 'react-icons/fa';
import api from '../../api/axios';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'hotel',
    name: '',
    phone: '',
    email: '',
    address: '',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-hotels');
      setProperties(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load your properties.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await api.put(`/hotels/${editingProperty.id}`, formData);
      } else {
        await api.post('/hotels', formData);
      }
      fetchProperties();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Check your fields.'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/hotels/${id}`);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const openEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      type: property.type,
      name: property.name || '',
      phone: property.phone || '',
      email: property.email || '',
      address: property.address || '',
      price: property.price || '',
      description: property.description || '',
      image: property.image || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProperty(null);
    setFormData({ type: 'hotel', name: '', phone: '', email: '', address: '', price: '', description: '', image: '' });
  };

  return (
    <DashboardLayout>
      <div className="dashboard-title-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>My Hotels & Riads</motion.h1>
          <p style={{ color: 'var(--dash-text-muted)' }}>Manage your establishments and keep your information up to date.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resetForm(); setIsModalOpen(true); }}
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
            fontWeight: '600'
          }}
        >
          <FaPlus /> Add New Property
        </motion.button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {properties.map((property) => (
            <motion.div 
              key={property.id}
              className="card-glass"
              style={{ background: 'white', border: '1px solid #eee', borderRadius: '24px', overflow: 'hidden' }}
            >
              <div style={{ height: '200px', background: '#f0f0f0', position: 'relative' }}>
                <img src={property.image} alt={property.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(property)} style={{ background: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                    <button onClick={() => handleDelete(property.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--dash-accent)' }}>{property.type}</span>
                <h3 style={{ margin: '0.5rem 0' }}>{property.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <FaMapMarkerAlt /> {property.address}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{property.price} <small>MAD</small></span>
                    <span style={{ color: property.availability ? '#10b981' : '#ef4444' }}>{property.availability ? 'Available' : 'Booked'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Type</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <option value="hotel">Hotel</option>
                                <option value="riad">Riad</option>
                                <option value="villa">Villa</option>
                            </select>
                        </div>
                        <div>
                            <label>Price (MAD/Night)</label>
                            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                    </div>
                    <div>
                        <label>Name</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                    <div>
                        <label>Image URL</label>
                        <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Phone</label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" style={{ flex: 1, background: 'var(--dash-accent)', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {editingProperty ? 'Save Changes' : 'Create Property'}
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#f3f4f6', border: 'none', padding: '1rem 2rem', borderRadius: '12px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyProperties;
