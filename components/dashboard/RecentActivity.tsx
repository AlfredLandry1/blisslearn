"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Trophy,
  Clock,
  Star,
  MessageSquare,
  Award,
  Calendar,
  Play,
  CheckCircle,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { DashboardCard } from "./DashboardCard";
import { useCourseStore } from "@/stores/courseStore";
import { useUIStore } from "@/stores/uiStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  type: "lesson" | "achievement" | "comment" | "certification" | "course_start" | "course_complete" | "favorite";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  link?: string;
}

export function RecentActivity() {
  const { courses, globalStats } = useCourseStore();
  const { persistentNotifications } = useUIStore();

  // Générer des activités basées sur les données réelles
  const generateActivities = (): Activity[] => {
    const activities: Activity[] = [];
    const now = new Date();

    // Activités basées sur les cours
    if (courses && courses.length > 0) {
      // Cours récemment commencés
      const recentStarted = courses
        .filter(course => course.progressPercentage > 0 && course.progressPercentage < 100)
        .slice(0, 2);

      recentStarted.forEach((course, index) => {
        activities.push({
          id: `course_start_${course.id}`,
          type: "course_start",
          title: "Cours commencé",
          description: `Vous avez commencé "${course.title}"`,
          timestamp: format(new Date(now.getTime() - (index + 1) * 3600000), 'dd/MM à HH:mm', { locale: fr }),
          icon: Play,
          color: "text-blue-400",
          link: `/dashboard/my-courses/${course.id}`,
        });
      });

      // Cours récemment terminés
      const recentCompleted = courses
        .filter(course => course.progressPercentage === 100)
        .slice(0, 1);

      recentCompleted.forEach((course, index) => {
        activities.push({
          id: `course_complete_${course.id}`,
          type: "course_complete",
          title: "Cours terminé",
          description: `Félicitations ! Vous avez terminé "${course.title}"`,
          timestamp: format(new Date(now.getTime() - (index + 3) * 3600000), 'dd/MM à HH:mm', { locale: fr }),
          icon: CheckCircle,
          color: "text-green-400",
          link: `/dashboard/my-courses/${course.id}`,
        });
      });

      // Cours favoris
      const favoriteCourses = courses
        .filter(course => course.favorite)
        .slice(0, 1);

      favoriteCourses.forEach((course, index) => {
        activities.push({
          id: `favorite_${course.id}`,
          type: "favorite",
          title: "Cours favori",
          description: `Vous avez ajouté "${course.title}" à vos favoris`,
          timestamp: format(new Date(now.getTime() - (index + 5) * 3600000), 'dd/MM à HH:mm', { locale: fr }),
          icon: Star,
          color: "text-yellow-400",
          link: `/dashboard/my-courses/${course.id}`,
        });
      });
    }

    // Activités basées sur les statistiques
    if (globalStats) {
      if (globalStats.completedCourses > 0) {
        activities.push({
          id: "achievement_milestone",
          type: "achievement",
          title: "Objectif atteint",
          description: `Vous avez terminé ${globalStats.completedCourses} cours !`,
          timestamp: format(new Date(now.getTime() - 6 * 3600000), 'dd/MM à HH:mm', { locale: fr }),
          icon: Trophy,
          color: "text-purple-400",
          link: "/dashboard/certifications",
        });
      }

      if (globalStats.globalProgress > 50) {
        activities.push({
          id: "progress_milestone",
          type: "achievement",
          title: "Progression excellente",
          description: `Votre progression globale est de ${globalStats.globalProgress}%`,
          timestamp: format(new Date(now.getTime() - 7 * 3600000), 'dd/MM à HH:mm', { locale: fr }),
          icon: TrendingUp,
          color: "text-orange-400",
          link: "/dashboard/progress",
        });
      }
    }

    // Activités basées sur les notifications récentes
    if (persistentNotifications && persistentNotifications.length > 0) {
      const recentNotifications = persistentNotifications
        .filter(notification => !notification.read)
        .slice(0, 2);

      recentNotifications.forEach((notification, index) => {
        activities.push({
          id: `notification_${notification.id}`,
          type: "comment",
          title: notification.title || "Nouvelle notification",
          description: notification.message,
          timestamp: format(new Date(notification.createdAt), 'dd/MM à HH:mm', { locale: fr }),
          icon: MessageSquare,
          color: "text-blue-400",
          link: "/dashboard/notifications",
        });
      });
    }

    // Trier par timestamp (plus récent en premier)
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  };

  const activities = generateActivities();

  const getActivityIcon = (activity: Activity) => {
    const IconComponent = activity.icon;
    return <IconComponent className={`w-4 h-4 ${activity.color}`} />;
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case "course_start":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "course_complete":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "favorite":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "achievement":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "comment":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <DashboardCard title="Activité récente">
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Aucune activité récente</p>
          <Link href="/dashboard/explorer">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Commencer un cours
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={activity.id}>
              <div className="flex items-start gap-3 group">
                {/* Icône de l'activité */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-gray-800/60 border border-gray-700/50 flex items-center justify-center">
                    {getActivityIcon(activity)}
                  </div>
                </div>

                {/* Contenu de l'activité */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h4 className="text-white font-medium text-sm truncate leading-tight">
                        {activity.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate leading-tight mt-0.5">
                        {activity.description}
                      </p>
                    </div>
                    
                    <Badge className={`text-xs flex-shrink-0 ${getActivityBadgeColor(activity.type)} max-w-[80px] truncate`}>
                      {activity.timestamp}
                    </Badge>
                  </div>
                </div>

                {/* Bouton d'action */}
                {activity.link && (
                  <div className="flex-shrink-0">
                    <Link href={activity.link}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Séparateur */}
              {i < activities.length - 1 && (
                <Separator className="my-4 bg-gray-700/50" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lien vers plus d'activités */}
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <Link href="/dashboard/progress">
            <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              Voir toutes les activités
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}