"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  type: "webinar" | "deadline" | "live" | "exam";
  date: string;
  time: string;
  duration: string;
  participants?: number;
  description: string;
  isRegistered: boolean;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Webinar React Hooks Avancés",
    type: "webinar",
    date: "2024-01-23",
    time: "14:00",
    duration: "1h 30min",
    participants: 45,
    description: "Découvrez les hooks personnalisés et les patterns avancés",
    isRegistered: true,
    color: "bg-blue-500"
  },
  {
    id: "2",
    title: "Deadline projet final",
    type: "deadline",
    date: "2024-01-25",
    time: "23:59",
    duration: "",
    description: "Soumission du projet E-commerce",
    isRegistered: false,
    color: "bg-red-500"
  },
  {
    id: "3",
    title: "Session live Q&A",
    type: "live",
    date: "2024-01-26",
    time: "16:00",
    duration: "1h",
    participants: 12,
    description: "Questions-réponses avec l'instructeur",
    isRegistered: true,
    color: "bg-green-500"
  },
  {
    id: "4",
    title: "Examen TypeScript",
    type: "exam",
    date: "2024-01-28",
    time: "10:00",
    duration: "2h",
    description: "Examen final du module TypeScript",
    isRegistered: false,
    color: "bg-purple-500"
  }
];

const daysInMonth = 31;
const firstDayOfMonth = 1; // Lundi
const currentDay = 22;

export default function CalendarPage() {
  const getEventForDay = (day: number) => {
    return mockEvents.filter(event => {
      const eventDay = parseInt(event.date.split('-')[2]);
      return eventDay === day;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Calendrier
          </h1>
          <p className="text-gray-400">
            Gérez vos événements et webinars
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendrier principal */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Janvier 2024</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="p-2 text-center text-gray-400 text-sm font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grille du calendrier */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Jours vides au début */}
                  {Array.from({ length: firstDayOfMonth - 1 }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-24 bg-gray-800/30 rounded"></div>
                  ))}

                  {/* Jours du mois */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const events = getEventForDay(day);
                    const isToday = day === currentDay;

                    return (
                      <div 
                        key={day} 
                        className={`h-24 p-1 border border-gray-700 rounded ${
                          isToday ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            isToday ? 'text-blue-400' : 'text-gray-300'
                          }`}>
                            {day}
                          </span>
                          {events.length > 0 && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {events.slice(0, 2).map(event => (
                            <div 
                              key={event.id}
                              className={`w-full h-1 rounded ${event.color}`}
                              title={event.title}
                            />
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-500">+{events.length - 2}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Événements à venir */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Événements à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.slice(0, 5).map((event) => (
                    <div key={event.id} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{event.title}</h4>
                          <p className="text-gray-400 text-xs">{event.description}</p>
                        </div>
                        <Badge 
                          variant={event.isRegistered ? "default" : "outline"}
                          className={event.isRegistered ? "bg-green-500/10 text-green-400" : "border-gray-600 text-gray-300"}
                        >
                          {event.isRegistered ? "Inscrit" : "Disponible"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.date} à {event.time}
                        </div>
                        {event.participants && (
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {event.participants}
                          </div>
                        )}
                      </div>
                      
                      {!event.isRegistered && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 border-gray-600 text-gray-300"
                        >
                          S'inscrire
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un événement
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Video className="w-4 h-4 mr-2" />
                  Planifier un webinar
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir tous les événements
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 