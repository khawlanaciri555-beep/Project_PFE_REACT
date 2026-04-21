import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../Components/Layout';
import { FaCompass, FaGem, FaHandshake } from 'react-icons/fa';
import getImageUrl from '../utils/imageUrl';
import './About.css';

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 200]);

  const slideUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  };

  const stagger = {
    initial: { opacity: 0 },
    whileInView: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    },
    viewport: { once: true }
  };

  return (
    <Layout>
      <div className={`about-page-container ${isRTL ? 'rtl-mode' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* --- Hero Section --- */}
        <section 
          className="hero-about" 
          style={{ backgroundImage: 'url("/koutoubia_hero.png")' }}
        >
          <motion.div 
            className="hero-glass-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="hero-title">{t('about.hero.title')}</h1>
            <p>{t('about.hero.subtitle')}</p>
          </motion.div>
        </section>

        {/* --- Our Story --- */}
        <section className={`story-section ${isRTL ? 'reverse' : ''}`}>
          <motion.div className="story-text" {...slideUp}>
            <h2>{t('about.story.title')}</h2>
            <p>{t('about.story.p1')}</p>
            <p>{t('about.story.p2')}</p>
          </motion.div>
          <motion.div 
            className="story-img-wrap"
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src={getImageUrl('/storage/places/Place Jemaa el-Fna/WhatsApp Image 2026-04-06 at 4.09.59 PM (1).jpeg')} alt="VibKech Experience" />
          </motion.div>
        </section>

        {/* --- Values --- */}
        <section className="values-wrapper">
          <h2 className="values-title">{t('about.values.title')}</h2>
          <motion.div className="values-grid" variants={stagger} initial="initial" whileInView="whileInView">
            <motion.div className="value-glass-card" variants={slideUp}>
              <FaCompass className="feature-icon" style={{ fontSize: '3.5rem', color: 'var(--primary-red)', marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>{t('about.values.v1.title')}</h3>
              <p style={{ color: '#666', lineHeight: '1.7', opacity: 0.8 }}>{t('about.values.v1.desc')}</p>
            </motion.div>
            <motion.div className="value-glass-card" variants={slideUp}>
              <FaGem className="feature-icon" style={{ fontSize: '3.5rem', color: 'var(--primary-red)', marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>{t('about.values.v2.title')}</h3>
              <p style={{ color: '#666', lineHeight: '1.7', opacity: 0.8 }}>{t('about.values.v2.desc')}</p>
            </motion.div>
            <motion.div className="value-glass-card" variants={slideUp}>
              <FaHandshake className="feature-icon" style={{ fontSize: '3.5rem', color: 'var(--primary-red)', marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>{t('about.values.v3.title')}</h3>
              <p style={{ color: '#666', lineHeight: '1.7', opacity: 0.8 }}>{t('about.values.v3.desc')}</p>
            </motion.div>
          </motion.div>
        </section>

        {/* --- History Timeline --- */}
        <section className="timeline-section">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', color: 'inherit' }}>{t('about.timeline.title')}</h2>
            <p style={{ letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>{t('about.timeline.subtitle')}</p>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-line" />
            
            <motion.div variants={stagger} initial="initial" whileInView="whileInView">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const step = t(`about.timeline.step${num}`, { returnObjects: true });
                return (
                  <motion.div 
                    key={num} 
                    className="timeline-item"
                    variants={slideUp}
                  >
                    <div className="timeline-dot" />
                    <div className="timeline-glass">
                      <div className="timeline-date">{step.date}</div>
                      <h3 style={{ color: 'var(--primary-red)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>{step.title}</h3>
                      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>{step.desc}</p>
                      <ul style={{ paddingRight: isRTL ? '1.5rem' : '0', paddingLeft: isRTL ? '0' : '1.5rem', marginTop: '1.2rem', opacity: 0.8, fontSize: '1rem', listStyle: 'none' }}>
                        {(step.details || []).map((detail, idx) => (
                          <li key={idx} style={{ marginBottom: '0.6rem' }}>🔸 {detail}</li>
                        ))}
                      </ul>
                      {/* Optional images for some steps */}
                      {num === 1 && <img src={getImageUrl('/about_hero.png')} alt="Foundation" style={{ width: '100%', marginTop: '2rem', borderRadius: '25px', height: '220px', objectFit: 'cover' }} />}
                      {num === 3 && <img src={getImageUrl('/storage/places/Mosquée Koutoubia/WhatsApp Image 2026-04-06 at 4.02.35 PM.jpeg')} alt="Koutoubia" style={{ width: '100%', marginTop: '2rem', borderRadius: '25px', height: '220px', objectFit: 'cover' }} />}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* --- Vision Banner --- */}
        <motion.section className="mission-banner" {...slideUp}>
          <h2>{t('about.mission.title')}</h2>
          <p>{t('about.mission.desc')}</p>
        </motion.section>

        {/* --- Final CTA --- */}
        <section className="cta-full">
          <motion.div {...slideUp}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', marginBottom: '2rem' }}>{t('about.cta.title')}</h2>
            <p style={{ fontSize: '1.4rem', opacity: 0.8, maxWidth: '800px', margin: '0 auto 4rem' }}>
              {t('about.cta.subtitle')}
            </p>
            <Link to="/explore" className="btn-premium-cta">
              {t('about.cta.btn')}
            </Link>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
};

export default About;
