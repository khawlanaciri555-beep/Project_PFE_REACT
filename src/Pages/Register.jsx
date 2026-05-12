import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { RoleSelector } from '../Components/Register/RoleSelector';
import {
  TouristForm,
  HotelForm,
  TransporteurForm,
  CooperativeForm
} from '../Components/Register/RegisterForms';
import { GradientButton } from '../Components/Register/UIComponents';
import { FaCheckCircle, FaArrowLeft, FaSun, FaMoon } from 'react-icons/fa';
import LanguageSwitcher from '../Components/LanguageSwitcher/LanguageSwitcher';
import AnimatedBackground from '../Components/Auth/AnimatedBackground';
import './Auth.css';

const Register = () => {
  const [role, setRole] = useState('tourist');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await api.get('/places');
        const data = response.data.data || response.data;
        setPlaces(data.map(p => ({ value: p.id, label: p.title })));
      } catch (err) {
        console.error('Failed to fetch places', err);
      }
    };
    fetchPlaces();
  }, []);

  // Unified form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    accommodationType: 'hotel',
    hotelName: '',
    address: '',
    place_id: '',
    description: '',
    company: '',
    vehicleType: '',
    licenseNumber: '',
    cooperativeName: '',
    activityType: '',
  });

  const [files, setFiles] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFiles = e.target.files;
    setFiles(prev => ({ ...prev, [fieldName]: selectedFiles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Map role to Laravel expected roles
      let backendRole = 'tourist';
      if (role === 'hotel') backendRole = 'hotel';
      else if (role === 'transporteur') backendRole = 'transport';
      else if (role === 'cooperative') backendRole = 'coop';
      
      // Determine name field based on role
      let finalName = formData.name;
      if (role === 'hotel') finalName = formData.hotelName;
      else if (role === 'transporteur') finalName = formData.company;
      else if (role === 'cooperative') finalName = formData.cooperativeName;

      const dataToSend = new FormData();
      dataToSend.append('name', finalName || 'Unknown');
      dataToSend.append('email', formData.email);
      dataToSend.append('password', formData.password);
      dataToSend.append('password_confirmation', formData.password_confirmation);
      dataToSend.append('role', backendRole);
      dataToSend.append('phone', formData.phone);
      dataToSend.append('address', formData.address);
      dataToSend.append('place_id', formData.place_id);
      dataToSend.append('description', formData.description);

      if (role === 'hotel') {
        dataToSend.append('accommodation_type', formData.accommodationType);
      }

      // Add Files
      if (files.images && files.images[0]) {
        dataToSend.append('image', files.images[0]);
      }
      if (files.certificate && files.certificate[0]) {
        dataToSend.append('certificate', files.certificate[0]);
      }
      if (files.licenseDoc && files.licenseDoc[0]) {
        dataToSend.append('licenseDoc', files.licenseDoc[0]);
      }

      await register(dataToSend);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        // Formatted Laravel validation errors
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        setError(err.response.data.errors[firstErrorKey][0]);
      } else {
        setError(err.response?.data?.message || t('common.error', 'Registration failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (role) {
      case 'tourist': return <TouristForm data={formData} onChange={handleInputChange} />;
      case 'hotel': return <HotelForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} places={places} />;
      case 'transporteur': return <TransporteurForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} places={places} />;
      case 'cooperative': return <CooperativeForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} places={places} />;
      default: return <TouristForm data={formData} onChange={handleInputChange} />;
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="auth-container success-container"
          style={{ textAlign: 'center' }}
        >
          <div className="success-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
            <FaCheckCircle />
          </div>
          <h1 className="auth-title">{t('auth.register.title')} ✓</h1>
          <p className="auth-subtitle">{t('auth.register.haveAccount')}</p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="auth-submit-btn">{t('auth.login.submit')}</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ position: 'relative' }}>
      <AnimatedBackground />
      <div className="auth-top-controls" style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 60 }}>
          <button onClick={toggleTheme} className="theme-toggle-btn" style={{ background: 'transparent', border: 'none', color: 'var(--premium-terracotta)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
              {isDarkMode ? <FaSun color="#F59E0B" /> : <FaMoon />}
          </button>
          <LanguageSwitcher />
      </div>

      <Link to="/home" style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', zIndex: 50, display: 'flex', alignItems: 'center', gap: '8px', color: '#CA5A3D', textDecoration: 'none', fontWeight: '600', fontSize: '1.05rem' }}>
          <FaArrowLeft /> {t('auth.back', 'Back')}
      </Link>
      <div className="register-card premium-glass-card" style={{ maxWidth: '550px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
        <div className="auth-header">
          <Link to="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '1rem' }}>
             <span style={{ color: '#C58A3A', fontSize: '1.2rem' }}>✦</span>
             <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 'bold', color: '#1a1008', textTransform: 'uppercase', letterSpacing: '3px' }}>VibKech</span>
          </Link>
          <h1 style={{ color: '#C55A3A', fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('auth.register.title')}</h1>
          <p style={{ color: '#64748b' }}>{t('auth.register.subtitle', 'Join the Marrakech Experience')}</p>
        </div>

        <RoleSelector activeRole={role} setRole={(r) => setRole(r)} />

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.register.submit')
              )}
            </button>
          </div>
        </form>

        <p className="login-form-footer" style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-dark)' }}>
          {t('auth.register.haveAccount')}{' '}
          <Link to="/login" style={{ color: '#CA5A3D', fontWeight: '700', textDecoration: 'underline' }}>
            {t('auth.register.login')}
          </Link>
        </p>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Register;
