"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Edit,
} from "lucide-react";

export function UserInfoCard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCompleteOnboarding = () => {
    router.push("/onboarding");
  };

  const handleEditProfile = () => {
    router.push("/dashboard/settings");
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-md ring-1 ring-blue-500/10 relative overflow-hidden group">
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
      <CardHeader className="pb-">
        <div className="flex md:items-center-safe justify-between">
          <CardTitle className="text-white flex md:items-center-safe">
            <User className="w-5 h-5 mr-2" />
            Informations utilisateur
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditProfile}
            className="text-gray-400 hover:text-white"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap sm:flex-row md:items-center-safe gap-4">
        <Avatar className="w-16 h-16 border-2 border-blue-500">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-2xl">
            {session?.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-lg truncate">
            {session?.user?.name || "Utilisateur"}
          </div>
          <div className="text-gray-400 text-sm truncate">
            {session?.user?.email}
          </div>
        </div>
      </CardContent>
      <CardFooter><div className="w-full mt-2 flex flex-col gap-1">
        <Badge
          variant={session?.user?.onboardingCompleted ? "default" : "secondary"}
          className={
            session?.user?.onboardingCompleted
              ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs px-2 py-1"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs px-2 py-1 animate-pulse"
          }
        >
          {session?.user?.onboardingCompleted
            ? "Onboarding ✓"
            : "Onboarding à compléter"}
        </Badge>
        {!session?.user?.onboardingCompleted && (
          <Button
            size="sm"
            variant="default"
            className="text-white mt-1 w-fit px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600"
            onClick={handleCompleteOnboarding}
          >
            Compléter l'onboarding
          </Button>
        )}
      </div></CardFooter>
    </Card>
  );
}
