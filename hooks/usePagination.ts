import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UsePaginationOptions {
  defaultPage?: number;
  defaultItemsPerPage?: number;
  itemsPerPageOptions?: number[];
  syncWithUrl?: boolean;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const {
    defaultPage = 1,
    defaultItemsPerPage = 12,
    itemsPerPageOptions = [6, 12, 24, 48],
    syncWithUrl = true,
    onPageChange,
    onItemsPerPageChange
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();

  // État local
  const [localPage, setLocalPage] = useState(defaultPage);
  const [localItemsPerPage, setLocalItemsPerPage] = useState(defaultItemsPerPage);
  const [totalItems, setTotalItems] = useState(0);

  // Récupération des paramètres depuis l'URL si syncWithUrl est activé
  const currentPage = useMemo(() => {
    if (syncWithUrl) {
      const urlPage = searchParams?.get('page');
      return urlPage ? parseInt(urlPage, 10) : defaultPage;
    }
    return localPage;
  }, [syncWithUrl, searchParams, defaultPage, localPage]);

  const itemsPerPage = useMemo(() => {
    if (syncWithUrl) {
      const urlLimit = searchParams?.get('limit');
      return urlLimit ? parseInt(urlLimit, 10) : defaultItemsPerPage;
    }
    return localItemsPerPage;
  }, [syncWithUrl, searchParams, defaultItemsPerPage, localItemsPerPage]);

  // Calculs de pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Fonction pour mettre à jour l'URL
  const updateUrl = useCallback((newPage: number, newItemsPerPage?: number) => {
    if (!syncWithUrl) return;

    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    
    if (newItemsPerPage) {
      params.set('limit', newItemsPerPage.toString());
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [syncWithUrl, searchParams, router]);

  // Fonction pour changer de page
  const handlePageChange = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    
    if (syncWithUrl) {
      updateUrl(validPage);
    } else {
      setLocalPage(validPage);
    }
    
    onPageChange?.(validPage);
  }, [syncWithUrl, totalPages, updateUrl, onPageChange]);

  // Fonction pour changer le nombre d'éléments par page
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    if (syncWithUrl) {
      updateUrl(1, newItemsPerPage); // Retour à la première page
    } else {
      setLocalItemsPerPage(newItemsPerPage);
      setLocalPage(1);
    }
    
    onItemsPerPageChange?.(newItemsPerPage);
  }, [syncWithUrl, updateUrl, onItemsPerPageChange]);

  // Fonction pour réinitialiser la pagination
  const resetPagination = useCallback(() => {
    if (syncWithUrl) {
      updateUrl(defaultPage, defaultItemsPerPage);
    } else {
      setLocalPage(defaultPage);
      setLocalItemsPerPage(defaultItemsPerPage);
    }
  }, [syncWithUrl, defaultPage, defaultItemsPerPage, updateUrl]);

  // Fonction pour aller à la première page
  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  // Fonction pour aller à la dernière page
  const goToLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [handlePageChange, totalPages]);

  // Fonction pour aller à la page précédente
  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, handlePageChange]);

  // Fonction pour aller à la page suivante
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  }, [hasNextPage, currentPage, handlePageChange]);

  // État de pagination
  const paginationState: PaginationState = {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };

  return {
    // État
    ...paginationState,
    
    // Actions
    setTotalItems,
    handlePageChange,
    handleItemsPerPageChange,
    resetPagination,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
    
    // Utilitaires
    itemsPerPageOptions,
    offset: (currentPage - 1) * itemsPerPage,
  };
}

// Hook spécialisé pour les cours
export function useCoursePagination(options: UsePaginationOptions = {}) {
  const pagination = usePagination({
    defaultItemsPerPage: 12,
    itemsPerPageOptions: [6, 12, 24, 48],
    syncWithUrl: true,
    ...options
  });

  return pagination;
}

// Hook spécialisé pour les cours de l'utilisateur
export function useMyCoursesPagination(options: UsePaginationOptions = {}) {
  const pagination = usePagination({
    defaultItemsPerPage: 12,
    itemsPerPageOptions: [6, 12, 24, 48],
    syncWithUrl: true,
    ...options
  });

  return pagination;
} 