"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function CoursesApiListPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des cours.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tous les cours (API)</h1>
      {loading && <div className="text-center text-gray-400">Chargement…</div>}
      {error && <div className="text-center text-red-400">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading && !error && courses.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">Aucun cours trouvé.</div>
        )}
        {courses.map((course) => (
          <Card key={course.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col h-full hover:shadow-xl transition">
            <div className="font-bold text-lg mb-2 line-clamp-2">{course.title}</div>
            <div className="text-sm text-gray-400 mb-2 line-clamp-3">{course.description}</div>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              {course.platform && <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">{course.platform}</span>}
              {course.level && <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{course.level}</span>}
              {course.language && <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{course.language}</span>}
            </div>
            <div className="mt-auto flex flex-col gap-2">
              {course.url && (
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">Voir le cours</a>
              )}
              {course.provider && <span className="text-xs text-gray-500">Source: {course.provider}</span>}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
} 