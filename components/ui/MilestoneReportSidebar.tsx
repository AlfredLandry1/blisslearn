'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, BookOpen, Target, Calendar } from 'lucide-react';
import { CourseReport } from '@/types/next-auth';
import { safeJsonParseArray } from "@/lib/utils";

interface MilestoneReportSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  report: CourseReport | null;
}

export function MilestoneReportSidebar({
  isOpen,
  onClose,
  report
}: MilestoneReportSidebarProps) {
  if (!report) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl lg:max-w-4xl h-full overflow-y-auto p-6"
      >
        <SheetHeader className="pb-6">
          <div>
            <SheetTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-primary" />
              {report.title}
            </SheetTitle>
            <SheetDescription className="mt-1">
              Rapport détaillé de progression généré par BlissLearn AI
            </SheetDescription>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-lg font-semibold">
                Palier {report.milestonePercentage}%
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Généré le {formatDate(report.generatedAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Rapport de progression personnalisé</span>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-1">
          {/* Résumé */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Résumé de progression
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm leading-relaxed">{report.summary}</p>
            </div>
          </div>

          {/* Ce que vous devriez savoir */}
          {report.recommendations && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Ce que vous devriez savoir
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm leading-relaxed">{report.recommendations}</p>
              </div>
            </div>
          )}

          {/* Points clés */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Points clés à retenir</h3>
            <div className="space-y-2">
              {safeJsonParseArray(report.keyPoints).map((point: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {report.insights && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Insights et observations</h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm leading-relaxed">{report.insights}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Footer */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center md:justify-start justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Rapport généré automatiquement par BlissLearn AI</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Ce rapport est basé sur vos réponses et votre progression dans le cours
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}