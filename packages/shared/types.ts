export interface StudyModule {
  id: string;
  name: string;
  displayName: string;
  description: string;
  organSystem: OrganSystem;
  createdAt: string;
  updatedAt: string;
  status: ModuleStatus;
  contentStats: ContentStats;
  studyProgress: StudyProgress;
}

export interface ContentStats {
  totalPowerPoints: number;
  totalSlides: number;
  extractedTopics: number;
  identifiedDrugs: number;
  clinicalPearls: number;
  knowledgeGaps: number;
  coverageScore: number;
}

export interface StudyProgress {
  completedTopics: string[];
  totalTopics: number;
  studyTimeMinutes: number;
  lastStudyDate?: string;
  masteredConcepts: string[];
  needsReview: string[];
}

export type ModuleStatus = 'created' | 'processing' | 'ready' | 'studying' | 'completed';

export type OrganSystem =
  | 'cardiovascular'
  | 'respiratory'
  | 'gastrointestinal'
  | 'hepatic'
  | 'renal'
  | 'neurological'
  | 'endocrine'
  | 'musculoskeletal'
  | 'integumentary'
  | 'reproductive'
  | 'immune'
  | 'other';

export interface ModuleTemplate {
  organSystem: OrganSystem;
  knowledgeBase: KnowledgeBase;
  requiredTopics: string[];
  commonDrugs: string[];
  assessmentTypes: string[];
}

export interface KnowledgeBase {
  anatomy: string[];
  physiology: string[];
  pathophysiology: string[];
  pharmacokinetics: string[];
  pharmacodynamics: string[];
  therapeutics: string[];
  clinicalAssessment: string[];
  drugInteractions: string[];
  adverseEffects: string[];
  patientCounseling: string[];
}
