import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import FavoriteButton from '../Components/FavoriteButton';
import RatingStars from '../Components/RatingStars';
import BookingModal from '../Components/BookingModal';
import { Link } from 'react-router-dom';
import { FaCommentDots } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './PlaceDetails.css';
import getImageUrl from '../utils/imageUrl';

// SVG Icons
const Icons = {
  Hotels: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Activites: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/>
    </svg>
  ),
  Transport: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="22" height="13" rx="2"/><path d="M7 21h0"/><path d="M17 21h0"/><path d="M5 21a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/><path d="M2 10h20"/>
    </svg>
  ),
  Restaurants: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
};

const ServiceCard = ({ id, title, hotel_type, type, description, price, rating, image, gallery, index, onBook, onViewGallery, provider_id, provider_type, is_provider_only }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="service-card-modern"
    >
      <div className="card-top">
        <img src={getImageUrl(image) || '/logo picter/placeholder.jpg'} alt={title} className="card-img" />
        <div className="card-type-tag">{hotel_type || type}</div>
      </div>
      
      <div className="card-details">
        <div style={{ marginBottom: '0.4rem' }}>
          <RatingStars rating={rating} size={14} showCount={false} />
        </div>
        
        {price > 0 && <div className="card-price-tag">{price} MAD</div>}
        
        <h3 className="card-name-bold">{title}</h3>
        
        <p className="card-desc-small">{description?.substring(0, 120)}...</p>
        
        <div className="card-bottom-actions">
          {(gallery && gallery.length > 1) || (['Activity', 'Experience', 'Workshop', 'Tour'].includes(type) && image) ? (
            <Link 
              to={`/activity/${id}`}
              className="details-link-arrow"
              style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}
            >
              {t('places.details')} &rarr;
            </Link>
          ) : (
            <Link to={provider_id && provider_type ? `/provider/${provider_type}/${provider_id}` : `#`} className="details-link-arrow">
              {t('places.details')} &rarr;
            </Link>
          )}
          {!is_provider_only && (
            <button 
              className="book-btn-direct"
              onClick={() => onBook({ id, title, price, type, is_provider_only, provider_type, provider_id })}
            >
              {t('places.book')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TabButton = ({ label, active, onClick, IconComponent }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`tab-btn ${active ? 'active' : ''}`}
    layout
  >
    <span className="tab-icon">
      <IconComponent />
    </span>
    {label}
    {active && (
      <motion.div
        layoutId="active-pill"
        className="active-indicator"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </motion.button>
);

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotels');
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [hotelTypeFilter, setHotelTypeFilter] = useState('Tous');
  const [selectedService, setSelectedService] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/places/${id}`);
        setPlace(response.data.data ? response.data.data : response.data);
      } catch (err) {
        console.error('Error fetching place details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceDetails();
  }, [id]);

  useEffect(() => {
    if (place?.images && place.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % place.images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [place]);

  const handleRate = async (value) => {
    if (!user) {
      navigate('/login', { state: { from: `/place/${id}` } });
      return;
    }
    try {
      await api.post('/ratings', { place_id: id, rating: value });
      const response = await api.get(`/places/${id}`);
      setPlace(response.data.data ? response.data.data : response.data);
    } catch (err) {
      console.error('Error submitting rating', err);
    }
  };

  const handleBookClick = (service) => {
    if (!user) {
      navigate('/login', { state: { from: `/place/${id}` } });
      return;
    }
    setSelectedService(service);
  };

  const handleConfirmBooking = async (formData) => {
    await api.post('/bookings', {
      service_id: formData.service_id || selectedService.id,
      user_id: user.id,
      ...formData
    });
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '60px', height: '60px', border: '5px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      </Layout>
    );
  }

  if (!place) {
    return (
      <Layout>
        <div className="not-found" style={{ textAlign: 'center', padding: '10rem 0' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{t('places.notFound')}</h2>
          <button onClick={() => navigate('/')} className="new-btn-detail" style={{ padding: '1rem 2rem' }}>{t('places.backHome')}</button>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'hotels', label: t('places.tabs.accommodation'), icon: Icons.Hotels },
    { id: 'activites', label: t('places.tabs.activities'), icon: Icons.Activites },
    { id: 'restaurants', label: t('places.tabs.restaurants'), icon: Icons.Restaurants },
    { id: 'transport', label: t('places.tabs.transport'), icon: Icons.Transport }
  ];

  let currentServices = place.services?.[activeTab] || [];
  
  if (activeTab === 'hotels' && hotelTypeFilter !== 'Tous') {
    const filterLower = hotelTypeFilter.toLowerCase();
    currentServices = currentServices.filter(s => {
        const typeLower = (s.hotel_type || s.type || '').toLowerCase();
        if (filterLower === 'hôtel') return typeLower === 'hotel';
        return typeLower === filterLower;
    });
  }

  const galleryImages = (place.images && place.images.length > 0) ? place.images : [place.image];

  return (
    <Layout>
      <div className={`place-details-page ${isRTL ? 'rtl-mode' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-pattern" />
        
        <div className="max-container">
          <header className="details-header" style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
            <motion.button 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="back-btn-minimal"
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}>
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              <span>{t('places.back')}</span>
            </motion.button>
          </header>

          <main className="main-content-wrapper">
             <motion.div 
               layout
               className={`details-split-container ${isMapVisible ? 'map-open' : ''} ${isRTL ? 'rtl-split' : ''}`}
             >
                <motion.div layout className="place-hero-legacy">
                  <div className="hero-slider-wrap">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentImgIndex}
                        src={getImageUrl(galleryImages[currentImgIndex])} 
                        alt={place.title}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-main-img"
                      />
                    </AnimatePresence>
                    <div className="slider-overlay-gradient"></div>
                    
                    <div className="slider-dots">
                      {galleryImages.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`slider-dot ${idx === currentImgIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImgIndex(idx)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="hero-info-legacy" style={{ position: 'relative', textAlign: isRTL ? 'right' : 'left' }}>
                      <FavoriteButton 
                        placeId={place.id} 
                        initialIsFavorited={place.is_favorited} 
                        initialFavoriteId={place.favorite_id}
                        style={{ top: '20px', [isRTL ? 'left' : 'right']: '20px' }} 
                      />
                      
                      <Link to={`/place/${place.id}/comments`} className="comment-btn-bounce" style={{ bottom: '20px', [isRTL ? 'left' : 'right']: '20px', top: 'auto' }}>
                        <FaCommentDots />
                      </Link>

                      <span className="info-tag">{place.category}</span>
                    <h1 className="info-title">{place.title}</h1>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: isRTL ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '1rem' }}>
                      <RatingStars 
                         rating={place.rating_avg} 
                         totalRatings={place.total_ratings} 
                         interactive={true}
                         onRate={handleRate}
                         size={24}
                      />
                      {place.user_rating && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.4rem', fontWeight: '600' }}>
                          {t('places.yourRating')} : {place.user_rating} / 5
                        </p>
                      )}
                    </div>
                    <p className="info-desc">{place.description}</p>
                    
                    <motion.div 
                      onClick={() => setIsMapVisible(!isMapVisible)}
                      className={`place-coordinates-box ${isMapVisible ? 'active' : ''}`}
                      whileHover={{ scale: 1.02, x: isRTL ? -5 : 5 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                    >
                      <div className="box-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className="box-text">
                        <span className="box-label">{t('places.location')}</span>
                        <span className="box-val">{isMapVisible ? t('places.hideMap') : t('places.showMap')}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isMapVisible && (
                    <motion.div 
                      key="side-map"
                      initial={{ opacity: 0, x: isRTL ? -50 : 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: isRTL ? -50 : 50, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className="side-map-container"
                    >
                      <div className="map-frame-wrapper">
                        <iframe 
                          title="Marrakech Map"
                          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13587.21!2d${place.coordinates?.split(',')[1]}!3d${place.coordinates?.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sma!4v1712067751965!5m2!1sfr!2sma`}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen="" 
                          loading="lazy" 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </motion.div>

            <div className="services-section">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-head"
              >
                <h2 className="section-subtitle">{t('places.discoverServices')}</h2>
                <div className="section-line" />
              </motion.div>
              
              <div className="tabs-filter" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                {tabs.map(tab => (
                  <div key={tab.id} className="tab-wrapper">
                    <TabButton 
                        label={tab.label}
                        IconComponent={tab.icon}
                        active={activeTab === tab.id && isServicesOpen}
                        onClick={() => {
                            if (activeTab === tab.id) {
                              setIsServicesOpen(!isServicesOpen);
                            } else {
                              setActiveTab(tab.id);
                              setIsServicesOpen(true);
                            }
                        }}
                    />
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {isServicesOpen && activeTab === 'hotels' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }} 
                    animate={{ opacity: 1, y: 0, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }} 
                    style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', overflow: 'hidden' }}
                  >
                    {['Tous', 'Hôtel', 'Riad'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setHotelTypeFilter(type)}
                        style={{ padding: '0.4rem 1.2rem', borderRadius: '20px', border: '1px solid #e1dfdb', background: hotelTypeFilter === type ? '#1a1817' : '#fff', color: hotelTypeFilter === type ? '#fff' : '#524e4a', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: '0.3s' }}
                      >
                        {type === 'Tous' ? t('places.filters.all') : t(`places.filters.${type === 'Hôtel' ? 'hotels' : 'riads'}`)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    className="services-grid"
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeTab}
                        className="grid-wrapper"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                      >
                        {currentServices.length > 0 ? (
                          currentServices.map((service, index) => (
                            <ServiceCard 
                              key={`${activeTab}-${service.id}-${index}`}
                              index={index}
                              onBook={handleBookClick}
                              {...service}
                            />
                          ))
                        ) : (
                          <div className="empty-services">
                            <div className="empty-icon">🏜️</div>
                            <p>{t('places.noServices')}</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>

        {selectedService && (
          <BookingModal 
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService}
            onConfirm={handleConfirmBooking}
          />
        )}
      </div>
    </Layout>
  );
};

export default PlaceDetails;
