import React from "react";
import { Clock, Star, Users, Award, Calendar, Wallet } from "lucide-react";
import { PriceConverter } from "./PriceConverter";

interface CourseInfoProps {
  duration?: number | string;
  rating?: number | string;
  format?: string;
  certificate_type?: string;
  start_date?: string;
  price?: number | string;
  className?: string;
}

export const CourseInfo: React.FC<CourseInfoProps> = ({
  duration,
  rating,
  format,
  certificate_type,
  start_date,
  price,
  className
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Date invalide"
        : date.toLocaleDateString("fr-FR");
    } catch {
      return "Date invalide";
    }
  };

  const formatDuration = (duration: number | string | undefined) => {
    if (typeof duration === 'number') {
      return `${duration}h`;
    }
    return duration || "Non spécifiée";
  };

  const formatRating = (rating: number | string | undefined) => {
    if (typeof rating === 'number') {
      return `${rating}/5`;
    }
    if (typeof rating === 'string') {
      const numRating = parseFloat(rating);
      return !isNaN(numRating) ? `${numRating}/5` : "Non évalué";
    }
    return "Non évalué";
  };

  const formatPrice = (price: number | string | undefined) => {
    if (typeof price === 'number') {
      return price === 0 ? "Gratuit" : `${price}€`;
    }
    if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return !isNaN(numPrice) ? (numPrice === 0 ? "Gratuit" : `${numPrice}€`) : "Gratuit";
    }
    return "Gratuit";
  };

  const infoItems = [
    { icon: Clock, label: "Durée", value: formatDuration(duration) },
    { icon: Star, label: "Note", value: formatRating(rating) },
    { icon: Users, label: "Format", value: format || "Non spécifié" },
    { icon: Award, label: "Certificat", value: certificate_type || "Non spécifié" },
    ...(start_date ? [{ icon: Calendar, label: "Date de début", value: formatDate(start_date) }] : []),
    { 
      icon: Wallet, 
      label: "Prix", 
      value: price !== undefined ? (
        <PriceConverter 
          price={price}
          originalCurrency="EUR"
          displayCurrency="FCFA"
          size="sm"
          variant="default"
          asChild={true}
        />
      ) : "Gratuit"
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {infoItems.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <item.icon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">{item.label}</p>
            {typeof item.value === 'string' ? (
              <p className="text-white text-sm">{item.value}</p>
            ) : (
              <span className="text-white text-sm">{item.value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 