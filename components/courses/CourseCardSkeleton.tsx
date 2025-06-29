import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseCardSkeleton() {
  return (
    <Card className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-6 overflow-hidden">
      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Header avec titre et favori */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-3/4 rounded-lg bg-gray-700" />
        </div>
        <Skeleton className="h-9 w-9 rounded-lg bg-gray-700 flex-shrink-0" />
      </div>

      {/* Description */}
      <div className="relative z-10 mb-4">
        <Skeleton className="h-4 w-full rounded-lg bg-gray-700 mb-2" />
        <Skeleton className="h-4 w-2/3 rounded-lg bg-gray-700" />
      </div>

      {/* Informations principales */}
      <div className="relative z-10 space-y-3 mb-4">
        {/* Rating et statistiques */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12 rounded-lg bg-gray-700" />
          <Skeleton className="h-4 w-16 rounded-lg bg-gray-700" />
          <Skeleton className="h-4 w-14 rounded-lg bg-gray-700" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-md bg-gray-700" />
          <Skeleton className="h-6 w-16 rounded-md bg-gray-700" />
          <Skeleton className="h-6 w-18 rounded-md bg-gray-700" />
          <Skeleton className="h-6 w-24 rounded-md bg-gray-700" />
        </div>
      </div>

      {/* Compétences */}
      <div className="relative z-10 mb-4">
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16 rounded-lg bg-gray-700" />
          <Skeleton className="h-6 w-20 rounded-lg bg-gray-700" />
          <Skeleton className="h-6 w-14 rounded-lg bg-gray-700" />
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 space-y-3">
        {/* Bouton externe */}
        <Skeleton className="h-10 w-full rounded-lg bg-gray-700" />
        
        {/* Boutons d'action principaux */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg bg-gray-700" />
          <Skeleton className="h-10 w-full rounded-lg bg-gray-700" />
        </div>
      </div>
    </Card>
  );
} 