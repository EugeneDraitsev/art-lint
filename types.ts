export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  content?: string; // Markdown string for the lesson content
  thumbnailImage?: string; // Path to a real image file for the thumbnail
}

export interface CritiquePoint {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  originalImage: string; // Base64
  overlayImage: string | null; // Base64 (Teacher's corrections)
  structureImage: string | null; // Base64 (Geometric breakdown/Tutorial)
  fixedImage: string | null; // Base64 (Polished version)
  textCritique: string;
  points: CritiquePoint[];
  suggestedExercises: string[];
  score: number; // 0-100
}

export interface SubmissionRecord {
  lessonId: string;
  score: number;
  timestamp: number;
}

export enum AppState {
  HOME = 'HOME',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  LESSONS = 'LESSONS',
  LESSON_DETAIL = 'LESSON_DETAIL',
  ABOUT = 'ABOUT'
}