"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as loader from "@/components/loading";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserInfoCard } from "@/components/dashboard/UserInfoCard";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { useUserStore } from "@/stores/userStore";
import { useCourseStore } from "@/stores/courseStore";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const firstName = session?.user?.name?.split(" ")[0] || "";
  const { refreshCourses } = useCourseStore();

  // Charger les données des cours au montage du composant
  useEffect(() => {
    if (status === "authenticated") {
      refreshCourses();
    }
  }, [status, refreshCourses]);

  if (status === "loading") {
    return <loader.PageSpinner />;
  }

  return (
    <OnboardingGuard requireOnboarding={false}>
      <DashboardLayout>
        <div>
          <div className="space-y-8 relative z-10">
            {/* En-tête */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 truncate">
                Bonjour{firstName && <span>, {firstName}</span>} <span className="text-2xl">👋</span>
              </h2>
              <p className="text-gray-400 mt-1 truncate">Prêt à apprendre aujourd'hui&nbsp;?</p>
            </div>

            {/* Statistiques rapides */}
            <div className="">
              <QuickStats />
            </div>

            {/* Contenu principal */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Colonne principale */}
              <div className="flex-1 space-y-6">
                <ProgressOverview />
                <RecentActivity />
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                <UserInfoCard />
                <UpcomingEvents />
              </div>
            </div>
          </div>
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
