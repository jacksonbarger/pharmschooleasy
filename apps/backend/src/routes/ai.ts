import { FastifyInstance } from 'fastify';
import { createEnhancedAIService } from '../services/enhanced-ai-service.js';
import { pharmacyMCP } from '../services/mcp-manager.js';

// Initialize Enhanced AI Service with MCP integration
const enhancedAI = createEnhancedAIService(process.env.OPENAI_API_KEY || '');

export async function aiRoutes(fastify: FastifyInstance) {
  
  // ✨ ENHANCED: Generate doctorate-level questions with MCP database integration
  fastify.post('/generate-question', async (request) => {
    try {
      const { topic, difficulty = 'doctorate', userId } = request.body as any;
      
      if (!topic) {
        return { error: 'Topic is required' };
      }

      const question = await enhancedAI.generateDoctorateLevelQuestion(
        topic, 
        { userId, difficulty }
      );

      return {
        success: true,
        data: question,
        enhanced: true,
        mcpPowered: true
      };
    } catch (error) {
      console.error('Enhanced question generation error:', error);
      return { 
        error: 'Failed to generate enhanced question',
        fallback: true 
      };
    }
  });

  // ✨ ENHANCED: AI Tutoring with personalized responses
  fastify.post('/tutor', async (request) => {
    try {
      const { question, userId, context } = request.body as any;
      
      if (!question) {
        return { error: 'Question is required' };
      }

      const response = await enhancedAI.getPersonalizedTutoring(
        userId || 'anonymous',
        question,
        context
      );

      return {
        success: true,
        data: response,
        personalized: true,
        mcpPowered: true
      };
    } catch (error) {
      console.error('Personalized tutoring error:', error);
      return { 
        error: 'Failed to provide tutoring response' 
      };
    }
  });

  // ✨ ENHANCED: Drug safety and interaction checking
  fastify.post('/check-drug-safety', async (request) => {
    try {
      const { drugs, patientProfile } = request.body as any;
      
      if (!drugs || !Array.isArray(drugs)) {
        return { error: 'Drugs array is required' };
      }

      const safetyAnalysis = await enhancedAI.checkDrugSafety(
        drugs,
        patientProfile
      );

      return {
        success: true,
        data: safetyAnalysis,
        clinicalGrade: true,
        mcpPowered: true
      };
    } catch (error) {
      console.error('Drug safety analysis error:', error);
      return { 
        error: 'Failed to perform drug safety analysis' 
      };
    }
  });

  // ✨ ENHANCED: Process uploaded content (PowerPoints, PDFs, Transcripts)
  fastify.post('/process-content', async (request) => {
    try {
      const { filePath, contentType } = request.body as any;
      
      if (!filePath) {
        return { error: 'File path is required' };
      }

      const processedContent = await enhancedAI.processUploadedContent(
        filePath,
        contentType || 'powerpoint'
      );

      return {
        success: true,
        data: processedContent,
        aiEnhanced: true,
        mcpPowered: true
      };
    } catch (error) {
      console.error('Content processing error:', error);
      return { 
        error: 'Failed to process uploaded content' 
      };
    }
  });

  // ✨ ENHANCED: Create adaptive study plans
  fastify.post('/create-study-plan', async (request) => {
    try {
      const { userId, goals, timeConstraints } = request.body as any;
      
      if (!userId || !goals) {
        return { error: 'User ID and goals are required' };
      }

      const studyPlan = await enhancedAI.createAdaptiveStudyPlan(
        userId,
        goals,
        timeConstraints || 'flexible'
      );

      return {
        success: true,
        data: studyPlan,
        personalized: true,
        adaptive: true,
        mcpPowered: true
      };
    } catch (error) {
      console.error('Study plan creation error:', error);
      return { 
        error: 'Failed to create adaptive study plan' 
      };
    }
  });

  // 🔍 MCP Database search endpoint
  fastify.post('/search-drugs', async (request) => {
    try {
      const { query, searchType } = request.body as any;
      
      if (!query) {
        return { error: 'Search query is required' };
      }

      const results = await pharmacyMCP.searchDrugDatabase({
        query,
        searchType: searchType || 'name'
      });

      return {
        success: true,
        data: results,
        source: 'MCP Drug Database'
      };
    } catch (error) {
      console.error('Drug database search error:', error);
      return { 
        error: 'Failed to search drug database' 
      };
    }
  });

  // 📊 User progress analysis
  fastify.get('/analyze-progress/:userId', async (request) => {
    try {
      const { userId } = request.params as any;
      const { timeframe } = request.query as any;

      const analysis = await pharmacyMCP.analyzeStudyProgress({
        userId,
        timeframe: timeframe || 'weekly'
      });

      return {
        success: true,
        data: analysis,
        mcpPowered: true
      };
    } catch (error) {
      console.error('Progress analysis error:', error);
      return { 
        error: 'Failed to analyze study progress' 
      };
    }
  });

  // 🎯 Legacy endpoints (backward compatibility)
  
  // Generate questions from text (legacy)
  fastify.post('/generate-questions', async (request) => {
    try {
      const { text } = request.body as any;

      // Use enhanced AI for better question generation
      const question = await enhancedAI.generateDoctorateLevelQuestion(
        text,
        { difficulty: 'doctorate' }
      );

      // Format as legacy response
      return [{
        question: question.question,
        choices: ['A', 'B', 'C', 'D'],
        answerIndex: 0,
        rationale: 'Enhanced AI generated question'
      }];

    } catch (error) {
      console.error('Legacy question generation error:', error);
      throw new Error(`AI generation failed: ${error}`);
    }
  });

  // Generate flashcards from text (legacy)
  fastify.post('/generate-flashcards', async (request) => {
    try {
      const { text } = request.body as any;

      // Use enhanced AI to process content and create flashcards
      const processed = await enhancedAI.processUploadedContent(
        text,
        'transcript'
      );

      // Format as legacy flashcard response
      return [{
        front: 'Enhanced Flashcard',
        back: processed.studyMaterials
      }];

    } catch (error) {
      console.error('Legacy flashcard generation error:', error);
      throw new Error(`AI generation failed: ${error}`);
    }
  });
}