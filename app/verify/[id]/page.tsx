"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Award,
  Calendar,
  User,
  Building,
  Star,
  ExternalLink,
  Copy
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useUIStore } from "@/stores/uiStore";

interface VerificationResult {
  valid: boolean;
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
    recipient: {
      name: string | null;
      email: string;
    };
  };
  verification: {
    isExpired: boolean;
    isRevoked: boolean;
    verifiedAt: string;
  };
}

export default function VerifyCertificationPage() {
  const params = useParams();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addNotification, setLoading, isKeyLoading } = useUIStore();
  const loadingKey = `verify-${params.id}`;
  const loading = isKeyLoading(loadingKey);

  const certificationId = params?.id as string;

  useEffect(() => {
    verifyCertificate();
  }, [params.id]);

  const verifyCertificate = async () => {
    setLoading(loadingKey, true);
    try {
      const response = await fetch(`/api/certifications/${params.id}/verify`);
      if (response.ok) {
        const data = await response.json();
        setVerificationResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la vérification");
        addNotification({
          type: "error",
          title: "Erreur de vérification",
          message: errorData.error || "Impossible de vérifier le certificat",
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      setError("Erreur de connexion");
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Erreur de connexion lors de la vérification",
        duration: 5000
      });
    } finally {
      setLoading(loadingKey, false);
    }
  };

  const copyVerificationUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Vous pourriez ajouter une notification ici
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  const getStatusIcon = (valid: boolean, isExpired: boolean, isRevoked: boolean) => {
    if (isRevoked) return <XCircle className="w-8 h-8 text-red-500" />;
    if (isExpired) return <Clock className="w-8 h-8 text-orange-500" />;
    if (valid) return <CheckCircle className="w-8 h-8 text-green-500" />;
    return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
  };

  const getStatusColor = (valid: boolean, isExpired: boolean, isRevoked: boolean) => {
    if (isRevoked) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (isExpired) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    if (valid) return "bg-green-500/20 text-green-400 border-green-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const getStatusText = (valid: boolean, isExpired: boolean, isRevoked: boolean) => {
    if (isRevoked) return "Révoquée";
    if (isExpired) return "Expirée";
    if (valid) return "Valide";
    return "En cours de vérification";
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Vérification en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="bg-gray-800/80 border-gray-700/50 backdrop-blur-sm max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Erreur de vérification</h1>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button onClick={() => window.history.back()}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!verificationResult) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Award className="w-12 h-12 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Vérification de Certification</h1>
              <p className="text-gray-400 text-lg">BlissLearn - Plateforme de vérification officielle</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Résultat principal */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-3">
                    {getStatusIcon(verificationResult.valid, verificationResult.verification.isExpired, verificationResult.verification.isRevoked)}
                    Résultat de la vérification
                  </CardTitle>
                  <Badge className={getStatusColor(verificationResult.valid, verificationResult.verification.isExpired, verificationResult.verification.isRevoked)}>
                    {getStatusText(verificationResult.valid, verificationResult.verification.isExpired, verificationResult.verification.isRevoked)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Informations de la certification */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Détails de la certification</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Bénéficiaire</p>
                          <p className="text-white font-medium">
                            {verificationResult.certification.recipient.name || verificationResult.certification.recipient.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Émise le</p>
                          <p className="text-white font-medium">
                            {format(new Date(verificationResult.certification.issuedAt), 'dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      
                      {verificationResult.certification.expiresAt && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-sm text-gray-400">Expire le</p>
                            <p className={`font-medium ${verificationResult.verification.isExpired ? 'text-red-400' : 'text-white'}`}>
                              {format(new Date(verificationResult.certification.expiresAt), 'dd MMMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {verificationResult.certification.institution && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="text-sm text-gray-400">Institution</p>
                            <p className="text-white font-medium">{verificationResult.certification.institution}</p>
                          </div>
                        </div>
                      )}
                      
                      {verificationResult.certification.level && (
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-sm text-gray-400">Niveau</p>
                            <p className="text-white font-medium">{verificationResult.certification.level}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Numéro de certification</p>
                          <p className="text-white font-mono font-medium">{verificationResult.certification.certificateNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Titre du cours */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Cours complété</h4>
                  <p className="text-gray-300 text-lg">{verificationResult.certification.title}</p>
                </div>

                {/* Informations de vérification */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Informations de vérification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Vérifiée le :</span>
                      <span className="text-white ml-2">
                        {format(new Date(verificationResult.verification.verifiedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Statut :</span>
                      <span className="text-white ml-2">{verificationResult.certification.status}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions et informations */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={copyVerificationUrl}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open('https://blisslearn.com', '_blank')}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visiter BlissLearn
                </Button>
              </CardContent>
            </Card>

            {/* Informations de sécurité */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">Vérification cryptographiquement sécurisée</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">Base de données sécurisée et chiffrée</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300">Vérification en temps réel</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 