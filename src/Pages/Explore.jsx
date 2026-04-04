import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../api/axios';
import ServiceMap from '../Components/Explore/ServiceMap';
import { FaThLarge, FaMapMarkedAlt } from 'react-icons/fa';
import './Explore.css';

const Explore = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/services');
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching explore data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, []);

  return (
    <Layout>
      <div className="explore-page">
        <div className="explore-hero">
          <div className="max-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="explore-hero-card"
            >
              <span className="section-eyebrow">DÉCOUVREZ TOUTE LA VILLE</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="explore-title">Explorer Marrakech</h1>
                    <p className="explore-subtitle">
                        Des palais impériaux aux jardins secrets, découvrez chaque recoin de la ville ocre.
                    </p>
                </div>
                <div className="view-toggle-container" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem', borderRadius: '12px', display: 'flex', border: '1px solid rgba(255,255,255,0.2)' }}>
                   <button 
                     onClick={() => setViewMode('grid')}
                     style={{ 
                       background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                       color: '#fff',
                       border: 'none',
                       padding: '0.6rem 1.25rem',
                       borderRadius: '8px',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '0.6rem',
                       fontWeight: '600',
                       transition: '0.3s'
                     }}
                   >
                     <FaThLarge /> Grille
                   </button>
                   <button 
                     onClick={() => setViewMode('map')}
                     style={{ 
                        background: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                        color: '#fff',
                        border: 'none',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontWeight: '600',
                        transition: '0.3s'
                     }}
                   >
                     <FaMapMarkedAlt /> Carte
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '50px', height: '50px', border: '5px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="explore-grid"
            >
              {items.map((place) => (
                <motion.div
                  key={place.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -10 }}
                  className="destination-card new-card"
                >
                  <div className="new-card-image-wrap">
                    <img src={place.image || '/logo picter/placeholder.jpg'} alt={place.title} />
                    <div className="image-overlay">
                      <span className="new-card-tag">{place.category || place.type}</span>
                      <h3 className="new-card-title">{place.title}</h3>
                    </div>
                  </div>
                  <div className="new-card-content">
                    <p>{place.description || 'Une expérience inoubliable au cœur de Marrakech.'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                       <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{place.price}</span>
                       <Link to={`/place/${place.id}`} className="new-btn-detail">Détail &rarr;</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
               <ServiceMap items={items} />
            </motion.div>
          )}

          {!loading && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.6 }}>
               <h3>Aucun résultat trouvé.</h3>
               <p>Essayez d'autres filtres ou revenez plus tard.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
