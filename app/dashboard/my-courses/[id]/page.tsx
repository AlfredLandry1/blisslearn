"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { ArrowLeft, CheckCircle, Clock, Star, ExternalLink, Users, Award, Calendar, BookOpen, Target } from "lucide-react";
import { ProgressTracker } from "@/components/courses/ProgressTracker";
import { useUIStore } from "@/stores/uiStore";
import Link from "next/link";
import { SectionHeader, CourseSkills, CourseInfo } from "@/components/ui";
import { safeJsonParseArray } from "@/lib/utils";
import { PageLoadingState } from "@/components/ui/loading-states";

interface Course {
  id: number;
  title: string;
  description: string;
  platform: string;
  provider: string;
  level: string;
  duration: string;
  rating: number;
  price: string;
  language: string;
  format: string;
  url: string;
  skills: string;
  certificate_type: string;
  start_date: string;
}

interface ProgressData {
  id: string;
  status: string;
  progressPercentage: number | null;
  timeSpent: number | null;
  currentPosition: string | null;
  notes: string | null;
  rating: number | null;
  review: string | null;
  difficulty: string | null;
  startedAt: string | null;
  lastActivityAt: string | null;
  favorite: boolean;
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setLoading: setGlobalLoading, clearLoading, addNotification } = useUIStore();
  const loadingKey = `my-course-detail-${courseId}`;

  useEffect(() => {
    const fetchCourseData = async () => {
      setGlobalLoading(loadingKey, true);
      try {
        // Récupérer les détails du cours
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error("Cours non trouvé");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Récupérer la progression
        const progressResponse = await fetch(`/api/courses/progress?courseId=${courseId}`);
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setProgress(progressData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
        addNotification({
          id: `course-error-${Date.now()}`,
          type: "error",
          title: "Erreur",
          message: "Impossible de charger les détails du cours",
          duration: 5000
        });
      } finally {
        setGlobalLoading(loadingKey, false);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, setGlobalLoading, clearLoading, addNotification, loadingKey]);

  const handleProgressUpdate = (updatedProgress: Partial<ProgressData>) => {
    setProgress(prev => prev ? { ...prev, ...updatedProgress } : null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoadingState message="Chargement du cours..." />
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="relative">
          <SpaceBackground/>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Cours non trouvé</h1>
            <p className="text-gray-400 mb-6">{error || "Le cours demandé n'existe pas."}</p>
            <Link href="/dashboard/courses">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux cours
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Parser les skills depuis JSON de manière sécurisée
  const skills = safeJsonParseArray(course.skills);

  return (
    <DashboardLayout>
      <div className="relative">
        <SpaceBackground/>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header avec navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4 text-gray-400 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux cours
            </Button>
            
            <h1 className="text-3xl font-bold mb-2 text-white">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{course.platform}</span>
              {course.provider && <span>• {course.provider}</span>}
              {course.level && <span>• {course.level}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                <SectionHeader icon={<BookOpen className="w-5 h-5" />}>Description</SectionHeader>
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {course.description || "Aucune description disponible."}
                  </p>
                </div>
              </div>

              {/* Compétences */}
              {skills.length > 0 && (
                <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                  <SectionHeader icon={<Target className="w-5 h-5" />}>Compétences acquises</SectionHeader>
                  <div className="px-6 pb-6">
                    <CourseSkills skills={skills} />
                  </div>
                </div>
              )}

              {/* Informations détaillées */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                <SectionHeader>Informations du cours</SectionHeader>
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CourseInfo
                      duration={course.duration}
                      rating={course.rating}
                      format={course.format}
                      certificate_type={course.certificate_type}
                      start_date={course.start_date}
                      price={course.price}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar avec progression */}
            <div className="space-y-6">
              {/* ProgressTracker */}
              <ProgressTracker
                courseId={course.id}
                courseTitle={course.title}
                courseUrl={course.url}
                initialProgress={progress || undefined}
                onProgressUpdate={handleProgressUpdate}
              />

              {/* Actions rapides */}
              <Card className="bg-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.url && (
                    <Button 
                      onClick={() => window.open(course.url, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir sur {course.platform}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300"
                    onClick={() => {
                      addNotification({
                        id: `favorite-${Date.now()}`,
                        type: "success",
                        title: "Favori ajouté",
                        message: "Cours ajouté à vos favoris",
                        duration: 3000
                      });
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Ajouter aux favoris
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 