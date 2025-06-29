"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CertificationCard } from "@/components/dashboard/CertificationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Award,
  Search,
  Filter,
  Plus,
  Download,
  Share2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";

interface Certification {
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
}

interface CertificationStats {
  total: number;
  completed: number;
  inProgress: number;
  averageScore: number;
}

interface CertificationFilters {
  status: string;
  platform: string;
  dateRange: string;
}

export default function CertificationsPage() {
  const { data: session, status } = useSession();
  const { addNotification, setLoading, isKeyLoading } = useUIStore();

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadingKey = "certifications-page";
  const globalLoading = isKeyLoading(loadingKey);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCertifications();
    }
  }, [status]);

  const fetchCertifications = async () => {
    setLoading(loadingKey, true);
    setLocalLoading(true);
    try {
      const response = await fetch("/api/certifications");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des certifications");
      }
      const data = await response.json();

      // L'API retourne un objet avec certifications, pagination et stats
      // Nous devons extraire le tableau des certifications
      setCertifications(data.certifications || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les certifications",
        duration: 5000,
      });
    } finally {
      setLoading(loadingKey, false);
      setLocalLoading(false);
    }
  };

  const filteredCertifications = certifications.filter((certification) => {
    const matchesSearch =
      certification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.certificateNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (certification.institution &&
        certification.institution
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || certification.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      active: 0,
      expired: 0,
      revoked: 0,
      total: certifications.length,
    };

    certifications.forEach((cert) => {
      if (cert.status === "active") stats.active++;
      else if (cert.status === "expired") stats.expired++;
      else if (cert.status === "revoked") stats.revoked++;
    });

    return stats;
  };

  const stats = getStatusStats();

  if (loading || globalLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Mes Certifications
                </h1>
                <p className="text-gray-400">
                  Gérez et partagez vos certifications professionnelles
                </p>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-full bg-blue-500/20 flex-shrink-0">
                      <Award className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold text-white truncate">
                        {stats.total}
                      </p>
                      <p className="text-gray-400 text-sm truncate">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-full bg-green-500/20 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold text-white truncate">
                        {stats.active}
                      </p>
                      <p className="text-gray-400 text-sm truncate">Actives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-full bg-orange-500/20 flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold text-white truncate">
                        {stats.expired}
                      </p>
                      <p className="text-gray-400 text-sm truncate">Expirées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-full bg-red-500/20 flex-shrink-0">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-2xl font-bold text-white truncate">
                        {stats.revoked}
                      </p>
                      <p className="text-gray-400 text-sm truncate">Révoquées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filtres et recherche */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm mb-6 overflow-hidden">
            <CardContent className="p-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                <div className="flex-1 relative min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 flex-shrink-0" />
                  <Input
                    placeholder="Rechercher une certification..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50 w-full"
                  />
                </div>

                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className={
                      filterStatus === "all"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    Toutes
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                    className={
                      filterStatus === "active"
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    Actives
                  </Button>
                  <Button
                    variant={filterStatus === "expired" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("expired")}
                    className={
                      filterStatus === "expired"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    Expirées
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des certifications */}
          {error ? (
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button onClick={fetchCertifications}>Réessayer</Button>
              </CardContent>
            </Card>
          ) : filteredCertifications.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm || filterStatus !== "all"
                    ? "Aucune certification trouvée"
                    : "Aucune certification"}
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Essayez de modifier vos critères de recherche"
                    : "Commencez par compléter un cours pour obtenir votre première certification"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <Button
                    onClick={() =>
                      (window.location.href = "/dashboard/explorer")
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Découvrir des cours
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCertifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
