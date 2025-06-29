"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Star,
  Clock,
  Users,
  Award,
  Calendar,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { ProgressTracker } from "@/components/courses/ProgressTracker";
import { MilestoneProgress } from "@/components/ui/MilestoneProgress";
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore } from "@/stores/courseStore";
import Link from "next/link";
import { SectionHeader, CourseSkills, CourseInfo, ProgressInfo } from "@/components/ui";
import { safeJsonParseArray } from "@/lib/utils";
import { PageLoadingState } from "@/components/ui/loading-states";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PriceConverter } from "@/components/ui/PriceConverter";

interface Course {
  id: number;
  title: string;
  description: string;
  platform: string;
  institution: string;
  level_normalized: string;
  duration_hours: number;
  rating_numeric: number;
  price_numeric: number;
  language: string;
  format: string;
  link: string;
  skills: string;
  course_type: string;
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

export default function CourseProgressPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [isStoppingCourse, setIsStoppingCourse] = useState(false);

  const {
    addNotification,
    setLoading,
    isKeyLoading,
  } = useUIStore();
  
  const { updateCourseProgress, refreshStats } = useCourseStore();

  const loadingKey = `course-progress-${courseId}`;
  const loading = isKeyLoading(loadingKey);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(loadingKey, true);
    try {
      const [courseResponse, progressResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/progress?courseId=${courseId}`)
      ]);

      if (courseResponse.ok && progressResponse.ok) {
        const [courseData, progressData] = await Promise.all([
          courseResponse.json(),
          progressResponse.json()
        ]);
        
        setCourse(courseData);
        setProgress(progressData);
      } else {
        throw new Error("Erreur lors du chargement des données");
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      setError("Impossible de charger les données du cours");
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les données du cours",
        duration: 5000
      });
    } finally {
      setLoading(loadingKey, false);
    }
  };

  // Gestionnaire d'événement pour arrêter le cours
  useEffect(() => {
    const handleStopCourse = (event: CustomEvent) => {
      setShowStopDialog(true);
    };

    window.addEventListener('stopCourse', handleStopCourse as EventListener);
    return () => {
      window.removeEventListener('stopCourse', handleStopCourse as EventListener);
    };
  }, []);

  const handleStopCourse = async () => {
    setIsStoppingCourse(true);
    try {
      const response = await fetch(`/api/courses/progress?courseId=${courseId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Cours retiré",
          message: `"${course?.title}" a été retiré de vos cours en cours.`,
          duration: 3000
        });
        
        // Rediriger vers la page My Courses
        router.push("/dashboard/my-courses");
      } else {
        throw new Error("Erreur lors du retrait du cours");
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de retirer le cours",
        duration: 5000
      });
    } finally {
      setIsStoppingCourse(false);
      setShowStopDialog(false);
    }
  };

  const handleCancelStop = () => {
    setShowStopDialog(false);
  };

  const handleProgressUpdate = (updatedProgress: Partial<ProgressData>) => {
    // Mettre à jour l'état local
    setProgress((prev) => (prev ? { ...prev, ...updatedProgress } : null));
    
    // Mettre à jour le store global
    if (course) {
      updateCourseProgress(course.id, {
        status: updatedProgress.status ?? progress?.status ?? "not_started",
        progressPercentage: updatedProgress.progressPercentage ?? progress?.progressPercentage ?? 0,
        favorite: updatedProgress.favorite ?? progress?.favorite ?? false,
        notes: updatedProgress.notes ?? progress?.notes ?? undefined,
        timeSpent: updatedProgress.timeSpent ?? progress?.timeSpent ?? undefined,
        currentPosition: updatedProgress.currentPosition ?? progress?.currentPosition ?? undefined,
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoadingState message="Chargement de la progression..." />
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="relative">
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">
              Cours non trouvé
            </h1>
            <p className="text-gray-400 mb-6">
              {error || "Le cours demandé n'existe pas."}
            </p>
            <Link href="/dashboard/my-courses">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à mes cours
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Parser les skills depuis JSON de manière sécurisée
  const parsed = safeJsonParseArray(course.skills);

  // Fonction helper pour formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Date invalide"
        : date.toLocaleDateString("fr-FR");
    } catch {
      return "Date invalide";
    }
  };

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header avec navigation */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4 text-gray-400 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <h1 className="text-3xl font-bold mb-2 text-white">
              Gestion de la progression
            </h1>
            <h2 className="text-xl text-blue-400 mb-2">{course.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{course.platform}</span>
              {course.institution && <span>• {course.institution}</span>}
              {course.level_normalized && <span>• {course.level_normalized}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ProgressTracker et Paliers - Plus large à gauche */}
            <div className="lg:col-span-2 space-y-6">
              {/* ProgressTracker */}
              <ProgressTracker
                courseId={course.id}
                courseTitle={course.title}
                courseUrl={course.link}
                initialProgress={progress || undefined}
                onProgressUpdate={handleProgressUpdate}
              />

              {/* Paliers de progression - Nouveau composant */}
              <MilestoneProgress
                courseId={course.id}
                currentProgress={progress?.progressPercentage || 0}
                currentTimeSpent={progress?.timeSpent || 0}
                currentPosition={progress?.currentPosition || ''}
              />

              {/* Actions rapides */}
              <Card className="bg-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.link && (
                    <Button
                      onClick={() => window.open(course.link, "_blank")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir sur {course.platform}
                    </Button>
                  )}

                  <Link href="/dashboard/my-courses">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour à mes cours
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Détails du cours à droite */}
            <div className="space-y-6">
              {/* Description - Toujours visible */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                <SectionHeader icon={<BookOpen className="w-5 h-5" />}>Description</SectionHeader>
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {course.description || "Aucune description disponible."}
                  </p>
                </div>
              </div>

              {/* Compétences - Toujours visibles */}
              {parsed.length > 0 && (
                <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                  <SectionHeader>Compétences</SectionHeader>
                  <div className="px-6 pb-6">
                    <CourseSkills skills={parsed.slice(0, 3)} />
                    {parsed.length > 3 && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-600/20 text-gray-300 border border-gray-500/30">
                          +{parsed.length - 3} autres
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informations détaillées - Toujours visibles mais compactes */}
              <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                <SectionHeader>Informations</SectionHeader>
                <div className="px-6 pb-6">
                  <CourseInfo
                    duration={String(course.duration_hours)}
                    rating={course.rating_numeric}
                    format={course.format}
                    certificate_type={course.course_type}
                    start_date={course.start_date}
                    price={course.price_numeric}
                  />
                </div>
              </div>

              {/* Informations de progression - Visibles seulement si le cours est en cours ou en pause */}
              {progress && (progress.status === "in_progress" || progress.status === "paused") && (
                <div className="bg-gray-900/60 border border-gray-700 rounded-lg">
                  <SectionHeader>Progression actuelle</SectionHeader>
                  <div className="px-6 pb-6">
                    <ProgressInfo
                      currentPosition={progress.currentPosition}
                      timeSpent={progress.timeSpent}
                      startedAt={progress.startedAt}
                      lastActivityAt={progress.lastActivityAt}
                    />
                  </div>
                </div>
              )}

              {/* Zone dangereuse - En bas de la sidebar */}
              {progress && progress.status !== "not_started" && (
                <div className="bg-red-500/5 border border-red-500/30 rounded-lg">
                  <div className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <Label className="text-red-400 font-medium text-lg">Zone dangereuse</Label>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-red-400 font-medium mb-2">Arrêter le cours</h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Cette action va retirer le cours de vos cours en cours et réinitialiser votre progression.
                          Vos notes et temps passé seront conservés.
                        </p>
                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                          <div>• Réinitialisation de la progression à 0%</div>
                          <div>• Effacement de la position actuelle</div>
                          <div>• Conservation des notes et temps passé</div>
                          <div>• Retrait de la liste "Mes cours"</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Déclencher l'événement pour ouvrir la modal
                          const event = new CustomEvent('stopCourse', { 
                            detail: { courseId: course.id, courseTitle: course.title } 
                          });
                          window.dispatchEvent(event);
                        }}
                        className="w-full border-red-500 text-red-400 hover:bg-red-500/10 hover:border-red-400"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Arrêter le cours
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation pour arrêter le cours */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Arrêter ce cours ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Êtes-vous sûr de vouloir arrêter de suivre "{course?.title}" ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="text-gray-300 space-y-3">
            <div>
              <strong>Attention :</strong> Cette action va :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Retirer le cours de vos cours en cours</li>
                <li>Réinitialiser votre progression à 0%</li>
                <li>Conserver vos notes et temps passé</li>
                <li>Marquer le cours comme non commencé</li>
              </ul>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelStop}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStopCourse}
              disabled={isStoppingCourse}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isStoppingCourse ? "Arrêt en cours..." : "Oui, arrêter le cours"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
