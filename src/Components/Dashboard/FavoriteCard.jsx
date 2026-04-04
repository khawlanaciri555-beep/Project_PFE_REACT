import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FavoriteCard = ({ place, onRemove }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card-glass"
      style={{ 
        background: 'white', 
        border: '1px solid var(--glass-border)', 
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ height: '180px', overflow: 'hidden' }}>
        <img src={place.image} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '1.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--dash-accent)', fontWeight: '700', textTransform: 'uppercase' }}>{place.category}</span>
        <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>{place.title}</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Link to={`/place/${place.id}`} style={{ flex: 1, textDecoration: 'none' }}>
            <button style={{ 
              width: '100%', 
              background: 'rgba(188, 73, 49, 0.05)', 
              color: 'var(--dash-accent)', 
              border: '1px solid var(--glass-border)', 
              padding: '0.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '700'
            }}>
              <FaEye /> View
            </button>
          </Link>
          <button 
            onClick={() => onRemove(place.id)}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              padding: '0.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteCard;
