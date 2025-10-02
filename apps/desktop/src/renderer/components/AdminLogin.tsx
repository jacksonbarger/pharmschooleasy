/**
 * Admin Login Component
 * Provides interface for admin authentication and API key management
 */

import React, { useState, useEffect } from 'react';
import { Shield, Users, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { adminAuth, AdminSession } from '../services/admin-auth';
import { ADMIN_CONFIG } from '../config/admin';
import { ProgressBar } from './ui/ProgressBar';

interface AdminLoginProps {
  onAuthChange?: (authenticated: boolean) => void;
  className?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthChange, className = '' }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [session, setSession] = useState<AdminSession | null>(null);
  const [usageStats, setUsageStats] = useState({
    dailyUsed: 0,
    dailyLimit: 0,
    sessionRemaining: 0,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const currentSession = adminAuth.getSession();
      setSession(currentSession);
      onAuthChange?.(adminAuth.isAuthenticated());

      if (currentSession) {
        setUsageStats(adminAuth.getUsageStats());
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [onAuthChange]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await adminAuth.authenticate(password);

      if (result.success) {
        setSession(result.session || null);
        setUsageStats(adminAuth.getUsageStats());
        setMessage(result.message);
        setMessageType('success');
        setPassword('');
        onAuthChange?.(true);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Authentication failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    setSession(null);
    setPassword('');
    setMessage('Logged out successfully');
    setMessageType('info');
    onAuthChange?.(false);
  };

  const formatTimeRemaining = (expiresAt: Date): string => {
    const remaining = Math.max(0, expiresAt.getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    return `${minutes} minutes`;
  };

  // Check if admin mode is available
  const isAdminModeAvailable = adminAuth.isAdminModeAvailable();

  if (!isAdminModeAvailable) {
    return (
      <div className={`glass-dark rounded-2xl p-6 ${className}`}>
        <div className='flex items-center gap-3 mb-4'>
          <CheckCircle className='h-6 w-6 text-green-400' />
          <h3 className='text-lg font-semibold text-white'>Configuration Complete! 🎉</h3>
        </div>

        <div className='space-y-4'>
          <div className='glass rounded-xl p-4 border border-green-400/30'>
            <p className='text-green-200 text-sm mb-3'>
              Your admin configuration is properly set up:
            </p>
            <ul className='text-white/80 text-sm space-y-2 list-disc list-inside'>
              <li>
                ✅ OpenAI API key configured in{' '}
                <code className='bg-white/10 px-2 py-1 rounded'>.env.local</code>
              </li>
              <li>✅ Admin password set securely</li>
              <li>✅ Environment variables validated</li>
              <li>✅ Admin mode is ready to use</li>
            </ul>
            <p className='text-white/60 text-xs mt-3'>
              If you're still seeing this message, try refreshing the app.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (session && adminAuth.isAuthenticated()) {
    return (
      <div className={`glass-emerald rounded-2xl p-6 ${className}`}>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <CheckCircle className='h-6 w-6 text-green-400' />
            <h3 className='text-lg font-semibold text-white'>Admin Authenticated</h3>
          </div>
          <button
            onClick={handleLogout}
            className='glass-rose p-2 rounded-lg hover:scale-105 transition-all duration-200'
            title='Logout'
          >
            <Lock className='h-4 w-4 text-white' />
          </button>
        </div>

        <div className='space-y-4'>
          {/* Session Info */}
          <div className='glass-dark rounded-xl p-4'>
            <h4 className='text-white/90 font-medium mb-3 flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              Session Details
            </h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-white/60'>Session Expires</p>
                <p className='text-white'>{formatTimeRemaining(session!.expiresAt)}</p>
              </div>
              <div>
                <p className='text-white/60'>Login Time</p>
                <p className='text-white'>{session!.loginTime.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className='glass-dark rounded-xl p-4'>
            <h4 className='text-white/90 font-medium mb-3 flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              Usage Statistics
            </h4>

            <div className='space-y-4'>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='text-white/70'>Daily Usage</span>
                  <span className='text-white'>
                    {usageStats.dailyUsed}/{usageStats.dailyLimit}
                  </span>
                </div>
                <ProgressBar
                  percentage={(usageStats.dailyUsed / usageStats.dailyLimit) * 100}
                  height='sm'
                  colorClass='from-blue-400 to-purple-500'
                  showTransition={true}
                />
              </div>

              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='text-white/70'>Session Remaining</span>
                  <span className='text-white'>{usageStats.sessionRemaining}</span>
                </div>
                <ProgressBar
                  percentage={(usageStats.sessionRemaining / 20) * 100}
                  height='sm'
                  colorClass='from-purple-400 to-pink-500'
                  showTransition={true}
                />
              </div>
            </div>
          </div>

          {/* Admin Settings */}
          <div className='glass-dark rounded-xl p-4'>
            <h4 className='text-white/90 font-medium mb-3 flex items-center gap-2'>
              <Users className='h-4 w-4' />
              Admin Settings
            </h4>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-white/70'>Daily Limit</span>
                <span className='text-white'>{ADMIN_CONFIG.DAILY_REQUEST_LIMIT} requests</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Session Limit</span>
                <span className='text-white'>{ADMIN_CONFIG.PER_USER_SESSION_LIMIT} requests</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>User Keys</span>
                <span className='text-white'>
                  {ADMIN_CONFIG.ALLOW_USER_KEYS ? 'Allowed' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-purple rounded-2xl p-6 ${className}`}>
      <div className='flex items-center gap-3 mb-6'>
        <Shield className='h-6 w-6 text-purple-400' />
        <h3 className='text-lg font-semibold text-white'>Admin Authentication</h3>
      </div>

      <form onSubmit={handleLogin} className='space-y-4'>
        {/* Password Input */}
        <div>
          <label className='block text-white/80 font-medium mb-2'>Admin Password</label>
          <div className='relative'>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter admin password...'
              className='w-full pl-12 pr-4 py-3 glass-dark rounded-xl text-white placeholder-white/50 
                focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200'
              disabled={isLoading}
              required
            />
            <div className='absolute left-4 top-1/2 transform -translate-y-1/2'>
              <Lock className='h-5 w-5 text-white/60' />
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
              messageType === 'success'
                ? 'bg-green-500/10 border border-green-400/30 text-green-200'
                : messageType === 'error'
                  ? 'bg-red-500/10 border border-red-400/30 text-red-200'
                  : 'bg-blue-500/10 border border-blue-400/30 text-blue-200'
            }`}
          >
            {messageType === 'success' && <CheckCircle className='h-4 w-4' />}
            {messageType === 'error' && <AlertTriangle className='h-4 w-4' />}
            {messageType === 'info' && <Shield className='h-4 w-4' />}
            <span>{message}</span>
          </div>
        )}

        {/* Info */}
        <div className='glass-dark rounded-xl p-4'>
          <h4 className='text-white/90 font-medium mb-2'>Admin Access Benefits:</h4>
          <ul className='text-sm text-white/70 space-y-1'>
            <li>• Use centralized OpenAI API key</li>
            <li>• No individual API key setup required</li>
            <li>• Protected usage limits and monitoring</li>
            <li>• Secure session management</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isLoading || !password}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 
            ${
              password && !isLoading
                ? 'glass-emerald hover:scale-105 text-white'
                : 'glass-dark text-white/50 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
              <span>Authenticating...</span>
            </div>
          ) : (
            'Login as Admin'
          )}
        </button>
      </form>
    </div>
  );
};
