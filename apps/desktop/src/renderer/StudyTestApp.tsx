import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { StudySession } from './components/StudySession';

const queryClient = new QueryClient();

// Mock data for testing
const mockCards = [
  {
    id: 1,
    front: 'What is the mechanism of action of Metformin?',
    back: 'Metformin works by decreasing hepatic glucose production, improving insulin sensitivity, and reducing glucose absorption in the intestines.',
    deckId: 1,
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0
  },
  {
    id: 2,
    front: 'What are the main side effects of ACE inhibitors?',
    back: 'Common side effects include dry cough (due to increased bradykinin), hyperkalemia, angioedema (rare but serious), and hypotension.',
    deckId: 1,
    nextReview: new Date(),
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0
  }
];

function HomePage() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Home Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">Test the study components!</p>
        <Link to="/study" className="block">
          <Button>Start Study Session</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function StudyPage() {
  const [isActive, setIsActive] = useState(true);
  
  if (!isActive) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Study Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">Great job studying!</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StudySession
        deckId="test-deck-1"
        onComplete={() => setIsActive(false)}
      />
    </div>
  );
}

function StudyTestApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="p-8 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">Study Component Test</h1>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudyPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default StudyTestApp;