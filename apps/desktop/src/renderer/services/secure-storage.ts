/**
 * Secure API Key Storage Service
 * Provides encrypted storage and validation for OpenAI API keys
 */

interface ApiKeyStorage {
  get(): string | null;
  set(key: string): Promise<boolean>;
  clear(): void;
  isValid(): boolean;
  test(): Promise<boolean>;
}

class SecureApiKeyStorage implements ApiKeyStorage {
  private readonly STORAGE_KEY = 'encrypted_api_key';
  private readonly SALT_KEY = 'api_key_salt';
  private memoryKey: string | null = null;

  /**
   * Simple XOR encryption for local storage (basic obfuscation)
   * Note: This is not cryptographically secure, but prevents casual viewing
   */
  private encrypt(text: string, salt: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      const saltChar = salt.charCodeAt(i % salt.length);
      result += String.fromCharCode(char ^ saltChar);
    }
    return btoa(result); // Base64 encode
  }

  private decrypt(encrypted: string, salt: string): string {
    try {
      const decoded = atob(encrypted); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const char = decoded.charCodeAt(i);
        const saltChar = salt.charCodeAt(i % salt.length);
        result += String.fromCharCode(char ^ saltChar);
      }
      return result;
    } catch {
      return '';
    }
  }

  private generateSalt(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate OpenAI API key format
   */
  private validateKeyFormat(key: string): boolean {
    // OpenAI API keys start with 'sk-' and have specific patterns
    const patterns = [
      /^sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20}$/, // Legacy format
      /^sk-proj-[a-zA-Z0-9_-]{43,}$/, // New project format
      /^sk-[a-zA-Z0-9_-]{43,}$/ // General format
    ];
    
    return patterns.some(pattern => pattern.test(key.trim()));
  }

  /**
   * Test API key by making a simple request to OpenAI
   */
  async test(): Promise<boolean> {
    const apiKey = this.get();
    if (!apiKey || !this.validateKeyFormat(apiKey)) {
      return false;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error) {
      console.warn('API key validation failed:', error);
      return false;
    }
  }

  /**
   * Get decrypted API key from storage or memory
   */
  get(): string | null {
    // First try memory cache
    if (this.memoryKey) {
      return this.memoryKey;
    }

    // Try localStorage with encryption
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY);
      const salt = localStorage.getItem(this.SALT_KEY);
      
      if (encrypted && salt) {
        const decrypted = this.decrypt(encrypted, salt);
        if (this.validateKeyFormat(decrypted)) {
          this.memoryKey = decrypted;
          return decrypted;
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve API key:', error);
    }

    return null;
  }

  /**
   * Securely store API key with validation
   */
  async set(key: string): Promise<boolean> {
    const trimmedKey = key.trim();
    
    // Validate format first
    if (!this.validateKeyFormat(trimmedKey)) {
      throw new Error('Invalid API key format. Please check your key and try again.');
    }

    // Test the key works
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        throw new Error('API key is invalid or expired. Please check your key.');
      }
      
      if (response.status === 429) {
        throw new Error('API key has exceeded rate limits. Please try again later.');
      }
      
      if (!response.ok) {
        throw new Error('Unable to validate API key. Please check your connection.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to validate API key. Please check your connection.');
    }

    // Store with encryption
    try {
      const salt = this.generateSalt();
      const encrypted = this.encrypt(trimmedKey, salt);
      
      localStorage.setItem(this.STORAGE_KEY, encrypted);
      localStorage.setItem(this.SALT_KEY, salt);
      this.memoryKey = trimmedKey;
      
      return true;
    } catch (error) {
      console.error('Failed to store API key:', error);
      throw new Error('Failed to save API key. Please try again.');
    }
  }

  /**
   * Clear API key from all storage
   */
  clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SALT_KEY);
      this.memoryKey = null;
    } catch (error) {
      console.warn('Failed to clear API key storage:', error);
    }
  }

  /**
   * Check if a valid API key is available
   */
  isValid(): boolean {
    const key = this.get();
    return key !== null && this.validateKeyFormat(key);
  }

  /**
   * Get masked version of API key for display
   */
  getMasked(): string {
    const key = this.get();
    if (!key) return 'Not configured';
    
    if (key.startsWith('sk-proj-')) {
      return `sk-proj-${'*'.repeat(8)}...${key.slice(-4)}`;
    }
    return `sk-${'*'.repeat(8)}...${key.slice(-4)}`;
  }
}

// Auto-clear API key when page unloads (security feature)
let apiKeyStorage: SecureApiKeyStorage | null = null;

export const getApiKeyStorage = (): SecureApiKeyStorage => {
  if (!apiKeyStorage) {
    apiKeyStorage = new SecureApiKeyStorage();
    
    // Clear memory cache on page unload for security
    window.addEventListener('beforeunload', () => {
      if (apiKeyStorage) {
        apiKeyStorage.clear();
      }
    });
  }
  
  return apiKeyStorage;
};

// Export for testing and direct usage
export { SecureApiKeyStorage };
export type { ApiKeyStorage };