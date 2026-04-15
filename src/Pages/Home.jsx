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
    fetchPlaces();

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
                {/* pour afficher la carte du pluce */}
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

      {/* Statistics Section */}
      <section className="stats-section">
          <Counter value="1062" label={t('home.stats.founded')} index={0} />
          <Counter value="800+" label={t('home.stats.monuments')} index={1} />
          <Counter value="10M+" label={t('home.stats.tourists')} index={2} />
          <Counter value="UNESCO" label={t('home.stats.heritage')} index={3} />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header-center">
            <span className="section-eyebrow">{t('home.testimonials.eyebrow')}</span>
            <h2 className="section-title">{t('home.testimonials.title')}</h2>
        </div>

        <div className="testimonials-masonry">
           <div className="test-card large user-elara">
               <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>Elara Rossi</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <p className="quote">
                 "Staying in a traditional Riad was a dream. The service was impeccable, and waking up to the sound of birds in the orange trees was the highlight of my year."
               </p>
           </div>

           <div className="test-card small right-col-1 user-mark">
              <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>Mark Jenkins</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <p className="quote">
                 "The photography tours were mind-blowing. Our guide knew every hidden alley in the Medina!"
               </p>
           </div>

           <div className="test-card small block-bottom-left user-aisha">
              <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>Aisha Mansour</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <p className="quote">
                 "Authentic, luxurious, and soul-stirring. VibKech is the perfect gateway to Marrakech culture."
               </p>
           </div>

           <div className="test-card medium block-bottom-right user-david">
              <div className="user-info">
                   <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="User" className="avatar"/>
                   <div>
                       <h4>David Chen</h4>
                       <div className="stars">★★★★★</div>
                   </div>
               </div>
               <div className="split-content">
                 <p className="quote">
                   "The hospitality here is not just a service, it's an art form. From the tea ceremonies to the rooftop dinners, everything was magical."
                 </p>
                 <img src="https://images.unsplash.com/photo-1574751336422-790159fd4fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Mint Tea" className="tea-pic"/>
               </div>
           </div>
        </div>
      </section>

      </div>
      <Link to="/comments/general" className="floating-general-comment" title="Discussion Générale">
        <FaCommentDots size={28} />
      </Link>
    </Layout>
  );
};

export default Home;
