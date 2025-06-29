"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  CheckCircle,
  Clock,
  Award,
  ExternalLink,
  Calendar,
  User,
  Building,
  Globe,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Certification {
  id: string;
  title: string;
  description: string;
  certificateNumber: string;
  issuedAt: string;
  expiresAt: string | null;
  courseTitle: string;
  institution: string | null;
  level: string | null;
  duration: string | null;
  timeSpent: number | null;
  completionDate: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CertificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addNotification, setLoading, isKeyLoading } = useUIStore();

  const [certification, setCertification] = useState<Certification | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showCertificateNumber, setShowCertificateNumber] = useState(false);

  const certificationId = params?.id as string;
  const loadingKey = `certification-${certificationId}`;
  const loading = isKeyLoading(loadingKey);

  useEffect(() => {
    if (certificationId && status === "authenticated") {
      fetchCertification();
    }
  }, [certificationId, status]);

  const fetchCertification = async () => {
    setLoading(loadingKey, true);
    try {
      const response = await fetch(`/api/certifications/${certificationId}`);
      if (!response.ok) {
        throw new Error("Certification introuvable");
      }
      const data = await response.json();
      setCertification(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger la certification",
        duration: 5000,
      });
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      addNotification({
        type: "info",
        title: "Téléchargement",
        message: "Génération du PDF en cours...",
        duration: 3000,
      });

      const response = await fetch(
        `/api/certifications/${certificationId}/download`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certification-${certification?.certificateNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        addNotification({
          type: "success",
          title: "Téléchargement réussi",
          message: "Votre certification a été téléchargée",
          duration: 3000,
        });
      } else {
        throw new Error("Erreur lors du téléchargement");
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de télécharger la certification",
        duration: 5000,
      });
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: certification?.title || "Ma certification",
        text: `J'ai obtenu ma certification ${certification?.title} !`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API Share
        await navigator.clipboard.writeText(window.location.href);
        addNotification({
          type: "success",
          title: "Lien copié",
          message:
            "Le lien de votre certification a été copié dans le presse-papiers",
          duration: 3000,
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de partager la certification",
        duration: 5000,
      });
    }
  };

  const copyCertificateNumber = async () => {
    try {
      await navigator.clipboard.writeText(
        certification?.certificateNumber || ""
      );
      addNotification({
        type: "success",
        title: "Numéro copié",
        message: "Le numéro de certification a été copié",
        duration: 2000,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de copier le numéro",
        duration: 3000,
      });
    }
  };

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

  const isExpired =
    certification?.expiresAt && new Date(certification.expiresAt) < new Date();
  const daysUntilExpiry = certification?.expiresAt
    ? Math.ceil(
        (new Date(certification.expiresAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !certification) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-white">
              Certification introuvable
            </h1>
            <p className="text-gray-400 mb-6">
              {error || "La certification demandée n'existe pas."}
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Header avec navigation */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 text-gray-400 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux certifications
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {certification.title}
                </h1>
                <p className="text-gray-400">{certification.courseTitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carte principale de la certification */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Détails de la certification
                    </CardTitle>
                    <Badge className={getStatusColor(certification.status)}>
                      {getStatusLabel(certification.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Émise le</p>
                          <p className="text-white font-medium">
                            {format(
                              new Date(certification.issuedAt),
                              "dd MMMM yyyy",
                              { locale: fr }
                            )}
                          </p>
                        </div>
                      </div>

                      {certification.expiresAt && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-sm text-gray-400">Expire le</p>
                            <p
                              className={`font-medium ${
                                isExpired ? "text-red-400" : "text-white"
                              }`}
                            >
                              {format(
                                new Date(certification.expiresAt),
                                "dd MMMM yyyy",
                                { locale: fr }
                              )}
                            </p>
                            {daysUntilExpiry !== null && (
                              <p
                                className={`text-xs ${
                                  isExpired
                                    ? "text-red-400"
                                    : daysUntilExpiry <= 30
                                    ? "text-orange-400"
                                    : "text-gray-400"
                                }`}
                              >
                                {isExpired
                                  ? "Expirée"
                                  : daysUntilExpiry <= 30
                                  ? `${daysUntilExpiry} jours restants`
                                  : `${daysUntilExpiry} jours restants`}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {certification.institution && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-sm text-gray-400">Institution</p>
                            <p className="text-white font-medium">
                              {certification.institution}
                            </p>
                          </div>
                        </div>
                      )}

                      {certification.level && (
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-sm text-gray-400">Niveau</p>
                            <p className="text-white font-medium">
                              {certification.level}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Numéro de certification */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      Numéro de certification
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-3 font-mono text-white">
                        {showCertificateNumber
                          ? certification.certificateNumber
                          : "••••••••••••••••"}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowCertificateNumber(!showCertificateNumber)
                        }
                        className="border-gray-600 text-gray-300"
                      >
                        {showCertificateNumber ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyCertificateNumber}
                        className="border-gray-600 text-gray-300"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  {certification.description && (
                    <>
                      <Separator className="bg-gray-700" />
                      <div className="space-y-3">
                        <p className="text-sm text-gray-400">Description</p>
                        <p className="text-gray-300 leading-relaxed">
                          {certification.description}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions et métadonnées */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `/api/certifications/${certification.id}/verify`,
                        "_blank"
                      )
                    }
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Vérifier en ligne
                  </Button>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Temps passé</span>
                    <span className="text-white font-medium">
                      {certification.timeSpent
                        ? `${Math.floor(certification.timeSpent / 60)}h ${
                            certification.timeSpent % 60
                          }min`
                        : "Non renseigné"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Durée du cours</span>
                    <span className="text-white font-medium">
                      {certification.duration || "Non renseigné"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Date de complétion</span>
                    <span className="text-white font-medium">
                      {format(
                        new Date(certification.completionDate),
                        "dd/MM/yyyy",
                        { locale: fr }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Vérifiée</span>
                    <Badge
                      className={
                        certification.isVerified
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {certification.isVerified ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
