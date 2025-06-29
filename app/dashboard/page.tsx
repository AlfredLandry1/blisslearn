"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as loader from "@/components/loading";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserInfoCard } from "@/components/dashboard/UserInfoCard";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { useUserStore } from "@/stores/userStore";
import { useCourseStore } from "@/stores/courseStore";
import { useUIStore } from "@/stores/uiStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Award,
  Play,
  CheckCircle,
  Plus,
  ArrowRight,
  RefreshCw,
  Home,
  BarChart3,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const firstName = session?.user?.name?.split(" ")[0] || "";
  const { refreshCourses, globalStats, courses } = useCourseStore();
  const { persistentNotifications, unreadCount, loadNotifications } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Charger les données au montage du composant
  useEffect(() => {
    const loadDashboardData = async () => {
      if (status === "authenticated") {
        setIsLoading(true);
        try {
          await Promise.all([
            refreshCourses(),
            loadNotifications(1, 5) // Charger les 5 dernières notifications
          ]);
        } catch (error) {
          console.error("Erreur lors du chargement des données:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [status, refreshCourses, loadNotifications]);

  if (status === "loading" || isLoading) {
    return <loader.PageSpinner />;
  }

  // Calculer les statistiques pour les cartes d'action rapide
  const recentCourses = courses?.slice(0, 3) || [];
  const today = new Date();
  const todayFormatted = format(today, 'EEEE d MMMM', { locale: fr });

  return (
    <OnboardingGuard requireOnboarding={false}>
      <DashboardLayout>
        <div className="space-y-6 lg:space-y-8">
          {/* En-tête avec salutation et date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                Bonjour{firstName && <span>, {firstName}</span>} 
                <span className="text-2xl sm:text-3xl">👋</span>
              </h1>
              <p className="text-gray-400 mt-1">
                {todayFormatted} • Prêt à apprendre aujourd'hui ?
              </p>
            </div>
            
            {/* Notifications rapides */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard/notifications">
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  refreshCourses();
                  loadNotifications(1, 5);
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Onglets principaux */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="relative">
              {/* Fond avec effet de glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-gray-800/60 to-gray-900/40 rounded-2xl border border-gray-700/50 backdrop-blur-xl shadow-2xl" />
              
              {/* Barre d'onglets stylée */}
              <TabsList className="relative bg-transparent border-0 w-full justify-start p-3 gap-1 sm:gap-2 rounded-2xl">
                <TabsTrigger 
                  value="overview" 
                  className="relative flex-1 sm:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=active]:border-blue-400/30 data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300 data-[state=inactive]:hover:bg-gray-700/30 transition-all duration-300 ease-out rounded-xl px-3 py-2 sm:px-6 sm:py-3 border border-transparent backdrop-blur-sm group"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="hidden sm:inline font-medium text-sm">Vue d'ensemble</span>
                    <span className="sm:hidden text-xs font-medium">Vue</span>
                  </div>
                  {/* Indicateur actif */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-500/20 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300" />
                </TabsTrigger>
                
                <TabsTrigger 
                  value="stats" 
                  className="relative flex-1 sm:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-purple-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 data-[state=active]:border-purple-400/30 data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300 data-[state=inactive]:hover:bg-gray-700/30 transition-all duration-300 ease-out rounded-xl px-3 py-2 sm:px-6 sm:py-3 border border-transparent backdrop-blur-sm group"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="hidden sm:inline font-medium text-sm">Statistiques</span>
                    <span className="sm:hidden text-xs font-medium">Stats</span>
                  </div>
                  {/* Indicateur actif */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-purple-500/20 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300" />
                </TabsTrigger>
                
                <TabsTrigger 
                  value="activity" 
                  className="relative flex-1 sm:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/80 data-[state=active]:to-green-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 data-[state=active]:border-green-400/30 data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-300 data-[state=inactive]:hover:bg-gray-700/30 transition-all duration-300 ease-out rounded-xl px-3 py-2 sm:px-6 sm:py-3 border border-transparent backdrop-blur-sm group"
                >
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="hidden sm:inline font-medium text-sm">Activité</span>
                    <span className="sm:hidden text-xs font-medium">Act</span>
                  </div>
                  {/* Indicateur actif */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/20 to-green-500/20 opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300" />
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Statistiques rapides */}
              <QuickStats />

              {/* Contenu principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                  <DailySummary />
                  
                  {/* Cours récents */}
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-blue-400" />
                          Cours récents
                        </CardTitle>
                        <Link href="/dashboard/my-courses">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            Voir tout
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {recentCourses.length === 0 ? (
                        <div className="text-center py-8">
                          <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">Aucun cours récent</p>
                          <Link href="/dashboard/explorer">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Découvrir des cours
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentCourses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">
                                  {course.title}
                                </h4>
                                <p className="text-gray-400 text-sm truncate">
                                  {course.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    course.progressPercentage === 100 
                                      ? 'border-green-600 text-green-400' 
                                      : course.progressPercentage > 0 
                                        ? 'border-blue-600 text-blue-400'
                                        : 'border-gray-600 text-gray-400'
                                  }`}
                                >
                                  {course.progressPercentage}%
                                </Badge>
                                
                                <Link href={`/dashboard/my-courses/${course.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    {course.progressPercentage === 100 ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : (
                                      <Play className="w-4 h-4 text-blue-400" />
                                    )}
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <ProgressOverview />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <UserInfoCard />
                  
                  {/* Notifications récentes */}
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Bell className="w-5 h-5 text-blue-400" />
                          Notifications récentes
                        </CardTitle>
                        <Link href="/dashboard/notifications">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {persistentNotifications.length === 0 ? (
                        <div className="text-center py-4">
                          <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Aucune notification</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {persistentNotifications.slice(0, 3).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border transition-colors ${
                                notification.read 
                                  ? 'bg-gray-800/30 border-gray-700/30' 
                                  : 'bg-blue-500/10 border-blue-500/30'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  notification.type === 'success' ? 'bg-green-400' :
                                  notification.type === 'error' ? 'bg-red-400' :
                                  notification.type === 'warning' ? 'bg-orange-400' :
                                  'bg-blue-400'
                                }`} />
                                
                                <div className="flex-1 min-w-0">
                                  {notification.title && (
                                    <h4 className="text-white text-sm font-medium truncate">
                                      {notification.title}
                                    </h4>
                                  )}
                                  <p className="text-gray-400 text-xs truncate">
                                    {notification.message}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {format(new Date(notification.createdAt), 'dd/MM à HH:mm', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <UpcomingEvents />
                </div>
              </div>

              {/* Actions rapides */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link href="/dashboard/explorer">
                      <Button variant="outline" className="w-full h-16 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-xs">Explorer</span>
                      </Button>
                    </Link>
                    
                    <Link href="/dashboard/my-courses">
                      <Button variant="outline" className="w-full h-16 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Target className="w-5 h-5" />
                        <span className="text-xs">Mes cours</span>
                      </Button>
                    </Link>
                    
                    <Link href="/dashboard/certifications">
                      <Button variant="outline" className="w-full h-16 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Award className="w-5 h-5" />
                        <span className="text-xs">Certifications</span>
                      </Button>
                    </Link>
                    
                    <Link href="/dashboard/progress">
                      <Button variant="outline" className="w-full h-16 flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-xs">Progression</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistiques détaillées */}
            <TabsContent value="stats" className="mt-6">
              <DashboardStats />
            </TabsContent>

            {/* Activité récente */}
            <TabsContent value="activity" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RecentActivity />
                </div>
                <div>
                  <UpcomingEvents />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </OnboardingGuard>
  );
}

// Composant de debug temporaire
function UserStoreDebug() {
  const { 
    session, 
    user, 
    isAuthenticated, 
    isLoading, 
    getOnboardingStatus,
    getUserName,
    getUserEmail
  } = useUserStore();

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 mb-4">
      <h3 className="text-white text-sm font-bold mb-2">Debug - Store Utilisateur</h3>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Authentifié:</span>
          <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
            {isAuthenticated ? "Oui" : "Non"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Chargement:</span>
          <span className={isLoading ? "text-yellow-400" : "text-green-400"}>
            {isLoading ? "En cours" : "Terminé"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Onboarding:</span>
          <span className={getOnboardingStatus() ? "text-green-400" : "text-yellow-400"}>
            {getOnboardingStatus() ? "Complété" : "À faire"}
          </span>
        </div>
        
        <div className="text-gray-400">
          <div>Nom: {getUserName()}</div>
          <div>Email: {getUserEmail()}</div>
        </div>
      </div>
    </div>
  );
}
