import React from 'react'
import { Upload, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface ProcessingJob {
  id: string
  fileName: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  module: string
  extractedTopics?: number
  identifiedGaps?: number
  progress: number
}

const sampleJobs: ProcessingJob[] = [
  {
    id: '1',
    fileName: 'Liver - Students.pptx',
    status: 'completed',
    module: 'Liver Section',
    extractedTopics: 24,
    identifiedGaps: 8,
    progress: 100
  },
  {
    id: '2',
    fileName: 'Cardiovascular Pharmacology.pptx',
    status: 'processing',
    module: 'Cardiovascular',
    progress: 65
  }
]

export function ContentProcessor() {
  const [jobs, setJobs] = React.useState<ProcessingJob[]>(sampleJobs)
  const [selectedModule, setSelectedModule] = React.useState('liver-section')

  const modules = [
    { id: 'liver-section', name: 'Liver Section' },
    { id: 'cardiovascular', name: 'Cardiovascular' },
    { id: 'renal', name: 'Renal System' },
    { id: 'respiratory', name: 'Respiratory' },
    { id: 'endocrine', name: 'Endocrine' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Content Processor
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Upload PowerPoints and other materials for AI-powered content extraction
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Materials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Module Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Module
              </label>
              <select 
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Supports: .ppt, .pptx, .pdf, .docx
              </p>
              <Button>
                Select Files
              </Button>
            </div>

            {/* Processing Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-2" defaultChecked />
                <span className="text-sm">Extract drug information and mechanisms</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-2" defaultChecked />
                <span className="text-sm">Identify clinical pearls and key concepts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-2" defaultChecked />
                <span className="text-sm">Perform knowledge gap analysis</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded mr-2" />
                <span className="text-sm">Generate practice questions</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Processing Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Content Extraction</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Parse slides and extract structured data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Knowledge Mapping</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Map content to pharmacy curriculum standards</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Gap Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Identify missing topics and create study plan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Study Material Generation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Create flashcards, quizzes, and summaries</p>
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
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {job.status === 'completed' ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : job.status === 'error' ? (
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    ) : (
                      <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{job.fileName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Module: {job.module}
                      {job.extractedTopics && (
                        <span className="ml-4">• {job.extractedTopics} topics • {job.identifiedGaps} gaps</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.progress}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all" 
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {job.status === 'completed' && (
                    <Button size="sm" variant="outline">
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
  )
}