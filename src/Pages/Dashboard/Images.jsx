import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaTrash, FaImage } from 'react-icons/fa';
import api from '../../api/axios';

const Images = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optional: Fetch images from a backend endpoint if available.
    // For now, it maintains local state as mock.
    setImages([
      { id: 1, url: 'https://images.unsplash.com/photo-1549488344-c1146313f8c8?auto=format&fit=crop&q=80', name: 'Riad Entrance' },
      { id: 2, url: 'https://images.unsplash.com/photo-1489659092419-5d4750a9fc7e?auto=format&fit=crop&q=80', name: 'Courtyard' }
    ]);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'provider_images');

    try {
      setLoading(true);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Append the new uploaded image
      setImages([...images, { id: Date.now(), url: res.data.url, name: file.name }]);
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="dashboard-title-section">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>My Images</motion.h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>Manage your public photo gallery.</p>
      </div>

      <div style={{ padding: '2rem', background: 'white', border: '1px dashed var(--dash-accent)', borderRadius: '24px', textAlign: 'center', marginBottom: '2rem' }}>
        <input type="file" id="imageUpload" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
        <label htmlFor="imageUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FaCloudUploadAlt style={{ fontSize: '3rem', color: 'var(--dash-accent)' }} />
          <div>
            <h3 style={{ margin: 0 }}>{loading ? 'Uploading...' : 'Click to Upload Image'}</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--dash-text-muted)', fontSize: '0.85rem' }}>JPEG, PNG up to 2MB</p>
          </div>
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {images.map(img => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card-glass"
              style={{ position: 'relative', height: '200px', borderRadius: '16px', overflow: 'hidden' }}
            >
              <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.name}</span>
                <button onClick={() => handleDelete(img.id)} style={{ background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}>
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {images.length === 0 && !loading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--dash-text-muted)' }}>
             <FaImage style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
             <p>No images uploaded yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Images;
