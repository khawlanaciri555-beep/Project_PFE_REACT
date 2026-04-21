import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RoleSelector } from '../Components/Register/RoleSelector';
import {
  TouristForm,
  HotelForm,
  TransporteurForm,
  CooperativeForm
} from '../Components/Register/RegisterForms';
import { GradientButton } from '../Components/Register/UIComponents';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../api/axios';
import './Auth.css';

const Register = () => {
  const [role, setRole] = useState('tourist');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  // Unified form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    hotelName: '',
    address: '',
    region: '',
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

    try {
      // Map names based on role
      let name = formData.name || '';
      if (role === 'hotel') name = formData.hotelName;
      if (role === 'transporteur') name = formData.company;
      if (role === 'cooperative') name = formData.cooperativeName;
      if (role === 'tourist') name = formData.name || formData.email.split('@')[0];

      const payload = {
        name: name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password, // Frontend uses same password for confirmation for simplicity
        role: role === 'tourist' ? 'tourist' : role, // Match Laravel enum ['tourist', 'guide', 'hotel', 'coop', 'admin']
      };

      // Correct role mapping for Laravel enum
      if (payload.role === 'cooperative') payload.role = 'coop';
      if (payload.role === 'transporteur') payload.role = 'transport';

      const response = await api.post('/register', payload);
      
      console.log('Registration successful:', response.data);
      
      // Store token
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSubmitted(true);
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed: ' + (err.response?.data?.message || 'Check your information and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (role) {
      case 'tourist': return <TouristForm data={formData} onChange={handleInputChange} />;
      case 'hotel': return <HotelForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} />;
      case 'transporteur': return <TransporteurForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} />;
      case 'cooperative': return <CooperativeForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} />;
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
    <div className="auth-page">
      <div className="register-card">
        <div className="auth-header">
          <h1>{t('auth.register.title')}</h1>
          <p>VibKech</p>
        </div>

        <RoleSelector activeRole={role} setRole={(r) => {
          setRole(r);
          // Optional: Clear form data when switching roles
        }} />

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>

          <div style={{ marginTop: '2.5rem' }}>
            <GradientButton loading={loading}>
              {t('auth.register.submit')}
            </GradientButton>
          </div>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>{t('auth.register.haveAccount')} <Link to="/login" style={{ color: 'var(--input-focus)', fontWeight: 'bold' }}>{t('auth.register.login')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
