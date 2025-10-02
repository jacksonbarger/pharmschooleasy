import React from 'react';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';

function MinimalApp() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Hello World - React is Working!</h1>
      
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">Tailwind CSS and glassmorphism are working!</p>
          <Button onClick={() => alert('Button works!')}>
            Test Button Component
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default MinimalApp;