import React from 'react';
import { renderWithBlanks } from '@/components/doctypes/utils';

interface ArticleDocProps {
  text: string;
  withBlanks?: boolean;
}

export function ArticleDoc({ text, withBlanks = false }: ArticleDocProps) {
  const firstNewline = text.indexOf('\n');
  const headline = firstNewline >= 0 ? text.slice(0, firstNewline) : text;
  const body = firstNewline >= 0 ? text.slice(firstNewline + 1).trimStart() : '';

  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* Article label */}
      <div className="bg-gray-200 border-b border-gray-800 px-4 py-1.5">
        <span className="font-bold tracking-[0.3em] uppercase text-xs text-gray-700">Article</span>
      </div>

      <div className="px-5 pt-4 pb-5">
        {/* Headline */}
        <h2 className="font-bold text-base text-gray-900 leading-snug mb-2">{headline}</h2>
        {/* Rule */}
        <div className="border-t-2 border-gray-800 mb-1" />
        <div className="border-t border-gray-400 mb-4" />
        {/* Body */}
        <div className="leading-relaxed whitespace-pre-wrap">
          {withBlanks ? renderWithBlanks(body) : body}
        </div>
      </div>
    </div>
  );
}
