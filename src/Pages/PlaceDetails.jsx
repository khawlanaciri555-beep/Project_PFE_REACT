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
  Restaurants: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
  Transport: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="22" height="13" rx="2"/><path d="M7 21h0"/><path d="M17 21h0"/><path d="M5 21a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/><path d="M2 10h20"/>
    </svg>
  )
};

const ServiceCard = ({ id, title, type, description, price, index, onBook }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="service-card"
  >
    <div className="service-card-header">
      <h3>{title} <span className="service-role"> — {type}</span></h3>
      <p className="service-desc">{description}</p>
    </div>
    <div className="service-footer">
      <span className="service-price">{price}</span>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="reserve-btn"
        onClick={() => onBook({ id, title, price, type })}
      >
        Réserver
      </motion.button>
    </div>
  </motion.div>
);

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
  
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotels');
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
      // Refresh place data to show new average
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
      service_id: selectedService.id,
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
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Lieu non trouvé.</h2>
          <button onClick={() => navigate('/')} className="new-btn-detail" style={{ padding: '1rem 2rem' }}>Retour à l'accueil</button>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'hotels', label: 'Hôtels', icon: Icons.Hotels },
    { id: 'activites', label: 'Activités', icon: Icons.Activites },
    { id: 'restaurants', label: 'Restaurants', icon: Icons.Restaurants },
    { id: 'transport', label: 'Transport', icon: Icons.Transport }
  ];

  const currentServices = place.related_services?.[activeTab] || [];
  const galleryImages = place.images && place.images.length > 0 ? place.images : [place.image];

  return (
    <Layout>
      <div className="place-details-page">
        <div className="bg-pattern" />
        
        <div className="max-container">
          <header className="details-header">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="back-btn-minimal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              <span>Explorer Marrakech</span>
            </motion.button>
          </header>

          <main className="main-content-wrapper">
             {/* Dynamic Layout: Split when Map is open */}
             <motion.div 
               layout
               className={`details-split-container ${isMapVisible ? 'map-open' : ''}`}
             >
                {/* 1. Hero / Info Box (Slider Inside) */}
                <motion.div 
                  layout
                  className="place-hero-legacy"
                >
                  <div className="hero-slider-wrap">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentImgIndex}
                        src={getImageUrl(galleryImages[currentImgIndex])} 
                        alt={place.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                      />
                    </AnimatePresence>
                    <div className="img-overlay-light" />
                  </div>
                  
                    <div className="hero-info-legacy" style={{ position: 'relative' }}>
                      <FavoriteButton 
                        placeId={place.id} 
                        initialIsFavorited={place.is_favorited} 
                        initialFavoriteId={place.favorite_id}
                        style={{ top: '20px', right: '20px' }} 
                      />
                      
                      <Link to={`/place/${place.id}/comments`} className="comment-btn-bounce" style={{ bottom: '20px', right: '20px', top: 'auto' }}>
                        <FaCommentDots />
                      </Link>

                      <span className="info-tag">{place.category}</span>
                    <h1 className="info-title">{place.title}</h1>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <RatingStars 
                         rating={place.rating_avg} 
                         totalRatings={place.total_ratings} 
                         interactive={true}
                         onRate={handleRate}
                         size={24}
                      />
                      {place.user_rating && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.4rem', fontWeight: '600' }}>
                          Votre note : {place.user_rating} / 5
                        </p>
                      )}
                    </div>
                    <p className="info-desc">{place.description}</p>
                    
                    <motion.div 
                      onClick={() => setIsMapVisible(!isMapVisible)}
                      className={`place-coordinates-box ${isMapVisible ? 'active' : ''}`}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="box-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div className="box-text">
                        <span className="box-label">Localisation</span>
                        <span className="box-val">{isMapVisible ? 'Masquer la carte' : 'Voir sur la carte'}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* 2. Side Map (Appears when mapVisible is true) */}
                <AnimatePresence>
                  {isMapVisible && (
                    <motion.div 
                      key="side-map"
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className="side-map-container"
                    >
                      <div className="map-frame-wrapper">
                        <iframe 
                          title="Marrakech Map"
                          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13587.21!2d${place.coordinates.split(',')[1]}!3d${place.coordinates.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sma!4v1712067751965!5m2!1sfr!2sma`}
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

            {/* Services Section */}
            <div className="services-section">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-head"
              >
                <h2 className="section-subtitle">Découvrez nos services</h2>
                <div className="section-line" />
              </motion.div>
              
              <div className="tabs-filter">
                {tabs.map(tab => (
                  <TabButton 
                    key={tab.id}
                    label={tab.label}
                    IconComponent={tab.icon}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </div>

              <div className="services-grid">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    className="grid-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {currentServices.length > 0 ? (
                      currentServices.map((service, index) => (
                        <ServiceCard 
                          key={`${activeTab}-${index}`}
                          index={index}
                          onBook={handleBookClick}
                          {...service}
                        />
                      ))
                    ) : (
                      <div className="empty-services">
                        <p>Aucun service disponible pour le moment.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
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
