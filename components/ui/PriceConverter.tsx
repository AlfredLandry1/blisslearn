import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, RefreshCw } from 'lucide-react';

interface PriceConverterProps {
  price: number | string;
  originalCurrency?: 'EUR' | 'FCFA';
  displayCurrency?: 'EUR' | 'FCFA';
  showToggle?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'badge' | 'button';
  asChild?: boolean;
}

// Taux de change EUR vers FCFA (1 EUR = ~655.957 FCFA)
const EUR_TO_FCFA_RATE = 655.957;
const FCFA_TO_EUR_RATE = 1 / EUR_TO_FCFA_RATE;

export function PriceConverter({
  price,
  originalCurrency = 'EUR',
  displayCurrency = 'FCFA',
  showToggle = false,
  className = '',
  size = 'md',
  variant = 'default',
  asChild = false
}: PriceConverterProps) {
  const [currentCurrency, setCurrentCurrency] = useState<'EUR' | 'FCFA'>(displayCurrency);
  const [convertedPrice, setConvertedPrice] = useState<number>(0);

  // Convertir le prix
  const convertPrice = (priceValue: number, from: 'EUR' | 'FCFA', to: 'EUR' | 'FCFA'): number => {
    if (from === to) return priceValue;
    
    if (from === 'EUR' && to === 'FCFA') {
      return priceValue * EUR_TO_FCFA_RATE;
    } else if (from === 'FCFA' && to === 'EUR') {
      return priceValue * FCFA_TO_EUR_RATE;
    }
    
    return priceValue;
  };

  // Formater le prix selon la devise
  const formatPrice = (priceValue: number, currency: 'EUR' | 'FCFA'): string => {
    if (currency === 'EUR') {
      return priceValue === 0 ? 'Gratuit' : `${priceValue.toFixed(2)}€`;
    } else {
      return priceValue === 0 ? 'Gratuit' : `${Math.round(priceValue).toLocaleString('fr-FR')} FCFA`;
    }
  };

  // Mettre à jour le prix converti quand les props changent
  useEffect(() => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) || 0 : price;
    const converted = convertPrice(numericPrice, originalCurrency, currentCurrency);
    setConvertedPrice(converted);
  }, [price, originalCurrency, currentCurrency]);

  // Toggle entre les devises
  const toggleCurrency = () => {
    setCurrentCurrency(currentCurrency === 'EUR' ? 'FCFA' : 'EUR');
  };

  // Styles selon la taille
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-lg font-semibold';
      default:
        return 'text-sm';
    }
  };

  // Rendu selon le variant
  const renderPrice = () => {
    const priceText = formatPrice(convertedPrice, currentCurrency);
    const sizeStyles = getSizeStyles();

    switch (variant) {
      case 'badge':
        return (
          <Badge 
            className={`bg-green-500/20 text-green-400 border-green-500/30 ${sizeStyles} ${className}`}
          >
            <Wallet className="w-3 h-3 mr-1" />
            {priceText}
          </Badge>
        );
      
      case 'button':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={showToggle ? toggleCurrency : undefined}
            className={`border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white ${className}`}
          >
            <Wallet className="w-3 h-3 mr-1" />
            {priceText}
            {showToggle && <RefreshCw className="w-3 h-3 ml-1" />}
          </Button>
        );
      
      default:
        if (asChild) {
          return (
            <span className={`text-green-400 font-medium ${sizeStyles} ${className}`}>
              {priceText}
            </span>
          );
        }
        return (
          <span className={`text-green-400 font-medium ${sizeStyles} ${className}`}>
            {priceText}
          </span>
        );
    }
  };

  if (asChild) {
    return renderPrice();
  }

  return (
    <div className="flex items-center gap-2">
      {renderPrice()}
      {showToggle && variant !== 'button' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCurrency}
          className="text-gray-400 hover:text-white p-1 h-6 w-6"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

// Hook personnalisé pour la conversion de prix
export function usePriceConverter() {
  const convertEURtoFCFA = (priceEUR: number): number => {
    return priceEUR * EUR_TO_FCFA_RATE;
  };

  const convertFCFAtoEUR = (priceFCFA: number): number => {
    return priceFCFA * FCFA_TO_EUR_RATE;
  };

  const formatEUR = (price: number): string => {
    return price === 0 ? 'Gratuit' : `${price.toFixed(2)}€`;
  };

  const formatFCFA = (price: number): string => {
    return price === 0 ? 'Gratuit' : `${Math.round(price).toLocaleString('fr-FR')} FCFA`;
  };

  return {
    convertEURtoFCFA,
    convertFCFAtoEUR,
    formatEUR,
    formatFCFA,
    EUR_TO_FCFA_RATE,
    FCFA_TO_EUR_RATE
  };
} 