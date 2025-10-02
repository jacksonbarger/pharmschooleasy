// Secure OpenAI Service for AI tutoring functionality
// This service handles communication with OpenAI's API using secure storage

import { getApiKeyStorage } from './secure-storage';
import { adminAuth } from './admin-auth';
import { ADMIN_CONFIG } from '../config/admin';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface OpenAIError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

// Export interfaces for component usage
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TutoringResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class OpenAIService {
  private storage = getApiKeyStorage();
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly MAX_REQUESTS_PER_MINUTE = 20;

  constructor() {
    // Service now uses secure storage automatically
  }

  /**
   * Set API key with validation and secure storage
   */
  async setApiKey(key: string): Promise<void> {
    try {
      await this.storage.set(key);
    } catch (error) {
      throw error; // Re-throw validation errors
    }
  }

  /**
   * Rate limiting to prevent abuse
   */
  private checkRateLimit(): void {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < 60000) { // Within last minute
      if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
        throw new Error('Rate limit exceeded. Please wait before making more requests.');
      }
    } else {
      this.requestCount = 0; // Reset counter after a minute
    }
    
    this.requestCount++;
    this.lastRequestTime = now;
  }

  /**
   * Secure chat method with error handling and safety checks
   */
  async chat(message: string, context?: string): Promise<string> {
    // Validate input
    if (!message || message.trim().length === 0) {
      throw new Error('Please enter a question or message.');
    }

    if (message.length > 2000) {
      throw new Error('Message is too long. Please keep it under 2000 characters.');
    }

    // Check rate limiting
    this.checkRateLimit();

    // Get API key - prioritize admin key if available
    let apiKey = adminAuth.getAdminApiKey();
    let useAdminKey = false;
    
    if (apiKey && adminAuth.isAuthenticated()) {
      // Check if admin has remaining requests
      if (!adminAuth.useRequest()) {
        throw new Error('Admin daily request limit reached. Please try again tomorrow or use your own API key.');
      }
      useAdminKey = true;
    } else {
      // Fall back to user's own API key
      if (!ADMIN_CONFIG.ALLOW_USER_KEYS) {
        throw new Error('Please authenticate as admin to use AI features.');
      }
      
      apiKey = this.storage.get();
      if (!apiKey) {
        throw new Error('Please configure your OpenAI API key or authenticate as admin.');
      }
    }

    // Sanitize message (remove potential harmful content)
    const sanitizedMessage = this.sanitizeMessage(message);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Use more cost-effective model
          messages: [
            {
              role: 'system',
              content: `You are an expert pharmacy tutor specializing in pharmaceutical sciences. 
              
              SAFETY GUIDELINES:
              - Provide educational information only, never medical advice
              - Always emphasize consulting healthcare professionals for clinical decisions  
              - Focus on mechanisms, interactions, and evidence-based pharmacology
              - Refuse to provide dosing recommendations or treatment advice
              - If asked about specific patient cases, redirect to educational concepts
              
              ${context ? `Context: ${context}` : ''}`
            },
            {
              role: 'user',
              content: sanitizedMessage
            }
        ],
          max_tokens: 800,
          temperature: 0.3, // Lower temperature for more consistent responses
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }),
      });

      // Handle specific error codes
      if (response.status === 401) {
        if (useAdminKey) {
          throw new Error('Admin API key is invalid or expired. Please contact the administrator.');
        } else {
          this.storage.clear(); // Clear invalid user key
          throw new Error('API key is invalid or expired. Please update your key.');
        }
      }

      if (response.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again in a few minutes.');
      }

      if (response.status === 402) {
        throw new Error('OpenAI account has insufficient credits. Please check your billing.');
      }

      if (!response.ok) {
        const errorData: OpenAIError = await response.json().catch(() => ({
          error: { message: 'Unknown error occurred', type: 'api_error' }
        }));
        
        throw new Error(`OpenAI Error: ${errorData.error.message}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response received from AI. Please try again.');
      }

      return this.sanitizeResponse(content);

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to AI service. Please check your connection.');
    }
  }

  /**
   * Sanitize user input to prevent injection attacks
   */
  private sanitizeMessage(message: string): string {
    return message
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML
      .substring(0, 2000); // Limit length
  }

  /**
   * Sanitize AI response for safety
   */
  private sanitizeResponse(response: string): string {
    return response
      .trim()
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove markdown italic
      .substring(0, 4000); // Limit response length
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return this.storage.isValid();
  }

  /**
   * Test API key connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      return await this.storage.test();
    } catch {
      return false;
    }
  }

  /**
   * Get masked API key for display
   */
  getMaskedKey(): string {
    return this.storage.getMasked();
  }

  /**
   * Clear API key securely
   */
  clearApiKey(): void {
    this.storage.clear();
    this.requestCount = 0;
  }

  /**
   * Get usage stats
   */
  getUsageStats(): { requestCount: number; lastRequestTime: number } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime
    };
  }
}

// Export service instance for easy usage
export const openAIService = new OpenAIService();