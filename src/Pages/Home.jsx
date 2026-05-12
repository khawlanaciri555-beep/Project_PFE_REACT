import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from '../Components/Layout';
import api from '../api/axios';
import FavoriteButton from '../Components/FavoriteButton';
import RatingStars from '../Components/RatingStars';
import { FaCommentDots, FaQuoteLeft, FaUserCircle } from 'react-icons/fa';
import '../Components/home.css';
import '../Components/Layout.css';
import getImageUrl from '../utils/imageUrl';

const TestimonialCard = ({ role, name, content, iconColor }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="testimonial-card-premium"
      style={{ 
        background: 'var(--card-bg)', 
        borderRadius: '24px', 
        padding: '2.5rem', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      <div style={{ color: 'var(--primary)', opacity: 0.2, position: 'absolute', top: '2rem', right: '2rem', fontSize: '2rem' }}>
        <FaQuoteLeft />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '16px', 
          background: iconColor || 'rgba(188, 73, 49, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--primary)',
          fontSize: '1.5rem'
        }}>
          <FaUserCircle />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)' }}>{name}</h4>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{role}</span>
        </div>
      </div>

      <p style={{ 
        color: 'var(--text-light)', 
        fontSize: '0.95rem', 
        lineHeight: '1.7', 
        fontStyle: 'italic',
        margin: 0
      }}>
        "{content}"
      </p>
    </motion.div>
  );
};

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
  const [generalComments, setGeneralComments] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { scrollY } = useScroll();
  const { t } = useTranslation();
  const [opening, setOpening] = useState(false);
  const [showShutter, setShowShutter] = useState(false);

  useEffect(() => {
    // Fast & Door-like reveal
    setShowShutter(true);
    setOpening(true);
    
    const timer = setTimeout(() => {
      setOpening(false);
      setTimeout(() => setShowShutter(false), 800);
    }, 400); // Very short delay
    
    return () => clearTimeout(timer);
  }, []);
  
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
        const allPlaces = result.data || [];
        // Filter out accommodation and transport from global view as requested
        const filtered = allPlaces.filter(p => {
          const cat = (p.category || '').toLowerCase();
          return !cat.includes('hotel') && !cat.includes('riad') && !cat.includes('transport') && !cat.includes('hébergement');
        });
        setPlaces(filtered);
      } catch (err) {
        console.error("failed to load places", err);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/testimonials');
        const result = response.data;
        setTestimonials(result.data || []);
      } catch (err) {
        console.error("failed to load testimonials", err);
      }
    };

    const fetchGeneralComments = async () => {
      try {
        const response = await api.get('/places/general/comments');
        // Just show the latest 3
        setGeneralComments((response.data.data || []).slice(0, 3));
      } catch (err) {
        console.error("failed to load general comments", err);
      }
    };

    fetchPlaces();
    fetchTestimonials();
    fetchGeneralComments();

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
      {showShutter && (
        <div className={`shutter-reveal ${!opening ? 'is-open' : 'is-closed'}`}>
          <div className="shutter shutter-left">
            <div className="shutter-logo left">VIB<span>-</span>KECH</div>
          </div>
          <div className="shutter shutter-right">
            <div className="shutter-logo right">VIB<span>-</span>KECH</div>
          </div>
        </div>
      )}
      <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div style={{ scale: videoScale }} className="hero-video-container">
          <video 
            className="hero-video" 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="/background/marrakech_auth_bg.png"
          >
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
                  <Link to={`/place/${place.id}`} className="new-btn-detail">{t('home.destinations.viewDetail')}</Link>
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

      {/* Testimonials Section */}
      <section className="testimonials-section" style={{ padding: '6rem 8%', background: 'var(--bg-color)' }}>
        <div className="section-header-center" style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <span className="section-eyebrow" style={{ color: 'var(--primary)', letterSpacing: '3px', fontWeight: 'bold' }}>{t('home.testimonials.eyebrow')}</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '1rem' }}>{t('home.testimonials.title')}</h2>
            <p style={{ color: '#666', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>{t('home.testimonials.description')}</p>
        </div>
        
        <div className="testimonials-grid">
           {testimonials.length > 0 ? (
             testimonials.map(test => (
               <motion.div 
                 key={test.id} 
                 className="testimonial-card-premium"
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
               >
                 <div className="testimonial-quote-mark">
                    "
                 </div>
                 <div className="testimonial-user">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${test.user?.name}&background=random`} 
                      alt={test.user?.name} 
                      className="testimonial-avatar"
                    />
                    <div>
                       <h4 className="testimonial-name">{test.user?.name}</h4>
                       <span className="testimonial-meta">
                          {test.transport ? `${t('home.testimonials.transport')}: ${test.transport.type}` : 
                           test.cooperative ? `${t('home.testimonials.coop')}: ${test.cooperative.name}` : 
                           test.place ? `${t('home.testimonials.place')}: ${test.place.title}` : t('home.testimonials.verified')}
                       </span>
                    </div>
                 </div>
                 <p className="testimonial-content">
                   "{test.content}"
                 </p>
                 <div className="testimonial-footer">
                    <div className="testimonial-stars">
                       {[...Array(5)].map((_, i) => (
                         <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#C58A3A">
                           <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                         </svg>
                       ))}
                    </div>
                    <span className="testimonial-date">{new Date(test.created_at).toLocaleDateString()}</span>
                 </div>
               </motion.div>
             ))
           ) : (
             <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', color: '#999' }}>{t('home.testimonials.loading')}</div>
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
      <Link to="/comments/general" className="floating-general-comment" title={t('comments.generalDiscussion')}>
        <FaCommentDots size={28} />
      </Link>
    </Layout>
  );
};

export default Home;
      