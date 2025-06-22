import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ value, onChange, disabled, className }) => (
  <Textarea
    className={className}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder="Ajoutez vos notes personnelles ici..."
    disabled={disabled}
    rows={5}
  />
); 