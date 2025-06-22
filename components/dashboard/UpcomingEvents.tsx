"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video,
  BookOpen,
  Trophy
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";

interface Event {
  id: string;
  title: string;
  type: "webinar" | "deadline" | "live" | "exam";
  date: string;
  time: string;
  participants?: number;
  description: string;
  color: string;
  bgColor: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Webinar React Hooks",
    type: "webinar",
    date: "Demain",
    time: "14:00 - 15:30",
    participants: 45,
    description: "Découvrez les hooks avancés de React",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    id: "2",
    title: "Deadline projet final",
    type: "deadline",
    date: "23 Jan",
    time: "23:59",
    description: "Soumission du projet E-commerce",
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  },
  {
    id: "3",
    title: "Session live Q&A",
    type: "live",
    date: "25 Jan",
    time: "16:00 - 17:00",
    participants: 12,
    description: "Questions-réponses avec l'instructeur",
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  {
    id: "4",
    title: "Examen TypeScript",
    type: "exam",
    date: "28 Jan",
    time: "10:00 - 12:00",
    description: "Examen final du module TypeScript",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  }
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "webinar":
      return Video;
    case "deadline":
      return Clock;
    case "live":
      return Users;
    case "exam":
      return BookOpen;
    default:
      return Calendar;
  }
};

export function UpcomingEvents() {
  return (
    <DashboardCard title="Événements à venir">
      {mockEvents.length === 0 && (
        <div className="text-gray-400 text-sm">Aucun événement à venir.</div>
      )}
      {mockEvents.map((event, i) => {
        const EventIcon = getEventIcon(event.type);
        
        return (
          <div key={i} className="flex flex-wrap sm:flex-row md:items-center gap-3">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs px-2 py-1 mb-1 sm:mb-0">
              {event.date}
            </Badge>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium truncate">{event.title}</div>
              <div className="text-gray-400 text-xs truncate">{event.description}</div>
            </div>
          </div>
        );
      })}
    </DashboardCard>
  );
} 