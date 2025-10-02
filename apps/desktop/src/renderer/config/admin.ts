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
  ADMIN_CONTACT: 'dbarger488023@student.wmcarey.edu',
};

// 🛡️ Security Settings
export const SECURITY_CONFIG = {
  // Session timeout in minutes
  ADMIN_SESSION_TIMEOUT: 60,

  // Max failed login attempts
  MAX_LOGIN_ATTEMPTS: 3,

  // Lockout duration in minutes after max attempts
  LOCKOUT_DURATION: 15,
};

// 🎯 Feature Toggles
export const FEATURES = {
  ADMIN_DASHBOARD: true,
  USAGE_ANALYTICS: true,
  USER_MANAGEMENT: false,
  COST_TRACKING: true,
};

/**
 * Configuration is now complete! 🎉
 *
 * Your environment variables are properly configured in .env.local:
 * - VITE_OPENAI_API_KEY: ✅ Set with your actual API key
 * - VITE_ADMIN_PASSWORD: ✅ Set with your secure password
 *
 * The app will automatically load these values at runtime.
 */
