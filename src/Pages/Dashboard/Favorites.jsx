import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../Components/Dashboard/DashboardLayout';
import FavoriteCard from '../../Components/Dashboard/FavoriteCard';
import api from '../../api/axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(favorites.filter(item => item.id !== id));
    } catch (err) {
      alert('Error removing favorite');
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-title-section">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          My Favorites
        </motion.h1>
        <p style={{ color: 'var(--dash-text-muted)' }}>Locations and services you've saved for your Marrakech trip.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
           <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '40px', height: '40px', border: '4px solid var(--dash-accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          <AnimatePresence>
            {favorites.length > 0 ? (
              favorites.map((place) => (
                <FavoriteCard key={place.id} place={place} onRemove={handleRemove} />
              ))
            ) : (
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0' }}
              >
                <h3 style={{ color: 'var(--dash-text-muted)' }}>You haven't saved any favorites yet.</h3>
                <p>Explore Marrakech to find hidden gems!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Favorites;
