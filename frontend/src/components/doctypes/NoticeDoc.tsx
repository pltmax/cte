import React from 'react';
import { renderWithBlanks } from '@/components/doctypes/utils';

interface NoticeDocProps {
  text: string;
  withBlanks?: boolean;
}

export function NoticeDoc({ text, withBlanks = false }: NoticeDocProps) {
  const lines = text.split('\n');
  const title = lines[0] ?? '';
  const body = lines.slice(1).join('\n').trimStart();

  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* NOTICE label */}
      <div className="bg-gray-800 px-4 py-1.5 text-center">
        <span className="font-bold tracking-[0.3em] uppercase text-xs text-white">Notice</span>
      </div>

      {/* Title */}
      <div className="border-b border-gray-800 px-5 py-3 bg-gray-100">
        <p className="font-bold text-center text-gray-900">{title}</p>
      </div>

      {/* Body */}
      <div className="px-5 py-4 leading-relaxed whitespace-pre-wrap">
        {withBlanks ? renderWithBlanks(body) : body}
      </div>
    </div>
  );
}
