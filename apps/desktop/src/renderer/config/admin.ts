/**
 * Admin Configuration - Secured with Environment Variables
 * All sensitive data is now stored in .env.local (never committed to git)
 * Users authenticate with admin password to use your API key
 */

import { validateAndGetConfig } from './environment';

// 🔐 ADMIN CONFIGURATION - Loaded from Environment Variables
const envConfig = validateAndGetConfig();

export const ADMIN_CONFIG = {
  // OpenAI API Key from environment variables
  OPENAI_API_KEY: envConfig.openaiApiKey,
  
  // Admin password from environment variables  
  ADMIN_PASSWORD: envConfig.adminPassword,
  
  // Usage limits to protect your API costs
  DAILY_REQUEST_LIMIT: envConfig.dailyRequestLimit,
  PER_USER_SESSION_LIMIT: envConfig.perUserSessionLimit,
  
  // Enable/disable admin mode
  ADMIN_MODE_ENABLED: envConfig.adminModeEnabled,
  
  // Allow users to still use their own keys
  ALLOW_USER_KEYS: true,
  
  // App settings
  APP_TITLE: 'Pharmacy Study Assistant',
  ADMIN_CONTACT: 'dbarger488023@student.wmcarey.edu'
};

// 🛡️ Security Settings
export const SECURITY_CONFIG = {
  // Session timeout in minutes
  ADMIN_SESSION_TIMEOUT: 60,
  
  // Max failed login attempts
  MAX_LOGIN_ATTEMPTS: 3,
  
  // Lockout duration in minutes after max attempts
  LOCKOUT_DURATION: 15
};

// 🎯 Feature Toggles
export const FEATURES = {
  ADMIN_DASHBOARD: true,
  USAGE_ANALYTICS: true,
  USER_MANAGEMENT: false,
  COST_TRACKING: true
};

/**
 * Instructions for setup:
 * 
 * 1. Replace 'YOUR_OPENAI_API_KEY_HERE' with your actual OpenAI API key
 * 2. Change 'admin123' to a secure password of your choice
 * 3. Adjust usage limits based on your OpenAI plan
 * 4. Set ADMIN_MODE_ENABLED to true to enable the system
 * 5. Optionally disable ALLOW_USER_KEYS to force all users to use admin key
 */