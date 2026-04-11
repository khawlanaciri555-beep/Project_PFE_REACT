import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RatingStars = ({ rating = 0, totalRatings = 0, interactive = false, onRate, size = 18, showCount = true }) => {
  const [hovered, setHovered] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  const getColor = (star) => {
    if (hovered >= star) return "#f1c40f"; // Gold on hover
    if (rating >= star) return "#f1c40f"; // Gold if rated
    return "#e0e0e0"; // Gray if not
  };

  const handleClick = (star) => {
    if (interactive && onRate) {
      onRate(star);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div 
        style={{ display: 'flex', gap: '2px' }}
        onMouseLeave={() => setHovered(0)}
      >
        {stars.map((star) => (
          <motion.svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={getColor(star)}
            stroke={getColor(star)}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ 
              cursor: interactive ? 'pointer' : 'default',
              transition: 'fill 0.2s ease, stroke 0.2s ease'
            }}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onMouseEnter={() => interactive && setHovered(star)}
            onClick={() => handleClick(star)}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </motion.svg>
        ))}
      </div>
      {showCount && (
        <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600' }}>
          {rating > 0 ? rating.toFixed(1) : 'No rating'} {totalRatings > 0 && `(${totalRatings})`}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
