// Application constants

export const ACTIVITY_TYPES = {
  RECYCLING: 'recycling',
  TRANSPORTATION: 'transportation',
  ENERGY: 'energy',
  WATER: 'water',
  FOOD: 'food',
  SHOPPING: 'shopping',
};

export const BADGE_TYPES = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  LOG_ACTIVITY: '/log-activity',
  IMPACT: '/impact',
  LEADERBOARD: '/leaderboard',
  BADGE_STORE: '/badge-store',
  WASTE_CLASSIFIER: '/waste-classifier',
  PROFILE: '/profile',
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  ACTIVITIES: '/activities',
  LEADERBOARD: '/leaderboard',
};

export default {
  ACTIVITY_TYPES,
  BADGE_TYPES,
  ROUTES,
  API_ENDPOINTS,
};
