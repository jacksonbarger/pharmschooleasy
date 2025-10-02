import { Brain, Pill, Plus } from 'lucide-react';

export function Home() {
  return (
    <div className='space-y-8'>
      {/* Study Progress Overview */}
      <div className='glass-purple p-8 rounded-3xl'>
        <h3 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
          <div className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse' />
          Today's Progress
        </h3>
        <div className='grid grid-cols-3 gap-6'>
          <div className='glass-dark p-6 rounded-2xl text-center'>
            <div className='text-4xl font-bold text-cyan-300 mb-2'>47</div>
            <div className='text-white/70'>Cards Studied</div>
          </div>
          <div className='glass-dark p-6 rounded-2xl text-center'>
            <div className='text-4xl font-bold text-emerald-300 mb-2'>89%</div>
            <div className='text-white/70'>Success Rate</div>
          </div>
          <div className='glass-dark p-6 rounded-2xl text-center'>
            <div className='text-4xl font-bold text-purple-300 mb-2'>12</div>
            <div className='text-white/70'>Day Streak</div>
          </div>
        </div>
      </div>

      {/* Study Modules */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {[
          {
            title: 'Liver System',
            progress: 75,
            glassClass: 'glass-emerald',
            icon: '🫁',
            status: 'Advanced',
            cardCount: 156,
          },
          {
            title: 'Cardiovascular',
            progress: 60,
            glassClass: 'glass-rose',
            icon: '❤️',
            status: 'Intermediate',
            cardCount: 203,
          },
          {
            title: 'Renal System',
            progress: 0,
            glassClass: 'glass-cyan',
            icon: '🫘',
            status: 'Not Started',
            cardCount: 89,
          },
        ].map((module, index) => (
          <div
            key={index}
            className={`${module.glassClass} rounded-3xl p-8 hover:scale-105 transition-all duration-300`}
          >
            <div className='flex items-center justify-between mb-6'>
              <div className='text-4xl'>{module.icon}</div>
              <div className='text-right'>
                <p className='text-3xl font-bold text-white'>{module.progress}%</p>
                <p className='text-white/70 text-sm'>{module.status}</p>
              </div>
            </div>
            <h3 className='text-xl font-bold text-white mb-3'>{module.title}</h3>
            <div className='mb-4'>
              <div className='bg-white/20 rounded-full h-2'>
                <div
                  className='bg-white rounded-full h-2 transition-all duration-1000'
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
            <p className='text-white/70 text-sm mb-6'>{module.cardCount} cards available</p>
            <button className='w-full py-3 glass-dark hover:glass-strong rounded-2xl text-white font-semibold transition-all duration-300'>
              {module.progress === 0 ? '🚀 Start Learning' : '📖 Continue'}
            </button>
          </div>
        ))}
      </div>

      {/* Content Generation */}
      <div className='glass-strong rounded-3xl p-8'>
        <h3 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
          <Plus className='h-6 w-6 text-emerald-400' />
          Generate Study Materials
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <button className='glass-emerald p-6 rounded-2xl text-left hover:scale-105 transition-all duration-300'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-emerald-500 rounded-xl'>
                <Pill className='h-6 w-6 text-white' />
              </div>
              <div>
                <h4 className='font-bold text-white text-lg'>Generate from Content</h4>
                <p className='text-white/70 text-sm'>Convert liver section content to cards</p>
              </div>
            </div>
            <p className='text-white/80'>Create flashcards from existing study materials</p>
          </button>

          <button className='glass-purple p-6 rounded-2xl text-left hover:scale-105 transition-all duration-300'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='p-3 bg-purple-500 rounded-xl'>
                <Brain className='h-6 w-6 text-white' />
              </div>
              <div>
                <h4 className='font-bold text-white text-lg'>AI Generated Cards</h4>
                <p className='text-white/70 text-sm'>Create cards with AI assistance</p>
              </div>
            </div>
            <p className='text-white/80'>Generate targeted study materials using AI</p>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-2 gap-6'>
        <div className='glass-cyan p-8 rounded-3xl'>
          <h4 className='text-xl font-bold text-white mb-4 flex items-center gap-3'>
            🧠 AI-Powered Study
          </h4>
          <p className='text-white/70 mb-6'>Get personalized explanations and practice questions</p>
          <button className='w-full glass-purple p-4 rounded-2xl text-white font-semibold hover:scale-105 transition-all duration-300'>
            Start AI Session
          </button>
        </div>
        <div className='glass-rose p-8 rounded-3xl'>
          <h4 className='text-xl font-bold text-white mb-4 flex items-center gap-3'>
            📊 Performance Analytics
          </h4>
          <p className='text-white/70 mb-6'>View detailed progress reports and insights</p>
          <button className='w-full glass-emerald p-4 rounded-2xl text-white font-semibold hover:scale-105 transition-all duration-300'>
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
