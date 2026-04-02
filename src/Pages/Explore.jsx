import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import { places } from '../data/mockData';
import './Explore.css';

const Explore = () => {
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
              <h1 className="explore-title">Explorer Marrakech</h1>
              <p className="explore-subtitle">
                Des palais impériaux aux jardins secrets, découvrez chaque recoin de la ville ocre.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-container">
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
            {places.map((place) => (
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
                  <img src={place.image} alt={place.title} />
                  <div className="image-overlay">
                    <span className="new-card-tag">{place.category}</span>
                    <h3 className="new-card-title">{place.title}</h3>
                  </div>
                </div>
                <div className="new-card-content">
                  <p>{place.description}</p>
                  <Link to={`/place/${place.id}`} className="new-btn-detail">Voir détail &rarr;</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
