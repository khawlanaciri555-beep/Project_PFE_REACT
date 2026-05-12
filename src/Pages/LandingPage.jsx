import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher/LanguageSwitcher';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleEnter = () => {
    setEntered(true);
    // Increased delay for the shutter animation to complete
    setTimeout(() => navigate('/home'), 1100);
  };

  return (
    <div
      ref={containerRef}
      className={`landing-root ${loaded ? 'loaded' : ''} ${entered ? 'exiting' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Shutter reveal panels */}
      <div className="shutter shutter-left" />
      <div className="shutter shutter-right" />
      {/* Animated background blobs */}
      <div className="landing-bg">
        <div className="blob blob-1" style={{ transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -12}px)` }} />
        <div className="blob blob-2" style={{ transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 20}px)` }} />
        <div className="blob blob-3" style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * 16}px)` }} />
        <div className="landing-grid" />
        <div className="landing-noise" />
      </div>

      {/* Floating particles */}
      <div className="particles-wrap">
        {[...Array(18)].map((_, i) => (
          <span key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Top bar */}
      <div className="landing-topbar">
        <div className="landing-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Vib<span>-</span>Kech</span>
        </div>
        <div className="landing-tagline-top">Marrakech · Morocco</div>
        <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', zIndex: 100 }}>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main content */}
      <div className="landing-center">
        {/* Decorative ring */}
        <div className="deco-ring">
          <svg viewBox="0 0 300 300" className="ring-svg">
            <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(197,138,58,0.15)" strokeWidth="1" />
            <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(197,138,58,0.1)" strokeWidth="0.5" strokeDasharray="4 8" />
          </svg>
        </div>

        <div className="landing-eyebrow">
          <span className="eyebrow-line" />
          <span>{t('landing.eyebrow')}</span>
          <span className="eyebrow-line" />
        </div>

        <h1 className="landing-title">
          <span className="title-line-1">{t('landing.welcome')}</span>
          <span className="title-line-2">
            <em>{t('landing.title1')}</em> {t('landing.title2')} <em>{t('landing.title3')}</em>
          </span>
        </h1>

        <p className="landing-desc">
          {t('landing.description')}
        </p>

        {/* CTA Button */}
        <button className="landing-cta" onClick={handleEnter} id="landing-enter-btn">
          <span className="cta-text">{t('landing.cta')}</span>
          <span className="cta-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          <span className="cta-ripple" />
        </button>

        <div className="landing-scroll-hint">
          <span>{t('landing.scroll')}</span>
          <span className="scroll-dots">
            <span /><span /><span />
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="landing-bottom">
        <div className="bottom-left">
          <span>© 2026 AL-RIAD</span>
          <span className="dot-sep">·</span>
          <span>All rights reserved</span>
        </div>
        <div className="bottom-right">
          <a href="/home" className="skip-link" id="skip-to-home">{t('landing.skip')} →</a>
        </div>
      </div>

      {/* Side decorations */}
      <div className="side-deco side-left">
        <div className="vertical-text">MARRAKECH 2026</div>
      </div>
      <div className="side-deco side-right">
        <div className="vertical-text">AL — RIAD</div>
      </div>
    </div>
  );
};

export default LandingPage;
