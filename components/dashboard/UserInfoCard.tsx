"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeAvatar } from "@/components/ui/safe-avatar";
import {
  User,
  Edit,
  Lock,
  Shield,
} from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import SetPasswordModal from "@/components/auth/SetPasswordModal";
import { useUIStore } from "@/stores/uiStore";
import { useApiClient } from "@/hooks/useApiClient";

interface PasswordStatus {
  hasPassword: boolean;
  isLoading: boolean;
  isGoogleUser?: boolean;
  needsPasswordSetup?: boolean;
}

export function UserInfoCard() {
  const { user, getOnboardingStatus, getUserName, getUserEmail, getUserImage, getPasswordStatus, updatePasswordStatus } = useUserStore();
  const { addNotification } = useUIStore();
  const router = useRouter();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus>({
    hasPassword: false,
    isLoading: true
  });

  const onboardingCompleted = getOnboardingStatus();
  const userName = getUserName();
  const userEmail = getUserEmail();
  const userImage = getUserImage();

  // ✅ MIGRATION : Utilisation du client API
  const {
    data: passwordData,
    loading: passwordLoading,
    error: passwordError,
    get: checkPassword
  } = useApiClient<PasswordStatus>({
    onSuccess: (data) => {
      setPasswordStatus(data);
      updatePasswordStatus(data.hasPassword);
    },
    onError: (error) => {
      console.error('Erreur vérification mot de passe:', error);
      setPasswordStatus((prev: PasswordStatus) => ({ ...prev, isLoading: false }));
    }
  });

  // ✅ OPTIMISÉ : Vérification du statut du mot de passe
  useEffect(() => {
    const verifyPasswordStatus = async () => {
      // Éviter les appels répétés si on a déjà les données
      if (passwordStatus.hasPassword !== false || passwordStatus.isLoading === false) {
        return;
      }

      try {
        await checkPassword('/api/auth/check-password');
      } catch (error) {
        // Erreur déjà gérée par le client API
      }
    };

    verifyPasswordStatus();
  }, [checkPassword, passwordStatus.hasPassword, passwordStatus.isLoading]);

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
    setPasswordStatus((prev: PasswordStatus) => ({
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
    <div className="w-full mt-2 flex flex-col gap-2 pb-2">
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
      {!passwordLoading && passwordStatus.isGoogleUser && (
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
          <SafeAvatar 
            src={userImage || ""} 
            alt={userName}
            size="xl"
            className="border-2 border-blue-500"
          />
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
