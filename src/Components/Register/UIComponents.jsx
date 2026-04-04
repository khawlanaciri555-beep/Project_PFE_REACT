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
  return (
    <div className="file-upload-container">
      <input
        type="file"
        multiple={multiple}
        onChange={onChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
        <div className="file-upload-icon">
          <FaCloudUploadAlt />
        </div>
        <div className="file-upload-text">
          <h4>{label}</h4>
          <p>{description || "Drag & drop or click to upload"}</p>
        </div>
      </label>
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
