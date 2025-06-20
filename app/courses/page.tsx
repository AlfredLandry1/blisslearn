import React from "react";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Composant Select natif pour éviter les erreurs de typage
function NativeSelect({ name, defaultValue, options, label }: { name: string; defaultValue?: string; options: string[]; label: string }) {
  return (
    <select name={name} defaultValue={defaultValue} className="w-40 bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-2">
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

async function getCourses({
  search = "",
  platform = "",
  level = "",
  language = "",
}: {
  search?: string;
  platform?: string;
  level?: string;
  language?: string;
}) {
  return await prisma.course.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {},
        platform ? { platform: { equals: platform } } : {},
        level ? { level: { equals: level } } : {},
        language ? { language: { equals: language } } : {},
      ],
    },
    orderBy: { title: "asc" },
    take: 40,
  });
}

export default async function CoursesPage({ searchParams }: any) {
  const search = searchParams?.search || "";
  const platform = searchParams?.platform || "";
  const level = searchParams?.level || "";
  const language = searchParams?.language || "";
  const courses = await getCourses({ search, platform, level, language });

  // Récupération des valeurs uniques pour les filtres
  const allCourses = await prisma.course.findMany({ select: { platform: true, level: true, language: true } });
  const platforms = Array.from(new Set(allCourses.map((c: any) => c.platform).filter(Boolean)));
  const levels = Array.from(new Set(allCourses.map((c: any) => c.level).filter(Boolean)));
  const languages = Array.from(new Set(allCourses.map((c: any) => c.language).filter(Boolean)));

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tous les cours disponibles</h1>
      <form className="flex flex-wrap gap-4 mb-8 items-end">
        <Input
          name="search"
          placeholder="Rechercher un cours, une compétence..."
          defaultValue={search}
          className="w-64"
        />
        <NativeSelect name="platform" defaultValue={platform} options={platforms} label="Plateforme" />
        <NativeSelect name="level" defaultValue={level} options={levels} label="Niveau" />
        <NativeSelect name="language" defaultValue={language} options={languages} label="Langue" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow">Filtrer</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">Aucun cours trouvé.</div>
        )}
        {courses.map((course: any) => (
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