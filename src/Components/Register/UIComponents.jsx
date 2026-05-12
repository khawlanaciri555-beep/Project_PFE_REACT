import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCloudUploadAlt, FaSearch, FaChevronDown } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

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
        placeholder={label}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
      />
      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      )}
    </div>
  );
};

export const CustomSelect = ({ icon: Icon, label, options, value, onChange, name, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find(opt => opt.value === value);
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val) => {
    // Simulate event for compatibility with handleInputChange
    onChange({ target: { name, value: val } });
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="floating-group custom-select-wrapper">
      <div className="input-icon">
        <Icon />
      </div>
      
      <div 
        className={`styled-select custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selectedOption ? 'placeholder' : ''}>
          {selectedOption ? selectedOption.label : label}
        </span>
        <FaChevronDown className={`chevron-icon ${isOpen ? 'rotated' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="custom-select-dropdown"
          >
            <div className="select-search-box">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            
            <div className="select-options-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div 
                    key={opt.value} 
                    className={`select-option ${value === opt.value ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    {opt.label}
                    {value === opt.value && <span className="selected-dot" />}
                  </div>
                ))
              ) : (
                <div className="no-options">Aucun résultat</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden input for HTML5 validation if required */}
      <input 
        type="text" 
        value={value} 
        required={required} 
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', bottom: 0, left: '50%' }}
        readOnly 
      />
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

  const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="file-upload-wrapper" style={{ marginBottom: '1.5rem' }}>
      <input
        type="file"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id={inputId}
      />
      <label htmlFor={inputId} className="file-upload-container">
        <div className="file-upload-icon">
          <FaCloudUploadAlt />
        </div>
        <div className="file-upload-text">
          <h4>{label}</h4>
          <p>{description || "Drag & drop or click to upload"}</p>
        </div>
      </label>
      
      {previews.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover', 
                  borderRadius: '12px', 
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
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
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      className="auth-submit-btn"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <div className="spinner"></div> : children}
    </motion.button>
  );
};
