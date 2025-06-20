"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SpaceBackground } from "@/components/ui/SpaceBackground";
import { ArrowLeft, CheckCircle, Clock, Star } from "lucide-react";

const mockCourses = [
  {
    id: "1",
    title: "Introduction à React",
    description: "Apprenez les bases de React et créez vos premières interfaces.",
    image: "/public/react-course.jpg",
    status: "in-progress",
    progress: 45,
    favorite: true,
    modules: [
      { title: "Découverte de React", completed: true },
      { title: "JSX et composants", completed: true },
      { title: "Props et state", completed: false },
      { title: "Hooks de base", completed: false },
    ],
  },
  {
    id: "2",
    title: "TypeScript avancé",
    description: "Maîtrisez les types avancés et la programmation sûre.",
    image: "/public/typescript-course.jpg",
    status: "completed",
    progress: 100,
    favorite: false,
    modules: [
      { title: "Types avancés", completed: true },
      { title: "Génériques", completed: true },
      { title: "Utilitaires", completed: true },
    ],
  },
  // ... autres cours ...
];

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const course = mockCourses.find((c) => c.id === params?.id);

  if (!course) {
    // Redirige vers la 404 custom
    if (typeof window !== "undefined") router.replace("/404");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <SpaceBackground/>
        <div className="relative z-10 max-w-3xl mx-auto py-8">
          <Button
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux cours
          </Button>
          <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-48 w-full bg-gray-700 overflow-hidden flex items-center justify-center">
                <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white flex-1">{course.title}</h1>
                {course.favorite && <Star className="w-5 h-5 text-yellow-400" />}
              </div>
              <p className="text-gray-300 mb-4">{course.description}</p>
              <div className="flex items-center gap-3 mb-4">
                {course.status === "completed" && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20"><CheckCircle className="w-4 h-4 mr-1" /> Terminé</Badge>
                )}
                {course.status === "in-progress" && (
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20"><Clock className="w-4 h-4 mr-1" /> En cours</Badge>
                )}
                {course.status === "not-started" && (
                  <Badge variant="outline" className="border-gray-600 text-gray-300">À venir</Badge>
                )}
              </div>
              <Progress value={course.progress} className="mb-6 h-2 bg-gray-700" />
              <h2 className="text-lg font-semibold text-white mb-2">Modules</h2>
              <ul className="space-y-2 mb-6">
                {course.modules.map((mod, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={mod.completed ? "text-green-400" : "text-gray-400"}>
                      {mod.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </span>
                    <span className={mod.completed ? "text-white" : "text-gray-300"}>{mod.title}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Reprendre le cours</Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">Télécharger le support</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 