"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Edit,
  Lock,
  Shield,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import SetPasswordModal from "@/components/auth/SetPasswordModal";
import { useUIStore } from "@/stores/uiStore";

export function UserInfoCard() {
  const { user, getOnboardingStatus, getUserName, getUserEmail, getUserImage, getPasswordStatus, updatePasswordStatus } = useUserStore();
  const { addNotification } = useUIStore();
  const router = useRouter();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({
    hasPassword: false,
    isGoogleUser: false,
    needsPasswordSetup: false
  });
  const [isLoadingPasswordStatus, setIsLoadingPasswordStatus] = useState(true);

  const onboardingCompleted = getOnboardingStatus();
  const userName = getUserName();
  const userEmail = getUserEmail();
  const userImage = getUserImage();

  // Vérifier le statut du mot de passe au chargement
  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        const response = await fetch("/api/auth/check-password");
        if (response.ok) {
          const data = await response.json();
          setPasswordStatus(data);
          updatePasswordStatus(data.hasPassword);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du mot de passe:", error);
      } finally {
        setIsLoadingPasswordStatus(false);
      }
    };

    if (user) {
      checkPasswordStatus();
    }
  }, [user, updatePasswordStatus]);

  const handleCompleteOnboarding = () => {
    router.push("/onboarding");
  };

  const handleEditProfile = () => {
    router.push("/dashboard/settings");
  };

  const handleSetPassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setPasswordStatus(prev => ({
      ...prev,
      hasPassword: true,
      needsPasswordSetup: false
    }));
    updatePasswordStatus(true);
  };

  const headerAction = (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleEditProfile}
      className="text-gray-400 hover:text-white"
    >
      <Edit className="w-4 h-4" />
    </Button>
  );

  const footer = (
    <div className="w-full mt-2 flex flex-col gap-2">
      {/* Badge d'onboarding */}
      <Badge
        variant={onboardingCompleted ? "default" : "secondary"}
        className={
          onboardingCompleted
            ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs px-2 py-1"
            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs px-2 py-1 animate-pulse"
        }
      >
        {onboardingCompleted
          ? "Onboarding complété"
          : "Onboarding à compléter"}
      </Badge>

      {/* Bouton d'onboarding */}
      {!onboardingCompleted && (
        <Button
          size="sm"
          variant="default"
          className="text-white mt-1 w-fit px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600"
          onClick={handleCompleteOnboarding}
        >
          Compléter l'onboarding
        </Button>
      )}

      {/* Badge et bouton de mot de passe pour les utilisateurs Google */}
      {!isLoadingPasswordStatus && passwordStatus.isGoogleUser && (
        <>
          <Badge
            variant={passwordStatus.hasPassword ? "default" : "secondary"}
            className={
              passwordStatus.hasPassword
                ? "bg-green-500/10 text-green-400 border-green-500/20 text-xs px-2 py-1"
                : "bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs px-2 py-1"
            }
          >
            {passwordStatus.hasPassword
              ? "Mot de passe configuré"
              : "Mot de passe non configuré"}
          </Badge>

          {passwordStatus.needsPasswordSetup && (
            <Button
              size="sm"
              variant="outline"
              className="text-orange-400 border-orange-500/30 hover:bg-orange-500/10 mt-1 w-fit px-3 py-1 text-xs"
              onClick={handleSetPassword}
            >
              <Lock className="w-3 h-3 mr-1" />
              Configurer un mot de passe
            </Button>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <DashboardCard 
        title="Informations utilisateur"
        headerAction={headerAction}
        footer={footer}
      >
        <div className="flex flex-wrap sm:flex-row md:items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-blue-500">
            <AvatarImage src={userImage || ""} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-2xl">
              {userName.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-lg truncate">
              {userName}
            </div>
            <div className="text-gray-400 text-sm truncate">
              {userEmail}
            </div>
            {/* Indicateur de méthode de connexion */}
            {passwordStatus.isGoogleUser && (
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400">Connexion Google</span>
              </div>
            )}
          </div>
        </div>
      </DashboardCard>

      {/* Modal de configuration du mot de passe */}
      <SetPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
}
