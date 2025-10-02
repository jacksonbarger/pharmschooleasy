import React, { useState, useEffect } from 'react';
import { StudyCard } from './StudyCard';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { Brain, CheckCircle, Clock } from 'lucide-react';

interface Card {
  id: string;
  front: string;
  back: string;
  dueAt: string;
  deck: {
    id: string;
    title: string;
  };
}

interface StudySessionProps {
  deckId?: string;
  onComplete?: () => void;
}

export function StudySession({ deckId, onComplete }: StudySessionProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    completed: 0,
    startTime: Date.now()
  });

  useEffect(() => {
    loadCards();
  }, [deckId]);

  const loadCards = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/cards${deckId ? `?deckId=${deckId}` : ''}`);
      const data = await response.json();
      setCards(data);
      setSessionStats(prev => ({ ...prev, total: data.length }));
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (cardId: string, rating: number) => {
    try {
      await fetch('http://localhost:3001/api/study/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          rating,
          timeSpent: 10, // TODO: Track actual time
          userId: 'demo-user' // TODO: Get from auth
        })
      });

      setSessionStats(prev => ({ ...prev, completed: prev.completed + 1 }));

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Session complete
        onComplete?.();
      }
    } catch (error) {
      console.error('Failed to grade card:', error);
    }
  };

  const handleHide = async (cardId: string, hidden: boolean) => {
    try {
      await fetch(`http://localhost:3001/api/cards/${cardId}/hide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden })
      });

      // Remove card from current session
      setCards(cards.filter(card => card.id !== cardId));
      setSessionStats(prev => ({ ...prev, total: prev.total - 1 }));

      if (currentIndex >= cards.length - 1 && cards.length > 1) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (error) {
      console.error('Failed to hide card:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading study cards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
          <p className="text-gray-600 mb-4">
            No cards due for review right now. Great job staying on top of your studies!
          </p>
          <Button onClick={onComplete}>Return to Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="space-y-6">
      {/* Session Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Study Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.round((Date.now() - sessionStats.startTime) / 1000 / 60)} min
              </span>
            </div>

            <ProgressBar
              percentage={progress}
              height="sm"
              colorClass="bg-blue-600"
              showTransition={true}
            />

            <div className="text-sm text-gray-600">
              Completed: {sessionStats.completed} cards
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Card */}
      <StudyCard
        card={currentCard}
        onGrade={handleGrade}
        onHide={handleHide}
      />
    </div>
  );
}