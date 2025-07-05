"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Vous êtes hors ligne</h1>
        <p className="text-gray-400 mb-8">
          Impossible de se connecter à Internet. Vérifiez votre connexion et réessayez.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
          
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Fonctionnalités disponibles hors ligne :</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Navigation dans les pages visitées</li>
            <li>• Consultation des cours téléchargés</li>
            <li>• Paramètres de l'application</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 