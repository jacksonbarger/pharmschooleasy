/**
 * Content Storage Service
 * Handles PowerPoint uploads, transcript processing, and user content management
 * Integrates with cloud storage (AWS S3, Firebase, etc.) for scalable data management
 */

export interface PowerPointContent {
  id: string;
  userId: string;
  filename: string;
  uploadedAt: Date;
  slides: SlideContent[];
  metadata: {
    totalSlides: number;
    extractedText: string;
    topics: string[];
    difficulty: 'undergraduate' | 'graduate' | 'doctorate';
    subject: string;
  };
}

export interface SlideContent {
  slideNumber: number;
  title?: string;
  textContent: string;
  images: ImageContent[];
  keyPoints: string[];
  drugReferences: string[];
  clinicalPearls: string[];
}

export interface ImageContent {
  id: string;
  url: string;
  altText?: string;
  type: 'diagram' | 'chart' | 'molecular-structure' | 'clinical-image';
}

export interface TranscriptContent {
  id: string;
  userId: string;
  filename: string;
  uploadedAt: Date;
  content: string;
  processed: {
    keyTopics: string[];
    drugMentions: string[];
    clinicalConcepts: string[];
    timestamps: TimestampedContent[];
  };
  metadata: {
    duration?: number;
    speaker?: string;
    course?: string;
    lecture?: string;
  };
}

export interface TimestampedContent {
  timestamp: string;
  text: string;
  importance: 'high' | 'medium' | 'low';
  topic: string;
}

export interface UserLearningProfile {
  userId: string;
  strengths: string[];
  weaknesses: string[];
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  uploadedContent: {
    powerpoints: string[]; // PowerPoint IDs
    transcripts: string[]; // Transcript IDs
  };
  learningMetrics: {
    topicsStudied: Record<string, number>; // topic -> times studied
    accuracy: Record<string, number>; // topic -> accuracy percentage
    timeSpent: Record<string, number>; // topic -> minutes spent
  };
  personalizedPrompts: string[];
}

export class ContentStorageService {
  private apiEndpoint = process.env.VITE_API_ENDPOINT || 'http://localhost:3001';

  /**
   * Upload and process PowerPoint file
   */
  async uploadPowerPoint(file: File, userId: string): Promise<PowerPointContent> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch(`${this.apiEndpoint}/api/content/upload-powerpoint`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Upload and process transcript
   */
  async uploadTranscript(file: File, userId: string, metadata?: Partial<TranscriptContent['metadata']>): Promise<TranscriptContent> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await fetch(`${this.apiEndpoint}/api/content/upload-transcript`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Transcript upload failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get user's uploaded content
   */
  async getUserContent(userId: string): Promise<{
    powerpoints: PowerPointContent[];
    transcripts: TranscriptContent[];
  }> {
    const response = await fetch(`${this.apiEndpoint}/api/content/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user content: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get user's learning profile
   */
  async getUserProfile(userId: string): Promise<UserLearningProfile> {
    const response = await fetch(`${this.apiEndpoint}/api/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Update user's learning metrics
   */
  async updateLearningMetrics(userId: string, metrics: Partial<UserLearningProfile['learningMetrics']>): Promise<void> {
    const response = await fetch(`${this.apiEndpoint}/api/profile/${userId}/metrics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(metrics),
    });

    if (!response.ok) {
      throw new Error(`Failed to update learning metrics: ${response.statusText}`);
    }
  }

  /**
   * Generate personalized questions from user's content
   */
  async generatePersonalizedQuestions(
    userId: string,
    topic: string,
    difficulty: string,
    count: number,
    contentSources?: string[] // Specific PowerPoint or transcript IDs
  ): Promise<any[]> {
    const response = await fetch(`${this.apiEndpoint}/api/questions/personalized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({
        userId,
        topic,
        difficulty,
        count,
        contentSources,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate personalized questions: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Search user's content for specific topics/drugs
   */
  async searchContent(userId: string, query: string): Promise<{
    powerpoints: Array<{
      contentId: string;
      filename: string;
      matches: Array<{
        slideNumber: number;
        text: string;
        context: string;
      }>;
    }>;
    transcripts: Array<{
      contentId: string;
      filename: string;
      matches: Array<{
        timestamp: string;
        text: string;
        context: string;
      }>;
    }>;
  }> {
    const response = await fetch(`${this.apiEndpoint}/api/content/search?userId=${userId}&query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Content search failed: ${response.statusText}`);
    }

    return await response.json();
  }

  private getAuthToken(): string {
    // This would integrate with your authentication system
    return localStorage.getItem('authToken') || '';
  }
}

// Export service instance
export const contentStorageService = new ContentStorageService();

/**
 * Enhanced AI Question Generator with User Content Integration
 */
export async function generateContentAwareQuestions(
  userId: string,
  topic: string,
  difficulty: string,
  count: number,
  usePersonalContent = true
): Promise<any[]> {
  try {
    if (usePersonalContent) {
      // Try to use user's uploaded content first
      return await contentStorageService.generatePersonalizedQuestions(
        userId,
        topic,
        difficulty,
        count
      );
    }
  } catch (error) {
    console.warn('Personalized questions failed, falling back to general content:', error);
  }

  // Fallback to general question generation
  // This would use the existing AI service with general content
  return [];
}

/**
 * Content Analysis Utilities
 */
export class ContentAnalyzer {
  /**
   * Extract key pharmaceutical concepts from text
   */
  static extractPharmacyConcepts(text: string): {
    drugs: string[];
    mechanisms: string[];
    conditions: string[];
    sideEffects: string[];
  } {
    // This would use NLP/AI to identify pharmaceutical concepts
    // For now, return basic regex-based extraction
    const drugPattern = /\b[A-Z][a-z]+(?:in|ol|ide|ine|ate|ium)\b/g;
    const drugs = Array.from(new Set(text.match(drugPattern) || []));

    return {
      drugs,
      mechanisms: [], // Would be extracted via AI
      conditions: [], // Would be extracted via AI
      sideEffects: [], // Would be extracted via AI
    };
  }

  /**
   * Assess content difficulty level
   */
  static assessDifficulty(content: string): 'undergraduate' | 'graduate' | 'doctorate' {
    // Simple heuristic - would be enhanced with AI
    const complexTerms = ['pharmacokinetics', 'pharmacodynamics', 'bioavailability', 'clearance'];
    const complexTermCount = complexTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    ).length;

    if (complexTermCount >= 3) return 'doctorate';
    if (complexTermCount >= 1) return 'graduate';
    return 'undergraduate';
  }
}