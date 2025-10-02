import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, Settings, LogIn } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { openAIService, ChatMessage } from '../services/openai';
import { adminAuth } from '../services/admin-auth';
import { AdminLogin } from './AdminLogin';
import { AuthModal } from './AuthModal';

export function AITutoringInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        "👋 Hello! I'm your AI pharmacy tutor. I can help you with drug mechanisms, clinical applications, side effects, interactions, and more. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(adminAuth.isAuthenticated());
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const adminAuthenticated = adminAuth.isAuthenticated();
    const userApiConfigured = openAIService.isConfigured();

    setIsAuthenticated(adminAuthenticated || userApiConfigured);

    if (adminAuthenticated) {
      openAIService.setApiKey(adminAuth.getAdminApiKey() || '');
    }
    // If user has configured their own API key, it should already be set in the service
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!adminAuth.isAuthenticated() && !openAIService.isConfigured()) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsLoading(true);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input,
        timestamp: new Date(),
      };

      // Use functional update to add user message immediately
      const messageToSend = input;
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');

      const pharmacyContext =
        'You are a pharmacy tutor. Provide educational, accurate information about drugs, mechanisms, interactions, and clinical applications. Focus on learning objectives for pharmacy students.';
      const response = await openAIService.chat(messageToSend, pharmacyContext);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${
          error instanceof Error ? error.message : String(error)
        }. Please check your API key configuration or try again.`,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthChange = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setShowAdminLogin(false);
      openAIService.setApiKey(adminAuth.getAdminApiKey() || '');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Explain the mechanism of action of ACE inhibitors',
    'What are the major drug interactions with warfarin?',
    'How do NSAIDs affect kidney function?',
    "What's the difference between pharmacokinetics and pharmacodynamics?",
  ];

  if (showAdminLogin) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 flex items-center justify-center'>
        <AdminLogin onAuthChange={handleAuthChange} className='max-w-md w-full' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 relative'>
      {/* Login Button - Top Right Corner */}
      <div className='absolute top-6 right-6 z-10'>
        <Button
          onClick={() => setShowAuthModal(true)}
          className='bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white shadow-lg'
          variant='outline'
        >
          <LogIn className='h-4 w-4 mr-2' />
          {isAuthenticated ? 'Authenticated' : 'Login'}
        </Button>
      </div>

      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <Card className='bg-white/10 backdrop-blur-xl border-white/20'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-white text-2xl'>
                <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'>
                  <Bot className='h-8 w-8' />
                </div>
                AI Pharmacy Tutor
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Quick Questions */}
          <div className='lg:col-span-1'>
            <Card className='bg-white/10 backdrop-blur-xl border-white/20 mt-4'>
              <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                  <Lightbulb className='h-5 w-5' />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className='w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 text-sm transition-all duration-200'
                  >
                    {question}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className='lg:col-span-3'>
            <Card className='bg-white/10 backdrop-blur-xl border-white/20 h-[600px] flex flex-col'>
              {/* Messages */}
              <div className='flex-1 p-6 overflow-y-auto space-y-4'>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.role === 'user'
                            ? 'bg-blue-500'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className='h-4 w-4 text-white' />
                        ) : (
                          <Bot className='h-4 w-4 text-white' />
                        )}
                      </div>
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                      >
                        <div className='whitespace-pre-wrap text-sm leading-relaxed'>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className='flex gap-3'>
                    <div className='p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
                      <Bot className='h-4 w-4 text-white' />
                    </div>
                    <div className='p-4 rounded-2xl bg-white/10 border border-white/20'>
                      <div className='flex space-x-1'>
                        <div className='w-2 h-2 bg-white/60 rounded-full animate-bounce'></div>
                        <div className='w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.1s]'></div>
                        <div className='w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0.2s]'></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className='p-4 border-t border-white/20'>
                <div className='flex gap-3'>
                  <input
                    type='text'
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Ask about drug mechanisms, interactions, side effects...'
                    className='flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                  >
                    <Send className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          const adminAuthenticated = adminAuth.isAuthenticated();
          const userApiConfigured = openAIService.isConfigured();
          setIsAuthenticated(adminAuthenticated || userApiConfigured);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}
