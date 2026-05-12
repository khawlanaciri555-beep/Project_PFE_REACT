// User role constants
export const ROLES = {
  ADMIN: 'admin',
  TOURIST: 'tourist',
  HOTEL: 'hotel',
  TRANSPORT: 'transport',
  COOPERATIVE: 'cooperative',
};

export const PROFESSIONAL_ROLES = [
  ROLES.HOTEL,
  ROLES.TRANSPORT,
  ROLES.COOPERATIVE,
  ROLES.COOP,
  ROLES.GUIDE,
];

export const isProfessionalRole = (role) => PROFESSIONAL_ROLES.includes(role);
