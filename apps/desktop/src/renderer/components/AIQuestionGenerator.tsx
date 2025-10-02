import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Brain, Sparkles, CheckCircle, XCircle } from 'lucide-react';

interface GeneratedQuestion {
  question: string;
  choices: string[];
  answerIndex: number;
  rationale: string;
}

export function AIQuestionGenerator() {
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuestions = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const response = await fetch('http://localhost:3001/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const addToDeck = async (question: GeneratedQuestion) => {
    // TODO: Implement adding question as a flashcard
    console.log('Adding question to deck:', question);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Question Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste your study material or notes:
            </label>
            <textarea
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              placeholder="Enter text about pharmacology, drug mechanisms, clinical guidelines, etc..."
              rows={8}
              className="w-full p-3 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <Button
            onClick={generateQuestions}
            disabled={loading || !text.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin mr-2" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Practice Questions
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Generated Questions</h3>

          {questions.map((q, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">
                      {index + 1}. {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.choices.map((choice, choiceIndex) => (
                        <div
                          key={choiceIndex}
                          className={`p-3 rounded-lg border ${
                            choiceIndex === q.answerIndex
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {choiceIndex === q.answerIndex ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                            <span className={choiceIndex === q.answerIndex ? 'font-medium text-green-800' : ''}>
                              {choice}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Rationale:</h5>
                    <p className="text-blue-700">{q.rationale}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToDeck(q)}
                    >
                      Add as Flashcard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement question editing
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}