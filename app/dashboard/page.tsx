"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { PredictionCard } from "@/components/dashboard/PredictionCard";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { useUIStore } from "@/stores/uiStore";
import { useApiClient } from "@/hooks/useApiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BookOpen, 
  Target, 
  Trophy, 
  Calendar,
  BarChart3,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  PlayCircle,
  Star,
  RefreshCw
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AchievementMessage, MotivationMessage, ProgressMessage } from "@/components/ui/personalized-message";
import { usePersonalizedContent } from "@/hooks/usePersonalizedContent";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { unreadCount, createPersistentNotification } = useUIStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Hook pour rafraîchir le contenu personnalisé
  const { refresh: refreshPersonalizedContent } = usePersonalizedContent();

  // ✅ MIGRATION : Utilisation du client API
  const {
    get: fetchDashboardData
  } = useApiClient<any>({
    onSuccess: (data) => {
      setDashboardData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Erreur chargement dashboard:', error);
      setIsLoading(false);
    }
  });

  const {
    post: resetOnboarding
  } = useApiClient<any>({
    onSuccess: () => {
      createPersistentNotification({
        type: "success",
        title: "Onboarding réinitialisé",
        message: "Vous pouvez maintenant refaire l'onboarding",
        duration: 3000,
      });
      // Recharger la page pour forcer la redirection
      window.location.reload();
    },
    onError: (error) => {
      createPersistentNotification({
        type: "error",
        title: "Erreur",
        message: error.message || "Erreur lors de la réinitialisation",
        duration: 5000,
      });
    }
  });

  const handleResetOnboarding = async () => {
    await resetOnboarding('/api/auth/reset-onboarding', {});
    // Forcer la déconnexion/reconnexion pour mettre à jour la session
    await signOut({ redirect: false });
    await signIn();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData('/api/dashboard');
    }
  }, [status]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <OnboardingGuard requireOnboarding={false}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Messages personnalisés IA */}
          <div className="space-y-4">
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
          </div>

          {/* En-tête avec salutation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Bonjour, {session?.user?.name || "Apprenant"} 👋
              </h1>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-1">
                Voici un aperçu de votre progression aujourd'hui
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {unreadCount} notification{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Calendar className="w-4 h-4 mr-2" />
                Voir le calendrier
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResetOnboarding}
                className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Onboarding
              </Button>
            </div>
          </div>

          {/* Onglets de navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-6">
                <QuickStats />
                <ProgressOverview />
              </div>
            </TabsContent>
            <TabsContent value="stats">
              <div className="space-y-6">
                <DashboardStats />
              </div>
            </TabsContent>
            <TabsContent value="activity">
              <div className="space-y-6">
                <RecentActivity />
                <UpcomingEvents />
                <DailySummary />
                <PredictionCard />
              </div>
            </TabsContent>
          </Tabs>

          {/* Section des cours en cours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Cours en cours
              </h2>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                Voir tous mes cours
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700 animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-2 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : dashboardData?.currentCourses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.currentCourses.slice(0, 3).map((course: any) => (
                  <Card key={course.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {course.platform}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Progression</span>
                          <span className="text-white font-medium">{course.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration || "N/A"}</span>
                        </div>
                        <Button size="sm" className="text-xs h-7 px-2">
                          <PlayCircle className="w-3 h-3 mr-1" />
                          Continuer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Aucun cours en cours</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Commencez par explorer nos cours recommandés
                  </p>
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Découvrir des cours
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Section des recommandations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Recommandations personnalisées
              </h2>
              <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                Voir toutes les recommandations
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <ProgressMessage 
              className="opacity-0 animate-fade-in duration-500"
            />
          </div>
        </div>
      </DashboardLayout>
    </OnboardingGuard>
  );
}
