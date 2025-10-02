import React from 'react';
import { Brain, BookOpen, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';

export function LiverSection() {
  const liverData = {
    coverageScore: 75,
    totalTopics: 32,
    coveredTopics: 24,
    missingTopics: 8,
    keyDrugs: ['Acetaminophen', 'Warfarin', 'Propranolol', 'Morphine'],
    missingDrugs: ['Statins', 'Phenytoin', 'Rifampin', 'Isoniazid'],
    lastUpdated: '2025-10-01',
  };

  const extractedContent = [
    {
      slide: 1,
      title: 'Liver Anatomy & Function',
      keyPoints: [
        'Hepatocytes perform metabolic functions',
        'Portal circulation from GI tract',
        'Bile production and secretion',
      ],
      drugs: ['Acetaminophen metabolism', 'First-pass effect'],
    },
    {
      slide: 2,
      title: 'Hepatic Drug Metabolism',
      keyPoints: ['Phase I and Phase II reactions', 'CYP450 enzyme system', 'Drug interactions'],
      drugs: ['CYP3A4 substrates', 'Warfarin interactions'],
    },
  ];

  const knowledgeGaps = [
    {
      topic: 'Child-Pugh Classification',
      priority: 'High',
      description: 'Essential for hepatic impairment dosing',
    },
    {
      topic: 'First-pass Metabolism Details',
      priority: 'High',
      description: 'Critical pharmacokinetic concept',
    },
    {
      topic: 'Drug-Induced Liver Injury',
      priority: 'Medium',
      description: 'Important safety topic',
    },
    {
      topic: 'CYP450 Enzyme Specifics',
      priority: 'Medium',
      description: 'Individual enzyme characteristics',
    },
    {
      topic: 'Hepatic Blood Flow',
      priority: 'Low',
      description: 'Advanced pharmacokinetic concept',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Liver & Hepatic System
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            Hepatic pharmacology, metabolism, and drug interactions
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>
            <Clock className='h-4 w-4 mr-2' />
            Study Session
          </Button>
          <Button>
            <Brain className='h-4 w-4 mr-2' />
            AI Quiz
          </Button>
        </div>
      </div>

      {/* Coverage Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>
                {liverData.coverageScore}%
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Content Coverage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>
                {liverData.coveredTopics}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Topics Covered</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-orange-600 mb-2'>
                {liverData.missingTopics}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Knowledge Gaps</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <div className='text-3xl font-bold text-purple-600 mb-2'>
                {liverData.keyDrugs.length}
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400'>Key Drugs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue='content'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='content'>Extracted Content</TabsTrigger>
          <TabsTrigger value='gaps'>Knowledge Gaps</TabsTrigger>
          <TabsTrigger value='drugs'>Drug Reference</TabsTrigger>
          <TabsTrigger value='study'>Study Tools</TabsTrigger>
        </TabsList>

        <TabsContent value='content' className='space-y-4'>
          <div className='grid gap-4'>
            {extractedContent.map((content, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Slide {content.slide}: {content.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white mb-2'>Key Points:</h4>
                    <ul className='space-y-1'>
                      {content.keyPoints.map((point, i) => (
                        <li key={i} className='flex items-start gap-2'>
                          <CheckCircle2 className='h-4 w-4 text-green-600 mt-0.5 flex-shrink-0' />
                          <span className='text-gray-700 dark:text-gray-300'>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                      Drug References:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {content.drugs.map((drug, i) => (
                        <span
                          key={i}
                          className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm'
                        >
                          {drug}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='gaps' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5 text-orange-600' />
                Identified Knowledge Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {knowledgeGaps.map((gap, index) => (
                  <div
                    key={index}
                    className='flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
                  >
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-medium text-gray-900 dark:text-white'>{gap.topic}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            gap.priority === 'High'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : gap.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}
                        >
                          {gap.priority}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>{gap.description}</p>
                    </div>
                    <Button size='sm' variant='outline'>
                      Study This
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='drugs' className='space-y-4'>
          <div className='grid md:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-green-600'>Covered Drugs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {liverData.keyDrugs.map((drug, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded'
                    >
                      <span className='font-medium'>{drug}</span>
                      <Button size='sm' variant='ghost'>
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-orange-600'>Missing Drug Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {liverData.missingDrugs.map((drug, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded'
                    >
                      <span className='font-medium'>{drug}</span>
                      <Button size='sm' variant='outline'>
                        Add Info
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='study' className='space-y-4'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardContent className='p-6 text-center'>
                <Brain className='h-12 w-12 text-blue-600 mx-auto mb-4' />
                <h3 className='font-medium text-gray-900 dark:text-white mb-2'>AI Flashcards</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  Generate smart flashcards from your content
                </p>
                <Button className='w-full'>Create Flashcards</Button>
              </CardContent>
            </Card>

            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardContent className='p-6 text-center'>
                <CheckCircle2 className='h-12 w-12 text-green-600 mx-auto mb-4' />
                <h3 className='font-medium text-gray-900 dark:text-white mb-2'>Practice Quiz</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  Test your knowledge with adaptive questions
                </p>
                <Button className='w-full'>Start Quiz</Button>
              </CardContent>
            </Card>

            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardContent className='p-6 text-center'>
                <AlertTriangle className='h-12 w-12 text-orange-600 mx-auto mb-4' />
                <h3 className='font-medium text-gray-900 dark:text-white mb-2'>Gap Study Plan</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  Focused study plan for missing topics
                </p>
                <Button className='w-full'>Generate Plan</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
