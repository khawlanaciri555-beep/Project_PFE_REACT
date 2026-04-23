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
          className={`role-tab ${activeRole === role.id ? 'active' : ''}`}
          onClick={() => setRole(role.id)}
        >
          {role.label}
          {activeRole === role.id && (
            <motion.div
              layoutId="role-pill"
              className="role-pill-bg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #C58A3A 0%, #cc5533 100%)',
                borderRadius: '12px',
                zIndex: -1,
                boxShadow: '0 4px 12px rgba(197, 138, 58, 0.4)'
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
