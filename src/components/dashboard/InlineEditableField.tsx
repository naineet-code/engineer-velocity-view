
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Edit2 } from "lucide-react";

interface InlineEditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: "text" | "date";
  className?: string;
}

export const InlineEditableField = ({ 
  value, 
  onSave, 
  type = "text", 
  className = "" 
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          type={type}
          className="h-8 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <Button size="sm" variant="ghost" onClick={handleSave}>
          <Check size={14} className="text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          <X size={14} className="text-red-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 group ${className}`}>
      <span>{value}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 size={12} />
      </Button>
    </div>
  );
};
