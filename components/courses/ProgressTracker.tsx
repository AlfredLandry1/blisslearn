"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  Star, 
  Clock, 
  BookOpen,
  Save,
  Loader2,
  ExternalLink,
  Target,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { ProgressBarWithLabel, NotesEditor } from "@/components/ui";

interface ProgressData {
  id?: string;
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

interface ProgressTrackerProps {
  courseId: number;
  courseTitle: string;
  courseUrl?: string;
  initialProgress?: ProgressData;
  onProgressUpdate?: (progress: Partial<ProgressData>) => void;
  renderDangerZone?: (props: {
    onStopCourse: () => void;
    isUpdating: boolean;
    courseTitle: string;
  }) => React.ReactNode;
}

// Hook pour le debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  courseId,
  courseTitle,
  courseUrl,
  initialProgress,
  onProgressUpdate,
  renderDangerZone
}) => {
  const [progress, setProgress] = useState<ProgressData>({
    status: "not_started",
    progressPercentage: 0,
    timeSpent: 0,
    currentPosition: "",
    notes: "",
    rating: null,
    review: "",
    difficulty: null,
    startedAt: null,
    lastActivityAt: null,
    favorite: false,
    ...initialProgress
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<string | null>(null);

  const [localTimeSpent, setLocalTimeSpent] = useState(progress.timeSpent || 0);
  const [localPosition, setLocalPosition] = useState(progress.currentPosition || "");
  const [localNotes, setLocalNotes] = useState(progress.notes || "");

  // États pour les paliers
  const [milestones, setMilestones] = useState<any[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [hasShownNotStartedNotification, setHasShownNotStartedNotification] = useState(false);

  // État pour le formulaire
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { setLoading: setGlobalLoading, clearLoading, addNotification } = useUIStore();
  const loadingKey = `progress-tracker-${courseId}`;

  // Mettre à jour la progression locale quand initialProgress change
  useEffect(() => {
    if (initialProgress) {
      setProgress(prev => ({ ...prev, ...initialProgress }));
      setLocalTimeSpent(initialProgress.timeSpent || 0);
      setLocalPosition(initialProgress.currentPosition || "");
      setLocalNotes(initialProgress.notes || "");
      setIsFormDirty(false);
    }
  }, [initialProgress]);

  // Charger les paliers
  useEffect(() => {
    // Réinitialiser l'état de notification pour chaque nouveau cours
    setHasShownNotStartedNotification(false);
    loadMilestones();
  }, [courseId]);

  // Vérifier si le formulaire a des modifications
  useEffect(() => {
    const hasChanges = 
      localTimeSpent !== (progress.timeSpent || 0) ||
      localPosition !== (progress.currentPosition || "") ||
      localNotes !== (progress.notes || "");
    
    setIsFormDirty(hasChanges);
  }, [localTimeSpent, localPosition, localNotes, progress]);

  const loadMilestones = async () => {
    setMilestonesLoading(true);
    try {
      const response = await fetch(`/api/courses/milestones?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Vérifier si le cours n'est pas commencé
        if (data.courseNotStarted) {
          setMilestones([]);
          // Afficher un toast informatif seulement si pas déjà affiché
          if (!hasShownNotStartedNotification) {
            addNotification({
              id: `course-not-started-${courseId}`,
              type: "info",
              title: "Cours non commencé",
              message: data.message || "Ce cours n'est pas encore dans vos cours en cours. Aucune statistique disponible.",
              duration: 5000
            });
            setHasShownNotStartedNotification(true);
          }
        } else {
          setMilestones(data.milestones);
        }
      } else {
        // Gérer les erreurs HTTP
        const errorData = await response.json();
        addNotification({
          id: `milestones-error-${courseId}`,
          type: "error",
          title: "Erreur de chargement",
          message: errorData.error || "Impossible de charger les statistiques du cours",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Erreur chargement paliers:', error);
      addNotification({
        id: `milestones-network-error-${courseId}`,
        type: "error",
        title: "Erreur réseau",
        message: "Impossible de communiquer avec le serveur",
        duration: 5000
      });
    } finally {
      setMilestonesLoading(false);
    }
  };

  const getNextAvailableMilestone = () => {
    return milestones.find(m => !m.isCompleted && m.percentage > (progress.progressPercentage || 0));
  };

  const canValidateMilestone = (percentage: number) => {
    // Vérifier que le palier précédent est validé
    const previousMilestone = milestones.find(m => m.percentage < percentage && !m.isCompleted);
    return !previousMilestone && (progress.progressPercentage || 0) >= percentage;
  };

  // Vérifier si tous les paliers sont validés
  const areAllMilestonesCompleted = () => {
    const requiredMilestones = [25, 50, 75, 100];
    const completedMilestones = milestones
      .filter(m => m.isCompleted)
      .map(m => m.percentage);
    
    return requiredMilestones.every(p => completedMilestones.includes(p));
  };

  const handleMilestoneClick = (percentage: number) => {
    if (canValidateMilestone(percentage)) {
      // Ouvrir la modal de validation
      addNotification({
        id: `milestone-info-${Date.now()}`,
        type: "info",
        title: "Validation de palier",
        message: `Pour valider le palier ${percentage}%, utilisez la section "Paliers de progression" ci-dessous.`,
        duration: 5000
      });
    } else if (percentage <= (progress.progressPercentage || 0)) {
      // Palier déjà atteint, juste mettre à jour la progression
      handleProgressChange(percentage);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    // Vérifier si on essaie d'abandonner un cours en cours
    if (newStatus === "not_started" && progress.status !== "not_started") {
      setPendingStatusChange(newStatus);
      setShowAbandonDialog(true);
      return;
    }

    await performStatusChange(newStatus);
  };

  const performStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setGlobalLoading(loadingKey, true);

    try {
      const updatedProgress = {
        ...progress,
        status: newStatus,
        lastActivityAt: new Date().toISOString(),
        // Réinitialiser la progression si on marque comme "non commencé"
        ...(newStatus === "not_started" && {
          progressPercentage: 0,
          currentPosition: ""
        }),
        ...(newStatus === "in_progress" && !progress.startedAt && { startedAt: new Date().toISOString() }),
        ...(newStatus === "completed" && { completedAt: new Date().toISOString() })
      };

      const response = await fetch("/api/courses/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          ...updatedProgress
        })
      });

      if (response.ok) {
        setProgress(updatedProgress);
        onProgressUpdate?.(updatedProgress);
        
        const statusLabel = getStatusLabel(newStatus);
        addNotification({
          id: `progress-update-${Date.now()}`,
          type: "success",
          title: "Progression mise à jour",
          message: `Statut changé vers "${statusLabel}"`,
          duration: 3000
        });
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      addNotification({
        id: `progress-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible de mettre à jour la progression",
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
      setGlobalLoading(loadingKey, false);
    }
  };

  const handleConfirmAbandon = async () => {
    if (pendingStatusChange) {
      await performStatusChange(pendingStatusChange);
      setPendingStatusChange(null);
    }
    setShowAbandonDialog(false);
  };

  const handleCancelAbandon = () => {
    setPendingStatusChange(null);
    setShowAbandonDialog(false);
  };

  const handleProgressChange = async (newPercentage: number) => {
    setIsUpdating(true);
    setGlobalLoading(loadingKey, true);

    try {
      const updatedProgress = {
        ...progress,
        progressPercentage: newPercentage,
        lastActivityAt: new Date().toISOString()
      };

      const response = await fetch("/api/courses/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          ...updatedProgress
        })
      });

      if (response.ok) {
        setProgress(updatedProgress);
        onProgressUpdate?.(updatedProgress);
        
        addNotification({
          id: `progress-update-${Date.now()}`,
          type: "success",
          title: "Progression mise à jour",
          message: `Progression mise à jour à ${newPercentage}%`,
          duration: 3000
        });
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      addNotification({
        id: `progress-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible de mettre à jour la progression",
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
      setGlobalLoading(loadingKey, false);
    }
  };

  const handleSaveNotes = async () => {
    // Cette fonction a été remplacée par handleSaveAllChanges
    // Supprimée pour éviter la duplication
  };

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    setGlobalLoading(loadingKey, true);

    try {
      const newFavoriteState = !progress.favorite;
      const updatedProgress = {
        ...progress,
        favorite: newFavoriteState,
        lastActivityAt: new Date().toISOString()
      };

      const response = await fetch("/api/courses/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          favorite: newFavoriteState,
          lastActivityAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setProgress(updatedProgress);
        onProgressUpdate?.(updatedProgress);
        
        addNotification({
          id: `favorite-update-${Date.now()}`,
          type: "success",
          title: "Favoris mis à jour",
          message: newFavoriteState ? "Cours ajouté aux favoris" : "Cours retiré des favoris",
          duration: 3000
        });
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      addNotification({
        id: `favorite-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible de mettre à jour les favoris",
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
      setGlobalLoading(loadingKey, false);
    }
  };

  // Fonction pour sauvegarder les données dans le palier en cours
  const saveToCurrentMilestone = async (data: {
    timeSpentAtMilestone: number;
    positionAtMilestone: string;
    notesAtMilestone: string;
  }) => {
    try {
      const currentProgress = progress.progressPercentage || 0;
      
      // Trouver le palier en cours (le plus proche de la progression actuelle)
      // Si on est à 25%, on sauvegarde dans le palier 25%
      // Si on est à 30%, on sauvegarde dans le palier 25% (le plus proche en dessous)
      const currentMilestone = milestones.find(m => 
        m.percentage <= currentProgress && 
        !m.isCompleted &&
        m.percentage === Math.max(...milestones
          .filter(m => m.percentage <= currentProgress && !m.isCompleted)
          .map(m => m.percentage)
        )
      );

      if (currentMilestone) {
        console.log(`Sauvegarde dans le palier ${currentMilestone.percentage}% (ID: ${currentMilestone.id})`);
        
        // Mettre à jour le palier avec les données actuelles
        const response = await fetch(`/api/courses/milestones/${currentMilestone.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeSpentAtMilestone: data.timeSpentAtMilestone,
            positionAtMilestone: data.positionAtMilestone,
            notesAtMilestone: data.notesAtMilestone,
            lastUpdatedAt: new Date().toISOString()
          })
        });

        if (response.ok) {
          console.log(`Palier ${currentMilestone.percentage}% mis à jour avec succès`);
        } else {
          console.error(`Erreur mise à jour palier ${currentMilestone.percentage}%:`, await response.text());
        }
      } else {
        console.log(`Aucun palier en cours trouvé pour la progression ${currentProgress}%`);
      }
    } catch (error) {
      console.error('Erreur sauvegarde palier en cours:', error);
      // Pas de notification pour éviter le spam
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not_started": return "Non commencé";
      case "in_progress": return "En cours";
      case "paused": return "En pause";
      case "completed": return "Terminé";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "not_started": return <BookOpen className="w-4 h-4" />;
      case "in_progress": return <PlayCircle className="w-4 h-4" />;
      case "paused": return <PauseCircle className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started": return "bg-gray-700 text-gray-300";
      case "in_progress": return "bg-blue-700 text-blue-300";
      case "paused": return "bg-yellow-700 text-yellow-300";
      case "completed": return "bg-green-700 text-green-300";
      default: return "bg-gray-700 text-gray-300";
    }
  };

  // Fonction pour sauvegarder toutes les modifications
  const handleSaveAllChanges = async () => {
    if (!isFormDirty) return;

    setIsSaving(true);
    setGlobalLoading(loadingKey, true);

    try {
      // Sauvegarder la progression générale
      const updatedProgress = {
        ...progress,
        timeSpent: localTimeSpent,
        currentPosition: localPosition,
        notes: localNotes,
        lastActivityAt: new Date().toISOString()
      };

      const response = await fetch("/api/courses/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          timeSpent: localTimeSpent,
          currentPosition: localPosition,
          notes: localNotes,
          lastActivityAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setProgress(updatedProgress);
        onProgressUpdate?.(updatedProgress);
        
        // Sauvegarder aussi dans le palier en cours si applicable
        await saveToCurrentMilestone({
          timeSpentAtMilestone: localTimeSpent,
          positionAtMilestone: localPosition,
          notesAtMilestone: localNotes
        });

        setIsFormDirty(false);
        
        addNotification({
          id: `progress-saved-${Date.now()}`,
          type: "success",
          title: "Progression sauvegardée",
          message: "Vos modifications ont été sauvegardées avec succès",
          duration: 3000
        });
      } else {
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      addNotification({
        id: `progress-error-${Date.now()}`,
        type: "error",
        title: "Erreur",
        message: "Impossible de sauvegarder les modifications",
        duration: 5000
      });
    } finally {
      setIsSaving(false);
      setGlobalLoading(loadingKey, false);
    }
  };

  // Fonction pour annuler les modifications
  const handleCancelChanges = () => {
    setLocalTimeSpent(progress.timeSpent || 0);
    setLocalPosition(progress.currentPosition || "");
    setLocalNotes(progress.notes || "");
    setIsFormDirty(false);
  };

  return (
    <Card className="bg-gray-900/60 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">Suivi de progression</CardTitle>
          <button
            onClick={handleToggleFavorite}
            disabled={isUpdating}
            className={`p-2 rounded-full transition-all duration-200 ${
              progress.favorite 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-gray-400 hover:text-yellow-400'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            title={progress.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Star className={`w-5 h-5 ${progress.favorite ? 'fill-current' : ''}`} />
            )}
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Statut actuel */}
        <div className="space-y-3">
          <Label className="text-gray-300">Statut actuel</Label>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(progress.status)} border-0`}>
              {getStatusIcon(progress.status)}
              <span className="ml-1">{getStatusLabel(progress.status)}</span>
            </Badge>
          </div>
          
          {/* Boutons de changement de statut */}
          <div className="flex flex-wrap gap-2">
            {progress.status !== "in_progress" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("in_progress")}
                disabled={isUpdating}
                className="border-blue-600 text-blue-300 hover:bg-blue-900/20"
              >
                <PlayCircle className="w-3 h-3 mr-1" />
                En cours
              </Button>
            )}
            
            {progress.status !== "paused" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("paused")}
                disabled={isUpdating}
                className="border-yellow-600 text-yellow-300 hover:bg-yellow-900/20"
              >
                <PauseCircle className="w-3 h-3 mr-1" />
                En pause
              </Button>
            )}
            
            {progress.status !== "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange("completed")}
                disabled={isUpdating || !areAllMilestonesCompleted()}
                className="border-green-600 text-green-300 hover:bg-green-900/20 disabled:border-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed"
                title={!areAllMilestonesCompleted() ? "Vous devez valider tous les paliers (25%, 50%, 75%, 100%) avant de terminer le cours" : "Marquer le cours comme terminé"}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Terminé
              </Button>
            )}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-3">
          <ProgressBarWithLabel 
            value={progress.progressPercentage || 0} 
            label="Progression"
          />
          <div className="grid grid-cols-5 gap-1">
            {[0, 25, 50, 75, 100].map((value) => {
              const milestone = milestones.find(m => m.percentage === value);
              const isCompleted = milestone?.isCompleted;
              const canValidate = canValidateMilestone(value);
              const isNext = getNextAvailableMilestone()?.percentage === value;
              const isCurrent = progress.progressPercentage === value;

              return (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleMilestoneClick(value)}
                  disabled={isUpdating || milestonesLoading}
                  className={`min-w-0 px-1 py-1 text-xs transition-all ${
                    isCompleted
                      ? 'border-green-600 text-green-300 hover:bg-green-900/20 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/30'
                      : canValidate
                      ? 'border-blue-600 text-blue-300 hover:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/30'
                      : isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
                      : 'border-gray-600 text-gray-300 hover:bg-gray-800 dark:border-gray-500 dark:text-gray-400 dark:hover:bg-gray-800/50'
                  }`}
                  title={
                    isCompleted
                      ? `Palier ${value}% validé`
                      : canValidate
                      ? `Cliquez pour valider le palier ${value}%`
                      : `Palier ${value}% verrouillé`
                  }
                >
                  <div className="flex items-center justify-center gap-0.5">
                    {isCompleted && <CheckCircle className="w-2.5 h-2.5" />}
                    {canValidate && !isCompleted && <Target className="w-2.5 h-2.5" />}
                    <span className="text-xs">{value}%</span>
                    {isNext && !isCompleted && (
                      <ArrowRight className="w-2.5 h-2.5" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
          
          {milestonesLoading && (
            <div className="text-center text-sm text-gray-400">
              Chargement des paliers...
            </div>
          )}
          
          {/* Message quand le cours n'est pas commencé */}
          {!milestonesLoading && milestones.length === 0 && progress.status === 'not_started' && (
            <div className="text-center p-4 border border-gray-700 rounded-lg bg-gray-800/50">
              <div className="text-gray-300 mb-2">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <h4 className="font-medium">Cours non commencé</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Ce cours n'est pas encore dans vos cours en cours. 
                Aucune statistique de progression disponible.
              </p>
              <Button
                onClick={() => handleStatusChange('in_progress')}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isUpdating}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Commencer ce cours
              </Button>
            </div>
          )}
        </div>

        {/* Temps passé */}
        <div className="space-y-3">
          <Label className="text-gray-300">Temps passé (minutes)</Label>
          <Input
            type="number"
            value={localTimeSpent}
            onChange={(e) => setLocalTimeSpent(parseInt(e.target.value) || 0)}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Position actuelle */}
        <div className="space-y-3">
          <Label className="text-gray-300">Position actuelle</Label>
          <Input
            value={localPosition}
            onChange={(e) => setLocalPosition(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Ex: Chapitre 3, Leçon 2"
          />
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Notes personnelles</Label>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveAllChanges}
                disabled={!isFormDirty || isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Sauvegarder
              </Button>
              {isFormDirty && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelChanges}
                  disabled={isSaving}
                  className="border-gray-600 text-gray-300"
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
            placeholder="Ajoutez vos notes personnelles..."
          />
          {isFormDirty && (
            <div className="text-sm text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Modifications non sauvegardées
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="space-y-3">
          <Label className="text-gray-300">Actions rapides</Label>
          <div className="flex flex-col gap-2">
            {courseUrl && (
              <Button
                onClick={() => window.open(courseUrl, '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isUpdating}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir sur la plateforme
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => handleProgressChange(Math.min((progress.progressPercentage || 0) + 10, 100))}
              disabled={isUpdating}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              +10% de progression
            </Button>
          </div>
        </div>

        {/* Informations temporelles */}
        {(progress.startedAt || progress.lastActivityAt) && (
          <div className="space-y-2 pt-4 border-t border-gray-700">
            {progress.startedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Commencé le {new Date(progress.startedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {progress.lastActivityAt && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Dernière activité: {new Date(progress.lastActivityAt).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {showAbandonDialog && (
        <AlertDialog open={showAbandonDialog} onOpenChange={handleCancelAbandon}>
          <AlertDialogContent className="bg-gray-900 border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Arrêter ce cours ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                Êtes-vous sûr de vouloir arrêter de suivre "{courseTitle}" ?
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
                onClick={handleCancelAbandon}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmAbandon}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Oui, arrêter le cours
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}; 