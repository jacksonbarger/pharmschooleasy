import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface StudyCardProps {
  card: {
    id: string;
    front: string;
    back: string;
    dueAt: string;
  };
  onGrade: (cardId: string, rating: number) => void;
  onHide: (cardId: string, hidden: boolean) => void;
}

export function StudyCard({ card, onGrade, onHide }: StudyCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
    setRevealed(true);
  };

  return (
    <Card className="max-w-xl w-full mx-auto">
      <CardContent className="p-6">
        <div className="text-sm text-gray-500 mb-2">
          Due: {new Date(card.dueAt).toLocaleDateString()}
        </div>

        <div
          className="min-h-[140px] cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={handleFlip}
        >
          <div className="text-2xl font-semibold text-center">
            {flipped ? card.back : card.front}
          </div>
          {!flipped && (
            <div className="text-center text-gray-500 mt-4">
              Click to reveal answer
            </div>
          )}
        </div>

        {revealed && (
          <div className="mt-6 flex gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGrade(card.id, 1)}
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              Again (1)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGrade(card.id, 2)}
              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              Hard (2)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGrade(card.id, 3)}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              Good (3)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGrade(card.id, 4)}
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              Easy (4)
            </Button>
          </div>
        )}

        {revealed && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHide(card.id, true)}
              className="text-gray-500 hover:text-gray-700"
            >
              We won't be tested on that
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}