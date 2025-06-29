"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  BookOpen,
  Target,
  Clock,
  Award,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  Star,
  Download,
  Share2,
  Calendar,
  Users,
  BarChart3,
  FileText,
  BookMarked,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

interface FinalCourseReportProps {
  courseId: number;
  isOpen: boolean;
  onClose: () => void;
}

interface CourseReport {
  id: string;
  title: string;
  type: string;
  summary: string;
  keyPoints: string[];
  recommendations: string;
  insights: string;
  createdAt: string;
}

export function FinalCourseReport({
  courseId,
  isOpen,
  onClose,
}: FinalCourseReportProps) {
  const [report, setReport] = useState<CourseReport | null>(null);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFinalReport();
    }
  }, [isOpen, courseId]);

  const loadFinalReport = async () => {
    setIsLoading(true);
    try {
      // Récupérer le rapport général de fin de cours
      const response = await fetch(
        `/api/courses/milestones?courseId=${courseId}`
      );
      if (response.ok) {
        const data = await response.json();
        const finalReport = data.reports.find(
          (r: any) => r.type === "final_course_summary"
        );

        if (finalReport) {
          setReport({
            id: finalReport.id,
            title: finalReport.title,
            type: finalReport.type,
            summary: finalReport.summary,
            keyPoints: finalReport.keyPoints
              ? JSON.parse(finalReport.keyPoints)
              : [],
            recommendations: finalReport.recommendations,
            insights: finalReport.insights,
            createdAt: finalReport.createdAt,
          });
        }

        // Récupérer les informations du cours
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (courseResponse.ok) {
          const courseData = await courseResponse.json();
          setCourseInfo(courseData);
        }
      }
    } catch (error) {
      console.error("Erreur chargement rapport final:", error);
      toast.error("Erreur lors du chargement du rapport");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const content = `
RAPPORT GÉNÉRAL DE FIN DE COURS
${courseInfo?.title || "Cours"}

${report.summary}

POINTS CLÉS :
${report.keyPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

RECOMMANDATIONS :
${report.recommendations}

INSIGHTS :
${report.insights}

Généré le : ${new Date(report.createdAt).toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-final-${courseInfo?.title || "cours"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Rapport téléchargé avec succès");
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: `Rapport Final - ${courseInfo?.title}`,
        text: `J'ai terminé le cours "${courseInfo?.title}" ! Voici mon rapport de progression.`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papiers");
    }
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-4xl h-full overflow-y-auto p-6"
      >
        <SheetHeader className="pb-6">
          <div>
            <SheetTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="h-6 w-6 text-primary" />
              Rapport Général de Fin de Cours
            </SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {courseInfo?.title} - {courseInfo?.institution}
            </p>
          </div>
        </SheetHeader>

        <div className="space-y-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                Génération du rapport final...
              </p>
            </div>
          ) : report ? (
            <div className="space-y-8">
              {/* En-tête avec statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Félicitations ! Vous avez terminé le cours
                  </CardTitle>
                  <CardDescription>
                    Voici votre rapport complet de progression et
                    d'apprentissage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Temps total</p>
                        <p className="text-sm text-muted-foreground">
                          {courseInfo?.timeSpent
                            ? `${Math.round(courseInfo.timeSpent / 60)}h`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Progression</p>
                        <p className="text-sm text-muted-foreground">
                          100% complété
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Terminé le</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Résumé exécutif */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Résumé Exécutif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: report.summary.replace(/\n/g, "<br>"),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Points clés */}
              {report.keyPoints && report.keyPoints.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Points Clés à Retenir
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {report.keyPoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommandations */}
              {report.recommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Recommandations pour la Suite
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: report.recommendations.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Insights */}
              {report.insights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Insights et Observations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: report.insights.replace(/\n/g, "<br>"),
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certificat de fin */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
                {/* Éléments décoratifs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/20 to-transparent dark:from-amber-800/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200/20 to-transparent dark:from-yellow-800/20 rounded-full translate-y-12 -translate-x-12"></div>

                <CardHeader className="text-center relative z-10 pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-lg opacity-30"></div>
                      <Award className="h-12 w-12 text-amber-600 dark:text-amber-400 relative z-10" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                    Certificat de Fin de Cours
                  </CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-300 font-medium">
                    Ce document atteste de votre réussite et de votre
                    progression
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center relative z-10 pt-0">
                  <div className="space-y-6">
                    {/* Informations du cours */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {courseInfo?.title}
                      </h3>
                      <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {courseInfo?.institution}
                        </span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {courseInfo?.level_normalized}
                        </span>
                      </div>
                    </div>

                    {/* Badge de réussite */}
                    <div className="flex justify-center">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-6 py-3 text-lg font-semibold shadow-lg">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Cours Terminé avec Succès
                      </Badge>
                    </div>

                    {/* Date de complétion */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Complété le{" "}
                      {new Date(report.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadReport}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-950/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareReport}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-950/20"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun rapport final trouvé
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
