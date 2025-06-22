import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboardingCompleted: boolean;
      hasPassword?: boolean;
      isGoogleUser?: boolean;
    };
  }

  interface User {
    onboardingCompleted?: boolean;
    image?: string | null;
    hasPassword?: boolean;
    isGoogleUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    onboardingCompleted?: boolean;
    picture?: string | null;
    hasPassword?: boolean;
    isGoogleUser?: boolean;
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
  type: 'milestone_summary' | 'course_completion' | 'learning_review';
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