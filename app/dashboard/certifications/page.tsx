"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Download, 
  Share2, 
  Calendar,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface Certification {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  dateObtained: string;
  score: number;
  isCompleted: boolean;
  isInProgress: boolean;
  estimatedCompletion: string;
  certificateUrl?: string;
}

const mockCertifications: Certification[] = [
  {
    id: "1",
    title: "Certification TypeScript",
    description: "Maîtrisez TypeScript pour des applications robustes",
    category: "Développement Web",
    level: "Avancé",
    dateObtained: "15 Jan 2024",
    score: 92,
    isCompleted: true,
    isInProgress: false,
    certificateUrl: "/certificates/typescript.pdf",
    estimatedCompletion: "15 Jan 2024"
  },
  {
    id: "2",
    title: "Certification React",
    description: "Développez des interfaces utilisateur modernes",
    category: "Frontend",
    level: "Intermédiaire",
    dateObtained: "28 Déc 2023",
    score: 88,
    isCompleted: true,
    isInProgress: false,
    certificateUrl: "/certificates/react.pdf",
    estimatedCompletion: "28 Déc 2023"
  },
  {
    id: "3",
    title: "Certification Next.js",
    description: "Créez des applications full-stack avec Next.js",
    category: "Framework",
    level: "Intermédiaire",
    dateObtained: "",
    score: 0,
    isCompleted: false,
    isInProgress: true,
    estimatedCompletion: "25 Jan 2024",
    certificateUrl: "/certificates/nextjs.pdf"
  },
  {
    id: "4",
    title: "Certification Node.js",
    description: "Développez des APIs robustes avec Node.js",
    category: "Backend",
    level: "Avancé",
    dateObtained: "",
    score: 0,
    isCompleted: false,
    isInProgress: false,
    estimatedCompletion: "15 Fév 2024",
    certificateUrl: "/certificates/nodejs.pdf"
  }
];

export default function CertificationsPage() {
  const completedCertifications = mockCertifications.filter(cert => cert.isCompleted);
  const inProgressCertifications = mockCertifications.filter(cert => cert.isInProgress);
  const availableCertifications = mockCertifications.filter(cert => !cert.isCompleted && !cert.isInProgress);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Certifications
          </h1>
          <p className="text-gray-400">
            Vos badges et certificats d'apprentissage
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{completedCertifications.length}</p>
              <p className="text-green-400 text-sm">Certifications obtenues</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{inProgressCertifications.length}</p>
              <p className="text-blue-400 text-sm">En cours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{availableCertifications.length}</p>
              <p className="text-purple-400 text-sm">Disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Certifications obtenues */}
        {completedCertifications.length > 0 && (
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Certifications obtenues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedCertifications.map((cert) => (
                  <div key={cert.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{cert.title}</h4>
                        <p className="text-gray-400 text-sm">{cert.description}</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Obtenue
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Score</span>
                        <span className="text-white font-medium">{cert.score}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Niveau</span>
                        <span className="text-white">{cert.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Date d'obtention</span>
                        <span className="text-white">{cert.dateObtained}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications en cours */}
        {inProgressCertifications.length > 0 && (
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Certifications en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressCertifications.map((cert) => (
                  <div key={cert.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{cert.title}</h4>
                        <p className="text-gray-400 text-sm">{cert.description}</p>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <Clock className="w-3 h-3 mr-1" />
                        En cours
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Niveau</span>
                        <span className="text-white">{cert.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Estimation</span>
                        <span className="text-white">{cert.estimatedCompletion}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                      Continuer la certification
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications disponibles */}
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-400" />
              Certifications disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableCertifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{cert.title}</h4>
                      <p className="text-gray-400 text-sm">{cert.description}</p>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      Disponible
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Niveau</span>
                      <span className="text-white">{cert.level}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Estimation</span>
                      <span className="text-white">{cert.estimatedCompletion}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                    Commencer la certification
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 