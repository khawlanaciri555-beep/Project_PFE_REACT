import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import api from '../api/axios';
import getImageUrl from '../utils/imageUrl';
import './ActivityDetail.css';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/${id}`);
        setService(res.data.data || res.data);
      } catch (err) {
        console.error('Error fetching activity', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            style={{ width: '60px', height: '60px', border: '5px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
          />
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <h2>Activity not found</h2>
          <button onClick={() => navigate(-1)} className="act-back-btn">← Go Back</button>
        </div>
      </Layout>
    );
  }

  const gallery = Array.isArray(service.gallery) && service.gallery.length > 0
    ? service.gallery
    : (service.image ? [service.image] : []);

  // Use the primary/main image for hero (prefer non-copy image)
  const heroImage = gallery.find(img => !img.includes('copy')) || gallery[0] || service.image;
  const heroUrl = getImageUrl(heroImage);

  return (
    <Layout>
      <div className="activity-detail-page">

        {/* HERO — first image full width */}
        <div 
          className="act-hero" 
          style={{ backgroundImage: `url("${heroUrl.replace(/"/g, '%22')}")` }}
        >
          <div className="act-hero-overlay" />
          <div className="act-hero-content">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="act-back-btn"
            >
              ← Back
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="act-type-badge">{service.type}</span>
              <h1 className="act-title">{service.title}</h1>
              {service.price > 0 && (
                <span className="act-price-badge">{service.price} MAD</span>
              )}
            </motion.div>
          </div>
        </div>

        <div className="act-body max-container">

          {/* DESCRIPTION */}
          {service.description && (
            <motion.section
              className="act-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="act-section-title">About this activity</h2>
              <p className="act-description">{service.description}</p>
            </motion.section>
          )}

          {/* PHOTO GALLERY — all images from folder */}
          {gallery.length > 0 && (
            <motion.section
              className="act-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="act-section-title">🖼️ Galerie d'images</h2>
              <div className="act-photo-grid">
                {gallery.map((img, i) => (
                  <motion.div
                    key={i}
                    className={`act-photo-card ${i === 0 ? 'act-photo-featured' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    onClick={() => setLightboxImg(getImageUrl(img))}
                  >
                    <img src={getImageUrl(img)} alt={`${service.title} ${i + 1}`} />
                    <div className="act-photo-overlay">
                      <div className="act-photo-zoom-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                      </div>
                      <span className="act-photo-num">Photo {i + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>

        {/* LIGHTBOX */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              className="act-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
            >
              <motion.img
                src={lightboxImg}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                transition={{ duration: 0.25 }}
                onClick={e => e.stopPropagation()}
              />
              <button className="act-lightbox-close" onClick={() => setLightboxImg(null)}>×</button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
};

export default ActivityDetail;
