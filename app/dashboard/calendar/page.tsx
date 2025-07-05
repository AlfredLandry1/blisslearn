"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIconLucide, 
  Clock, 
  Target, 
  BookOpen,
  Trophy,
  Plus,
  Filter
} from "lucide-react";
import { AchievementMessage, MotivationMessage, ProgressMessage } from "@/components/ui/personalized-message";
import { usePersonalizedContent } from "@/hooks/usePersonalizedContent";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'course' | 'deadline' | 'milestone' | 'review';
  date: Date;
  time?: string;
  description?: string;
  status: 'upcoming' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Hook pour rafraîchir le contenu personnalisé
  const { refresh: refreshPersonalizedContent } = usePersonalizedContent();

  // Événements simulés
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Fin du cours React.js',
      type: 'course',
      date: new Date(2024, 11, 15),
      time: '14:00',
      description: 'Terminer les derniers modules du cours React.js',
      status: 'upcoming',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Révision Machine Learning',
      type: 'review',
      date: new Date(2024, 11, 18),
      time: '10:00',
      description: 'Réviser les concepts de base du ML',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Milestone Python',
      type: 'milestone',
      date: new Date(2024, 11, 20),
      description: 'Atteindre 75% du cours Python',
      status: 'upcoming',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Deadline Projet Final',
      type: 'deadline',
      date: new Date(2024, 11, 25),
      time: '23:59',
      description: 'Soumettre le projet final de développement web',
      status: 'upcoming',
      priority: 'high'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'deadline': return <Clock className="w-4 h-4" />;
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'review': return <Trophy className="w-4 h-4" />;
      default: return <CalendarIconLucide className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'upcoming': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const upcomingEvents = events.filter(event => event.status === 'upcoming').slice(0, 5);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Calendrier d'Apprentissage</h1>
            <p className="text-gray-400">Planifiez et suivez vos objectifs d'apprentissage</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel événement
            </Button>
          </div>
        </div>

        {/* Messages personnalisés IA */}
        <div className="space-y-4 mb-8">
          <AchievementMessage 
            autoHide={true} 
            autoHideDelay={8000}
            className="opacity-0 animate-fade-in duration-500"
          />
          <MotivationMessage 
            showRefresh={true}
            onRefresh={refreshPersonalizedContent}
            className="opacity-0 animate-fade-in duration-500 delay-200"
          />
          <ProgressMessage 
            className="opacity-0 animate-fade-in duration-500 delay-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendrier principal */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIconLucide className="w-5 h-5" />
                  Calendrier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setDate(date)}
                  className="rounded-md border-gray-700 bg-gray-800/50"
                />
              </CardContent>
            </Card>
          </div>

          {/* Événements à venir */}
          <div className="space-y-6">
            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Événements à venir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-gray-800/40 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-md bg-gray-700/50 flex-shrink-0">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white line-clamp-1">
                              {event.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(event.date)}
                            </p>
                            {event.time && (
                              <p className="text-xs text-gray-500 mt-1">
                                {event.time}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className={`text-xs ${getPriorityColor(event.priority)}`}>
                              {event.priority}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIconLucide className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm">Aucun événement à venir</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objectifs du mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Cours à terminer</span>
                      <span className="text-sm text-gray-400">2/3</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Heures d'étude</span>
                      <span className="text-sm text-gray-400">18/25h</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Milestones</span>
                      <span className="text-sm text-gray-400">3/5</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 