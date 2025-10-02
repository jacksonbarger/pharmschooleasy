/**
 * Content Upload Routes
 * Handles PowerPoint and transcript uploads with processing
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createPowerPointProcessor } from '../services/powerpoint-processor';
import { createTranscriptProcessor } from '../services/transcript-processor';

const pump = promisify(pipeline);

// Types for request bodies
interface UploadRequestBody {
  userId: string;
  metadata?: string;
}

interface PersonalizedQuestionsBody {
  userId: string;
  topic: string;
  difficulty: string;
  count: number;
  contentSources?: string[];
}

export async function contentRoutes(fastify: FastifyInstance) {
  // Initialize processors (you'll need to pass API keys from environment)
  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    fastify.log.warn('OpenAI API key not found - AI features will be limited');
  }

  const powerPointProcessor = openAiApiKey ? createPowerPointProcessor(openAiApiKey) : null;
  const transcriptProcessor = openAiApiKey ? createTranscriptProcessor(openAiApiKey) : null;

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  /**
   * Upload and process PowerPoint
   */
  fastify.post('/api/content/upload-powerpoint', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      // Validate file type
      if (!data.mimetype?.includes('presentation') && !data.filename?.match(/\\.(ppt|pptx)$/i)) {
        return reply.code(400).send({ error: 'Invalid file type. Please upload a PowerPoint file.' });
      }

      // Get user ID from form data or headers
      const fields = data.fields as any;
      const userId = fields?.userId?.value || 'anonymous';

      // Save uploaded file
      const fileId = uuidv4();
      const filename = data.filename || `powerpoint-${fileId}.pptx`;
      const filePath = path.join(uploadDir, `${fileId}-${filename}`);

      await pump(data.file, fs.createWriteStream(filePath));

      if (!powerPointProcessor) {
        return reply.code(503).send({ 
          error: 'PowerPoint processing service unavailable - OpenAI API key not configured' 
        });
      }

      // Process PowerPoint
      const analysis = await powerPointProcessor.processPowerPoint(filePath, filename);

      // In production, you would:
      // 1. Save analysis to database
      // 2. Upload files to S3/cloud storage
      // 3. Update user's learning profile
      // 4. Clean up local temp files

      // Clean up temp file
      fs.unlinkSync(filePath);

      return reply.send({
        success: true,
        content: analysis,
        message: 'PowerPoint uploaded and processed successfully'
      });

    } catch (error) {
      fastify.log.error('PowerPoint upload failed:', error);
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'PowerPoint processing failed'
      });
    }
  });

  /**
   * Upload and process transcript
   */
  fastify.post('/api/content/upload-transcript', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      // Validate file type
      const validExtensions = ['.txt', '.pdf', '.docx', '.mp3', '.wav', '.m4a'];
      const fileExt = path.extname(data.filename || '').toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        return reply.code(400).send({ 
          error: `Invalid file type. Supported formats: ${validExtensions.join(', ')}` 
        });
      }

      // Get metadata from form data
      const fields = data.fields as any;
      const userId = fields?.userId?.value || 'anonymous';
      const metadata = fields?.metadata?.value ? JSON.parse(fields.metadata.value) : {};

      // Save uploaded file
      const fileId = uuidv4();
      const filename = data.filename || `transcript-${fileId}${fileExt}`;
      const filePath = path.join(uploadDir, `${fileId}-${filename}`);

      await pump(data.file, fs.createWriteStream(filePath));

      if (!transcriptProcessor) {
        return reply.code(503).send({ 
          error: 'Transcript processing service unavailable - OpenAI API key not configured' 
        });
      }

      // Process transcript
      const analysis = await transcriptProcessor.processTranscript(filePath, filename, metadata);

      // Clean up temp file
      fs.unlinkSync(filePath);

      return reply.send({
        success: true,
        content: analysis,
        message: 'Transcript uploaded and processed successfully'
      });

    } catch (error) {
      fastify.log.error('Transcript upload failed:', error);
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Transcript processing failed'
      });
    }
  });

  /**
   * Generic file upload for content processing
   */
  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parts = request.parts();
      const files = [];
      let module = 'default';

      for await (const part of parts) {
        if (part.type === 'file') {
          const fileId = uuidv4();
          const filename = part.filename;
          const filePath = path.join(uploadDir, `${fileId}-${filename}`);
          await pump(part.file, fs.createWriteStream(filePath));
          files.push({ filename, filePath, size: fs.statSync(filePath).size });
        } else if (part.type === 'field' && part.fieldname === 'module') {
          module = part.value as string;
        }
      }

      if (files.length === 0) {
        return reply.code(400).send({ error: 'No files uploaded' });
      }

      // Here you could trigger different processing based on the 'module'
      // For now, we just confirm the upload.
      fastify.log.info(`Uploaded ${files.length} files for module: ${module}`);

      // In a real app, you might want to clean up the files after processing
      // For now, we'll leave them in the 'uploads' directory.

      return reply.send({
        success: true,
        message: `${files.length} files uploaded successfully for module '${module}'.`,
        files: files.map(f => f.filename),
      });

    } catch (error) {
      fastify.log.error('Generic upload failed: %s', error);
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'File upload processing failed'
      });
    }
  });

  /**
   * Generate personalized questions from user's content
   */
  fastify.post<{ Body: PersonalizedQuestionsBody }>('/api/questions/personalized', async (request, reply) => {
    try {
      const { userId, topic, difficulty, count, contentSources } = request.body;

      if (!powerPointProcessor || !transcriptProcessor) {
        return reply.code(503).send({ 
          error: 'Question generation service unavailable - OpenAI API key not configured' 
        });
      }

      // In production, you would:
      // 1. Fetch user's uploaded content from database
      // 2. Filter by contentSources if specified
      // 3. Generate questions based on their specific materials
      // 4. Update user's learning analytics

      // Mock response for now
      const mockQuestions = [
        {
          id: uuidv4(),
          type: 'multiple-choice',
          topic,
          difficulty,
          question: `Based on your uploaded materials, what is a key concept in ${topic}?`,
          options: [
            'Correct answer from your content',
            'Incorrect option A',
            'Incorrect option B', 
            'Incorrect option C'
          ],
          correctAnswer: 'Correct answer from your content',
          explanation: `This concept was highlighted in your uploaded PowerPoint slides. Understanding this is crucial for ${topic} mastery.`,
          references: ['Your uploaded materials'],
          tags: [topic.toLowerCase()],
          estimatedTime: 45,
          contentSource: 'powerpoint',
          slideReference: 3
        }
      ];

      return reply.send({
        success: true,
        questions: mockQuestions.slice(0, count),
        message: `Generated ${Math.min(count, mockQuestions.length)} personalized questions`
      });

    } catch (error) {
      fastify.log.error('Personalized question generation failed:', error);
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Question generation failed'
      });
    }
  });

  /**
   * Get user's uploaded content
   */
  fastify.get<{ Params: { userId: string } }>('/api/content/user/:userId', async (request, reply) => {
    try {
      const { userId } = request.params;

      // In production, fetch from database
      const mockContent = {
        powerpoints: [
          {
            id: uuidv4(),
            filename: 'Cardiology Lecture.pptx',
            uploadedAt: new Date(),
            slides: [
              {
                slideNumber: 1,
                title: 'ACE Inhibitors',
                textContent: 'Mechanism of action and clinical applications',
                keyPoints: ['Blocks angiotensin conversion', 'Reduces blood pressure'],
                drugReferences: ['Lisinopril', 'Enalapril'],
                clinicalPearls: ['Monitor potassium levels', 'Watch for dry cough']
              }
            ],
            metadata: {
              totalSlides: 25,
              topics: ['cardiology', 'hypertension'],
              difficulty: 'graduate',
              subject: 'Cardiology'
            }
          }
        ],
        transcripts: [
          {
            id: uuidv4(),
            filename: 'Clinical Rounds Transcript.txt',
            uploadedAt: new Date(),
            content: 'Discussion about patient case with hypertension...',
            processed: {
              keyTopics: ['hypertension', 'drug therapy'],
              drugMentions: ['amlodipine', 'lisinopril'],
              clinicalConcepts: ['medication adherence', 'side effects']
            },
            metadata: {
              speaker: 'Dr. Smith',
              course: 'Clinical Pharmacy',
              subject: 'Cardiology'
            }
          }
        ]
      };

      return reply.send({
        success: true,
        content: mockContent,
        message: `Retrieved content for user ${userId}`
      });

    } catch (error) {
      fastify.log.error('Failed to get user content:', error);
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Failed to retrieve user content'
      });
    }
  });

  /**
   * Search user's content
   */
  fastify.get<{ 
    Querystring: { userId: string; query: string } 
  }>('/api/content/search', async (request, reply) => {
    try {
      const { userId, query } = request.query;

      if (!query?.trim()) {
        return reply.code(400).send({ error: 'Search query is required' });
      }

      // In production, this would search the user's actual content in the database
      const mockResults = {
        powerpoints: [
          {
            contentId: uuidv4(),
            filename: 'Cardiology Lecture.pptx',
            matches: [
              {
                slideNumber: 3,
                text: `Search result for "${query}" found in slide content`,
                context: 'Slide discussing ACE inhibitors and their mechanism'
              }
            ]
          }
        ],
        transcripts: [
          {
            contentId: uuidv4(),
            filename: 'Clinical Rounds.txt',
            matches: [
              {
                timestamp: '15:30',
                text: `Transcript mention of "${query}"`,
                context: 'Discussion about drug interactions'
              }
            ]
          }
        ]
      };

      return reply.send({
        success: true,
        results: mockResults,
        message: `Found ${mockResults.powerpoints.length + mockResults.transcripts.length} matches for "${query}"`
      });

    } catch (error) {
      fastify.log.error('Content search failed:', error);
      return reply.code(500).send({
        error: error instanceof Error ? error.message : 'Content search failed'
      });
    }
  });
}