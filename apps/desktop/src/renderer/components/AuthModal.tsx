/**
 * Authentication Modal Component
 * Provides options for admin login or user-provided API key
 */

import React, { useState } from 'react';
import { X, Shield, Key, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { AdminLogin } from './AdminLogin';
import { SecureApiKeyConfig } from './SecureApiKeyConfig';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState<'choice' | 'admin' | 'user'>('choice');

  if (!isOpen) return null;

  const handleAuthChange = (authenticated: boolean) => {
    if (authenticated) {
      onAuthSuccess();
      onClose();
    }
  };

  const handleKeyConfigured = (configured: boolean) => {
    if (configured) {
      onAuthSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {authMode === 'choice' && (
          <Card className="bg-white/95 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">
                  Choose Authentication Method
                </CardTitle>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Choose how you'd like to authenticate for AI tutoring:
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => setAuthMode('admin')}
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Shield className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Admin Login</div>
                    <div className="text-xs opacity-90">Use admin password for pre-configured API key</div>
                  </div>
                </Button>

                <Button
                  onClick={() => setAuthMode('user')}
                  variant="outline"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Key className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Your Own API Key</div>
                    <div className="text-xs opacity-75">Provide your personal OpenAI API key</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {authMode === 'admin' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setAuthMode('choice')}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <AdminLogin onAuthChange={handleAuthChange} />
          </div>
        )}

        {authMode === 'user' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={() => setAuthMode('choice')}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Card className="bg-white/95 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Configure Your API Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SecureApiKeyConfig onKeyConfigured={handleKeyConfigured} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};