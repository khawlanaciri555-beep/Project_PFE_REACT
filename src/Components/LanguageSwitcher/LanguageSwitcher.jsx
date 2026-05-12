import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

const languages = [
  { code: 'en', label: 'EN', full: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', full: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'AR', full: 'العربية', flag: '🇲🇦', dir: 'rtl' },
  { code: 'es', label: 'ES', full: 'Español', flag: '🇪🇸' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLangCode = i18n.language || 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[0];
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.documentElement.dir = currentLang.dir || 'ltr';
    document.documentElement.lang = currentLang.code;
  }, [currentLang]);

  useEffect(() => {
    const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', zIndex: 2000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.9rem',
          borderRadius: '12px',
          border: '1.5px solid rgba(188, 73, 49, 0.35)',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '0.82rem',
          letterSpacing: '0.05em',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>{isOpen ? '▴' : '▾'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'var(--card-bg, #fff)',
              border: '1px solid var(--border-color, #eee)',
              borderRadius: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              overflow: 'hidden',
              minWidth: '140px',
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: lang.code === currentLangCode ? 'rgba(188,73,49,0.08)' : 'transparent',
                  border: 'none',
                  color: lang.code === currentLangCode ? 'var(--primary, #BC4931)' : 'var(--text-dark, #1a1817)',
                  cursor: 'pointer',
                  fontWeight: lang.code === currentLangCode ? '700' : '500',
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                  borderLeft: lang.code === currentLangCode ? '3px solid #BC4931' : '3px solid transparent',
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.full}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
