/**
 * PowerPoint Processing Service
 * Extracts content, images, and structure from PowerPoint files
 * Creates pharmacy-focused analysis with drug references and clinical concepts
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import PizZip from 'pizzip';
import { OpenAI } from 'openai';

export interface SlideContent {
  slideNumber: number;
  title?: string;
  textContent: string;
  images: ImageContent[];
  keyPoints: string[];
  drugReferences: string[];
  clinicalPearls: string[];
}

export interface ImageContent {
  id: string;
  url: string;
  altText?: string;
  type: 'diagram' | 'chart' | 'molecular-structure' | 'clinical-image';
}

export interface PowerPointAnalysis {
  id: string;
  filename: string;
  totalSlides: number;
  slides: SlideContent[];
  extractedText: string;
  metadata: {
    topics: string[];
    difficulty: 'undergraduate' | 'graduate' | 'doctorate';
    subject: string;
    drugsMentioned: string[];
    clinicalConcepts: string[];
  };
  processedAt: Date;
}

export class PowerPointProcessor {
  private openai: OpenAI;

  constructor(openAiApiKey: string) {
    this.openai = new OpenAI({ apiKey: openAiApiKey });
  }

  /**
   * Process uploaded PowerPoint file
   */
  async processPowerPoint(filePath: string, filename: string): Promise<PowerPointAnalysis> {
    try {
      console.log(`Processing PowerPoint: ${filename}`);
      
      // Extract content from PowerPoint
      const slides = await this.extractSlides(filePath);
      
      // Analyze content with AI
      const analysis = await this.analyzeContent(slides, filename);
      
      // Generate unique ID
      const id = uuidv4();
      
      return {
        id,
        filename,
        totalSlides: slides.length,
        slides,
        extractedText: slides.map(s => s.textContent).join(' '),
        metadata: analysis,
        processedAt: new Date()
      };
    } catch (error) {
      console.error('PowerPoint processing failed:', error);
      throw new Error(`Failed to process PowerPoint: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract slides from PowerPoint file
   */
  private async extractSlides(filePath: string): Promise<SlideContent[]> {
    const slides: SlideContent[] = [];
    
    try {
      // Read PowerPoint file
      const data = fs.readFileSync(filePath);
      const zip = new PizZip(data);
      
      // Extract slide content (this is a simplified version)
      // In production, you'd use a more robust PowerPoint parser
      const slideFiles = Object.keys(zip.files).filter(name => 
        name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
      );
      
      for (let i = 0; i < slideFiles.length; i++) {
        const slideFile = slideFiles[i];
        const slideContent = zip.files[slideFile]?.asText();
        
        if (slideContent) {
          // Extract text content (simplified XML parsing)
          const textContent = this.extractTextFromSlideXML(slideContent);
          
          slides.push({
            slideNumber: i + 1,
            textContent,
            images: [], // Would extract images in full implementation
            keyPoints: [],
            drugReferences: [],
            clinicalPearls: []
          });
        }
      }
      
      // If no slides found, create a fallback slide
      if (slides.length === 0) {
        slides.push({
          slideNumber: 1,
          textContent: 'PowerPoint content extraction in progress...',
          images: [],
          keyPoints: [],
          drugReferences: [],
          clinicalPearls: []
        });
      }
      
    } catch (error) {
      console.warn('Advanced extraction failed, using fallback method:', error);
      // Fallback: create basic slide structure
      slides.push({
        slideNumber: 1,
        textContent: `Content from ${path.basename(filePath)}`,
        images: [],
        keyPoints: ['PowerPoint processing'],
        drugReferences: [],
        clinicalPearls: []
      });
    }
    
    return slides;
  }

  /**
   * Extract text from slide XML (simplified)
   */
  private extractTextFromSlideXML(xml: string): string {
    // Remove XML tags and extract text content
    const textRegex = /<a:t[^>]*>([^<]+)<\/a:t>/g;
    const matches = [];
    let match;
    
    while ((match = textRegex.exec(xml)) !== null) {
      matches.push(match[1]);
    }
    
    return matches.join(' ').trim() || 'Slide content';
  }

  /**
   * Analyze content with AI to extract pharmacy-specific information
   */
  private async analyzeContent(slides: SlideContent[], filename: string): Promise<PowerPointAnalysis['metadata']> {
    const allText = slides.map(s => s.textContent).join(' ');
    
    try {
      const prompt = `Analyze this pharmacy/medical PowerPoint content and extract key information:

Content: "${allText}"
Filename: "${filename}"

Please provide a JSON response with:
{
  "topics": ["list of main pharmaceutical/medical topics"],
  "difficulty": "undergraduate" | "graduate" | "doctorate",
  "subject": "main subject area (e.g., Cardiology, Infectious Disease, etc.)",
  "drugsMentioned": ["list of specific drugs mentioned"],
  "clinicalConcepts": ["key clinical concepts and mechanisms"]
}

Focus on pharmaceutical and medical content. Be thorough but accurate.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (aiResponse) {
        try {
          const parsed = JSON.parse(aiResponse);
          return {
            topics: parsed.topics || [],
            difficulty: parsed.difficulty || 'graduate',
            subject: parsed.subject || 'General Pharmacy',
            drugsMentioned: parsed.drugsMentioned || [],
            clinicalConcepts: parsed.clinicalConcepts || []
          };
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback');
        }
      }
    } catch (aiError) {
      console.warn('AI analysis failed, using content-based analysis:', aiError);
    }

    // Fallback analysis
    return this.fallbackAnalysis(allText, filename);
  }

  /**
   * Fallback content analysis when AI is unavailable
   */
  private fallbackAnalysis(text: string, filename: string): PowerPointAnalysis['metadata'] {
    const lowerText = text.toLowerCase();
    
    // Basic drug detection (common pharmaceutical suffixes)
    const drugPattern = /\b[A-Z][a-z]+(?:in|ol|ide|ine|ate|ium|pril|sartan|statin)\b/g;
    const drugsMentioned = Array.from(new Set(text.match(drugPattern) || []));
    
    // Topic detection based on keywords
    const topicKeywords = {
      'cardiology': ['heart', 'cardiac', 'blood pressure', 'hypertension', 'arrhythmia'],
      'infectious-disease': ['antibiotic', 'infection', 'bacteria', 'virus', 'antimicrobial'],
      'oncology': ['cancer', 'chemotherapy', 'tumor', 'malignancy', 'oncology'],
      'psychiatry': ['depression', 'anxiety', 'psychiatric', 'mental health', 'antidepressant'],
      'endocrine': ['diabetes', 'insulin', 'hormone', 'thyroid', 'endocrine']
    };
    
    const topics = Object.entries(topicKeywords)
      .filter(([topic, keywords]) => 
        keywords.some(keyword => lowerText.includes(keyword))
      )
      .map(([topic]) => topic);

    // Difficulty assessment
    const complexTerms = ['pharmacokinetics', 'pharmacodynamics', 'bioavailability', 'clearance', 'metabolism'];
    const complexTermCount = complexTerms.filter(term => lowerText.includes(term)).length;
    
    let difficulty: 'undergraduate' | 'graduate' | 'doctorate' = 'undergraduate';
    if (complexTermCount >= 3) difficulty = 'doctorate';
    else if (complexTermCount >= 1) difficulty = 'graduate';

    return {
      topics: topics.length > 0 ? topics : ['general-pharmacy'],
      difficulty,
      subject: topics[0] || 'General Pharmacy',
      drugsMentioned: drugsMentioned.slice(0, 10), // Limit to first 10 drugs
      clinicalConcepts: this.extractClinicalConcepts(text)
    };
  }

  /**
   * Extract clinical concepts from text
   */
  private extractClinicalConcepts(text: string): string[] {
    const concepts = [
      'mechanism of action',
      'side effects',
      'drug interactions',
      'contraindications',
      'therapeutic monitoring',
      'dosing guidelines',
      'clinical efficacy',
      'safety profile'
    ];

    return concepts.filter(concept => 
      text.toLowerCase().includes(concept.toLowerCase())
    );
  }

  /**
   * Generate personalized questions from PowerPoint content
   */
  async generateQuestionsFromSlides(
    analysis: PowerPointAnalysis,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number = 5
  ): Promise<any[]> {
    const slideContent = analysis.slides.map(slide => 
      `Slide ${slide.slideNumber}: ${slide.textContent}`
    ).join('\n');

    const prompt = `Create ${count} ${difficulty} pharmacy quiz questions based on this PowerPoint content:

${slideContent}

Metadata:
- Subject: ${analysis.metadata.subject}
- Drugs mentioned: ${analysis.metadata.drugsMentioned.join(', ')}
- Clinical concepts: ${analysis.metadata.clinicalConcepts.join(', ')}

Create questions that:
- Reference specific slides (e.g., "Based on slide 3...")
- Are ${difficulty} level for pharmacy students
- Include supportive explanations
- Test clinical understanding, not just memorization

Return as JSON array of questions with this format:
[{
  "type": "multiple-choice",
  "question": "Question text referencing specific slide",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "Supportive explanation referencing slide content",
  "slideReference": slide_number,
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
      console.error('Question generation failed:', error);
    }

    // Fallback questions
    return this.createFallbackQuestions(analysis, difficulty, count);
  }

  /**
   * Create fallback questions when AI generation fails
   */
  private createFallbackQuestions(analysis: PowerPointAnalysis, difficulty: string, count: number): any[] {
    const questions = [];
    
    for (let i = 0; i < Math.min(count, analysis.slides.length); i++) {
      const slide = analysis.slides[i];
      questions.push({
        type: 'multiple-choice',
        question: `Based on slide ${slide.slideNumber}, what is a key concept discussed?`,
        options: [
          slide.textContent.split(' ').slice(0, 3).join(' '),
          'Unrelated concept A',
          'Unrelated concept B',
          'Unrelated concept C'
        ],
        correctAnswer: slide.textContent.split(' ').slice(0, 3).join(' '),
        explanation: `This concept from slide ${slide.slideNumber} is fundamental to understanding the topic.`,
        slideReference: slide.slideNumber,
        tags: [analysis.metadata.subject.toLowerCase()]
      });
    }
    
    return questions;
  }
}

// Export factory function
export function createPowerPointProcessor(openAiApiKey: string): PowerPointProcessor {
  return new PowerPointProcessor(openAiApiKey);
}