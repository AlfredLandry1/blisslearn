'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CheckCircle, Clock, MapPin, BookOpen, Target, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { MilestoneFormData } from '@/types/next-auth';
import { safeJsonParseArray } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import { LoadingButton } from "@/components/ui/loading-states";
import { ErrorDisplay } from "@/components/ui/error-display";
import { 
  milestoneValidationSchema, 
  initialMilestoneValidationValues, 
  type MilestoneValidationFormValues 
} from "@/lib/validation-schemas";
import { useApiClient } from "@/hooks/useApiClient";

interface MilestoneValidationFormProps {
  percentage: number;
  courseId: number;
  currentProgress: number;
  currentTimeSpent: number;
  currentPosition: string;
  onValidation: (data: MilestoneFormData) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export function MilestoneValidationForm({
  percentage,
  courseId,
  currentProgress,
  currentTimeSpent,
  currentPosition,
  onValidation,
  onCancel,
  isOpen
}: MilestoneValidationFormProps) {
  const { setLoading, clearLoading, addNotification } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newConcept, setNewConcept] = useState('');
  const [existingMilestone, setExistingMilestone] = useState<any>(null);
  const [isLoadingMilestone, setIsLoadingMilestone] = useState(false);

  const {
    get: getMilestone,
  } = useApiClient<any>({
    onError: (error) => {
      console.error('Erreur chargement données palier:', error);
      toast.error('Erreur lors du chargement des données du palier');
    }
  });

  // Charger les données existantes du palier si elles existent
  useEffect(() => {
    if (isOpen) {
      loadExistingMilestoneData();
    }
  }, [isOpen, courseId, percentage]);

  const loadExistingMilestoneData = async () => {
    setIsLoadingMilestone(true);
    try {
      const response = await getMilestone(`/api/courses/milestones?courseId=${courseId}`);
      if (response?.data) {
        const data = response.data;
        const milestone = data.milestones.find((m: any) => m.percentage === percentage);
        setExistingMilestone(milestone);
        
        // Récupérer le palier précédent pour utiliser ses données comme valeurs par défaut
        const previousMilestone = data.milestones
          .filter((m: any) => m.percentage < percentage && m.isCompleted)
          .sort((a: any, b: any) => b.percentage - a.percentage)[0];
        
        // Si on a des données existantes pour ce palier, on les utilise
        if (milestone) {
          formik.setValues({
            learningSummary: milestone.learningSummary || '',
            keyConcepts: milestone.keyConcepts ? safeJsonParseArray(milestone.keyConcepts) as string[] : [],
            challenges: milestone.challenges || '',
            nextSteps: milestone.nextSteps || '',
            timeSpentAtMilestone: milestone.timeSpentAtMilestone || currentTimeSpent || 0,
            positionAtMilestone: milestone.positionAtMilestone || currentPosition || '',
            notesAtMilestone: milestone.notesAtMilestone || ''
          });
        } else if (previousMilestone) {
          // Sinon, on utilise les données du palier précédent comme valeurs par défaut
          formik.setValues({
            learningSummary: '',
            keyConcepts: [],
            challenges: '',
            nextSteps: '',
            timeSpentAtMilestone: currentTimeSpent || 0,
            positionAtMilestone: currentPosition || '',
            notesAtMilestone: previousMilestone.notesAtMilestone || '' // Récupérer les notes du palier précédent
          });
        }
      }
    } catch (error) {
      // Erreur déjà gérée par le client API
    } finally {
      setIsLoadingMilestone(false);
    }
  };

  const formik = useFormik<MilestoneValidationFormValues>({
    initialValues: {
      learningSummary: '',
      keyConcepts: [] as string[],
      challenges: '',
      nextSteps: '',
      timeSpentAtMilestone: currentTimeSpent || 0,
      positionAtMilestone: currentPosition || '',
      notesAtMilestone: ''
    },
    validationSchema: milestoneValidationSchema,
    enableReinitialize: false, // On désactive car on gère manuellement la réinitialisation
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onValidation(values);
        toast.success(`Palier ${percentage}% validé avec succès !`);
      } catch (error) {
        toast.error('Erreur lors de la validation du palier');
        console.error('Erreur validation palier:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const addConcept = () => {
    if (newConcept.trim() && formik.values.keyConcepts.length < 10) {
      formik.setFieldValue('keyConcepts', [...formik.values.keyConcepts, newConcept.trim()]);
      setNewConcept('');
    }
  };

  const removeConcept = (index: number) => {
    const updatedConcepts = formik.values.keyConcepts.filter((_: string, i: number) => i !== index);
    formik.setFieldValue('keyConcepts', updatedConcepts);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addConcept();
    }
  };

  // Déterminer si on doit afficher les champs temps et notes
  const shouldShowTimeAndNotes = !existingMilestone?.isCompleted;

  return (
    <Sheet open={isOpen} onOpenChange={onCancel}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl lg:max-w-4xl h-full overflow-y-auto p-6"
      >
        <SheetHeader className="pb-6">
          <div>
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Target className="h-6 w-6 text-primary" />
              Validation du palier {percentage}%
            </SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Partagez vos apprentissages pour valider ce palier et générer un rapport IA
            </p>
          </div>
          
          <div className="mt-4">
            <Badge variant="secondary" className="text-lg font-semibold">
              {percentage}%
            </Badge>
            <div className="mt-2">
              <Progress value={currentProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                Progression actuelle : {currentProgress}%
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-1">
          {isLoadingMilestone ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Chargement des données...</p>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Informations actuelles */}
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Temps passé :</strong> {currentTimeSpent || 0} minutes
                  <br />
                  <strong>Position actuelle :</strong> {currentPosition || 'Non définie'}
                </AlertDescription>
              </Alert>

              {/* Résumé de l'apprentissage */}
              <div className="space-y-2">
                <Label htmlFor="learningSummary" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Résumé de ce que vous avez appris *
                </Label>
                <Textarea
                  id="learningSummary"
                  placeholder="Décrivez en détail ce que vous avez appris, les nouvelles compétences acquises, les concepts maîtrisés..."
                  {...formik.getFieldProps('learningSummary')}
                  className="min-h-[120px]"
                />
                {formik.touched.learningSummary && formik.errors.learningSummary && (
                  <p className="text-sm text-destructive">{formik.errors.learningSummary as string}</p>
                )}
              </div>

              {/* Concepts clés */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Concepts clés maîtrisés * ({formik.values.keyConcepts.length}/10)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter un concept clé..."
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={formik.values.keyConcepts.length >= 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addConcept}
                    disabled={!newConcept.trim() || formik.values.keyConcepts.length >= 10}
                  >
                    Ajouter
                  </Button>
                </div>
                
                {formik.values.keyConcepts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formik.values.keyConcepts.map((concept: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {concept}
                        <button
                          type="button"
                          onClick={() => removeConcept(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {formik.touched.keyConcepts && formik.errors.keyConcepts && (
                  <p className="text-sm text-destructive">{formik.errors.keyConcepts as string}</p>
                )}
              </div>

              {/* Difficultés rencontrées */}
              <div className="space-y-2">
                <Label htmlFor="challenges" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Difficultés rencontrées *
                </Label>
                <Textarea
                  id="challenges"
                  placeholder="Décrivez les difficultés que vous avez rencontrées, les concepts qui vous ont posé problème..."
                  {...formik.getFieldProps('challenges')}
                  className="min-h-[100px]"
                />
                {formik.touched.challenges && formik.errors.challenges && (
                  <p className="text-sm text-destructive">{formik.errors.challenges as string}</p>
                )}
              </div>

              {/* Prochaines étapes */}
              <div className="space-y-2">
                <Label htmlFor="nextSteps" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Prochaines étapes prévues *
                </Label>
                <Textarea
                  id="nextSteps"
                  placeholder="Décrivez ce que vous prévoyez de faire ensuite, les objectifs pour la suite..."
                  {...formik.getFieldProps('nextSteps')}
                  className="min-h-[100px]"
                />
                {formik.touched.nextSteps && formik.errors.nextSteps && (
                  <p className="text-sm text-destructive">{formik.errors.nextSteps as string}</p>
                )}
              </div>

              {/* Position actuelle - toujours affichée */}
              <div className="space-y-2">
                <Label htmlFor="positionAtMilestone" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Position actuelle dans le cours *
                </Label>
                <Input
                  id="positionAtMilestone"
                  placeholder="Ex: Chapitre 3, Leçon 2 - Introduction aux variables"
                  {...formik.getFieldProps('positionAtMilestone')}
                />
                {formik.touched.positionAtMilestone && formik.errors.positionAtMilestone && (
                  <p className="text-sm text-destructive">{formik.errors.positionAtMilestone as string}</p>
                )}
              </div>

              {/* Temps passé et notes - affichés seulement si pas déjà rempli */}
              {shouldShowTimeAndNotes && (
                <>
                  {/* Temps passé */}
                  <div className="space-y-2">
                    <Label htmlFor="timeSpentAtMilestone" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Temps passé total (en minutes) *
                    </Label>
                    <Input
                      id="timeSpentAtMilestone"
                      type="number"
                      min="1"
                      {...formik.getFieldProps('timeSpentAtMilestone')}
                    />
                    {formik.touched.timeSpentAtMilestone && formik.errors.timeSpentAtMilestone && (
                      <p className="text-sm text-destructive">{formik.errors.timeSpentAtMilestone as string}</p>
                    )}
                  </div>

                  {/* Notes personnelles */}
                  <div className="space-y-2">
                    <Label htmlFor="notesAtMilestone">
                      Notes personnelles (optionnel)
                    </Label>
                    <Textarea
                      id="notesAtMilestone"
                      placeholder="Ajoutez des notes personnelles, des réflexions, des liens utiles..."
                      {...formik.getFieldProps('notesAtMilestone')}
                      className="min-h-[100px]"
                    />
                    {formik.touched.notesAtMilestone && formik.errors.notesAtMilestone && (
                      <p className="text-sm text-destructive">{formik.errors.notesAtMilestone as string}</p>
                    )}
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                  className="flex-1"
                >
                  {isSubmitting ? 'Validation...' : `Valider le palier ${percentage}%`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 