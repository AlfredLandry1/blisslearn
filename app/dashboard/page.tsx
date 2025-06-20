"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as loader from "@/components/loading";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UserInfoCard } from "@/components/dashboard/UserInfoCard";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { SpaceBackground } from "@/components/ui/SpaceBackground";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const firstName = session?.user?.name?.split(" ")[0] || "";

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
