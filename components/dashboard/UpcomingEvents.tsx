"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video,
  BookOpen,
  Trophy,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle,
  Play,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useCourseStore } from "@/stores/courseStore";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  type: "webinar" | "deadline" | "live" | "exam" | "course_deadline" | "milestone" | "certification";
  date: string;
  time: string;
  participants?: number;
  description: string;
  color: string;
  bgColor: string;
  link?: string;
  priority: "high" | "medium" | "low";
}

export function UpcomingEvents() {
  const { courses, globalStats } = useCourseStore();

  // Générer des événements basés sur les données réelles
  const generateEvents = (): Event[] => {
    const events: Event[] = [];
    const now = new Date();

    // Événements basés sur les cours
    if (courses && courses.length > 0) {
      // Deadlines de cours (simulées)
      const coursesWithDeadlines = courses
        .filter(course => course.progressPercentage > 0 && course.progressPercentage < 100)
        .slice(0, 2);

      coursesWithDeadlines.forEach((course, index) => {
        const deadlineDate = addDays(now, 7 + index * 3); // Deadline dans 7-10 jours
        events.push({
          id: `deadline_${course.id}`,
          title: `Deadline: ${course.title}`,
          type: "course_deadline",
          date: format(deadlineDate, 'dd MMM', { locale: fr }),
          time: "23:59",
          description: `Terminer le cours "${course.title}"`,
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          link: `/dashboard/my-courses/${course.id}`,
          priority: "high",
        });
      });

      // Milestones de progression
      if (globalStats && globalStats.globalProgress > 0) {
        const nextMilestone = Math.ceil(globalStats.globalProgress / 25) * 25;
        if (nextMilestone > globalStats.globalProgress) {
          events.push({
            id: "milestone_progress",
            title: `Objectif ${nextMilestone}%`,
            type: "milestone",
            date: format(addDays(now, 5), 'dd MMM', { locale: fr }),
            time: "Objectif",
            description: `Atteindre ${nextMilestone}% de progression globale`,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            link: "/dashboard/progress",
            priority: "medium",
          });
        }
      }

      // Certifications à venir
      const coursesNearCompletion = courses
        .filter(course => course.progressPercentage >= 80 && course.progressPercentage < 100)
        .slice(0, 1);

      coursesNearCompletion.forEach((course) => {
        events.push({
          id: `certification_${course.id}`,
          title: `Certification: ${course.title}`,
          type: "certification",
          date: format(addDays(now, 2), 'dd MMM', { locale: fr }),
          time: "Disponible",
          description: `Obtenir votre certification pour "${course.title}"`,
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          link: `/dashboard/my-courses/${course.id}`,
          priority: "high",
        });
      });
    }

    // Événements simulés pour enrichir l'expérience
    const mockEvents: Event[] = [
      {
        id: "webinar_react",
        title: "Webinar React Hooks",
        type: "webinar",
        date: format(addDays(now, 1), 'dd MMM', { locale: fr }),
        time: "14:00 - 15:30",
        participants: 45,
        description: "Découvrez les hooks avancés de React",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        priority: "medium",
      },
      {
        id: "live_qa",
        title: "Session live Q&A",
        type: "live",
        date: format(addDays(now, 3), 'dd MMM', { locale: fr }),
        time: "16:00 - 17:00",
        participants: 12,
        description: "Questions-réponses avec l'instructeur",
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        priority: "medium",
      },
    ];

    events.push(...mockEvents);

    // Trier par priorité et date
    return events
      .sort((a, b) => {
        // Priorité d'abord
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Puis par date
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 5);
  };

  const events = generateEvents();

  const getEventIcon = (type: string) => {
    switch (type) {
      case "webinar":
        return Video;
      case "deadline":
      case "course_deadline":
        return Clock;
      case "live":
        return Users;
      case "exam":
        return BookOpen;
      case "milestone":
        return Trophy;
      case "certification":
        return Trophy;
      default:
        return Calendar;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500/50 bg-red-500/5";
      case "medium":
        return "border-yellow-500/50 bg-yellow-500/5";
      case "low":
        return "border-gray-500/50 bg-gray-500/5";
      default:
        return "border-gray-500/50 bg-gray-500/5";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      case "medium":
        return <Clock className="w-3 h-3 text-yellow-400" />;
      case "low":
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      default:
        return <Calendar className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <DashboardCard title="Événements à venir">
      {events.length === 0 ? (
        <div className="text-center py-6">
          <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Aucun événement à venir</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => {
            const EventIcon = getEventIcon(event.type);
            const isUrgent = event.priority === "high";
            
            return (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:border-gray-600/50 group ${
                  getPriorityColor(event.priority)
                } ${isUrgent ? 'ring-1 ring-red-500/20' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icône de priorité */}
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(event.priority)}
                  </div>

                  {/* Contenu de l'événement */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium truncate ${
                          isUrgent ? 'text-red-300' : 'text-white'
                        }`}>
                          {event.title}
                        </h4>
                        <p className="text-gray-400 text-xs truncate">
                          {event.description}
                        </p>
                      </div>
                      
                      {/* Date - visible seulement sur mobile et tablette */}
                      <Badge className={`text-xs ${event.bgColor} border ${event.color.replace('text-', 'border-')}/20 md:hidden`}>
                        {event.date}
                      </Badge>
                    </div>

                    {/* Date - visible seulement sur desktop (md et lg) */}
                    <div className="hidden md:block mb-2">
                      <Badge className={`text-xs ${event.bgColor} border ${event.color.replace('text-', 'border-')}/20`}>
                        {event.date}
                      </Badge>
                    </div>

                    {/* Détails supplémentaires */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{event.time}</span>
                      {event.participants && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.participants}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  {event.link && (
                    <Link href={event.link}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lien vers le calendrier */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <Link href="/dashboard/calendar">
          <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            Voir le calendrier complet
          </Button>
        </Link>
      </div>
    </DashboardCard>
  );
} 