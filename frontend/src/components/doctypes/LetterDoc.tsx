import React from 'react';
import { renderWithBlanks } from '@/components/doctypes/utils';

interface LetterDocProps {
  text: string;
  withBlanks?: boolean;
}

export function LetterDoc({ text, withBlanks = false }: LetterDocProps) {
  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* Letter label */}
      <div className="bg-gray-200 border-b border-gray-800 px-4 py-1.5">
        <span className="font-bold tracking-[0.3em] uppercase text-xs text-gray-700">Letter</span>
      </div>

      {/* Letter body — padded to simulate paper */}
      <div className="px-8 py-6 leading-relaxed whitespace-pre-wrap">
        {withBlanks ? renderWithBlanks(text) : text}
      </div>
    </div>
  );
}
