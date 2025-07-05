"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/loading/spinner";
import {
  Filter,
  Search,
  X,
  ChevronDown,
  Sparkles,
  Target,
  Clock,
  Star,
  Globe,
  BookOpen,
  Zap,
  SlidersHorizontal,
  RefreshCw,
  Check,
} from "lucide-react";

export interface CourseFilters {
  search: string;
  status: string;
  platform: string;
  institution: string;
  level: string;
  language: string;
  format: string;
  price_numeric: number;
  rating: string;
  duration: string;
  favorite: string;
  sortBy: string;
  sortOrder: string;
  // Filtres spécifiques pour my-courses
  progressRange?: string;
  difficulty?: string;
  course_type?: string;
}

interface CourseFilterProps {
  filters: CourseFilters;
  onFiltersChange: (filters: Partial<CourseFilters>) => void;
  onReset: () => void;
  availableFilters?: {
    platforms?: string[];
    institutions?: string[];
    levels?: string[];
    languages?: string[];
    formats?: string[];
    course_types?: string[];
  };
  variant?: "explorer" | "my-courses";
  className?: string;
  isMobile?: boolean;
  isLoading?: boolean;
}

const defaultFilters: CourseFilters = {
  search: "",
  status: "all",
  platform: "all",
  institution: "all",
  level: "all",
  language: "all",
  format: "all",
  price_numeric: 0,
  rating: "all",
  duration: "all",
  favorite: "all",
  sortBy: "updatedAt",
  sortOrder: "desc",
  progressRange: "all",
  difficulty: "all",
  course_type: "all",
};

const statusOptions = [
  { value: "all", label: "Tous les statuts", icon: Target },
  { value: "not_started", label: "Non commencé", icon: Clock },
  { value: "in_progress", label: "En cours", icon: Zap },
  { value: "completed", label: "Terminé", icon: Star },
  { value: "paused", label: "En pause", icon: Clock },
  { value: "abandoned", label: "Abandonné", icon: X },
];

const levelOptions = [
  { value: "all", label: "Tous les niveaux" },
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
  { value: "expert", label: "Expert" },
];

const priceOptions = [
  { value: "all", label: "Tous les prix" },
  { value: "free", label: "Gratuit" },
  { value: "paid", label: "Payant" },
  { value: "subscription", label: "Abonnement" },
];

const ratingOptions = [
  { value: "all", label: "Toutes les notes" },
  { value: "4.5+", label: "4.5+ étoiles" },
  { value: "4.0+", label: "4.0+ étoiles" },
  { value: "3.5+", label: "3.5+ étoiles" },
];

const durationOptions = [
  { value: "all", label: "Toutes les durées" },
  { value: "0-2h", label: "0-2 heures" },
  { value: "2-5h", label: "2-5 heures" },
  { value: "5-10h", label: "5-10 heures" },
  { value: "10h+", label: "10+ heures" },
];

const progressOptions = [
  { value: "all", label: "Toute progression" },
  { value: "0-25", label: "0-25%" },
  { value: "25-50", label: "25-50%" },
  { value: "50-75", label: "50-75%" },
  { value: "75-100", label: "75-100%" },
];

const difficultyOptions = [
  { value: "all", label: "Toutes difficultés" },
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

const sortOptions = [
  { value: "updatedAt", label: "Dernière activité" },
  { value: "startedAt", label: "Date de début" },
  { value: "progressPercentage", label: "Progression" },
  { value: "rating", label: "Note" },
  { value: "title", label: "Titre" },
  { value: "platform", label: "Plateforme" },
];

export function CourseFilter({
  filters,
  onFiltersChange,
  onReset,
  availableFilters = {},
  variant = "explorer",
  className,
  isMobile = false,
  isLoading = false,
}: CourseFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<CourseFilters>(() => filters);
  const [searchValue, setSearchValue] = useState(() => filters.search);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ✅ CORRIGÉ : Synchronisation plus efficace sans dépendances instables
  useEffect(() => {
    setLocalFilters(filters);
    setSearchValue(filters.search);
    setHasUnsavedChanges(false);
  }, [filters]);

  // ✅ OPTIMISÉ : Callback mémorisé pour éviter les re-renders
  const handleFilterChange = useCallback((key: keyof CourseFilters, value: string) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      return newFilters;
    });
    setHasUnsavedChanges(true);
  }, []);

  // ✅ OPTIMISÉ : Gestion de la recherche sans latence
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    setLocalFilters(prev => ({ ...prev, search: value }));
    setHasUnsavedChanges(true);
  }, []);

  // ✅ CORRIGÉ : Callbacks mémorisés sans dépendances instables
  const applyFilters = useCallback(() => {
    onFiltersChange(localFilters);
    setHasUnsavedChanges(false);
    setIsOpen(false);
  }, [localFilters]);

  const resetFilters = useCallback(() => {
    setLocalFilters(defaultFilters);
    setSearchValue("");
    setHasUnsavedChanges(false);
    onReset();
    setIsOpen(false);
  }, []);

  // ✅ OPTIMISÉ : Calculs mémorisés
  const hasActiveFilters = useMemo(() => 
    Object.entries(filters).some(
      ([key, value]) => value !== defaultFilters[key as keyof CourseFilters]
    ), [filters]);

  const activeFiltersCount = useMemo(() => 
    Object.entries(filters).filter(
      ([key, value]) => value !== defaultFilters[key as keyof CourseFilters]
    ).length, [filters]);

    const FilterContent = () => (
    <div className="space-y-6">
      {/* Recherche */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-300">Recherche</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un cours, une compétence..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-gray-800/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Filtres principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Statut (spécifique à my-courses) */}
        {variant === "my-courses" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Statut</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      {option.icon && <option.icon className="w-4 h-4" />}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Plateforme */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Plateforme</Label>
          <Select
            value={localFilters.platform}
            onValueChange={(value) => handleFilterChange("platform", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Toutes les plateformes" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">
                Toutes les plateformes
              </SelectItem>
              {availableFilters.platforms?.map((platform) => (
                <SelectItem
                  key={platform}
                  value={platform}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fournisseur */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Fournisseur</Label>
          <Select
            value={localFilters.institution}
            onValueChange={(value) => handleFilterChange("institution", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Tous les fournisseurs" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">
                Tous les fournisseurs
              </SelectItem>
              {availableFilters.institutions?.map((institution) => (
                <SelectItem
                  key={institution}
                  value={institution}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {institution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Niveau */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Niveau</Label>
          <Select
            value={localFilters.level}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Tous les niveaux" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {levelOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Langue */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Langue</Label>
          <Select
            value={localFilters.language}
            onValueChange={(value) => handleFilterChange("language", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Toutes les langues" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">
                Toutes les langues
              </SelectItem>
              {availableFilters.languages?.map((language) => (
                <SelectItem
                  key={language}
                  value={language}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Format</Label>
          <Select
            value={localFilters.format}
            onValueChange={(value) => handleFilterChange("format", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Tous les formats" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">
                Tous les formats
              </SelectItem>
              {availableFilters.formats?.map((format) => (
                <SelectItem
                  key={format}
                  value={format}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prix */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Prix</Label>
          <Select
            value={localFilters.favorite}
            onValueChange={(value) => handleFilterChange("favorite", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Tous les prix" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {priceOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Note</Label>
          <Select
            value={localFilters.rating}
            onValueChange={(value) => handleFilterChange("rating", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Toutes les notes" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {ratingOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Durée */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-300">Durée</Label>
          <Select
            value={localFilters.duration}
            onValueChange={(value) => handleFilterChange("duration", value)}
          >
            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
              <SelectValue placeholder="Toutes les durées" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {durationOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtres spécifiques pour my-courses */}
      {variant === "my-courses" && (
        <>
          <Separator className="bg-gray-700" />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-medium text-gray-300">Filtres spécifiques</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Progression */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Progression</Label>
                <Select
                  value={localFilters.progressRange}
                  onValueChange={(value) => handleFilterChange("progressRange", value)}
                >
                  <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Toute progression" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {progressOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulté */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Difficulté</Label>
                <Select
                  value={localFilters.difficulty}
                  onValueChange={(value) => handleFilterChange("difficulty", value)}
                >
                  <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Toutes difficultés" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {difficultyOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type de certificat */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Certificat</Label>
                <Select
                  value={localFilters.course_type}
                  onValueChange={(value) => handleFilterChange("course_type", value)}
                >
                  <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Tous les certificats" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">
                      Tous les certificats
                    </SelectItem>
                    {availableFilters.course_types?.map((course_type) => (
                      <SelectItem
                        key={course_type}
                        value={course_type}
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        {course_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tri */}
      <Separator className="bg-gray-700" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-medium text-gray-300">Tri</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Trier par</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
                <SelectValue placeholder="Sélectionner un critère" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-gray-300 hover:bg-gray-700"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Ordre</Label>
            <Select
              value={localFilters.sortOrder}
              onValueChange={(value) => handleFilterChange("sortOrder", value)}
            >
              <SelectTrigger className="bg-gray-800/60 border-gray-700 text-gray-300">
                <SelectValue placeholder="Ordre" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="desc" className="text-gray-300 hover:bg-gray-700">
                  Décroissant
                </SelectItem>
                <SelectItem value="asc" className="text-gray-300 hover:bg-gray-700">
                  Croissant
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ✅ NOUVEAU : Actions avec bouton Appliquer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={applyFilters}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium"
          disabled={!hasUnsavedChanges}
        >
          <Check className="w-4 h-4 mr-2" />
          Appliquer les filtres
        </Button>
        <Button
          onClick={resetFilters}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      {/* ✅ NOUVEAU : Indicateur de changements non sauvegardés */}
      {hasUnsavedChanges && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm text-center">
            ⚠️ Des changements sont en attente. Cliquez sur "Appliquer les filtres" pour les activer.
          </p>
        </div>
      )}
    </div>
  );

  // Version mobile avec Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200",
              hasActiveFilters && "border-blue-500 text-blue-400 bg-blue-500/10",
              hasUnsavedChanges && "border-yellow-500 text-yellow-400 bg-yellow-500/10",
              className
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtres</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 bg-blue-500 text-white">
                {activeFiltersCount}
              </Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="ml-1 bg-yellow-500 text-white">
                !
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] bg-gray-900 border-gray-700">
          <SheetHeader className="border-b border-gray-700 pb-4">
            <SheetTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtres avancés
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 overflow-y-auto">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Version desktop avec bouton et card conditionnelle
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200",
          hasActiveFilters && "border-blue-500 text-blue-400 bg-blue-500/10",
          hasUnsavedChanges && "border-yellow-500 text-yellow-400 bg-yellow-500/10",
          className
        )}
      >
        <Filter className="w-4 h-4" />
        <span>Filtres</span>
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-1 bg-blue-500 text-white">
            {activeFiltersCount}
          </Badge>
        )}
        {hasUnsavedChanges && (
          <Badge variant="secondary" className="ml-1 bg-yellow-500 text-white">
            !
          </Badge>
        )}
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </Button>
      
      {isOpen && (
        <Card className="border-gray-700">
          <CardHeader className="border-b border-gray-700 pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Filtres avancés
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <FilterContent />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 