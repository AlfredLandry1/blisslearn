import React from "react";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, XCircle } from "lucide-react";

interface CourseActionsProps {
  onFavorite: () => void;
  onProgress: () => void;
  onAbandon: () => void;
  isFavorite: boolean;
  isInProgress: boolean;
  disabled?: boolean;
}

export const CourseActions: React.FC<CourseActionsProps> = ({
  onFavorite,
  onProgress,
  onAbandon,
  isFavorite,
  isInProgress,
  disabled
}) => (
  <div className="flex gap-2 mt-2">
    <Button
      variant={isFavorite ? "default" : "outline"}
      onClick={onFavorite}
      disabled={disabled}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Star className={isFavorite ? "text-yellow-400" : "text-gray-400"} size={18} />
    </Button>
    <Button
      variant={isInProgress ? "default" : "outline"}
      onClick={onProgress}
      disabled={disabled}
      aria-label={isInProgress ? "Gérer la progression" : "Commencer le cours"}
    >
      <CheckCircle className={isInProgress ? "text-green-400" : "text-gray-400"} size={18} />
    </Button>
    <Button
      variant="destructive"
      onClick={onAbandon}
      disabled={disabled}
      aria-label="Abandonner le cours"
    >
      <XCircle className="text-red-400" size={18} />
    </Button>
  </div>
); 