// Environment configuration
const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://removealist.eu.pythonanywhere.com/api/',
  // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api', // Development URL
  // App Configuration
  APP_NAME: process.env.REACT_APP_APP_NAME || 'RemoveList',
  APP_VERSION: process.env.REACT_APP_APP_VERSION || '1.0.0',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_SOCIAL_LOGIN: process.env.REACT_APP_ENABLE_SOCIAL_LOGIN === 'true',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS !== 'false',
  
  // External Services
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
  GOOGLE_PLACES_API_KEY: process.env.REACT_APP_GOOGLE_PLACES_API_KEY|| 'AIzaSyBBbDRV4FhiuvhZHSoLq01yJo0DhHWK4Gw',
  
  // Analytics
  GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  
  // Development helpers
  isDevelopment: () => config.ENVIRONMENT === 'development',
  isProduction: () => config.ENVIRONMENT === 'production',
  isStaging: () => config.ENVIRONMENT === 'staging',
}

export default config

