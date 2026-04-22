import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from '../Components/Layout';
import api from '../api/axios';
import FavoriteButton from '../Components/FavoriteButton';
import RatingStars from '../Components/RatingStars';
import { FaCommentDots } from 'react-icons/fa';
import '../Components/home.css';
import getImageUrl from '../utils/imageUrl';

// Counter Component for Statistics
const Counter = ({ value, label, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      if (isNaN(parseInt(value))) {
        setCount(value);
        return;
      }
      
      const target = parseInt(value.replace(/[^0-9]/g, ''));
      let startTime = null;
      const duration = 1000;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        const easeOutPercentage = 1 - (1 - percentage) * (1 - percentage);
        setCount(Math.floor(easeOutPercentage * target));
        if (percentage < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  const suffix = value.replace(/[0-9]/g, '');

  return (
    <motion.div 
      ref={ref}
      className={`stat-item ${label === 'unesco' ? 'unesco' : ''}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <span className="stat-number">
        {isNaN(parseInt(value)) ? value : `${count}${suffix}`}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
};

const Home = () => {
  const sliderRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const { scrollY } = useScroll();
  const { t } = useTranslation();
  
  // Parallax / Smooth scroll effect for hero
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -100]);
  const videoScale = useTransform(scrollY, [0, 400], [1, 1.1]);

  useEffect(() => {
    // recepere les places
    const fetchPlaces = async () => {
      try {
        const response = await api.get('/places');
        const result = response.data;
        setPlaces(result.data || []);
      } catch (err) {
        console.error("failed to load places", err);
      }
    };

    const fetchHotels = async () => {
      try {
        const response = await api.get('/hotels');
        const result = response.data;
        // Just take the first 4 for the home page showcase
        setHotels((result.data || []).slice(0, 4));
      } catch (err) {
        console.error("failed to load hotels", err);
      }
    };

    fetchPlaces();
    fetchHotels();

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div style={{ scale: videoScale }} className="hero-video-container">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src="/background/backHome.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
        </motion.div>
        
        <motion.div 
          className="hero-content"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ lineHeight: '1.1', marginBottom: '1.5rem' }}
          >
            <span style={{ color: 'rgba(226, 218, 215, 1)', fontSize: '4.8rem', fontWeight: '800' }}>
              {t('home.hero.title')}
            </span> <br/>
            <span style={{ 
              background: 'linear-gradient(90deg, #EAD3B1, #C58A3A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              fontSize: '2.4rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              marginTop: '0.5rem'
            }}>
              {t('home.hero.subtitle')}
            </span>
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ color: '#f7f0e7ff', opacity: 1 }}
          >
            {t('home.hero.description')}
          </motion.p>
        </motion.div>
      </section>
      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">{t('home.destinations.eyebrow')}</span>
            <h2 className="section-title">{t('home.destinations.title')}</h2>
          </div>
        </div>

        <div className="destinations-grid slider-container" ref={sliderRef}>
          {places.length > 0 ? (
            places.map(place => (
              <div className="destination-card new-card" key={place.id}>
                <div className="new-card-image-wrap">
                  <FavoriteButton 
                    placeId={place.id} 
                    initialIsFavorited={place.is_favorited} 
                    initialFavoriteId={place.favorite_id}
                  />
                  <img src={getImageUrl(place.image)} alt={place.title} />
                  <div className="image-overlay">
                    <span className="new-card-tag">{place.category || 'Destination'}</span>
                    <h3 className="new-card-title">{place.title}</h3>
                  </div>
                </div>
                <div className="new-card-content">
                  <div style={{ marginBottom: '0.8rem' }}>
                    <RatingStars rating={place.rating_avg} showCount={false} size={14} />
                  </div>
                  <Link to={`/place/${place.id}`} className="new-btn-detail">Voir détail &rarr;</Link>
                </div>
              </div>
            ))
          ) : (
             <div style={{ color: "white", padding: "2rem" }}>{t('home.destinations.loading')}</div>
          )}
        </div>

        <div className="section-footer-centered">
          <Link to="/explore" className="btn-see-more">
            <span>{t('home.destinations.seeMore')}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 5l7 7-7 7M4 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Luxury Stays Section (New from Laravel) */}
      <section className="hotels-showcase-section" style={{ padding: '6rem 8%', background: 'var(--bg-color)' }}>
        <div className="section-header-center" style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <span className="section-eyebrow" style={{ color: 'var(--primary)', letterSpacing: '3px', fontWeight: 'bold' }}>EXCEPTIONAL LIVING</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>Luxury Stays & Riads</h2>
        </div>
        <div className="hotels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
           {hotels.length > 0 ? (
             hotels.map(hotel => (
               <motion.div 
                 key={hotel.id} 
                 className="hotel-card-premium"
                 whileHover={{ y: -10 }}
                 style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
               >
                 <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img src={getImageUrl(hotel.image)} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 </div>
                 <div style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}>{hotel.type}</span>
                    <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>{hotel.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
                      {hotel.description}
                    </p>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                       <span style={{ fontWeight: 'bold' }}>{hotel.price} <small>MAD</small></span>
                       <Link to="/explore" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>Check Details &rarr;</Link>
                    </div>
                 </div>
               </motion.div>
             ))
           ) : (
             <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem' }}>Discovering exceptional stays...</div>
           )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
          <Counter value="1062" label={t('home.stats.founded')} index={0} />
          <Counter value="800+" label={t('home.stats.monuments')} index={1} />
          <Counter value="10M+" label={t('home.stats.tourists')} index={2} />
          <Counter value="UNESCO" label={t('home.stats.heritage')} index={3} />
      </section>

      </div>
      <Link to="/comments/general" className="floating-general-comment" title="Discussion Générale">
        <FaCommentDots size={28} />
      </Link>
    </Layout>
  );
};

export default Home;
      