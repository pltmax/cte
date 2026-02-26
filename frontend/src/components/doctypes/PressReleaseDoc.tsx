import React from 'react';
import { renderWithBlanks } from '@/components/doctypes/utils';

interface PressReleaseDocProps {
  text: string;
  withBlanks?: boolean;
}

export function PressReleaseDoc({ text, withBlanks = false }: PressReleaseDocProps) {
  let body = text;
  let hasReleaseHeader = false;

  if (text.toLowerCase().startsWith('for immediate release')) {
    hasReleaseHeader = true;
    body = text.slice(text.indexOf('\n') + 1).trimStart();
  }

  // Detect CITY, ST — dateline
  const datelineMatch = body.match(/^([A-Z][A-Z\s,]+(?:[A-Z]{2})?)\s*—\s*/);
  let dateline = '';
  let mainBody = body;
  if (datelineMatch) {
    dateline = datelineMatch[1].trim();
    mainBody = body.slice(datelineMatch.index! + datelineMatch[0].length);
  }

  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* FOR IMMEDIATE RELEASE header */}
      <div className="bg-gray-200 border-b border-gray-800 px-5 py-2 flex items-center justify-between">
        <span className="font-bold tracking-[0.2em] uppercase text-xs text-gray-800">
          {hasReleaseHeader ? 'For Immediate Release' : 'Press Release'}
        </span>
      </div>

      <div className="px-5 py-4">
        {/* Dateline */}
        {dateline && (
          <p className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-3">
            {dateline} —
          </p>
        )}

        {/* Body */}
        <div className="leading-relaxed whitespace-pre-wrap">
          {withBlanks ? renderWithBlanks(mainBody) : mainBody}
        </div>

        {/* ### end-of-release marker */}
        <p className="mt-6 text-center font-bold tracking-widest text-gray-500 text-sm">###</p>
      </div>
    </div>
  );
}
