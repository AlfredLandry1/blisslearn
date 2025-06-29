"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/uiStore";
import { Bell, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

export function TestNotificationButton() {
  const { showSuccess, showError, showInfo, showWarning } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const testNotifications = async () => {
    setIsLoading(true);
    
    try {
      // Créer plusieurs notifications de test
      await Promise.all([
        showSuccess("Votre cours a été ajouté aux favoris avec succès !", "Favori ajouté"),
        showError("Impossible de télécharger le certificat. Veuillez réessayer.", "Erreur de téléchargement"),
        showInfo("Un nouveau cours est disponible dans votre domaine d'intérêt.", "Nouveau cours"),
        showWarning("Votre session expirera dans 5 minutes.", "Session expirante"),
        showSuccess("Progression sauvegardée automatiquement.", "Sauvegarde"),
        showInfo("Vous avez 3 notifications non lues.", "Notifications"),
      ]);

      // Attendre un peu avant de créer d'autres notifications
      setTimeout(async () => {
        await showWarning("N'oubliez pas de compléter votre profil pour une meilleure expérience.", "Profil incomplet");
        await showSuccess("Certificat généré avec succès !", "Certificat prêt");
      }, 2000);

    } catch (error) {
      console.error("Erreur lors de la création des notifications de test:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSingleNotification = async (type: 'success' | 'error' | 'info' | 'warning') => {
    setIsLoading(true);
    
    try {
      const messages = {
        success: "Opération réussie !",
        error: "Une erreur s'est produite.",
        info: "Information importante.",
        warning: "Attention, action requise."
      };

      const titles = {
        success: "Succès",
        error: "Erreur",
        info: "Information",
        warning: "Avertissement"
      };

      switch (type) {
        case 'success':
          await showSuccess(messages.success, titles.success);
          break;
        case 'error':
          await showError(messages.error, titles.error);
          break;
        case 'info':
          await showInfo(messages.info, titles.info);
          break;
        case 'warning':
          await showWarning(messages.warning, titles.warning);
          break;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800/60 rounded-lg border border-gray-700/50">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Test des Notifications</h3>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={testNotifications}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Création..." : "Créer plusieurs notifications de test"}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => createSingleNotification('success')}
            disabled={isLoading}
            variant="outline"
            className="border-green-600 text-green-400 hover:bg-green-600/20"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Succès
          </Button>
          
          <Button
            onClick={() => createSingleNotification('error')}
            disabled={isLoading}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600/20"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Erreur
          </Button>
          
          <Button
            onClick={() => createSingleNotification('info')}
            disabled={isLoading}
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
          >
            <Info className="w-4 h-4 mr-1" />
            Info
          </Button>
          
          <Button
            onClick={() => createSingleNotification('warning')}
            disabled={isLoading}
            variant="outline"
            className="border-orange-600 text-orange-400 hover:bg-orange-600/20"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Avertissement
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-400">
        <p>• Les notifications sont persistantes en base de données</p>
        <p>• Suppression automatique après 15 jours</p>
        <p>• Accessibles depuis la page des notifications</p>
      </div>
    </div>
  );
} 