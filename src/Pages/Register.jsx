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
import { FaCheckCircle } from 'react-icons/fa';
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
          className="register-card success-container"
        >
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>{t('auth.register.title')} ✓</h1>
          <p>{t('auth.register.haveAccount')}</p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <GradientButton>{t('auth.login.submit')}</GradientButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page login-page register-page-split">
      {/* Left Panel — decorative (Reuse from Login) */}
      <div className="login-left-panel">
        <div className="login-panel-overlay" />
        <div className="login-panel-content">
          <div className="login-brand">
            <span className="login-brand-icon">✦</span>
            <span className="login-brand-name">VibKech</span>
          </div>
          <h2 className="login-panel-title">
            Begin Your<br />
            <em>Marrakech Story</em>
          </h2>
          <p className="login-panel-desc">
            Join our community of explorers and hosts. 
            Experience the soul of the Red City like never before.
          </p>
          <div className="login-panel-stats">
            <div className="lp-stat">
              <span>800+</span>
              <small>Monuments</small>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span>10M+</span>
              <small>Tourists / Year</small>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="login-right-panel">
        <div className="login-form-card" style={{ maxWidth: '550px' }}>
          <div className="login-form-header">
            <div className="login-form-eyebrow">
              <span className="lf-line" />
              <span>JOIN THE EXPERIENCE</span>
              <span className="lf-line" />
            </div>
            <h1>{t('auth.register.title')}</h1>
            <p>VibKech — Luxury & Authenticity</p>
          </div>

          <RoleSelector activeRole={role} setRole={(r) => setRole(r)} />

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error-msg" style={{ marginBottom: '1.5rem' }}>
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
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('auth.register.submit')}
                    <span style={{ fontSize: '1.1rem' }}>→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="login-divider">
            <span />
            <small>OR</small>
            <span />
          </div>

          <p className="login-form-footer">
            {t('auth.register.haveAccount')}{' '}
            <Link to="/login" style={{ color: 'var(--input-focus)', fontWeight: '700', textDecoration: 'none' }}>
              {t('auth.register.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
