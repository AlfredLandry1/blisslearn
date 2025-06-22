import React from "react";

interface ProgressInfoProps {
  currentPosition?: string | null;
  timeSpent?: number | null;
  startedAt?: string | null;
  lastActivityAt?: string | null;
  className?: string;
}

export const ProgressInfo: React.FC<ProgressInfoProps> = ({
  currentPosition,
  timeSpent,
  startedAt,
  lastActivityAt,
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

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const infoItems = [
    ...(currentPosition ? [{ label: "Position actuelle", value: currentPosition }] : []),
    ...(timeSpent && timeSpent > 0 ? [{ label: "Temps passé", value: formatTime(timeSpent) }] : []),
    ...(startedAt ? [{ label: "Commencé le", value: formatDate(startedAt) }] : []),
    ...(lastActivityAt ? [{ label: "Dernière activité", value: formatDate(lastActivityAt) }] : [])
  ];

  if (infoItems.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {infoItems.map((item, index) => (
        <div key={index}>
          <p className="text-xs text-gray-400">{item.label}</p>
          <p className="text-white text-sm">{item.value}</p>
        </div>
      ))}
    </div>
  );
}; 