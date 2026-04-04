import React from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser } from 'react-icons/fa';

const BookingCard = ({ request, onStatusChange }) => {
  const isPending = request.status === 'pending';

  return (
    <div 
      className="card-glass"
      style={{ 
        background: 'white', 
        border: '1px solid var(--glass-border)', 
        padding: '1.5rem', 
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        opacity: request.status === 'rejected' ? 0.6 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.1rem' }}>
            <FaUser style={{ color: 'var(--dash-accent)', fontSize: '0.9rem' }} />
            {request.user}
          </h4>
          <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: 'var(--dash-text-muted)' }}>
            {request.service}
          </p>
        </div>
        <span 
          style={{ 
            fontSize: '1rem', 
            fontWeight: '700', 
            color: 'var(--dash-accent)' 
          }}
        >
          {request.amount}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--dash-text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FaCalendarAlt /> {request.date}
        </span>
        <span style={{ 
          color: request.status === 'confirmed' ? '#10b981' : (request.status === 'rejected' ? '#ef4444' : 'var(--dash-accent)'),
          fontWeight: '700',
          textTransform: 'uppercase'
        }}>
          ● {request.status}
        </span>
      </div>

      {isPending && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button 
            onClick={() => onStatusChange(request.id, 'confirmed')}
            style={{ 
              flex: 1, 
              background: '#10b981', 
              color: '#fff', 
              border: 'none', 
              padding: '0.6rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontWeight: '600'
            }}
          >
            <FaCheck /> Accept
          </button>
          <button 
            onClick={() => onStatusChange(request.id, 'rejected')}
            style={{ 
              flex: 1, 
              background: '#ef4444', 
              color: '#fff', 
              border: 'none', 
              padding: '0.6rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontWeight: '600'
            }}
          >
            <FaTimes /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
