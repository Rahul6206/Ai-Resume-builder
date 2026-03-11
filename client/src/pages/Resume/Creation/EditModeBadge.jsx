import React from "react";
import { Pencil } from "lucide-react";

const EditModeBadge = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center mb-8 animate-fade-up">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
        <Pencil size={14} />
        <span>Editing Resume Mode</span>
      </div>
    </div>
  );
};

export default EditModeBadge;
