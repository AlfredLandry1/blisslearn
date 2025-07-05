"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Square, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useApiClient } from "@/hooks/useApiClient";
import { useUIStore } from "@/stores/uiStore";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
}

export function ApiClientExample() {
  const [testResults, setTestResults] = useState<{
    status: 'idle' | 'running' | 'completed' | 'error';
    message: string;
    duration?: number;
  }>({ status: 'idle', message: 'Aucun test en cours' });

  const { createPersistentNotification } = useUIStore();

  // ✅ EXEMPLE : Utilisation du nouveau client API
  const {
    data: courses,
    loading: coursesLoading,
    error: coursesError,
    get: fetchCourses,
    cancel: cancelCourses,
    reset: resetCourses
  } = useApiClient<Course[]>({
    onSuccess: async (data) => {
      await createPersistentNotification({
        type: 'success',
        title: 'Cours chargés',
        message: `${data.length} cours récupérés avec succès`
      });
    },
    onError: async (error) => {
      await createPersistentNotification({
        type: 'error',
        title: 'Erreur de chargement',
        message: error.message
      });
    }
  });

  // Test de performance
  const runPerformanceTest = async () => {
    setTestResults({ status: 'running', message: 'Test en cours...' });
    const startTime = Date.now();

    try {
      // Test avec le nouveau client API
      await fetchCourses('/api/courses');
      const duration = Date.now() - startTime;
      
      setTestResults({
        status: 'completed',
        message: `Test réussi en ${duration}ms`,
        duration
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `Erreur: ${(error as Error).message}`
      });
    }
  };

  const cancelTest = () => {
    cancelCourses();
    setTestResults({ status: 'idle', message: 'Test annulé' });
  };

  const resetTest = () => {
    resetCourses();
    setTestResults({ status: 'idle', message: 'État réinitialisé' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Test du Client API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contrôles */}
          <div className="flex gap-2">
            <Button
              onClick={runPerformanceTest}
              disabled={coursesLoading}
              className="flex items-center gap-2"
            >
              {coursesLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Lancer le test
            </Button>
            
            <Button
              variant="outline"
              onClick={cancelTest}
              disabled={!coursesLoading}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Annuler
            </Button>
            
            <Button
              variant="outline"
              onClick={resetTest}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Résultats du test */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {testResults.status === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
              {testResults.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {testResults.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
              <span className="font-medium">Statut:</span>
              <Badge variant={
                testResults.status === 'completed' ? 'default' :
                testResults.status === 'error' ? 'destructive' :
                'secondary'
              }>
                {testResults.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{testResults.message}</p>
            {testResults.duration && (
              <p className="text-xs text-gray-500 mt-1">
                Durée: {testResults.duration}ms
              </p>
            )}
          </div>

          {/* État de l'API */}
          <div className="space-y-2">
            <h4 className="font-medium">État de l'API:</h4>
            <div className="flex gap-2">
              <Badge variant={coursesLoading ? 'default' : 'secondary'}>
                {coursesLoading ? 'Chargement...' : 'Prêt'}
              </Badge>
              {coursesError && (
                <Badge variant="destructive">
                  Erreur: {coursesError.message}
                </Badge>
              )}
              {courses && (
                <Badge variant="outline">
                  {courses.length} cours chargés
                </Badge>
              )}
            </div>
          </div>

          {/* Données récupérées */}
          {courses && courses.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Cours récupérés:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="p-2 bg-white border rounded text-sm">
                    <div className="font-medium">{course.title}</div>
                    <div className="text-gray-500 text-xs">{course.level} • {course.duration}min</div>
                  </div>
                ))}
                {courses.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    ... et {courses.length - 3} autres cours
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avantages du client API */}
      <Card>
        <CardHeader>
          <CardTitle>Avantages du Client API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Avantages</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• API similaire à Axios</li>
                <li>• Gestion automatique des erreurs</li>
                <li>• Annulation native des requêtes</li>
                <li>• Intercepteurs configurables</li>
                <li>• Pas de dépendance externe</li>
                <li>• Performance optimale</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">🚀 Fonctionnalités</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Timeout automatique</li>
                <li>• Parsing JSON automatique</li>
                <li>• Gestion des credentials</li>
                <li>• Headers configurables</li>
                <li>• TypeScript natif</li>
                <li>• Compatible Next.js 15</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 