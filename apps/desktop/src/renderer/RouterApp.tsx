import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';

function HomePage() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Home Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">This is the home page!</p>
        <Link to="/test">
          <Button>Go to Test Page</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function TestPage() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Test Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">This is the test page!</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function RouterApp() {
  return (
    <BrowserRouter>
      <div className="p-8 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">React Router Test</h1>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default RouterApp;