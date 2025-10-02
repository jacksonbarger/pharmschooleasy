/// <reference types="vite/client" />

/**
 * Environment Configuration Helper
 * Provides type-safe access to environment variables with validation
 */

interface EnvironmentConfig {
  openaiApiKey: string;
  adminPassword: string;
  dailyRequestLimit: number;
  perUserSessionLimit: number;
  adminModeEnabled: boolean;
  appVersion: string;
  isDevelopment: boolean;
}

/// <reference types="vite/client" />

/**
 * Environment configuration utilities
 */

/**
 * Get environment variable safely with fallback
 */
function getEnvVar(key: string, fallback: string = ''): string {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as any)[key] || fallback;
  }
  return fallback;
}

/**
 * Validate that required environment variables are set
 */
function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = ['VITE_OPENAI_API_KEY', 'VITE_ADMIN_PASSWORD'];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    const value = getEnvVar(varName);
    if (!value || value === '' || value.includes('your-') || value.includes('<your')) {
      missingVars.push(varName);
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

/**
 * Get configuration from environment variables
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    openaiApiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    adminPassword: getEnvVar('VITE_ADMIN_PASSWORD'),
    dailyRequestLimit: Number(getEnvVar('VITE_DAILY_REQUEST_LIMIT', '100')),
    perUserSessionLimit: Number(getEnvVar('VITE_PER_USER_SESSION_LIMIT', '20')),
    adminModeEnabled: getEnvVar('VITE_ADMIN_MODE_ENABLED', 'true') === 'true',
    appVersion: getEnvVar('VITE_APP_VERSION', '0.1.0'),
    isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
  };
}

/**
 * Validate environment and throw helpful errors if misconfigured
 */
export function validateAndGetConfig(): EnvironmentConfig {
  const validation = validateEnvironment();

  if (!validation.isValid) {
    console.error('❌ Missing required environment variables:', validation.missingVars);
    console.error(
      '📋 Please check your .env.local file and ensure all required variables are set.'
    );
    console.error('📖 See README.md for setup instructions.');
  }

  return getEnvironmentConfig();
}

/**
 * Check if environment is properly configured
 */
export function isEnvironmentConfigured(): boolean {
  return validateEnvironment().isValid;
}
