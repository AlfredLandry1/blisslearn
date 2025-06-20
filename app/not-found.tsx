"use client";

import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950 overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">404</h1>
        <p className="text-2xl text-blue-400 mb-2 font-semibold">Oups, page non trouvée !</p>
        <p className="text-gray-300 mb-8 max-w-md">La page que vous cherchez semble perdue dans l'espace. Essayez de revenir à la page d'accueil ou explorez le dashboard.</p>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg font-bold shadow-lg" onClick={() => router.push("/")}>Retour à l'accueil</Button>
      </div>
    </div>
  );
} 