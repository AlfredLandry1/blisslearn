"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Award, 
  Calendar, 
  Clock, 
  Download, 
  Share2, 
  ExternalLink,
  Building,
  Star,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useUIStore } from "@/stores/uiStore";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/useApiClient";

interface CertificationCardProps {
  certification: {
    id: string;
    title: string;
    certificateNumber: string;
    issuedAt: string;
    expiresAt: string | null;
    status: string;
    isVerified: boolean;
    institution: string | null;
    level: string | null;
    duration: string | null;
    timeSpent: number | null;
    completionDate: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const router = useRouter();
  const { createPersistentNotification } = useUIStore();
  const [isHovered, setIsHovered] = useState(false);

  const isExpired = certification.expiresAt && new Date(certification.expiresAt) < new Date();
  const daysUntilExpiry = certification.expiresAt 
    ? Math.ceil((new Date(certification.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "expired":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "revoked":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "expired":
        return "Expirée";
      case "revoked":
        return "Révoquée";
      default:
        return status;
    }
  };

  const {
    post: postDownload,
  } = useApiClient<any>({
    onError: (error) => {
      createPersistentNotification({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Impossible de télécharger la certification',
        duration: 5000
      });
    }
  });

  const handleDownload = async () => {
    try {
      await createPersistentNotification({
        type: 'info',
        title: 'Téléchargement',
        message: 'Génération du certificat en cours...'
      });
      const response = await postDownload(`/api/certifications/${certification.id}/download`);
      if (response?.data) {
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certification-${certification.certificateNumber}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        await createPersistentNotification({
          type: 'success',
          title: 'Téléchargement réussi',
          message: 'Votre certification a été téléchargée'
        });
      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      // Erreur déjà gérée par le client API
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: certification.title,
        text: `J'ai obtenu ma certification ${certification.title} !`,
        url: `${window.location.origin}/verify/${certification.id}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/verify/${certification.id}`);
        await createPersistentNotification({
          type: 'success',
          title: 'Lien copié',
          message: 'Le lien de vérification a été copié dans le presse-papiers'
        });
      }
    } catch (error) {
      await createPersistentNotification({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de partager la certification',
        duration: 5000
      });
    }
  };

  return (
    <Card 
      className={`
        bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm
        transition-all duration-300 cursor-pointer group
        ${isHovered ? 'border-blue-500/50 shadow-lg shadow-blue-500/25' : 'hover:border-gray-600/50'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/dashboard/certifications/${certification.id}`)}
    >
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className={`
              p-1.5 sm:p-2 rounded-full transition-all duration-300 flex-shrink-0
              ${isHovered 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                : 'bg-gray-800/50 border border-gray-700/50'
              }
            `}>
              <Award className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                isHovered ? 'text-blue-400' : 'text-gray-400'
              }`} />
            </div>
            <div className="min-w-0 flex-1 max-w-[calc(100%-60px)]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="text-white text-base sm:text-lg font-semibold group-hover:text-blue-400 transition-colors duration-300 truncate cursor-pointer leading-tight">
                    {certification.title}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>{certification.title}</TooltipContent>
              </Tooltip>
              <p className="text-gray-400 text-xs sm:text-sm truncate">#{certification.certificateNumber}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(certification.status)} flex-shrink-0 text-xs whitespace-nowrap`}>
            {getStatusLabel(certification.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 pb-4">
        {/* Informations principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-400 text-xs">Émise le</p>
              <p className="text-white font-medium truncate">
                {format(new Date(certification.issuedAt), 'dd/MM/yyyy', { locale: fr })}
              </p>
            </div>
          </div>

          {certification.expiresAt && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-400 text-xs">Expire le</p>
                <p className={`font-medium truncate ${isExpired ? 'text-red-400' : 'text-white'}`}>
                  {format(new Date(certification.expiresAt), 'dd/MM/yyyy', { locale: fr })}
                </p>
                {daysUntilExpiry !== null && (
                  <p className={`text-xs truncate ${isExpired ? 'text-red-400' : daysUntilExpiry <= 30 ? 'text-orange-400' : 'text-gray-400'}`}>
                    {isExpired ? 'Expirée' : `${daysUntilExpiry} jours restants`}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {certification.institution && (
            <div className="flex items-center gap-1 text-xs">
              <Building className="w-3 h-3 text-purple-400 flex-shrink-0" />
              <span className="text-gray-300 truncate">{certification.institution}</span>
            </div>
          )}
          
          {certification.level && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
              <span className="text-gray-300 truncate">{certification.level}</span>
            </div>
          )}
          
          {certification.duration && (
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 truncate">{certification.duration}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-gray-700/50 -mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="flex-1 h-8 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white min-w-0"
          >
            <Download className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Télécharger</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="flex-1 h-8 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white min-w-0"
          >
            <Share2 className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Partager</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/verify/${certification.id}`, '_blank');
            }}
            className="h-8 w-8 p-0 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white flex-shrink-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 