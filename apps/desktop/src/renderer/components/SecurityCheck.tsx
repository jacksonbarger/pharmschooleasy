/**
 * Security Validation Component
 * Displays warnings if environment is not properly configured
 */

import React from 'react';
import { isEnvironmentConfigured } from '../config/environment';

export const SecurityCheck: React.FC = () => {
  const isConfigured = isEnvironmentConfigured();

  if (isConfigured) {
    return null; // Don't render anything if properly configured
  }

  return (
    <div className="fixed top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg z-50 max-w-md">
      <div className="flex items-start space-x-3">
        <div className="text-xl">⚠️</div>
        <div>
          <h3 className="font-bold text-sm mb-1">Environment Not Configured</h3>
          <p className="text-xs opacity-90 mb-2">
            API keys or admin password not set. Check your <code>.env.local</code> files.
          </p>
          <p className="text-xs opacity-75">
            See <code>ENVIRONMENT-SETUP.md</code> for instructions.
          </p>
        </div>
      </div>
    </div>
  );
};