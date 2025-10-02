/**
 * Admin Authentication Service
 * Handles admin login, session management, and API key access
 */

import { ADMIN_CONFIG, SECURITY_CONFIG } from '../config/admin';

interface AdminSession {
  isAuthenticated: boolean;
  loginTime: Date;
  expiresAt: Date;
  remainingRequests: number;
}

class AdminAuthService {
  private session: AdminSession | null = null;
  private failedAttempts = 0;
  private lockoutUntil: Date | null = null;

  /**
   * Authenticate admin with password
   */
  async authenticate(
    password: string
  ): Promise<{ success: boolean; message: string; session?: AdminSession }> {
    // Check if locked out
    if (this.lockoutUntil && new Date() < this.lockoutUntil) {
      const remainingTime = Math.ceil((this.lockoutUntil.getTime() - Date.now()) / 1000 / 60);
      return {
        success: false,
        message: `Account locked. Try again in ${remainingTime} minutes.`,
      };
    }

    // Validate password
    if (password !== ADMIN_CONFIG.ADMIN_PASSWORD) {
      this.failedAttempts++;

      if (this.failedAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        this.lockoutUntil = new Date(Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION * 60 * 1000);
        return {
          success: false,
          message: `Too many failed attempts. Account locked for ${SECURITY_CONFIG.LOCKOUT_DURATION} minutes.`,
        };
      }

      const remainingAttempts = SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - this.failedAttempts;
      return {
        success: false,
        message: `Invalid password. ${remainingAttempts} attempts remaining.`,
      };
    }

    // Reset failed attempts on success
    this.failedAttempts = 0;
    this.lockoutUntil = null;

    // Create session
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SECURITY_CONFIG.ADMIN_SESSION_TIMEOUT * 60 * 1000);

    this.session = {
      isAuthenticated: true,
      loginTime: now,
      expiresAt,
      remainingRequests: this.getDailyRemainingRequests(),
    };

    return {
      success: true,
      message: 'Successfully authenticated as admin',
      session: this.session,
    };
  }

  /**
   * Check if admin is currently authenticated
   */
  isAuthenticated(): boolean {
    if (!this.session) return false;

    const now = new Date();
    if (now > this.session.expiresAt) {
      this.session = null;
      return false;
    }

    return this.session.isAuthenticated;
  }

  /**
   * Get admin API key if authenticated
   */
  getAdminApiKey(): string | null {
    if (!this.isAuthenticated()) return null;
    if (!ADMIN_CONFIG.ADMIN_MODE_ENABLED) return null;

    return ADMIN_CONFIG.OPENAI_API_KEY;
  }

  /**
   * Logout admin
   */
  logout(): void {
    this.session = null;
  }

  /**
   * Get current session info
   */
  getSession(): AdminSession | null {
    if (!this.isAuthenticated()) return null;
    return this.session;
  }

  /**
   * Use a request (decrement counter)
   */
  useRequest(): boolean {
    if (!this.session) return false;
    if (this.session.remainingRequests <= 0) return false;

    this.session.remainingRequests--;
    this.updateDailyUsage();
    return true;
  }

  /**
   * Get daily usage stats
   */
  private getDailyRemainingRequests(): number {
    const today = new Date().toDateString();
    const usage = this.getDailyUsage();

    if (usage.date !== today) {
      // Reset for new day
      this.setDailyUsage({ date: today, requests: 0 });
      return ADMIN_CONFIG.DAILY_REQUEST_LIMIT;
    }

    return Math.max(0, ADMIN_CONFIG.DAILY_REQUEST_LIMIT - usage.requests);
  }

  /**
   * Update daily usage
   */
  private updateDailyUsage(): void {
    const today = new Date().toDateString();
    const usage = this.getDailyUsage();

    if (usage.date === today) {
      usage.requests++;
    } else {
      usage.date = today;
      usage.requests = 1;
    }

    this.setDailyUsage(usage);
  }

  /**
   * Get daily usage from storage
   */
  private getDailyUsage(): { date: string; requests: number } {
    try {
      const stored = localStorage.getItem('admin_daily_usage');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load daily usage:', error);
    }

    return { date: new Date().toDateString(), requests: 0 };
  }

  /**
   * Set daily usage in storage
   */
  private setDailyUsage(usage: { date: string; requests: number }): void {
    try {
      localStorage.setItem('admin_daily_usage', JSON.stringify(usage));
    } catch (error) {
      console.warn('Failed to save daily usage:', error);
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): { dailyUsed: number; dailyLimit: number; sessionRemaining: number } {
    const usage = this.getDailyUsage();
    const today = new Date().toDateString();

    return {
      dailyUsed: usage.date === today ? usage.requests : 0,
      dailyLimit: ADMIN_CONFIG.DAILY_REQUEST_LIMIT,
      sessionRemaining: this.session?.remainingRequests || 0,
    };
  }

  /**
   * Check if admin mode is available
   */
  isAdminModeAvailable(): boolean {
    return ADMIN_CONFIG.ADMIN_MODE_ENABLED && !!ADMIN_CONFIG.OPENAI_API_KEY;
  }
}

// Export singleton instance
export const adminAuth = new AdminAuthService();
export type { AdminSession };
