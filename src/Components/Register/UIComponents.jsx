import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCloudUploadAlt } from 'react-icons/fa';

export const FloatingInput = ({ icon: Icon, label, type = "text", value, onChange, name, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="floating-group">
      <div className="input-icon">
        <Icon />
      </div>
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className="floating-input"
        placeholder=" "
        value={value}
        onChange={onChange}
        name={name}
        required={required}
      />
      <label className="floating-label">{label}</label>
      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};

export const CustomSelect = ({ icon: Icon, label, options, value, onChange, name, required = false }) => {
  return (
    <div className="floating-group">
      <div className="input-icon">
        <Icon />
      </div>
      <select
        className="styled-select"
        value={value}
        onChange={onChange}
        name={name}
        required={required}
      >
        <option value="" disabled>{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const FileUpload = ({ label, description, onChange, multiple = false }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    if (onChange) onChange(e);
    
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => {
        // Only create preview for images
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return null;
      }).filter(url => url !== null);
      
      setPreviews(newPreviews);
    } else {
      setPreviews([]);
    }
  };

  // Generate a unique ID based on the label
  const inputId = `file-upload-${label.replace(/\\s+/g, '-')}`;

  return (
    <div className="file-upload-container" style={{ marginBottom: '1.5rem' }}>
      <input
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={inputId}
      />
      <label htmlFor={inputId} style={{ cursor: 'pointer', display: 'block', padding: '2rem', border: '2px dashed #cbd5e1', borderRadius: '15px', textAlign: 'center', transition: 'all 0.3s ease', background: '#f8fafc' }}>
        <div className="file-upload-icon" style={{ fontSize: '2.5rem', color: '#64748b', marginBottom: '0.5rem' }}>
          <FaCloudUploadAlt />
        </div>
        <div className="file-upload-text">
          <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: '600' }}>{label}</h4>
          <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{description || "Drag & drop or click to upload"}</p>
        </div>
      </label>
      
      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
          {previews.map((preview, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'relative' }}
            >
              <img 
                src={preview} 
                alt={`preview-${index}`} 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  objectFit: 'cover', 
                  borderRadius: '10px', 
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }} 
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export const GradientButton = ({ children, loading, onClick, type = "submit" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="submit-btn"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <div className="spinner"></div> : children}
    </motion.button>
  );
};
