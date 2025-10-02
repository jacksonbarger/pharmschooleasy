/**
 * Secure API Key Configuration Component
 * Provides a safe interface for managing OpenAI API keys
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, CheckCircle, AlertCircle, Key, Trash2 } from 'lucide-react';
import { OpenAIService } from '../services/openai';

interface SecureApiKeyConfigProps {
  onKeyConfigured?: (configured: boolean) => void;
  className?: string;
}

export const SecureApiKeyConfig: React.FC<SecureApiKeyConfigProps> = ({
  onKeyConfigured,
  className = ''
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  
  const openAIService = new OpenAIService();

  // Check if key is already configured on mount
  useEffect(() => {
    const configured = openAIService.isConfigured();
    setIsConfigured(configured);
    if (configured) {
      setMaskedKey(openAIService.getMaskedKey());
      setValidationStatus('valid');
    }
    onKeyConfigured?.(configured);
  }, [onKeyConfigured]);

  const validateKeyFormat = (key: string): boolean => {
    const patterns = [
      /^sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}$/, // Legacy format
      /^sk-proj-[a-zA-Z0-9_-]{43,}$/, // New project format
      /^sk-[a-zA-Z0-9_-]{43,}$/ // General format
    ];
    
    return patterns.some(pattern => pattern.test(key.trim()));
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
    setErrorMessage('');
    
    if (value.length === 0) {
      setValidationStatus('idle');
    } else if (!validateKeyFormat(value)) {
      setValidationStatus('invalid');
      setErrorMessage('Invalid API key format');
    } else {
      setValidationStatus('idle');
    }
  };

  const handleSaveKey = async () => {
    if (!validateKeyFormat(apiKey)) {
      setValidationStatus('invalid');
      setErrorMessage('Please enter a valid OpenAI API key');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');

    try {
      await openAIService.setApiKey(apiKey);
      setValidationStatus('valid');
      setIsConfigured(true);
      setMaskedKey(openAIService.getMaskedKey());
      setApiKey(''); // Clear input for security
      onKeyConfigured?.(true);
    } catch (error) {
      setValidationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearKey = () => {
    if (window.confirm('Are you sure you want to remove your API key? This will disable AI features.')) {
      openAIService.clearApiKey();
      setIsConfigured(false);
      setMaskedKey('');
      setValidationStatus('idle');
      setApiKey('');
      setErrorMessage('');
      onKeyConfigured?.(false);
    }
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'invalid':
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Key className="h-5 w-5 text-white/60" />;
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'border-green-400/50 bg-green-500/10';
      case 'invalid':
      case 'error':
        return 'border-red-400/50 bg-red-500/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  if (isConfigured) {
    return (
      <div className={`glass-purple rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">API Key Configured</h3>
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        
        <div className="space-y-4">
          <div className="glass-dark rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Current Key</p>
                <p className="text-white font-mono text-sm">{maskedKey}</p>
              </div>
              <button
                onClick={handleClearKey}
                className="glass-rose p-2 rounded-lg hover:scale-105 transition-all duration-200"
                title="Remove API Key"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="glass-dark rounded-xl p-4">
            <h4 className="text-white/90 font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="h-3 w-3" />
                <span>API key encrypted in local storage</span>
              </div>
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="h-3 w-3" />
                <span>Automatic clearing on app close</span>
              </div>
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="h-3 w-3" />
                <span>Rate limiting enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-purple rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Secure API Key Setup</h3>
      </div>

      <div className="space-y-4">
        {/* Security Notice */}
        <div className="glass-dark rounded-xl p-4 border border-blue-400/30">
          <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Features
          </h4>
          <ul className="text-sm text-white/70 space-y-1">
            <li>• API key validation before saving</li>
            <li>• Encrypted local storage</li>
            <li>• Automatic rate limiting</li>
            <li>• Memory clearing on app close</li>
          </ul>
        </div>

        {/* API Key Input */}
        <div className="space-y-3">
          <label className="block text-white/80 font-medium">
            OpenAI API Key
          </label>
          
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleKeyChange}
              placeholder="sk-proj-your-api-key-here..."
              className={`w-full pl-12 pr-12 py-3 rounded-xl text-white placeholder-white/50 
                focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200
                ${getStatusColor()}`}
            />
            
            {/* Status Icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {getStatusIcon()}
            </div>
            
            {/* Toggle Visibility */}
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
            >
              {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Help Text */}
          <p className="text-white/60 text-sm">
            Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 underline"
            >
              platform.openai.com/api-keys
            </a>
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveKey}
          disabled={!validateKeyFormat(apiKey) || isValidating}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 
            ${validateKeyFormat(apiKey) && !isValidating
              ? 'glass-emerald hover:scale-105 text-white'
              : 'glass-dark text-white/50 cursor-not-allowed'
            }`}
        >
          {isValidating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Validating...</span>
            </div>
          ) : (
            'Save & Validate API Key'
          )}
        </button>
      </div>
    </div>
  );
};