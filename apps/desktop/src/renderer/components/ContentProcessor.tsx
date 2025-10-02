import React from 'react';
import { Upload, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface ProcessingJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  module: string;
  extractedTopics?: number;
  identifiedGaps?: number;
  progress: number;
}

const sampleJobs: ProcessingJob[] = [
  {
    id: '1',
    fileName: 'Liver - Students.pptx',
    status: 'completed',
    module: 'Liver Section',
    extractedTopics: 24,
    identifiedGaps: 8,
    progress: 100,
  },
  {
    id: '2',
    fileName: 'Cardiovascular Pharmacology.pptx',
    status: 'processing',
    module: 'Cardiovascular',
    progress: 65,
  },
];

export function ContentProcessor() {
  const jobs = React.useState<ProcessingJob[]>(sampleJobs)[0];
  const [selectedModule, setSelectedModule] = React.useState('liver-section');
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const modules = [
    { id: 'liver-section', name: 'Liver Section' },
    { id: 'cardiovascular', name: 'Cardiovascular' },
    { id: 'renal', name: 'Renal System' },
    { id: 'respiratory', name: 'Respiratory' },
    { id: 'endocrine', name: 'Endocrine' },
  ];

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    formData.append('module', selectedModule);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Content Processor</h2>
          <p className="text-lg text-gray-300">
            Upload PowerPoints and other materials for AI-powered content extraction
          </p>
        </div>

      {/* Upload Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <Upload className='h-5 w-5' />
              Upload Materials
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Module Selection */}
            <div>
              <label htmlFor='target-module' className='block text-sm font-medium text-white mb-2'>
                Target Module
              </label>
              <select
                id='target-module'
                value={selectedModule}
                onChange={e => setSelectedModule(e.target.value)}
                className='w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400'
              >
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div 
              className='border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-white/5 transition-all cursor-pointer'
              onClick={handleFileSelect}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".ppt,.pptx,.pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload PowerPoint files"
              />
              <FileText className='h-12 w-12 text-white/70 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-white mb-2'>
                Drop files here or click to browse
              </h3>
              <p className='text-gray-300 mb-4'>
                Supports: .ppt, .pptx, .pdf, .docx
              </p>
              <Button 
                onClick={handleFileSelect}
                disabled={isUploading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isUploading ? 'Uploading...' : 'Select Files'}
              </Button>
            </div>

            {/* Processing Options */}
            <div className='space-y-3'>
              <label className='flex items-center'>
                <input type='checkbox' className='rounded mr-2' defaultChecked />
                <span className='text-sm text-gray-200'>Extract drug information and mechanisms</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='rounded mr-2' defaultChecked />
                <span className='text-sm text-gray-200'>Identify clinical pearls and key concepts</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='rounded mr-2' defaultChecked />
                <span className='text-sm text-gray-200'>Perform knowledge gap analysis</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='rounded mr-2' />
                <span className='text-sm text-gray-200'>Generate practice questions</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              AI Processing Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium'>
                  1
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>Content Extraction</h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Parse slides and extract structured data
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium'>
                  2
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>Knowledge Mapping</h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Map content to pharmacy curriculum standards
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium'>
                  3
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>Gap Analysis</h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Identify missing topics and create study plan
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div className='w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium'>
                  4
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    Study Material Generation
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Create flashcards, quizzes, and summaries
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Processing Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {jobs.map(job => (
              <div
                key={job.id}
                className='flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex-shrink-0'>
                    {job.status === 'completed' ? (
                      <CheckCircle className='h-8 w-8 text-green-600' />
                    ) : job.status === 'error' ? (
                      <AlertCircle className='h-8 w-8 text-red-600' />
                    ) : (
                      <div className='h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                    )}
                  </div>

                  <div>
                    <h4 className='font-medium text-gray-900 dark:text-white'>{job.fileName}</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Module: {job.module}
                      {job.extractedTopics && (
                        <span className='ml-4'>
                          • {job.extractedTopics} topics • {job.identifiedGaps} gaps
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                      {job.progress}%
                    </div>
                    <div className='w-24'>
                      <ProgressBar
                        percentage={job.progress}
                        height="sm"
                        colorClass="bg-blue-600"
                        showTransition={true}
                      />
                    </div>
                  </div>

                  {job.status === 'completed' && (
                    <Button size='sm' variant='outline'>
                      View Results
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
