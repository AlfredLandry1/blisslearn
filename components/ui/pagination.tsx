"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  variant?: "default" | "minimal" | "bliss";
}

const variantClasses = {
  default: {
    button:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    active: "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    disabled: "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed",
    info: "text-gray-600",
  },
  minimal: {
    button:
      "bg-transparent border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300",
    active: "bg-gray-900 border-gray-900 text-white hover:bg-gray-800",
    disabled: "bg-transparent border-gray-100 text-gray-300 cursor-not-allowed",
    info: "text-gray-500",
  },
  bliss: {
    button:
      "bg-gray-800/60 border border-gray-700 text-gray-300 hover:bg-gray-700/80 hover:border-gray-600 hover:text-white backdrop-blur-sm",
    active:
      "bg-blue-600/80 border-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-600/25",
    disabled:
      "bg-gray-800/30 border-gray-700/50 text-gray-500 cursor-not-allowed",
    info: "text-gray-400",
  },
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showInfo = true,
  variant = "bliss",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const baseButtonClasses =
    "h-9 px-3 text-sm font-medium transition-all duration-200";
  const classes = variantClasses[variant];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4",
        className
      )}
    >
      {showInfo && (
        <div className={cn("text-sm text-center sm:text-left", classes.info)}>
          Page {currentPage} sur {totalPages}
        </div>
      )}

      <div className="flex items-center gap-1">
        {/* Bouton précédent */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            baseButtonClasses,
            currentPage <= 1 ? classes.disabled : classes.button
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Page précédente</span>
        </Button>

        {/* Pages numérotées */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <div className="flex items-center justify-center w-9 h-9">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={cn(
                  baseButtonClasses,
                  currentPage === page ? classes.active : classes.button
                )}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* Bouton suivant */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            baseButtonClasses,
            currentPage >= totalPages ? classes.disabled : classes.button
          )}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Page suivante</span>
        </Button>
      </div>
    </div>
  );
}

// Composant de pagination avec sélecteur de page
interface PaginationWithSelectorProps extends PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export function PaginationWithSelector({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  itemsPerPageOptions = [6, 12, 24, 48],
  className,
  variant = "bliss",
}: PaginationWithSelectorProps) {
  const classes = variantClasses[variant];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-4",
        className
      )}
    >
      <div className={cn("text-sm text-center sm:text-left", classes.info)}>
        Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems}{" "}
        résultats
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        {/* Sélecteur d'éléments par page */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className={cn("text-sm", classes.info)}>Par page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className={cn(
                "px-2 py-1 text-sm rounded border transition-colors",
                variant === "bliss"
                  ? "bg-gray-800/60 border-gray-700 text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  : "bg-white border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              )}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showInfo={false}
          variant={variant}
        />
      </div>
    </div>
  );
}
