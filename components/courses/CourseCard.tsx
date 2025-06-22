"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Settings, ChevronRight, StopCircle } from "lucide-react";
import Link from "next/link";
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
import { useUIStore } from "@/stores/uiStore";
import { useCourseStore } from "@/stores/courseStore";

export function CourseCard({ 
  course, 
  context = "explorer",
  onCourseUpdate
}: { 
  course: any; 
  context?: "explorer" | "my-courses";
  onCourseUpdate?: (courseId: number, action: 'started' | 'stopped') => void;
}) {
  // Debug temporaire pour voir les données de progression
  console.log('CourseCard Debug:', {
    courseId: course.id,
    title: course.title,
    status: course.status,
    progressPercentage: course.progressPercentage,
    context
  });

  const [showStopDialog, setShowStopDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addNotification } = useUIStore();
  const { updateCourseProgress, getCourseById, removeCourse } = useCourseStore();

  // Essayer de récupérer les données du store global en premier
  const storeCourse = getCourseById(course.id);
  // Utiliser les données du store si disponibles, sinon utiliser les données du cours directement
  // Les données du cours contiennent déjà les informations de progression de l'API
  const displayCourse = storeCourse || course;

  const handleStartCourse = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: displayCourse.id,
          status: "in_progress",
          startedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Mettre à jour le store global
        updateCourseProgress(displayCourse.id, {
          status: "in_progress",
          progressPercentage: 0
        });
        
        // Notifier le parent si la prop est fournie
        onCourseUpdate?.(displayCourse.id, 'started');
        
        addNotification({
          id: `course-started-${Date.now()}`,
          type: "success",
          title: "Cours ajouté !",
          message: `"${displayCourse.title}" a été ajouté à vos cours en cours.`,
          duration: 3000
        });
      } else {
        throw new Error("Erreur lors de l'ajout du cours");
      }
    } catch (error) {
      addNotification({
        id: `course-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible d'ajouter le cours",
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStopCourse = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/courses/progress?courseId=${displayCourse.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        // Supprimer le cours du store global seulement sur My Courses
        if (context === "my-courses") {
          removeCourse(displayCourse.id);
        }
        
        // Mettre à jour le store global (pour Explorer)
        updateCourseProgress(displayCourse.id, {
          status: "not_started",
          progressPercentage: 0,
          currentPosition: ""
        });
        
        // Notifier le parent si la prop est fournie
        onCourseUpdate?.(displayCourse.id, 'stopped');
        
        addNotification({
          id: `course-stopped-${Date.now()}`,
          type: "success",
          title: "Cours retiré",
          message: context === "my-courses" 
            ? `"${displayCourse.title}" a été retiré de vos cours en cours.`
            : `"${displayCourse.title}" a été marqué comme non commencé.`,
          duration: 3000
        });
      } else {
        throw new Error("Erreur lors du retrait du cours");
      }
    } catch (error) {
      addNotification({
        id: `course-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible de retirer le cours",
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
      setShowStopDialog(false);
    }
  };

  const isCourseInProgress = displayCourse.status === "in_progress" || displayCourse.status === "completed";

  return (
    <>
      <Card key={displayCourse.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col h-full hover:shadow-xl transition">
        <div className="font-bold text-lg mb-2 line-clamp-2">{displayCourse.title}</div>
        <div className="text-sm text-gray-400 mb-2 line-clamp-3">{displayCourse.description}</div>
        <div className="flex flex-wrap gap-2 text-xs mb-2">
          {displayCourse.platform && (
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">{displayCourse.platform}</span>
          )}
          {displayCourse.level && <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{displayCourse.level}</span>}
          {displayCourse.language && (
            <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{displayCourse.language}</span>
          )}
          {/* Badge de statut - affiché sur toutes les pages */}
          <Badge
            variant={
              displayCourse.status === "completed"
                ? "default"
                : displayCourse.status === "in_progress"
                ? "secondary"
                : "outline"
            }
            className="text-xs"
          >
            {displayCourse.status === "completed"
              ? "Terminé"
              : displayCourse.status === "in_progress"
              ? "En cours"
              : "Non commencé"}
          </Badge>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          {/* Barre de progression - affichée pour les cours en cours ou terminés sur toutes les pages */}
          {(displayCourse.status === "in_progress" || displayCourse.status === "completed") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Progression</span>
                <span className="text-white font-medium">
                  {displayCourse.progressPercentage || 0}%
                </span>
              </div>
              <Progress
                value={displayCourse.progressPercentage || 0}
                className="h-2 w-full"
              />
            </div>
          )}

          {displayCourse.url && (
            <a
              href={displayCourse.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Voir le cours sur {displayCourse.platform}
            </a>
          )}
          
          {/* Bouton Commencer/Arrêter */}
          <Button
            onClick={isCourseInProgress ? () => setShowStopDialog(true) : handleStartCourse}
            disabled={isUpdating}
            className={`w-full ${
              isCourseInProgress
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : isCourseInProgress ? (
              <StopCircle className="w-4 h-4 mr-2" />
            ) : (
              <PlayCircle className="w-4 h-4 mr-2" />
            )}
            {isCourseInProgress ? "Arrêter le cours" : "Commencer le cours"}
          </Button>
          
          {/* Boutons conditionnels selon le statut du cours */}
          {/* Bouton "Gérer progression" - seulement si le cours est en cours ou terminé */}
          {(displayCourse.status === "in_progress" || displayCourse.status === "completed") && (
            <Link href={`/dashboard/my-courses/${displayCourse.id}/progress`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Settings className="w-3 h-3 mr-1" />
                Gérer progression
              </Button>
            </Link>
          )}
          
          {/* Bouton "Voir détail" - toujours présent, adapté au contexte */}
          <Link href={context === "my-courses" ? `/dashboard/my-courses/${displayCourse.id}` : `/dashboard/explorer/${displayCourse.id}`}>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Voir les détails
              <ChevronRight className="w-3 h-3 mr-1" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Modal de confirmation pour arrêter le cours */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Arrêter ce cours ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Êtes-vous sûr de vouloir arrêter de suivre "{displayCourse.title}" ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="text-gray-300 space-y-3">
            <div>
              <strong>Attention :</strong> Cette action va :
              <ul className="list-disc list-inside mt-2 space-y-1">
                {context === "my-courses" ? (
                  <>
                    <li>Retirer le cours de vos cours en cours</li>
                    <li>Réinitialiser votre progression à 0%</li>
                    <li>Conserver vos notes et temps passé</li>
                    <li>Marquer le cours comme non commencé</li>
                  </>
                ) : (
                  <>
                    <li>Marquer le cours comme non commencé</li>
                    <li>Réinitialiser votre progression à 0%</li>
                    <li>Conserver vos notes et temps passé</li>
                    <li>Le cours restera visible dans l'explorateur</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowStopDialog(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStopCourse}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Oui, arrêter le cours
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 