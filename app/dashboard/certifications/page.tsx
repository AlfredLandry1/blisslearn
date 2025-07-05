"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Award, 
  Star, 
  Download, 
  Eye,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useUIStore } from "@/stores/uiStore";
import { PageLoadingState } from "@/components/ui/loading-states";
import { useApiClient } from "@/hooks/useApiClient";
import { AchievementMessage, MotivationMessage, ProgressMessage } from "@/components/ui/personalized-message";
import { usePersonalizedContent } from "@/hooks/usePersonalizedContent";

interface Certification {
  id: string;
  title: string;
  platform: string;
  courseTitle: string;
  issuedDate: string;
  expiryDate?: string;
  score: number;
  status: 'active' | 'expired' | 'pending';
  downloadUrl?: string;
  verifyUrl?: string;
  imageUrl?: string;
}

interface CertificationStats {
  total: number;
  completed: number;
  inProgress: number;
  averageScore: number;
}

export default function CertificationsPage() {
  const { data: session, status: authStatus } = useSession();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [stats, setStats] = useState<CertificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addNotification, setLoading: setUILoading, isKeyLoading } = useUIStore();
  const loadingKey = "certifications";
  const isLoading = isKeyLoading(loadingKey);

  // Hook pour rafraîchir le contenu personnalisé
  const { refresh: refreshPersonalizedContent } = usePersonalizedContent();

  // ✅ MIGRATION : Utilisation du client API
  const {
    data: certData,
    loading: certLoading,
    error: certError,
    get: fetchCertifications
  } = useApiClient<{ certifications: Certification[]; stats: CertificationStats }>({
    onSuccess: (data) => {
      setCertifications(data.certifications || []);
      setStats(data.stats || null);
      setUILoading(loadingKey, false);
    },
    onError: (error) => {
      console.error('Erreur chargement certifications:', error);
      setError(error.message);
      setUILoading(loadingKey, false);
      addNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: 'Impossible de charger vos certifications'
      });
    }
  });

  // ✅ OPTIMISÉ : Chargement des certifications
  useEffect(() => {
    if (authStatus === "authenticated") {
      setUILoading(loadingKey, true);
      setError(null);
      fetchCertifications('/api/certifications');
    }
  }, [authStatus, fetchCertifications, setUILoading, loadingKey]);

  if (authStatus === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <PageLoadingState message="Chargement des certifications..." />
      </DashboardLayout>
    );
  }

  if (authStatus !== "authenticated") {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-400 py-20">
          Veuillez vous connecter pour voir vos certifications.
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="text-center py-20">
            <div className="text-red-400 text-lg font-medium mb-4">
              Erreur lors du chargement
            </div>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'expired': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'expired': return 'Expirée';
      case 'pending': return 'En cours';
      default: return 'Inconnu';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mes Certifications</h1>
            <p className="text-gray-400">Validez et partagez vos compétences acquises</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm">
              <Trophy className="w-4 h-4 mr-2" />
              Nouvelle certification
            </Button>
          </div>
        </div>

        {/* Messages personnalisés IA */}
        <div className="space-y-4 mb-8">
          <AchievementMessage 
            autoHide={true} 
            autoHideDelay={8000}
            className="opacity-0 animate-fade-in duration-500"
          />
          <MotivationMessage 
            showRefresh={true}
            onRefresh={refreshPersonalizedContent}
            className="opacity-0 animate-fade-in duration-500 delay-200"
          />
          <ProgressMessage 
            className="opacity-0 animate-fade-in duration-500 delay-400"
          />
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <p className="text-xs text-gray-400">
                  certifications obtenues
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Actives</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.completed}</div>
                <p className="text-xs text-gray-400">
                  certifications valides
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">En cours</CardTitle>
                <Clock className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
                <p className="text-xs text-gray-400">
                  en cours d'obtention
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Score moyen</CardTitle>
                <Star className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
                <p className="text-xs text-gray-400">
                  performance moyenne
                </p>
                <Progress value={stats.averageScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste des certifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Certifications récentes</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </div>
          </div>

          {certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.id} className="bg-gray-900/60 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                          {cert.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-2">
                          {cert.courseTitle}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {cert.platform}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(cert.status)}`}>
                        {getStatusLabel(cert.status)}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Score</span>
                        <span className="text-white font-medium">{cert.score}%</span>
                      </div>
                      <Progress value={cert.score} className="h-2" />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Obtenue le</span>
                        <span className="text-white">{formatDate(cert.issuedDate)}</span>
                      </div>

                      {cert.expiryDate && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Expire le</span>
                          <span className="text-white">{formatDate(cert.expiryDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {cert.downloadUrl && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-3 h-3 mr-1" />
                          Télécharger
                        </Button>
                      )}
                      {cert.verifyUrl && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          Vérifier
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-900/60 border-gray-700">
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Aucune certification</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Commencez par terminer des cours pour obtenir vos premières certifications
                </p>
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Explorer les cours
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
