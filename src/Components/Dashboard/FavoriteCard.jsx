import React from 'react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FavoriteButton from '../FavoriteButton';

const FavoriteCard = ({ place, onRemove }) => {
  const placeData = place.place; // Accessing the nested place object from FavoriteResource

  if (!placeData) return null;

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
      <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
        <FavoriteButton 
          placeId={placeData.id} 
          initialIsFavorited={true} 
          initialFavoriteId={place.id}
          onToggle={(pId, isFav) => {
            if (!isFav) onRemove(place.id);
          }}
        />
        <img src={placeData.image} alt={placeData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '1.25rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--dash-accent)', fontWeight: '700', textTransform: 'uppercase' }}>{placeData.category}</span>
        <h3 style={{ fontSize: '1.1rem', margin: '0.25rem 0' }}>{placeData.title}</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Link to={`/place/${placeData.id}`} style={{ flex: 1, textDecoration: 'none' }}>
            <button style={{ 
              width: '100%', 
              background: 'rgba(188, 73, 49, 0.05)', 
              color: 'var(--dash-accent)', 
              border: '1px solid var(--glass-border)', 
              padding: '0.6rem', 
              borderRadius: '12px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '700',
              transition: '0.3s'
            }}>
              <FaEye /> View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteCard;
