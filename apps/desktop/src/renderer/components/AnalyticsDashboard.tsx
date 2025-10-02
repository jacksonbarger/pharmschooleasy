import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { BarChart3, TrendingUp, Calendar, Target, Clock, Award } from 'lucide-react';

interface AnalyticsData {
  bySubject: Array<{
    deck: string;
    avgRating: number;
    reviews: number;
  }>;
  streak: Array<{
    createdAt: string;
    _count: { _all: number };
  }>;
  overall: {
    totalUsers: number;
    totalCards: number;
    totalReviews: number;
    averageRating: number;
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p>Failed to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{data.overall.totalCards}</p>
                <p className="text-sm text-gray-600">Total Cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{data.overall.totalReviews}</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{data.overall.averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{data.overall.totalUsers}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Deck */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance by Deck
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.bySubject.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subject.deck}</span>
                  <div className="text-sm text-gray-600">
                    {subject.reviews} reviews • {subject.avgRating.toFixed(1)} avg
                  </div>
                </div>
                <ProgressBar
                  percentage={(subject.avgRating / 4) * 100}
                  height="sm"
                  colorClass="bg-gradient-to-r from-blue-500 to-purple-500"
                  showTransition={false}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Streak */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Study Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.streak.slice(0, 7).map((day, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">
                  {new Date(day.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {day._count._all} reviews
                  </span>
                  <div className="w-20">
                    <ProgressBar
                      percentage={Math.min((day._count._all / 20) * 100, 100)}
                      height="sm"
                      colorClass="bg-green-500"
                      showTransition={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}