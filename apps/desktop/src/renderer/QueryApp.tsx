import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';

const queryClient = new QueryClient();

function TestQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'React Query is working!' };
    }
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error occurred</p>;

  return <p className="text-green-600">{data?.message}</p>;
}

function HomePage() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Home Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">This is the home page!</p>
        <TestQuery />
        <Link to="/test" className="block mt-4">
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

function QueryApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="p-8 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">React Query Test</h1>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default QueryApp;