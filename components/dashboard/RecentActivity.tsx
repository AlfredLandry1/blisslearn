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
} from "lucide-react";
import { Separator } from "../ui/separator";
import { DashboardCard } from "./DashboardCard";

interface Activity {
  id: string;
  type: "lesson" | "achievement" | "comment" | "certification";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "lesson",
    title: "Leçon terminée",
    description:
      "Vous avez terminé la leçon 'Hooks personnalisés' dans React Avancé",
    timestamp: "Il y a 2 heures",
    icon: BookOpen,
    color: "text-blue-400",
  },
  {
    id: "2",
    type: "achievement",
    title: "Nouveau badge",
    description: "Vous avez obtenu le badge 'Développeur React'",
    timestamp: "Il y a 1 jour",
    icon: Trophy,
    color: "text-yellow-400",
  },
  {
    id: "3",
    type: "comment",
    title: "Commentaire reçu",
    description: "Marie a commenté votre projet 'E-commerce App'",
    timestamp: "Il y a 2 jours",
    icon: MessageSquare,
    color: "text-green-400",
  },
  {
    id: "4",
    type: "certification",
    title: "Certification obtenue",
    description: "Félicitations ! Vous avez obtenu la certification TypeScript",
    timestamp: "Il y a 3 jours",
    icon: Award,
    color: "text-purple-400",
  },
  {
    id: "5",
    type: "lesson",
    title: "Nouveau cours",
    description: "Vous avez commencé le cours 'Next.js 14 - Le guide complet'",
    timestamp: "Il y a 4 jours",
    icon: BookOpen,
    color: "text-blue-400",
  },
];

export function RecentActivity() {
  return (
    <DashboardCard title="Activité récente">
      {mockActivities.length === 0 && (
        <div className="text-gray-400 text-sm">Aucune activité récente.</div>
      )}
      {mockActivities.map((activity, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row md:items-center gap-3"
        >
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs px-2 py-1 mb-1 sm:mb-0">
            {activity.timestamp}
          </Badge>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">
              {activity.title}
            </div>
            <div className="text-gray-400 text-xs truncate">
              {activity.description}
            </div>
          </div>
        </div>
      ))}
    </DashboardCard>
  );
}
