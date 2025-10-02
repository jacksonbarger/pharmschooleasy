// Simple analytics module for local-only tracking

interface StudyStartEvent {
  type: 'study_start';
  timestamp: number;
  sessionId: string;
  cardCount: number;
}

interface CardRatingEvent {
  type: 'card_rate';
  timestamp: number;
  sessionId: string;
  cardId: string;
  rating: number;
  beforeInterval: number;
  afterInterval: number;
  timeSpent: number; // milliseconds
}

interface UndoRatingEvent {
  type: 'undo_rate';
  timestamp: number;
  sessionId: string;
  cardId: string;
  previousRating: number;
}

interface SessionCompleteEvent {
  type: 'session_complete';
  timestamp: number;
  sessionId: string;
  cardCount: number;
  duration: number; // seconds
  accuracy: number;
}

type AnalyticsEvent = StudyStartEvent | CardRatingEvent | UndoRatingEvent | SessionCompleteEvent;

class Analytics {
  private static readonly STORAGE_KEY = 'pharmacy_app_analytics';
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(Analytics.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics events:', error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(Analytics.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  private addEvent(event: AnalyticsEvent): void {
    this.events.push(event);

    // Keep only last 1000 events to prevent localStorage from growing too large
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    this.saveEvents();
  }

  // Log when a study session starts
  logStudyStart(sessionId: string, cardCount: number): void {
    this.addEvent({
      type: 'study_start',
      timestamp: Date.now(),
      sessionId,
      cardCount,
    });
  }

  // Log when a card is rated
  logCardRating(
    sessionId: string,
    cardId: string,
    rating: number,
    beforeInterval: number,
    afterInterval: number,
    timeSpent: number
  ): void {
    this.addEvent({
      type: 'card_rate',
      timestamp: Date.now(),
      sessionId,
      cardId,
      rating,
      beforeInterval,
      afterInterval,
      timeSpent,
    });
  }

  // Log when a rating is undone
  logUndoRating(sessionId: string, cardId: string, previousRating: number): void {
    this.addEvent({
      type: 'undo_rate',
      timestamp: Date.now(),
      sessionId,
      cardId,
      previousRating,
    });
  }

  // Log when a study session completes
  logSessionComplete(
    sessionId: string,
    cardCount: number,
    duration: number,
    accuracy: number
  ): void {
    this.addEvent({
      type: 'session_complete',
      timestamp: Date.now(),
      sessionId,
      cardCount,
      duration,
      accuracy,
    });
  }

  // Get analytics data for charts and insights
  getAnalyticsData(days: number = 7): {
    studySessionsByDay: Array<{ date: string; sessions: number; cardsStudied: number }>;
    totalCards: number;
    totalSessions: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    ratingDistribution: { [rating: number]: number };
  } {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentEvents = this.events.filter(event => event.timestamp >= cutoffTime);

    // Group events by day
    const dayMap = new Map<string, { sessions: Set<string>; cardsStudied: number }>();
    const sessionCompleteEvents = recentEvents.filter(
      e => e.type === 'session_complete'
    ) as SessionCompleteEvent[];
    const cardRateEvents = recentEvents.filter(e => e.type === 'card_rate') as CardRatingEvent[];

    // Process session data by day
    sessionCompleteEvents.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!dayMap.has(date)) {
        dayMap.set(date, { sessions: new Set(), cardsStudied: 0 });
      }
      const dayData = dayMap.get(date)!;
      dayData.sessions.add(event.sessionId);
      dayData.cardsStudied += event.cardCount;
    });

    // Convert to array format
    const studySessionsByDay = Array.from(dayMap.entries())
      .map(([date, data]) => ({
        date,
        sessions: data.sessions.size,
        cardsStudied: data.cardsStudied,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate totals
    const totalCards = cardRateEvents.length;
    const totalSessions = new Set(sessionCompleteEvents.map(e => e.sessionId)).size;
    const averageAccuracy =
      sessionCompleteEvents.length > 0
        ? sessionCompleteEvents.reduce((sum, e) => sum + e.accuracy, 0) /
          sessionCompleteEvents.length
        : 0;

    const totalTimeSpent = sessionCompleteEvents.reduce((sum, e) => sum + e.duration, 0);

    // Rating distribution
    const ratingDistribution = cardRateEvents.reduce(
      (dist, event) => {
        dist[event.rating] = (dist[event.rating] || 0) + 1;
        return dist;
      },
      {} as { [rating: number]: number }
    );

    return {
      studySessionsByDay,
      totalCards,
      totalSessions,
      averageAccuracy,
      totalTimeSpent,
      ratingDistribution,
    };
  }

  // Get events for debugging/development
  getEvents(limit?: number): AnalyticsEvent[] {
    return limit ? this.events.slice(-limit) : [...this.events];
  }

  // Clear all analytics data (for testing/reset)
  clearData(): void {
    this.events = [];
    localStorage.removeItem(Analytics.STORAGE_KEY);
  }

  // Export data for backup
  exportData(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as AnalyticsEvent[];

      // Basic validation
      if (!Array.isArray(imported)) {
        throw new Error('Invalid data format');
      }

      this.events = imported;
      this.saveEvents();
      return true;
    } catch (error) {
      console.error('Failed to import analytics data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Utility functions for common patterns
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
}
