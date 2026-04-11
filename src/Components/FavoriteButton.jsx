import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const FavoriteButton = ({ placeId, initialIsFavorited = false, initialFavoriteId = null, onToggle, style = {} }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [favId, setFavId] = useState(initialFavoriteId);
  const [loading, setLoading] = useState(false);

  // Update internal state if props change (important for lists)
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
    setFavId(initialFavoriteId);
  }, [initialIsFavorited, initialFavoriteId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setLoading(true);
    try {
      if (isFavorited && favId) {
        await api.delete(`/favorites/${favId}`);
        setIsFavorited(false);
        setFavId(null);
        if (onToggle) onToggle(placeId, false);
      } else {
        const response = await api.post('/favorites', { place_id: placeId });
        // The Laravel resource usually wraps in 'data'
        const data = response.data.data ? response.data.data : response.data;
        setIsFavorited(true);
        setFavId(data.id);
        if (onToggle) onToggle(placeId, true, data.id);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={toggleFavorite}
      className={`favorite-btn-overlay ${isFavorited ? 'is-favorited' : ''} ${loading ? 'loading' : ''}`}
      style={style}
      disabled={loading}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.button>
  );
};

export default FavoriteButton;
