import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingCompleted: boolean;
      emailVerified?: Date | null;
      hasPassword?: boolean;
      isGoogleUser?: boolean;
      totalCoursesStarted?: number;
      totalCoursesCompleted?: number;
      totalTimeSpent?: number;
      totalCertifications?: number;
      streakDays?: number;
      lastActivityAt?: Date;
      onboardingData?: any;
    };
  }

  interface User {
    onboardingCompleted?: boolean;
    emailVerified?: Date | null;
    image?: string | null;
    hasPassword?: boolean;
    isGoogleUser?: boolean;
    totalCoursesStarted?: number;
    totalCoursesCompleted?: number;
    totalTimeSpent?: number;
    totalCertifications?: number;
    streakDays?: number;
    lastActivityAt?: Date;
    onboardingData?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    onboardingCompleted?: boolean;
    emailVerified?: Date | null;
    picture?: string | null;
    hasPassword?: boolean;
    isGoogleUser?: boolean;
    totalCoursesStarted?: number;
    totalCoursesCompleted?: number;
    totalTimeSpent?: number;
    totalCertifications?: number;
    streakDays?: number;
    lastActivityAt?: Date;
    onboardingData?: any;
  }
}

export interface Milestone {
  id: string;
  userId: string;
  courseId: number;
  progressId: string;
  percentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpentAtMilestone?: number;
  positionAtMilestone?: string;
  notesAtMilestone?: string;
  learningSummary?: string;
  keyConcepts?: string;
  challenges?: string;
  nextSteps?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseReport {
  id: string;
  userId: string;
  courseId: number;
  progressId: string;
  title: string;
  type: 'milestone_summary' | 'course_completion' | 'learning_review' | 'final_course_summary';
  milestonePercentage?: number;
  summary: string;
  keyPoints: string;
  recommendations?: string;
  insights?: string;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MilestoneFormData {
  learningSummary: string;
  keyConcepts: string[];
  challenges: string;
  nextSteps: string;
  timeSpentAtMilestone: number;
  positionAtMilestone: string;
  notesAtMilestone: string;
}

export interface Course {
  id: number;
  course_id: string;
  title: string;
  link: string;
  platform: string;
  institution?: string;
  instructor?: string;
  description?: string;
  skills?: string;
  category?: string;
  level_normalized?: string;
  duration_hours?: number;
  price_numeric?: number;
  rating_numeric?: number;
  reviews_count_numeric?: number;
  enrolled_students?: string;
  course_type?: string;
  mode?: string;
  availability?: string;
  source_file?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithProgress extends Course {
  status: string;
  progressPercentage: number;
  timeSpent?: number;
  currentPosition?: string;
  notes?: string;
  rating?: number;
  review?: string;
  difficulty?: string;
  startedAt?: Date;
  completedAt?: Date;
  lastActivityAt?: Date;
  favorite: boolean;
} 