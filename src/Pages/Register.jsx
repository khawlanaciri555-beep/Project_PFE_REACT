import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RoleSelector } from '../Components/Register/RoleSelector';
import { 
  TouristForm, 
  HotelForm, 
  GuideForm, 
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
    
    // Simulate API call
    console.log('Submitting for role:', role);
    console.log('Form data:', formData);
    console.log('Files:', files);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  const renderForm = () => {
    switch (role) {
      case 'tourist': return <TouristForm data={formData} onChange={handleInputChange} />;
      case 'hotel': return <HotelForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} />;
      case 'guide': return <GuideForm data={formData} onChange={handleInputChange} onFileChange={handleFileChange} />;
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
          <h1>Registration Successful!</h1>
          <p>Your account as a <strong>{role}</strong> has been created. Please check your email for verification.</p>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <GradientButton>Go to Login</GradientButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="register-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the AL-RIAD experience</p>
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
              Register as {role.charAt(0).toUpperCase() + role.slice(1)}
            </GradientButton>
          </div>
        </form>

        <div className="auth-footer" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Already have an account? <Link to="/login" style={{ color: 'var(--input-focus)', fontWeight: 'bold' }}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
