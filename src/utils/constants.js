/**
 * FleetFlow Global Constants
 */

export const COLORS = {
  primary: '#1e40af', // Blue 800
  secondary: '#64748b', // Slate 500
  success: '#16a34a', // Green 600
  warning: '#ea580c', // Orange 600
  danger: '#dc2626', // Red 600
  info: '#0284c7', // Sky 600
  background: '#f8fafc', // Slate 50
  card: '#ffffff',
  text: '#1e293b', // Slate 800
  textLight: '#64748b', // Slate 500
};

export const STATUS_COLORS = {
  // Vehicle Status
  AVAILABLE: 'success',
  ON_TRIP: 'info',
  IN_SHOP: 'danger',
  RETIRED: 'secondary',
  
  // Trip Status
  DRAFT: 'warning',
  DISPATCHED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'secondary',

  // Driver Status
  ON_DUTY: 'info',
  OFF_DUTY: 'success',
  SUSPENDED: 'danger',
};

export const USER_ROLES = {
  MANAGER: 'Fleet Manager',
  DISPATCHER: 'Dispatcher',
  SAFETY: 'Safety Officer',
  ANALYST: 'Financial Analyst',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.MANAGER]: ['dashboard', 'vehicles', 'trips', 'maintenance', 'expenses', 'drivers', 'analytics'],
  [USER_ROLES.DISPATCHER]: ['dashboard', 'vehicles', 'trips'],
  [USER_ROLES.SAFETY]: ['dashboard', 'drivers', 'vehicles'], // Access to vehicles for compliance
  [USER_ROLES.ANALYST]: ['dashboard', 'analytics', 'expenses'],
};

export const API_DELAY = 1000;
