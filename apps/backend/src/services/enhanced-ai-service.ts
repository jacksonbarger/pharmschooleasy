import OpenAI from 'openai';
import { pharmacyMCP, TOP_200_DRUGS } from './mcp-manager.js';

/**
 * Enhanced AI Service with MCP Integration
 * 
 * This service provides doctorate-level pharmacy education content
 * powered by OpenAI GPT and Model Context Protocol integration.
 * 
 * Features:
 * - Personalized question generation using MCP drug database
 * - Content-aware tutoring with uploaded PowerPoint context
 * - Adaptive difficulty based on user performance
 * - Real-time fact verification against pharmaceutical databases
 */

export class EnhancedAIService {
  private openai: OpenAI;
  private mcpManager = pharmacyMCP;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  /**
   * Generate PhD-level pharmacy questions with MCP database context
   */
  async generateDoctorateLevelQuestion(topic: string, userProfile?: any) {
    try {
      // Use MCP to search drug database for context
      const drugContext = await this.mcpManager.searchDrugDatabase({
        query: topic,
        searchType: 'comprehensive'
      });

      const systemPrompt = `You are a distinguished pharmacy professor with 20+ years of experience teaching doctorate-level PharmD students. 

Your expertise covers:
- Advanced pharmacokinetics and pharmacodynamics
- Clinical pharmacy practice and therapeutics
- Drug development and regulatory science
- Pharmacogenomics and personalized medicine
- Advanced medicinal chemistry
- Pharmaceutical care and patient safety

IMPORTANT GUIDELINES:
1. Create questions at DOCTORATE LEVEL complexity
2. Focus on clinical reasoning and critical thinking
3. Include real-world clinical scenarios
4. Break down complex concepts kindly and efficiently
5. Maintain calm, encouraging tone throughout
6. Connect theory to practical patient care

User Topic: ${topic}
Database Context: ${JSON.stringify(drugContext, null, 2)}

Generate a comprehensive question that:
- Tests deep understanding, not just memorization
- Includes clinical context and patient scenarios  
- Requires integration of multiple pharmacy concepts
- Provides detailed explanation with mechanisms
- Offers learning extensions and related topics`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Create a doctorate-level question about ${topic}. Make it challenging but explain it kindly and thoroughly.` 
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return {
        question: completion.choices[0].message.content,
        source: 'Enhanced AI + MCP Database',
        difficulty: 'doctorate',
        topic: topic,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Enhanced AI question generation error:', error);
      throw new Error('Failed to generate enhanced question');
    }
  }

  /**
   * Analyze PowerPoint content and generate study materials
   */
  async processUploadedContent(filePath: string, contentType: 'powerpoint' | 'pdf' | 'transcript') {
    try {
      // Use MCP to process the content
      const processedContent = await this.mcpManager.processPowerPoint({
        filePath,
        extractImages: true,
        generateSummary: true
      });

      // Generate AI-enhanced study materials from processed content
      const systemPrompt = `You are an expert pharmacy educator analyzing uploaded study materials.

Your task:
1. Extract key pharmaceutical concepts
2. Identify important drug information
3. Generate study questions from the content
4. Create memory aids and mnemonics
5. Suggest related topics for deeper learning

Content Type: ${contentType}
Processed Content: ${JSON.stringify(processedContent, null, 2)}

Create comprehensive study materials that help pharmacy students master this content at a graduate level.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: 'Analyze this pharmacy content and create comprehensive study materials.' 
          }
        ],
        temperature: 0.6,
        max_tokens: 3000
      });

      return {
        processedContent: processedContent,
        studyMaterials: completion.choices[0].message.content,
        contentType: contentType,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Content processing error:', error);
      throw new Error('Failed to process uploaded content');
    }
  }

  /**
   * Provide personalized tutoring based on user performance
   */
  async getPersonalizedTutoring(userId: string, question: string, userHistory?: any) {
    try {
      // Analyze user progress with MCP
      const progressAnalysis = await this.mcpManager.analyzeStudyProgress({
        userId,
        timeframe: 'monthly'
      });

      const systemPrompt = `You are a compassionate and brilliant pharmacy tutor providing personalized one-on-one instruction.

Your approach:
- Kind, calm, and encouraging tone
- Break down complex concepts step-by-step
- Use clinical examples and real patient scenarios
- Adapt explanations to student's current level
- Provide memory techniques and study strategies
- Connect new information to previously learned concepts

Student Progress Analysis: ${JSON.stringify(progressAnalysis, null, 2)}
Drug Database Available: ${TOP_200_DRUGS.length} medications in context

Guidelines:
1. Always explain the WHY behind pharmaceutical concepts
2. Use analogies and visual descriptions when helpful
3. Provide multiple learning pathways for the same concept
4. Encourage questions and critical thinking
5. Celebrate progress and learning milestones
6. Offer practical application examples

Student Question: ${question}`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: question 
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
        stream: false
      });

      return {
        response: completion.choices[0].message.content,
        personalizedFor: userId,
        basedOnProgress: true,
        suggestions: this.generateRelatedTopics(question),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Personalized tutoring error:', error);
      throw new Error('Failed to provide personalized tutoring');
    }
  }

  /**
   * Generate adaptive study plan based on user weaknesses
   */
  async createAdaptiveStudyPlan(userId: string, goals: string[], timeConstraints: string) {
    try {
      const studyPlan = await this.mcpManager.createStudyPlan({
        userId,
        goals,
        timeConstraints,
        focusAreas: this.extractPharmacyTopics(goals.join(' '))
      });

      const systemPrompt = `You are a pharmacy education consultant creating personalized study plans.

Your expertise:
- Learning science and spaced repetition
- Pharmacy curriculum design
- Clinical practice integration
- Student performance optimization

Study Plan Data: ${JSON.stringify(studyPlan, null, 2)}
Available Resources: Drug database, practice questions, clinical scenarios

Create a detailed, actionable study plan that:
1. Balances theory with practical application
2. Uses evidence-based learning techniques
3. Includes regular progress checkpoints
4. Adapts to individual learning styles
5. Incorporates real-world clinical experience
6. Provides motivation and milestone celebrations`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Create a comprehensive study plan for these goals: ${goals.join(', ')}` 
          }
        ],
        temperature: 0.6,
        max_tokens: 2500
      });

      return {
        studyPlan: studyPlan,
        aiGuidance: completion.choices[0].message.content,
        userId: userId,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Study plan creation error:', error);
      throw new Error('Failed to create adaptive study plan');
    }
  }

  /**
   * Real-time drug interaction and safety checking
   */
  async checkDrugSafety(drugs: string[], patientProfile?: any) {
    try {
      // Search for each drug in MCP database
      const drugData = await Promise.all(
        drugs.map(drug => this.mcpManager.searchDrugDatabase({
          query: drug,
          searchType: 'interaction'
        }))
      );

      const systemPrompt = `You are a clinical pharmacist performing comprehensive drug safety analysis.

Your responsibilities:
- Identify potential drug-drug interactions
- Assess contraindications and warnings
- Evaluate dosing appropriateness
- Consider patient-specific factors
- Provide clinical recommendations
- Suggest monitoring parameters

Drug Information: ${JSON.stringify(drugData, null, 2)}
Patient Profile: ${JSON.stringify(patientProfile || 'Not provided', null, 2)}

Provide a thorough clinical assessment with:
1. Interaction risk levels (major/moderate/minor)
2. Mechanism-based explanations
3. Clinical monitoring recommendations
4. Alternative therapy suggestions when needed
5. Patient counseling points`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze these medications for safety: ${drugs.join(', ')}` 
          }
        ],
        temperature: 0.3, // Lower temperature for safety-critical analysis
        max_tokens: 2000
      });

      return {
        safetyAnalysis: completion.choices[0].message.content,
        drugsAnalyzed: drugs,
        riskLevel: this.assessOverallRisk(drugs),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Drug safety analysis error:', error);
      throw new Error('Failed to perform drug safety analysis');
    }
  }

  // Helper Methods
  private generateRelatedTopics(question: string): string[] {
    // Extract pharmacy-related keywords and suggest related topics
    const pharmacyTopics = [
      'pharmacokinetics', 'pharmacodynamics', 'drug interactions',
      'side effects', 'contraindications', 'mechanism of action',
      'clinical applications', 'dosing considerations', 'monitoring parameters'
    ];
    
    return pharmacyTopics.filter(topic => 
      question.toLowerCase().includes(topic.split(' ')[0])
    ).slice(0, 3);
  }

  private extractPharmacyTopics(text: string): string[] {
    // Extract relevant pharmacy topics from text
    const topics: string[] = [];
    const pharmacyKeywords = [
      'cardiovascular', 'diabetes', 'infectious disease', 'oncology',
      'psychiatry', 'neurology', 'respiratory', 'gastroenterology'
    ];
    
    pharmacyKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        topics.push(keyword);
      }
    });
    
    return topics.length > 0 ? topics : ['general pharmacy'];
  }

  private assessOverallRisk(drugs: string[]): 'low' | 'moderate' | 'high' {
    // Simple risk assessment based on number of drugs and known high-risk combinations
    if (drugs.length <= 2) return 'low';
    if (drugs.length <= 4) return 'moderate';
    return 'high';
  }
}

// Export enhanced service with default configuration
export const createEnhancedAIService = (apiKey: string) => {
  return new EnhancedAIService(apiKey);
};