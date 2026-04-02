import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../Components/Layout';
import { places } from '../data/mockData';
import './PlaceDetails.css';

// SVG Icons
const Icons = {
  Guides: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
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

const ServiceCard = ({ name, role, description, price, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="service-card"
  >
    <div className="service-card-header">
      <h3>{name} <span className="service-role"> — {role}</span></h3>
      <p className="service-desc">{description}</p>
    </div>
    <div className="service-footer">
      <span className="service-price">{price}</span>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="reserve-btn"
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
  const place = places.find(p => p.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('guides');
  const [isMapVisible, setIsMapVisible] = useState(false);

  if (!place) {
    return (
      <Layout>
        <div className="not-found">
          <p>Lieu non trouvé.</p>
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'guides', label: 'Guides', icon: Icons.Guides },
    { id: 'hotels', label: 'Hôtels', icon: Icons.Hotels },
    { id: 'activites', label: 'Activités', icon: Icons.Activites },
    { id: 'restaurants', label: 'Restaurants', icon: Icons.Restaurants },
    { id: 'transport', label: 'Transport', icon: Icons.Transport }
  ];

  const currentServices = place.services?.[activeTab] || [];

  return (
    <Layout>
      <div className="place-details-page">
        <div className="bg-pattern" />
        
        <div className="max-container">
          <header className="details-header">
            <motion.button 
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={() => navigate('/')}
              className="close-btn"
              aria-label="Fermer"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </motion.button>
          </header>

          <main className="main-content-wrapper">
            <motion.div 
              layout
              className={`details-split-container ${isMapVisible ? 'map-open' : ''}`}
            >
              {/* Left Side: Photo & Info */}
              <motion.div 
                layout
                className="place-hero-container"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div 
                  className="place-hero"
                >
                  <div className="hero-image-wrap">
                    <img src={place.image} alt={place.title} />
                    <div className="hero-image-overlay" />
                  </div>
                  
                  <div className="hero-info-wrap">
                    <span className="category-tag">
                      {place.category}
                    </span>
                    <h1 className="place-title">
                      {place.title}
                    </h1>
                    <p className="place-description">
                      {place.description}
                    </p>
                    
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
              </motion.div>

              {/* Right Side: Map */}
              <AnimatePresence>
                {isMapVisible && (
                  <motion.div 
                    initial={{ opacity: 0, x: 100, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="map-container-side"
                  >
                    <div className="map-frame">
                      {/* Placeholder for map iframe */}
                      <iframe 
                        title="Marrakech Map"
                        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13587.21!2d${place.coordinates.split(',')[1]}!3d${place.coordinates.split(',')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sma!4v1712067751965!5m2!1sfr!2sma`}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                      />
                      <div className="map-overlay-badge">
                        <span>{place.title}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Services Section */}
            <div className="services-section">
              <div className="section-head">
                <h2 className="section-subtitle">Services Exclusifs</h2>
                <div className="section-line" />
              </div>
              
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {currentServices.map((service, index) => (
                      <ServiceCard 
                        key={`${activeTab}-${index}`}
                        index={index}
                        {...service}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceDetails;
