import React from "react";
import { Badge } from "@/components/ui/badge";

interface CourseSkillsProps {
  skills: string[];
  className?: string;
}

export const CourseSkills: React.FC<CourseSkillsProps> = ({ skills, className }) => {
  if (!skills || skills.length === 0) return null;
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}; 