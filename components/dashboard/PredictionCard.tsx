"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Trophy,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip
} from "recharts";
import { useUIStore } from "@/stores/uiStore";

interface PredictionData {
  day: string;
  hours: number;
  courses: number;
  certifications: number;
  confidence: number;
}

interface PredictionResponse {
  predictions: any[];
  trends: {
    learningVelocity: string;
    focusAreas: string[];
    potentialBreakthroughs: string[];
    gamificationTips: string[];
  };
  goals: {
    realisticGoal: string;
    stretchGoal: string;
    motivationalQuote: string;
  };
  chartData: PredictionData[];
  currentStats: any;
}

export function PredictionCard() {
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'hours' | 'courses' | 'certifications'>('hours');

  const { addNotification } = useUIStore();

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats/predictions');
      
      if (response.ok) {
        const data = await response.json();
        setPredictionData(data);
      } else {
        throw new Error('Erreur lors du chargement des prédictions');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les prédictions');
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de charger les prédictions d'évolution",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'hours':
        return {
          color: "#3B82F6",
          icon: Clock,
          label: "Heures d'apprentissage",
          unit: "h"
        };
      case 'courses':
        return {
          color: "#10B981",
          icon: BookOpen,
          label: "Cours terminés",
          unit: ""
        };
      case 'certifications':
        return {
          color: "#F59E0B",
          icon: Award,
          label: "Certifications",
          unit: ""
        };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'croissant':
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'décroissant':
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case 'croissant':
        return 'text-green-400';
      case 'décroissant':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Prédictions d'évolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !predictionData) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Prédictions d'évolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">{error || "Aucune donnée disponible"}</p>
            <Button onClick={fetchPredictions} variant="outline" size="sm">
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metricConfig = getMetricConfig();
  const chartConfig = {
    hours: {
      label: "Heures d'apprentissage",
      color: "#3B82F6",
      gradientStart: "#3B82F6",
      gradientEnd: "#1E40AF",
    },
    courses: {
      label: "Cours terminés",
      color: "#10B981",
      gradientStart: "#10B981",
      gradientEnd: "#059669",
    },
    certifications: {
      label: "Certifications",
      color: "#F59E0B",
      gradientStart: "#F59E0B",
      gradientEnd: "#D97706",
    },
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700 overflow-hidden min-w-0">
      <CardHeader className="pb-4 overflow-hidden min-w-0">
        <div className="flex items-center justify-between min-w-0 w-full">
          <CardTitle className="text-white flex items-center min-w-0 flex-1 overflow-hidden">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400 flex-shrink-0" />
            <span className="truncate">Prédictions d'évolution</span>
          </CardTitle>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex-shrink-0 min-w-0">
            <Zap className="w-3 h-3 mr-1" />
            IA Prédictive
          </Badge>
        </div>
        
        {/* Message motivant */}
        <p className="text-gray-300 text-sm mt-2 truncate overflow-hidden min-w-0">
          {predictionData.goals.motivationalQuote}
        </p>
      </CardHeader>

      <CardContent className="space-y-6 overflow-hidden min-w-0">
        {/* Sélecteur de métrique */}
        <div className="flex flex-wrap gap-2 overflow-hidden min-w-0">
          {(['hours', 'courses', 'certifications'] as const).map((metric) => (
            <Button
              key={metric}
              variant={selectedMetric === metric ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(metric)}
              className={`text-xs flex-shrink-0 min-w-0 ${
                selectedMetric === metric 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {metricConfig.icon && <metricConfig.icon className="w-3 h-3 mr-1 flex-shrink-0" />}
              <span className="truncate">{chartConfig[metric].label}</span>
            </Button>
          ))}
        </div>

        {/* Graphique de prédictions */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData.chartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCertifications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tick={{ fill: '#9CA3AF' }}
              />
              
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={chartConfig[selectedMetric].color}
                fill={`url(#color${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)})`}
                strokeWidth={2}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                }}
                labelStyle={{ color: '#9CA3AF', fontWeight: '600' }}
                itemStyle={{ color: '#F9FAFB' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tendances et objectifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden min-w-0">
          {/* Tendances */}
          <div className="space-y-3 overflow-hidden min-w-0">
            <h4 className="text-white font-semibold flex items-center min-w-0">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
              <span className="truncate">Tendances</span>
            </h4>
            
            <div className="space-y-2 overflow-hidden min-w-0">
              <div className="flex items-center justify-between min-w-0">
                <span className="text-gray-400 text-sm truncate flex-1 min-w-0">Vitesse d'apprentissage</span>
                <div className="flex items-center gap-1 flex-shrink-0 min-w-0">
                  {getTrendIcon(predictionData.trends.learningVelocity)}
                  <span className={`text-sm ${getVelocityColor(predictionData.trends.learningVelocity)} truncate`}>
                    {predictionData.trends.learningVelocity}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 overflow-hidden min-w-0">
                <span className="text-gray-400 text-sm truncate">Domaines de focus</span>
                <div className="flex flex-wrap gap-1 overflow-hidden min-w-0">
                  {predictionData.trends.focusAreas.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/30 truncate flex-shrink-0">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Objectifs */}
          <div className="space-y-3 overflow-hidden min-w-0">
            <h4 className="text-white font-semibold flex items-center min-w-0">
              <Target className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
              <span className="truncate">Objectifs</span>
            </h4>
            
            <div className="space-y-2 overflow-hidden min-w-0">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 overflow-hidden min-w-0">
                <p className="text-green-300 text-sm font-medium truncate">Objectif réaliste</p>
                <p className="text-white text-sm truncate overflow-hidden">{predictionData.goals.realisticGoal}</p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 overflow-hidden min-w-0">
                <p className="text-purple-300 text-sm font-medium truncate">Objectif ambitieux</p>
                <p className="text-white text-sm truncate overflow-hidden">{predictionData.goals.stretchGoal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conseils gamifiés */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4 overflow-hidden min-w-0">
          <h4 className="text-white font-semibold flex items-center mb-3 min-w-0">
            <Trophy className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
            <span className="truncate">Conseils pour maximiser votre progression</span>
          </h4>
          <div className="space-y-2 overflow-hidden min-w-0">
            {predictionData.trends.gamificationTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 min-w-0">
                <Star className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm truncate overflow-hidden flex-1 min-w-0">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="flex justify-center">
          <Button
            onClick={fetchPredictions}
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Actualiser les prédictions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 