import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';
import ServiceMap from '../Components/Explore/ServiceMap';
import FavoriteButton from '../Components/FavoriteButton';
import RatingStars from '../Components/RatingStars';
import { FaThLarge, FaMapMarkedAlt, FaCommentDots } from 'react-icons/fa';
import './Explore.css';
import getImageUrl from '../utils/imageUrl';

const Explore = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/places');
        setItems(response.data.data ? response.data.data : response.data);
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
          <video autoPlay loop muted playsInline className="explore-hero-video">
            <source src="/background/backExplore.mp4" type="video/mp4" />
          </video>
          <div className="max-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="explore-hero-card"
            >
              <span className="section-eyebrow">{t('explore.title').toUpperCase()}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="explore-title">{t('explore.title')}</h1>
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
                     <FaThLarge /> {t('explore.grid')}
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
                     <FaMapMarkedAlt /> {t('explore.map')}
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
                <Link
                  key={place.id}
                  to={`/place/${place.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -10 }}
                    className="destination-card new-card"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="new-card-image-wrap">
                      <FavoriteButton 
                        placeId={place.id} 
                        initialIsFavorited={place.is_favorited} 
                        initialFavoriteId={place.favorite_id}
                      />
                      <img src={getImageUrl(place.image) || '/logo picter/placeholder.jpg'} alt={place.title} />
                      <div className="image-overlay">
                        <span className="new-card-tag">{place.category || place.type}</span>
                        <h3 className="new-card-title">{place.title}</h3>
                      </div>
                    </div>
                    <div className="new-card-content">
                      <div style={{ marginBottom: '0.8rem' }}>
                        <RatingStars rating={place.rating_avg} showCount={false} size={14} />
                      </div>
                      <p>{place.description || t('explore.defaultDescription')}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                         <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{place.price}</span>
                         <span className="new-link-text" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{t('explore.seeMore')} &rarr;</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               transition={{ duration: 0.5 }}
               style={{ height: '70vh', minHeight: '500px', width: '100%', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            >
               <ServiceMap items={items} />
            </motion.div>
          )}

          {!loading && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0', opacity: 0.6 }}>
               <h3>{t('explore.noResults')}</h3>
               <p>{t('common.error')}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
