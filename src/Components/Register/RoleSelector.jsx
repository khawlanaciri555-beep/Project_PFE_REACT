import React from 'react';
import { motion } from 'framer-motion';

const roles = [
  { id: 'tourist', label: 'Tourist' },
  { id: 'hotel', label: 'Hébergement' },
  { id: 'transporteur', label: 'Transporteur' },
  { id: 'cooperative', label: 'Cooperative' }
];

export const RoleSelector = ({ activeRole, setRole }) => {
  return (
    <div className="role-selector-container">
      {roles.map((role) => (
        <button
          key={role.id}
          type="button"
          className={`role-tab ${activeRole === role.id ? 'active' : ''}`}
          onClick={() => setRole(role.id)}
          style={{ position: 'relative' }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>{role.label}</span>
          {activeRole === role.id && (
            <motion.div
              layoutId="role-pill"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                zIndex: 1,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
