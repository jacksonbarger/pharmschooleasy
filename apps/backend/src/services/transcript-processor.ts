/**
 * Transcript Processing Service
 * Processes lecture transcripts, audio files, and documents
 * Extracts pharmacy-focused content with timestamp mapping
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';
import * as mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export interface TimestampedContent {
  timestamp: string;
  text: string;
  importance: 'high' | 'medium' | 'low';
  topic: string;
}

export interface TranscriptAnalysis {
  id: string;
  filename: string;
  content: string;
  processed: {
    keyTopics: string[];
    drugMentions: string[];
    clinicalConcepts: string[];
    timestamps: TimestampedContent[];
  };
  metadata: {
    duration?: number;
    speaker?: string;
    course?: string;
    lecture?: string;
    difficulty: 'undergraduate' | 'graduate' | 'doctorate';
    subject: string;
  };
  processedAt: Date;
}

export class TranscriptProcessor {
  private openai: OpenAI;

  constructor(openAiApiKey: string) {
    this.openai = new OpenAI({ apiKey: openAiApiKey });
  }

  /**
   * Process uploaded transcript file
   */
  async processTranscript(
    filePath: string, 
    filename: string,
    metadata?: Partial<TranscriptAnalysis['metadata']>
  ): Promise<TranscriptAnalysis> {
    try {
      console.log(`Processing transcript: ${filename}`);
      
      // Extract text content based on file type
      const content = await this.extractContent(filePath, filename);
      
      // Analyze content with AI
      const analysis = await this.analyzeTranscriptContent(content, filename);
      
      // Generate unique ID
      const id = uuidv4();
      
      return {
        id,
        filename,
        content,
        processed: analysis.processed,
        metadata: {
          ...analysis.metadata,
          ...metadata
        },
        processedAt: new Date()
      };
    } catch (error) {
      console.error('Transcript processing failed:', error);
      throw new Error(`Failed to process transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract content from different file types
   */
  private async extractContent(filePath: string, filename: string): Promise<string> {
    const ext = path.extname(filename).toLowerCase();
    
    try {
      switch (ext) {
        case '.txt':
          return fs.readFileSync(filePath, 'utf-8');
        
        case '.docx':
          const docxResult = await mammoth.extractRawText({ path: filePath });
          return docxResult.value;
        
        case '.pdf':
          const pdfBuffer = fs.readFileSync(filePath);
          const pdfData = await pdfParse(pdfBuffer);
          return pdfData.text;
        
        case '.mp3':
        case '.wav':
        case '.m4a':
          // Audio transcription would require additional services like Whisper
          return await this.transcribeAudio(filePath);
        
        default:
          throw new Error(`Unsupported file type: ${ext}`);
      }
    } catch (error) {
      console.error(`Content extraction failed for ${filename}:`, error);
      throw new Error(`Failed to extract content from ${filename}`);
    }
  }

  /**
   * Transcribe audio files (placeholder for Whisper integration)
   */
  private async transcribeAudio(filePath: string): Promise<string> {
    // In production, this would use OpenAI's Whisper API or similar service
    console.log(`Audio transcription for ${filePath} - using placeholder`);
    return "Audio transcription placeholder - would integrate with Whisper API in production";
  }

  /**
   * Analyze transcript content with AI
   */
  private async analyzeTranscriptContent(
    content: string, 
    filename: string
  ): Promise<{
    processed: TranscriptAnalysis['processed'];
    metadata: Omit<TranscriptAnalysis['metadata'], 'duration' | 'speaker' | 'course' | 'lecture'>;
  }> {
    try {
      const prompt = `Analyze this pharmacy/medical lecture transcript and extract key information:

Content: "${content.substring(0, 3000)}..." // Truncate for API limits
Filename: "${filename}"

Provide detailed analysis in this JSON format:
{
  "keyTopics": ["main pharmaceutical/medical topics discussed"],
  "drugMentions": ["specific drugs mentioned with generic names"],
  "clinicalConcepts": ["important clinical concepts, mechanisms, guidelines"],
  "difficulty": "undergraduate" | "graduate" | "doctorate",
  "subject": "main subject area",
  "timestamps": [
    {
      "timestamp": "approximate time marker",
      "text": "key content excerpt", 
      "importance": "high" | "medium" | "low",
      "topic": "specific topic"
    }
  ]
}

Focus on pharmacy education content. Be thorough and accurate.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1200,
        temperature: 0.3
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (aiResponse) {
        try {
          const parsed = JSON.parse(aiResponse);
          return {
            processed: {
              keyTopics: parsed.keyTopics || [],
              drugMentions: parsed.drugMentions || [],
              clinicalConcepts: parsed.clinicalConcepts || [],
              timestamps: parsed.timestamps || []
            },
            metadata: {
              difficulty: parsed.difficulty || 'graduate',
              subject: parsed.subject || 'General Pharmacy'
            }
          };
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback analysis');
        }
      }
    } catch (aiError) {
      console.warn('AI analysis failed, using content-based analysis:', aiError);
    }

    // Fallback analysis
    return this.fallbackTranscriptAnalysis(content, filename);
  }

  /**
   * Fallback analysis when AI is unavailable
   */
  private fallbackTranscriptAnalysis(
    content: string, 
    filename: string
  ): {
    processed: TranscriptAnalysis['processed'];
    metadata: Omit<TranscriptAnalysis['metadata'], 'duration' | 'speaker' | 'course' | 'lecture'>;
  } {
    const lowerContent = content.toLowerCase();
    
    // Drug detection
    const drugPattern = /\b[A-Z][a-z]+(?:in|ol|ide|ine|ate|ium|pril|sartan|statin)\b/g;
    const drugMentions = Array.from(new Set(content.match(drugPattern) || []));
    
    // Topic detection
    const pharmacyTopics = [
      'pharmacokinetics', 'pharmacodynamics', 'drug interaction', 'side effects',
      'mechanism of action', 'therapeutic monitoring', 'contraindications',
      'dosing', 'clinical efficacy', 'adverse reactions'
    ];
    
    const keyTopics = pharmacyTopics.filter(topic => 
      lowerContent.includes(topic.toLowerCase())
    );
    
    // Clinical concepts
    const clinicalConcepts = [
      'patient counseling', 'medication therapy', 'clinical guidelines',
      'drug safety', 'pharmaceutical care', 'therapeutic outcomes'
    ];
    
    const foundConcepts = clinicalConcepts.filter(concept =>
      lowerContent.includes(concept.toLowerCase())
    );
    
    // Create basic timestamps (every 500 characters as approximation)
    const timestamps: TimestampedContent[] = [];
    const chunks = content.match(/.{1,500}/g) || [];
    
    chunks.slice(0, 5).forEach((chunk, index) => {
      timestamps.push({
        timestamp: `${index * 5}:00`, // Approximate 5-minute intervals
        text: chunk.substring(0, 100) + '...',
        importance: index === 0 ? 'high' : 'medium',
        topic: keyTopics[0] || 'General Discussion'
      });
    });
    
    return {
      processed: {
        keyTopics: keyTopics.length > 0 ? keyTopics : ['general pharmacy'],
        drugMentions: drugMentions.slice(0, 15),
        clinicalConcepts: foundConcepts,
        timestamps
      },
      metadata: {
        difficulty: 'graduate',
        subject: keyTopics[0] || 'General Pharmacy'
      }
    };
  }

  /**
   * Generate questions from transcript content
   */
  async generateQuestionsFromTranscript(
    analysis: TranscriptAnalysis,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5
  ): Promise<any[]> {
    const keyContent = analysis.processed.timestamps
      .filter(t => t.importance === 'high')
      .map(t => `[${t.timestamp}] ${t.text}`)
      .join('\n');

    const prompt = `Create ${count} ${difficulty} pharmacy quiz questions based on this lecture transcript:

Key Content:
${keyContent || analysis.content.substring(0, 1000)}

Metadata:
- Subject: ${analysis.metadata.subject}
- Key Topics: ${analysis.processed.keyTopics.join(', ')}
- Drugs Mentioned: ${analysis.processed.drugMentions.join(', ')}

Create questions that:
- Reference specific parts of the lecture
- Are ${difficulty} level for pharmacy students  
- Include timestamp references when possible
- Test understanding of clinical concepts
- Have supportive, encouraging explanations

Return as JSON array:
[{
  "type": "multiple-choice" | "true-false",
  "question": "Question referencing lecture content",
  "options": ["A", "B", "C", "D"], // for multiple choice
  "correctAnswer": "correct answer",
  "explanation": "Supportive explanation with lecture reference",
  "timestampReference": "timestamp if applicable",
  "tags": ["relevant", "tags"]
}]`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (aiResponse) {
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      console.error('Question generation from transcript failed:', error);
    }

    // Fallback questions
    return this.createFallbackTranscriptQuestions(analysis, difficulty, count);
  }

  /**
   * Create fallback questions from transcript
   */
  private createFallbackTranscriptQuestions(
    analysis: TranscriptAnalysis, 
    difficulty: string, 
    count: number
  ): any[] {
    const questions = [];
    const topics = analysis.processed.keyTopics;
    const drugs = analysis.processed.drugMentions;
    
    for (let i = 0; i < Math.min(count, topics.length + drugs.length); i++) {
      if (i < topics.length) {
        questions.push({
          type: 'multiple-choice',
          question: `Based on the lecture, what is important to know about ${topics[i]}?`,
          options: [
            `Key clinical consideration for ${topics[i]}`,
            'Not clinically relevant',
            'Only affects pediatric patients',
            'Requires no monitoring'
          ],
          correctAnswer: `Key clinical consideration for ${topics[i]}`,
          explanation: `Understanding ${topics[i]} is crucial for pharmaceutical practice as discussed in the lecture.`,
          tags: [analysis.metadata.subject.toLowerCase()]
        });
      } else if (drugs[i - topics.length]) {
        const drug = drugs[i - topics.length];
        questions.push({
          type: 'true-false',
          question: `The lecture discussed important clinical considerations for ${drug}.`,
          correctAnswer: 'True',
          explanation: `${drug} was mentioned in the context of important pharmaceutical concepts.`,
          tags: ['pharmacotherapy']
        });
      }
    }
    
    return questions;
  }

  /**
   * Search transcript content for specific terms
   */
  searchTranscript(analysis: TranscriptAnalysis, query: string): Array<{
    timestamp?: string;
    text: string;
    context: string;
    relevance: number;
  }> {
    const results: Array<{timestamp?: string; text: string; context: string; relevance: number}> = [];
    const lowerQuery = query.toLowerCase();
    
    // Search in timestamps
    analysis.processed.timestamps.forEach(timestamp => {
      if (timestamp.text.toLowerCase().includes(lowerQuery)) {
        results.push({
          timestamp: timestamp.timestamp,
          text: timestamp.text,
          context: `Topic: ${timestamp.topic}, Importance: ${timestamp.importance}`,
          relevance: timestamp.importance === 'high' ? 0.9 : 0.6
        });
      }
    });
    
    // Search in full content
    const contentLines = analysis.content.split('\n');
    contentLines.forEach((line, index) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        results.push({
          text: line,
          context: `Line ${index + 1}`,
          relevance: 0.7
        });
      }
    });
    
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10); // Return top 10 results
  }
}

// Export factory function  
export function createTranscriptProcessor(openAiApiKey: string): TranscriptProcessor {
  return new TranscriptProcessor(openAiApiKey);
}