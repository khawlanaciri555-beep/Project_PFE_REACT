import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Set default if i18n.language is undefined
  const currentLangCode = i18n.language || 'en';

  useEffect(() => {
    // Automatically set document direction when language changes
    const currentLang = languages.find(lang => lang.code === currentLangCode) || languages[0];
    document.documentElement.dir = currentLang.dir || 'ltr';
    document.documentElement.lang = currentLang.code;
  }, [currentLangCode]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <select 
        value={currentLangCode} 
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          border: '1px solid rgba(188, 73, 49, 0.4)',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          outline: 'none',
          fontWeight: '500',
          fontSize: '0.9rem'
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ color: '#000' }}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
