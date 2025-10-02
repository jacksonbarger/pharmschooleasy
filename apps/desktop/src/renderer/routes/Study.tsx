import { useState, useEffect } from 'react';
import { ChevronLeft, RotateCcw, Eye, EyeOff, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ProgressBar } from '../components/ui/ProgressBar';

interface StudyCard {
  id: string;
  front: string;
  back: string;
  difficulty: number;
  lastReviewed?: Date;
  nextReview?: Date;
}

// Mock data for now - will be replaced with proper state management
const mockCards: StudyCard[] = [
  {
    id: '1',
    front: 'What is the mechanism of action of ACE inhibitors?',
    back: 'ACE inhibitors block the angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II, resulting in vasodilation and decreased aldosterone secretion.',
    difficulty: 2,
  },
  {
    id: '2',
    front: 'Name three major side effects of statins',
    back: '1. Myopathy/rhabdomyolysis\n2. Hepatotoxicity (elevated liver enzymes)\n3. Diabetes mellitus (slightly increased risk)',
    difficulty: 3,
  },
  {
    id: '3',
    front: 'What drug class is contraindicated with grapefruit juice?',
    back: 'Calcium channel blockers (especially felodipine, nifedipine) and some statins (simvastatin, atorvastatin) due to CYP3A4 inhibition.',
    difficulty: 1,
  },
];

export function Study() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [sessionCards] = useState(mockCards);
  const [sessionStartTime] = useState(new Date());

  const currentCard = sessionCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / sessionCards.length) * 100;

  useEffect(() => {
    // Card start time tracking removed - can be added back if needed
  }, [currentCardIndex]);

  const handleCardFlip = () => {
    setShowBack(!showBack);
  };

  const handleRating = (rating: number) => {
    // TODO: Implement SRS algorithm and analytics logging
    console.log(`Card ${currentCard.id} rated: ${rating}`);

    // Move to next card or complete session
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowBack(false);
    } else {
      // Session complete
      console.log('Session complete!');
    }
  };

  const sessionDuration = Math.floor(
    (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60
  );
  const remainingCards = sessionCards.length - currentCardIndex;

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Session Header */}
      <div className='glass-dark rounded-2xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => window.history.back()}
              className='glass p-2 rounded-xl hover:scale-105 transition-all duration-300'
              aria-label='Go back'
            >
              <ChevronLeft className='h-5 w-5 text-white' />
            </button>
            <div>
              <h1 className='text-2xl font-bold text-white'>Study Session</h1>
              <p className='text-white/70'>
                Card {currentCardIndex + 1} of {sessionCards.length}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-6 text-white/70'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              <span>{sessionDuration}min</span>
            </div>
            <div>{remainingCards} remaining</div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          percentage={progress}
          colorClass='from-purple-400 to-pink-400'
          height='sm'
        />
      </div>

      {/* Study Card */}
      <div className='glass-strong rounded-3xl p-8 min-h-[400px]'>
        <div className='flex flex-col items-center justify-center h-full space-y-6'>
          {/* Card Content */}
          <div
            className={`w-full max-w-2xl p-8 rounded-2xl cursor-pointer transition-all duration-300 ${
              showBack ? 'glass-purple' : 'glass-emerald'
            }`}
            onClick={handleCardFlip}
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                {showBack ? (
                  <EyeOff className='h-5 w-5 text-white/70' />
                ) : (
                  <Eye className='h-5 w-5 text-white/70' />
                )}
                <span className='text-white/70 text-sm'>
                  {showBack ? 'Back' : 'Front'} - Click to flip
                </span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowBack(false);
                }}
                className='text-white/70 hover:text-white transition-colors'
                aria-label='Reset card'
              >
                <RotateCcw className='h-4 w-4' />
              </button>
            </div>

            <div className='text-white text-lg leading-relaxed whitespace-pre-wrap'>
              {showBack ? currentCard.back : currentCard.front}
            </div>
          </div>

          {/* Rating Buttons - Only show when back is visible */}
          {showBack && (
            <div className='flex items-center gap-4'>
              <button
                onClick={() => handleRating(1)}
                className='glass-rose px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 flex items-center gap-2'
                aria-label='Rate as difficult - will show again soon'
              >
                <XCircle className='h-5 w-5' />
                Again
              </button>
              <button
                onClick={() => handleRating(2)}
                className='glass-cyan px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300'
                aria-label='Rate as hard - will show again in a few days'
              >
                Hard
              </button>
              <button
                onClick={() => handleRating(3)}
                className='glass-emerald px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300'
                aria-label='Rate as good - will show again in about a week'
              >
                Good
              </button>
              <button
                onClick={() => handleRating(4)}
                className='glass-purple px-6 py-3 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 flex items-center gap-2'
                aria-label='Rate as easy - will show again in a few weeks'
              >
                <CheckCircle className='h-5 w-5' />
                Easy
              </button>
            </div>
          )}

          {/* Navigation Hint */}
          {!showBack && (
            <p className='text-white/60 text-center'>
              Press <kbd className='px-2 py-1 bg-white/20 rounded'>Space</kbd> to flip card, or use
              keyboard shortcuts <kbd className='px-2 py-1 bg-white/20 rounded'>1-4</kbd> for
              ratings
            </p>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className='glass-dark rounded-2xl p-4'>
        <div className='flex items-center justify-center gap-8 text-sm text-white/70'>
          <div className='flex items-center gap-2'>
            <kbd className='px-2 py-1 bg-white/20 rounded text-xs'>Space</kbd>
            <span>Flip</span>
          </div>
          <div className='flex items-center gap-2'>
            <kbd className='px-2 py-1 bg-white/20 rounded text-xs'>1-4</kbd>
            <span>Rate</span>
          </div>
          <div className='flex items-center gap-2'>
            <kbd className='px-2 py-1 bg-white/20 rounded text-xs'>←</kbd>
            <span>Previous</span>
          </div>
          <div className='flex items-center gap-2'>
            <kbd className='px-2 py-1 bg-white/20 rounded text-xs'>?</kbd>
            <span>Help</span>
          </div>
        </div>
      </div>
    </div>
  );
}
