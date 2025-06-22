import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseCardSkeleton() {
  return (
    <Card className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col h-full space-y-4">
      <Skeleton className="h-5 w-3/4 rounded-lg bg-gray-700" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg bg-gray-700" />
        <Skeleton className="h-4 w-5/6 rounded-lg bg-gray-700" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-20 rounded-md bg-gray-700" />
        <Skeleton className="h-5 w-16 rounded-md bg-gray-700" />
      </div>
      <div className="mt-auto pt-4 flex justify-between items-center">
        <Skeleton className="h-5 w-24 rounded-lg bg-gray-700" />
        <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
      </div>
    </Card>
  );
} 