"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  Settings,
  ChevronRight,
  Star,
  Clock,
  Users,
  Heart,
  ExternalLink,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  safeJsonParseArray,
  extractCourseExtraInfo,
  formatDuration,
  formatPrice,
  formatNumber,
} from "@/lib/utils";
import { PriceConverter } from "@/components/ui/PriceConverter";

export function CourseCard({
  course,
  context = "explorer",
  onCourseUpdate,
}: {
  course: any;
  context?: "explorer" | "my-courses";
  onCourseUpdate?: (courseId: number, action: "started" | "stopped") => void;
}) {
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(course.favorite || false);
  const { addNotification } = useUIStore();
  const { updateCourseProgress, getCourseById, removeCourse, toggleFavorite, refreshCourses } =
    useCourseStore();

  // Récupérer les données du store global
  const storeCourse = getCourseById(course.id);
  const displayCourse = storeCourse || course;

  const isCourseInProgress =
    displayCourse.status === "in_progress" ||
    displayCourse.status === "completed";
  const isCompleted = displayCourse.status === "completed";
  const extraInfo = extractCourseExtraInfo(displayCourse.extra);
  const skills = safeJsonParseArray(displayCourse.skills);

  const handleStartCourse = async () => {
    setIsUpdating(true);
    try {
      console.log("🚀 Début handleStartCourse:", {
        courseId: displayCourse.id,
        courseTitle: displayCourse.title,
        status: "in_progress",
      });

      const requestBody = {
        courseId: displayCourse.id,
        status: "in_progress",
        startedAt: new Date().toISOString(),
      };

      console.log("📤 Envoi de la requête:", {
        url: "/api/courses/progress",
        method: "POST",
        body: requestBody,
      });

      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Réponse reçue:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Données de réponse:", responseData);

        updateCourseProgress(displayCourse.id, {
          status: "in_progress",
          progressPercentage: 0,
        });

        onCourseUpdate?.(displayCourse.id, "started");

        addNotification({
          type: "success",
          title: "Cours ajouté !",
          message: `"${displayCourse.title}" a été ajouté à vos cours en cours.`,
          duration: 3000,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Erreur de réponse:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Erreur ${response.status}: ${errorData.error || response.statusText}`
        );
      }
    } catch (error) {
      console.error("💥 Erreur dans handleStartCourse:", error);
      addNotification({
        type: "error",
        title: "Erreur",
        message: `Impossible d'ajouter le cours: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStopCourse = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `/api/courses/progress?courseId=${displayCourse.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        if (context === "my-courses") {
          removeCourse(displayCourse.id);
        }

        updateCourseProgress(displayCourse.id, {
          status: "not_started",
          progressPercentage: 0,
          currentPosition: "",
        });

        onCourseUpdate?.(displayCourse.id, "stopped");

        addNotification({
          type: "success",
          title: "Cours retiré",
          message:
            context === "my-courses"
              ? `"${displayCourse.title}" a été retiré de vos cours en cours.`
              : `"${displayCourse.title}" a été marqué comme non commencé.`,
          duration: 3000,
        });
      } else {
        throw new Error("Erreur lors du retrait du cours");
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de retirer le cours",
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
      setShowStopDialog(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const newFavoriteState = !isFavorite;
      
      // Appel API pour persister en base de données
      const response = await fetch("/api/courses/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: displayCourse.id,
          favorite: newFavoriteState,
          lastActivityAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Mettre à jour l'état local et le store
        setIsFavorite(newFavoriteState);
        toggleFavorite(displayCourse.id);
        
        // Synchroniser le store avec la base de données
        await refreshCourses();
        
        addNotification({
          type: "success",
          title: newFavoriteState ? "Ajouté aux favoris" : "Retiré des favoris",
          message: `"${displayCourse.title}" ${
            newFavoriteState ? "a été ajouté à" : "a été retiré de"
          } vos favoris.`,
          duration: 2000,
        });
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de mettre à jour les favoris",
        duration: 5000
      });
    }
  };

  const getStatusColor = () => {
    if (isCompleted)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (isCourseInProgress)
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getStatusIcon = () => {
    if (isCompleted) return <Award className="w-3 h-3" />;
    if (isCourseInProgress) return <TrendingUp className="w-3 h-3" />;
    return <BookOpen className="w-3 h-3" />;
  };

  return (
    <>
      <Card className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden min-w-0">
        {/* Effet de brillance au survol */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        {/* Header avec titre et favori */}
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4 min-w-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="font-bold text-lg leading-tight text-white group-hover:text-blue-300 transition-colors line-clamp-2 overflow-hidden min-w-0">
                  {displayCourse.title}
                </h3>
              </TooltipTrigger>
              <TooltipContent>{displayCourse.title}</TooltipContent>
            </Tooltip>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="text-gray-400 hover:text-yellow-400 p-2 h-9 w-9 flex-shrink-0 transition-colors min-w-0"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
          </Button>
        </div>

        {/* Description */}
        <div className="relative z-10 mb-4 overflow-hidden min-w-0">
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed overflow-hidden min-w-0">
            {displayCourse.description || "Aucune description disponible."}
          </p>
        </div>

        {/* Informations principales */}
        <div className="relative z-10 space-y-3 mb-4 overflow-hidden min-w-0">
          {/* Rating et statistiques */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm overflow-hidden min-w-0">
            {displayCourse.rating_numeric && (
              <div className="flex items-center gap-1.5 text-yellow-400 flex-shrink-0 min-w-0">
                <Star className="w-4 h-4 fill-current flex-shrink-0" />
                <span className="font-medium truncate">
                  {displayCourse.rating_numeric.toFixed(1)}
                </span>
              </div>
            )}
            {displayCourse.duration_hours && (
              <div className="flex items-center gap-1.5 text-gray-400 flex-shrink-0 min-w-0">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formatDuration(displayCourse.duration_hours)}</span>
              </div>
            )}
            {displayCourse.price_numeric !== undefined && (
              <div className="flex-shrink-0 min-w-0">
                <PriceConverter
                  price={displayCourse.price_numeric}
                  originalCurrency="EUR"
                  displayCurrency="FCFA"
                  size="sm"
                  variant="default"
                />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-hidden min-w-0">
            {displayCourse.platform && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs px-2 py-1 truncate flex-shrink-0">
                {displayCourse.platform}
              </Badge>
            )}
            {displayCourse.level_normalized && (
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs px-2 py-1 truncate flex-shrink-0">
                {displayCourse.level_normalized}
              </Badge>
            )}
            {displayCourse.language && (
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs px-2 py-1 truncate flex-shrink-0">
                {displayCourse.language}
              </Badge>
            )}
            {/* Statut du cours */}
            <Badge
              className={`${getStatusColor()} text-xs px-2 py-1 flex items-center gap-1 truncate flex-shrink-0`}
            >
              {getStatusIcon()}
              <span className="truncate">
                {isCompleted
                  ? "Terminé"
                  : isCourseInProgress
                  ? "En cours"
                  : "Non commencé"}
              </span>
            </Badge>
          </div>
        </div>

        {/* Compétences */}
        {skills && skills.length > 0 && (
          <div className="relative z-10 mb-4 overflow-hidden min-w-0">
            <div className="flex flex-wrap gap-1.5 overflow-hidden min-w-0">
              {skills.slice(0, 3).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-lg text-xs border border-gray-600/30 truncate flex-shrink-0"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-gray-500 text-xs px-2 py-1 flex-shrink-0">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Barre de progression */}
        {isCourseInProgress && (
          <div className="relative z-10 mb-4 overflow-hidden min-w-0">
            <div className="flex items-center justify-between text-sm mb-2 min-w-0">
              <span className="text-gray-400 truncate">Progression</span>
              <span className="text-white font-medium truncate flex-shrink-0">
                {displayCourse.progressPercentage || 0}%
              </span>
            </div>
            <Progress
              value={displayCourse.progressPercentage || 0}
              className="h-2 bg-gray-700"
            />
          </div>
        )}

        {/* Actions */}
        <div className="relative z-10 space-y-3 overflow-hidden min-w-0">
          {/* Bouton externe */}
          {displayCourse.link && (
            <a
              href={displayCourse.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Voir le cours</span>
                <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
              </Button>
            </a>
          )}

          {/* Boutons d'action principaux - Empilés verticalement */}
          <div className="space-y-2 overflow-hidden min-w-0">
            {!isCourseInProgress ? (
              // Cours non commencé
              <>
                {/* Bouton principal - Voir détails */}
                <Link
                  href={`/dashboard/explorer/${displayCourse.id}`}
                  className="block w-full"
                >
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors h-10"
                  >
                    <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Voir détails</span>
                  </Button>
                </Link>

                {/* Bouton secondaire - Commencer */}
                <Button
                  onClick={handleStartCourse}
                  disabled={isUpdating}
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors h-10"
                >
                  {isUpdating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Commencer</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              // Cours en cours
              <>
                {/* Bouton principal - Continuer */}
                <Link
                  href={`/dashboard/my-courses/${displayCourse.id}/progress`}
                  className="block w-full"
                >
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors h-10"
                  >
                    <Target className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Continuer</span>
                  </Button>
                </Link>

                {/* Bouton secondaire - Arrêter */}
                <Button
                  onClick={() => setShowStopDialog(true)}
                  variant="outline"
                  size="sm"
                  disabled={isUpdating}
                  className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-colors h-10"
                >
                  {isUpdating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Arrêter</span>
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Dialog de confirmation amélioré */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              Arrêter le cours ?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <span>
                  Êtes-vous sûr de vouloir arrêter{" "}
                  <strong>"{displayCourse.title}"</strong> ?
                </span>

                {/* Informations sur la progression */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium">
                      Votre progression sera conservée
                    </span>
                  </div>

                  {displayCourse.progressPercentage &&
                    displayCourse.progressPercentage > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-blue-300">
                          <span>Progression actuelle</span>
                          <span>{displayCourse.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-blue-500/20 rounded-full h-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${displayCourse.progressPercentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                  <div className="text-xs text-blue-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Vous pourrez reprendre plus tard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Vos notes et évaluations seront sauvegardées</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Le cours restera dans votre bibliothèque</span>
                    </div>
                  </div>
                </div>

                <span className="text-sm text-gray-400 block">
                  Vous pouvez toujours reprendre ce cours depuis la section "Mes
                  cours".
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
              Continuer le cours
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStopCourse}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
            >
              <Settings className="w-4 h-4 mr-2" />
              Arrêter le cours
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
