import React from "react";
import { Clock, Star, Users, Award, Calendar, Wallet } from "lucide-react";

interface CourseInfoProps {
  duration?: string;
  rating?: number;
  format?: string;
  certificate_type?: string;
  start_date?: string;
  price?: string;
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

  const infoItems = [
    { icon: Clock, label: "Durée", value: duration || "Non spécifiée" },
    { icon: Star, label: "Note", value: rating && !isNaN(rating) ? `${rating}/5` : "Non évalué" },
    { icon: Users, label: "Format", value: format || "Non spécifié" },
    { icon: Award, label: "Certificat", value: certificate_type || "Non spécifié" },
    ...(start_date ? [{ icon: Calendar, label: "Date de début", value: formatDate(start_date) }] : []),
    { icon: Wallet, label: "Prix", value: price || "Gratuit" }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {infoItems.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <item.icon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="text-white text-sm">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 