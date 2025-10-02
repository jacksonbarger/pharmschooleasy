import React from 'react';
import { StudySession } from '../components/StudySession';

export function Study() {
  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Study Session</h1>
        <StudySession />
      </div>
    </div>
  );
}