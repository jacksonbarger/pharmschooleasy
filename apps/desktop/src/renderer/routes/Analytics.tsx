import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  studySessionsByDay: { date: string; sessions: number; cardsStudied: number }[];
  totalCards: number;
  totalSessions: number;
  averageAccuracy: number;
  streak: number;
  timeSpent: number; // in minutes
}

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  studySessionsByDay: [
    { date: '2025-09-25', sessions: 2, cardsStudied: 15 },
    { date: '2025-09-26', sessions: 1, cardsStudied: 8 },
    { date: '2025-09-27', sessions: 3, cardsStudied: 24 },
    { date: '2025-09-28', sessions: 1, cardsStudied: 12 },
    { date: '2025-09-29', sessions: 2, cardsStudied: 18 },
    { date: '2025-09-30', sessions: 1, cardsStudied: 7 },
    { date: '2025-10-01', sessions: 2, cardsStudied: 16 },
  ],
  totalCards: 100,
  totalSessions: 12,
  averageAccuracy: 0.87,
  streak: 7,
  timeSpent: 180,
};

export function Analytics() {
  const analytics = useState<AnalyticsData>(mockAnalytics)[0];
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    // TODO: Load analytics data from localStorage/IndexedDB
    // For now, using mock data
  }, [selectedTimeframe]);

  const maxCards = Math.max(...analytics.studySessionsByDay.map(day => day.cardsStudied));

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div className='glass-dark rounded-2xl p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>Analytics Dashboard</h1>
            <p className='text-white/70'>Track your study progress and performance</p>
          </div>

          <div className='flex items-center gap-2'>
            {(['week', 'month', 'all'] as const).map(timeframe => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedTimeframe === timeframe
                    ? 'glass-purple text-white'
                    : 'glass text-white/70 hover:text-white'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='glass-purple rounded-2xl p-6 text-center'>
          <div className='p-3 bg-purple-500 rounded-xl w-fit mx-auto mb-4'>
            <Target className='h-6 w-6 text-white' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{analytics.totalCards}</div>
          <div className='text-white/70 text-sm'>Total Cards Studied</div>
        </div>

        <div className='glass-emerald rounded-2xl p-6 text-center'>
          <div className='p-3 bg-emerald-500 rounded-xl w-fit mx-auto mb-4'>
            <BarChart3 className='h-6 w-6 text-white' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{analytics.totalSessions}</div>
          <div className='text-white/70 text-sm'>Study Sessions</div>
        </div>

        <div className='glass-cyan rounded-2xl p-6 text-center'>
          <div className='p-3 bg-cyan-500 rounded-xl w-fit mx-auto mb-4'>
            <TrendingUp className='h-6 w-6 text-white' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>
            {Math.round(analytics.averageAccuracy * 100)}%
          </div>
          <div className='text-white/70 text-sm'>Average Accuracy</div>
        </div>

        <div className='glass-rose rounded-2xl p-6 text-center'>
          <div className='p-3 bg-rose-500 rounded-xl w-fit mx-auto mb-4'>
            <Award className='h-6 w-6 text-white' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{analytics.streak}</div>
          <div className='text-white/70 text-sm'>Day Streak</div>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Daily Activity Chart */}
        <div className='glass-strong rounded-3xl p-8'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-blue-500 rounded-xl'>
              <Calendar className='h-6 w-6 text-white' />
            </div>
            <h2 className='text-2xl font-bold text-white'>Daily Study Activity</h2>
          </div>

          <div className='space-y-4'>
            {analytics.studySessionsByDay.map((day, index) => (
              <div key={index} className='glass-dark rounded-2xl p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-white font-medium'>
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className='text-right'>
                    <div className='text-white font-bold'>{day.cardsStudied} cards</div>
                    <div className='text-white/60 text-sm'>{day.sessions} sessions</div>
                  </div>
                </div>

                {/* Simple bar chart */}
                <div className='bg-white/10 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-blue-400 to-purple-500 rounded-full h-2 transition-all duration-500'
                    style={{ width: `${(day.cardsStudied / maxCards) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className='space-y-8'>
          {/* Time Spent */}
          <div className='glass-emerald rounded-3xl p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-3 bg-emerald-500 rounded-xl'>
                <Clock className='h-6 w-6 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-white'>Time Invested</h2>
            </div>

            <div className='text-center'>
              <div className='text-4xl font-bold text-white mb-2'>
                {Math.floor(analytics.timeSpent / 60)}h {analytics.timeSpent % 60}m
              </div>
              <div className='text-white/70'>Total study time this week</div>

              <div className='mt-6 glass-dark rounded-2xl p-4'>
                <div className='text-lg text-white font-semibold'>
                  ~{Math.round(analytics.timeSpent / analytics.totalSessions)} min per session
                </div>
                <div className='text-white/60 text-sm'>Average session length</div>
              </div>
            </div>
          </div>

          {/* Accuracy Trends */}
          <div className='glass-purple rounded-3xl p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-3 bg-purple-500 rounded-xl'>
                <TrendingUp className='h-6 w-6 text-white' />
              </div>
              <h2 className='text-2xl font-bold text-white'>Performance</h2>
            </div>

            <div className='space-y-4'>
              <div className='glass-dark rounded-2xl p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-white'>Easy Cards</span>
                  <span className='text-emerald-300 font-bold'>45%</span>
                </div>
                <div className='bg-white/10 rounded-full h-2'>
                  <div className='bg-emerald-400 rounded-full h-2 w-[45%]' />
                </div>
              </div>

              <div className='glass-dark rounded-2xl p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-white'>Good Cards</span>
                  <span className='text-blue-300 font-bold'>42%</span>
                </div>
                <div className='bg-white/10 rounded-full h-2'>
                  <div className='bg-blue-400 rounded-full h-2 w-[42%]' />
                </div>
              </div>

              <div className='glass-dark rounded-2xl p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-white'>Hard Cards</span>
                  <span className='text-orange-300 font-bold'>10%</span>
                </div>
                <div className='bg-white/10 rounded-full h-2'>
                  <div className='bg-orange-400 rounded-full h-2 w-[10%]' />
                </div>
              </div>

              <div className='glass-dark rounded-2xl p-4'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-white'>Again Cards</span>
                  <span className='text-red-300 font-bold'>3%</span>
                </div>
                <div className='bg-white/10 rounded-full h-2'>
                  <div className='bg-red-400 rounded-full h-2 w-[3%]' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      <div className='glass-cyan rounded-3xl p-8'>
        <h2 className='text-2xl font-bold text-white mb-6'>📊 Insights & Recommendations</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='glass-dark rounded-2xl p-6'>
            <h3 className='font-bold text-white mb-3'>🔥 Keep it up!</h3>
            <p className='text-white/80'>
              You've maintained a {analytics.streak}-day streak. Consistency is key to long-term
              retention.
            </p>
          </div>

          <div className='glass-dark rounded-2xl p-6'>
            <h3 className='font-bold text-white mb-3'>⚡ Peak Performance</h3>
            <p className='text-white/80'>
              Your accuracy is {Math.round(analytics.averageAccuracy * 100)}% - excellent work! Try
              reviewing harder cards more frequently.
            </p>
          </div>

          <div className='glass-dark rounded-2xl p-6'>
            <h3 className='font-bold text-white mb-3'>📈 Growth Opportunity</h3>
            <p className='text-white/80'>
              Consider increasing session length to 15-20 cards for optimal spaced repetition
              benefits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
