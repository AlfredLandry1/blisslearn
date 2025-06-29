'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Lock, 
  Unlock, 
  Clock, 
  MapPin, 
  Calendar, 
  FileText, 
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { MilestoneValidationForm } from './MilestoneValidationForm';
import { Milestone, CourseReport, MilestoneFormData } from '@/types/next-auth';
import { useCourseStore } from '@/stores/courseStore';
import { MilestoneReportSidebar } from './MilestoneReportSidebar';
import { FinalCourseReport } from './FinalCourseReport';
import { useUIStore } from '@/stores/uiStore';

interface MilestoneProgressProps {
  courseId: number;
  currentProgress: number;
  currentTimeSpent: number;
  currentPosition: string;
}

export function MilestoneProgress({
  courseId,
  currentProgress,
  currentTimeSpent,
  currentPosition
}: MilestoneProgressProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [reports, setReports] = useState<CourseReport[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [showValidationForm, setShowValidationForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CourseReport | null>(null);
  const [showFinalReport, setShowFinalReport] = useState(false);

  const { updateCourseProgress, refreshStats } = useCourseStore();
  const { setLoading, isKeyLoading, addNotification } = useUIStore();
  const loadingKey = `milestone-progress-${courseId}`;
  const loading = isKeyLoading(loadingKey);

  useEffect(() => {
    loadMilestones();
  }, [courseId]);

  const loadMilestones = async () => {
    setLoading(loadingKey, true);
    try {
      const response = await fetch(`/api/courses/milestones?courseId=${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setMilestones(data.milestones);
        setReports(data.reports);
      } else {
        addNotification({
          type: "error",
          title: "Erreur",
          message: "Erreur lors du chargement des paliers",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Erreur chargement paliers:', error);
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur lors du chargement des paliers",
        duration: 5000
      });
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const handleMilestoneValidation = async (formData: MilestoneFormData) => {
    if (!selectedMilestone) return;

    try {
      const response = await fetch('/api/courses/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          percentage: selectedMilestone,
          formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setShowValidationForm(false);
        setSelectedMilestone(null);
        
        // Synchroniser avec le store global
        updateCourseProgress(courseId, {
          progressPercentage: selectedMilestone,
          timeSpent: formData.timeSpentAtMilestone,
          currentPosition: formData.positionAtMilestone,
        });
        
        // Recharger les données locales et globales
        await Promise.all([
          loadMilestones(),
          refreshStats()
        ]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur validation palier:', error);
      toast.error('Erreur lors de la validation du palier');
    }
  };

  const getNextAvailableMilestone = () => {
    return milestones.find(m => !m.isCompleted && m.percentage > currentProgress);
  };

  const canValidateMilestone = (percentage: number) => {
    if (percentage <= currentProgress) return false;
    
    // Vérifier que tous les paliers précédents sont validés
    const previousMilestones = milestones.filter(m => m.percentage < percentage);
    return previousMilestones.every(m => m.isCompleted);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCourseCompleted = () => {
    return milestones.every(m => m.isCompleted);
  };

  const hasFinalReport = () => {
    return reports.some(r => r.type === 'final_course_summary');
  };

  const generateFinalReport = async () => {
    try {
      const response = await fetch('/api/courses/milestones/generate-final-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        toast.success('Rapport final généré avec succès !');
        await loadMilestones(); // Recharger pour avoir le nouveau rapport
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de la génération du rapport');
      }
    } catch (error) {
      console.error('Erreur génération rapport final:', error);
      toast.error('Erreur lors de la génération du rapport final');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Paliers de progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[25, 50, 75, 100].map((percentage) => (
              <div key={percentage} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Paliers de progression
          </CardTitle>
          <CardDescription>
            Validez vos paliers pour générer des rapports IA détaillés
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progression globale */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression actuelle</span>
              <span className="font-semibold">{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>

          <Separator />

          {/* Liste des paliers */}
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const isCompleted = milestone.isCompleted;
              const canValidate = canValidateMilestone(milestone.percentage);
              const isNext = getNextAvailableMilestone()?.percentage === milestone.percentage;

              return (
                <div
                  key={milestone.percentage}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                      : canValidate
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                      : 'bg-muted/50 border-muted dark:bg-gray-800/50 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : canValidate ? (
                        <Unlock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                      
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 text-foreground">
                          Palier {milestone.percentage}%
                          {isNext && (
                            <Badge variant="secondary" className="text-xs">
                              Prochain
                            </Badge>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isCompleted ? 'Validé' : canValidate ? 'Disponible' : 'Verrouillé'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <Badge variant="outline" className="text-green-700 border-green-300 dark:text-green-400 dark:border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Validé
                        </Badge>
                      )}
                      
                      {canValidate && !isCompleted && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMilestone(milestone.percentage);
                            setShowValidationForm(true);
                          }}
                        >
                          Valider
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Détails du palier */}
                  {isCompleted && (
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Temps : {formatDuration(milestone.timeSpentAtMilestone || 0)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{milestone.positionAtMilestone}</span>
                        </div>
                      </div>
                      
                      {milestone.learningSummary && (
                        <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-700">
                          <p className="text-xs text-muted-foreground mb-1">Résumé d'apprentissage :</p>
                          <p className="text-sm line-clamp-2 text-foreground">{milestone.learningSummary}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Validé le {formatDate(milestone.completedAt!)}</span>
                      </div>

                      {/* Rapport IA du palier */}
                      {(() => {
                        const palierReport = reports.find(r => r.milestonePercentage === milestone.percentage);
                        return palierReport ? (
                          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                                <FileText className="h-4 w-4" />
                                Rapport de progression
                              </h5>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-700 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-950/20"
                                onClick={() => setSelectedReport(palierReport)}
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                Voir le rapport complet
                              </Button>
                            </div>
                            
                            {/* Aperçu du rapport */}
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                  Aperçu du rapport :
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-400 line-clamp-3">
                                  {palierReport.summary}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-500">
                                  <FileText className="h-3 w-3" />
                                  <span>Généré le {formatDate(palierReport.generatedAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {!isCompleted && !canValidate && (
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Validez d'abord les paliers précédents pour débloquer celui-ci.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bouton pour le rapport final */}
      {isCourseCompleted() && (
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Félicitations ! Cours terminé</h3>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                {hasFinalReport() 
                  ? "Vous avez validé tous les paliers. Votre rapport final de fin de cours est prêt !"
                  : "Vous avez validé tous les paliers. Générez votre rapport final de fin de cours !"
                }
              </p>
              <Button
                onClick={hasFinalReport() ? () => setShowFinalReport(true) : generateFinalReport}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                {hasFinalReport() ? "Voir mon rapport final" : "Générer mon rapport final"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sidebar de validation de palier */}
      <MilestoneValidationForm
        percentage={selectedMilestone || 0}
        courseId={courseId}
        currentProgress={currentProgress}
        currentTimeSpent={currentTimeSpent}
        currentPosition={currentPosition}
        onValidation={handleMilestoneValidation}
        onCancel={() => {
          setShowValidationForm(false);
          setSelectedMilestone(null);
        }}
        isOpen={showValidationForm}
      />

      {/* Sidebar de rapport de palier */}
      <MilestoneReportSidebar
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        report = {selectedReport as CourseReport}
      />

      {/* Modal du rapport final */}
      <FinalCourseReport
        courseId={courseId}
        isOpen={showFinalReport}
        onClose={() => setShowFinalReport(false)}
      />
    </>
  );
} 