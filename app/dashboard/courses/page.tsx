"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Flame,
  List,
  LayoutGrid,
  Trash,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

const mockCourses = [
  {
    id: "1",
    title: "Introduction à React",
    description:
      "Apprenez les bases de React et créez vos premières interfaces.",
    image: "/public/react-course.jpg",
    status: "in-progress",
    progress: 45,
    favorite: true,
  },
  {
    id: "2",
    title: "TypeScript avancé",
    description: "Maîtrisez les types avancés et la programmation sûre.",
    image: "/public/typescript-course.jpg",
    status: "completed",
    progress: 100,
    favorite: false,
  },
  {
    id: "3",
    title: "Node.js pour les débutants",
    description: "Créez des APIs robustes avec Node.js et Express.",
    image: "/public/node-course.jpg",
    status: "not-started",
    progress: 0,
    favorite: false,
  },
  {
    id: "4",
    title: "Next.js Fullstack",
    description: "Développez des applications web modernes avec Next.js.",
    image: "/public/nextjs-course.jpg",
    status: "in-progress",
    progress: 70,
    favorite: true,
  },
  {
    id: "5",
    title: "CSS Moderne",
    description: "Flexbox, Grid, animations et design responsive.",
    image: "/public/css-course.jpg",
    status: "completed",
    progress: 100,
    favorite: false,
  },
];

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "in-progress", label: "En cours" },
  { id: "completed", label: "Terminés" },
  { id: "not-started", label: "À venir" },
  { id: "favorite", label: "Favoris" },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"card" | "list">("card");

  const filteredCourses = useMemo(() => {
    let courses = mockCourses;
    if (filter !== "all") {
      if (filter === "favorite") {
        courses = courses.filter((c) => c.favorite);
      } else {
        courses = courses.filter((c) => c.status === filter);
      }
    }
    if (search.trim()) {
      courses = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return courses;
  }, [search, filter]);

  // Stats header
  const total = mockCourses.length;
  const completed = mockCourses.filter((c) => c.status === "completed").length;
  const inProgress = mockCourses.filter(
    (c) => c.status === "in-progress"
  ).length;
  const notStarted = mockCourses.filter(
    (c) => c.status === "not-started"
  ).length;
  const globalProgress = Math.round(
    mockCourses.reduce((acc, c) => acc + c.progress, 0) / (total || 1)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header enrichi */}
        <div className="mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-400" /> Mes cours
            </h1>
            <div className="flex flex-wrap gap-3 items-center text-sm mb-2">
              <span className="text-gray-400">{total} cours</span>
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> {completed} terminés
              </span>
              <span className="text-blue-400 flex items-center gap-1">
                <Flame className="w-4 h-4" /> {inProgress} en cours
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {notStarted} à venir
              </span>
            </div>
            <div className="flex items-center mb-6 gap-2">
              <span className="text-gray-400 text-xs">Progression globale</span>
              <Progress
                value={globalProgress}
                className="w-32 h-2 bg-gray-700"
              />
              <span className="text-white text-xs font-bold">
                {globalProgress}%
              </span>
            </div>
          </div>
          <Input
            placeholder="Rechercher un cours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 bg-gray-800 border-gray-600 text-white focus:border-blue-500"
          />
        </div>

        {/* Filtres + Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 justify-between">
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <Button
                key={f.id}
                variant={filter === f.id ? "default" : "outline"}
                className={
                  filter === f.id
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : "border-gray-600 text-gray-300"
                }
                onClick={() => setFilter(f.id)}
                size="sm"
              >
                {f.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700 rounded-xl shadow-md p-1">
            <Button
              variant={view === "card" ? "default" : "outline"}
              size="icon"
              aria-label="Vue cartes"
              onClick={() => setView("card")}
              className={
                view === "card"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30 ring-2 ring-blue-400"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:text-white"
              }
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              aria-label="Vue liste"
              onClick={() => setView("list")}
              className={
                view === "list"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30 ring-2 ring-blue-400"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:text-white"
              }
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Vue liste/tableau */}
        {view === "list" ? (
          <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800/60 to-gray-900/80 shadow-lg backdrop-blur-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-gray-400 py-8"
                    >
                      Aucun cours trouvé.
                    </TableCell>
                  </TableRow>
                )}
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-semibold text-white max-w-[180px] truncate">
                      {course.id}
                    </TableCell>
                    <TableCell className="text-gray-400 max-w-[220px] truncate">
                      {course.description}
                    </TableCell>
                    <TableCell>
                      {course.status === "completed" && (
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          Terminé
                        </Badge>
                      )}
                      {course.status === "in-progress" && (
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          En cours
                        </Badge>
                      )}
                      {course.status === "not-started" && (
                        <Badge
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          À venir
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={course.progress}
                          className="w-24 h-2 bg-gray-700"
                        />
                        <span className="text-xs text-white font-bold w-8 text-right">
                          {course.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="font-semibold"
                        disabled={course.status === "not-started"}
                      >
                        {course.status === "completed"
                          ? "Revoir"
                          : course.status === "in-progress"
                          ? "Continuer"
                          : "Bientôt"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="font-semibold text-gray-400 hover:text-red-400"
                        disabled={course.status === "not-started"}
                      >
                        {course.status === "completed" ||
                        course.status === "in-progress" ? (
                          <Trash2 className="w-5 h-5" />
                        ) : (
                          <Trash className="w-5 h-5" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Grille de cours modernisée */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12">
                Aucun cours trouvé.
              </div>
            )}
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group bg-gradient-to-br from-gray-800/70 to-gray-900/80 border-gray-700 flex flex-col h-full shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-200 relative overflow-hidden min-h-[220px]"
              >
                <CardHeader className="p-0 relative">
                  <div className="h-32 w-full bg-gray-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.favorite && (
                      <Star className="absolute top-2 right-2 w-6 h-6 text-yellow-400 drop-shadow-lg" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white flex-1 truncate group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    {course.status === "completed" && (
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        <CheckCircle className="w-3 h-3 mr-1" /> Terminé
                      </Badge>
                    )}
                    {course.status === "in-progress" && (
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <Flame className="w-3 h-3 mr-1 animate-pulse" /> En
                        cours
                      </Badge>
                    )}
                    {course.status === "not-started" && (
                      <Badge
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        À venir
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Progress
                      value={course.progress}
                      className="flex-1 h-2 bg-gray-700"
                    />
                    <span className="text-xs text-white font-bold w-8 text-right">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <Button
                      className="mt-auto font-semibold"
                      variant="default"
                      disabled={course.status === "not-started"}
                    >
                      {course.status === "completed"
                        ? "Revoir le cours"
                        : course.status === "in-progress"
                        ? "Continuer"
                        : "Bientôt disponible"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="font-semibold text-gray-400 hover:text-red-400"
                      disabled={course.status === "not-started"}
                    >
                      {course.status === "completed" ||
                      course.status === "in-progress" ? (
                        <Trash2 className="w-5 h-5" />
                      ) : (
                        <Trash className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
