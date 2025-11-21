'use client';

import { Sparkles } from 'lucide-react';

type ExplainButtonProps = {
  label?: string;
  onClick: () => void;
  className?: string;
};

export function ExplainButton({ label = 'Explain this chart', onClick, className = '' }: ExplainButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
