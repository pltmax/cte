import React from 'react';
import { parseHeaderBody, renderWithBlanks } from '@/components/doctypes/utils';

interface MemoDocProps {
  text: string;
  withBlanks?: boolean;
}

export function MemoDoc({ text, withBlanks = false }: MemoDocProps) {
  const { headers, body } = parseHeaderBody(text);

  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* MEMO banner */}
      <div className="bg-gray-200 border-b border-gray-800 px-4 py-2 text-center">
        <span className="font-bold tracking-[0.3em] uppercase text-sm">Memorandum</span>
      </div>

      {/* Header fields */}
      {headers.length > 0 && (
        <div className="bg-gray-100 border-b border-gray-800">
          {headers.map(({ key, value }) => (
            <div key={key} className="flex border-b border-gray-300 last:border-b-0 px-4 py-1.5">
              <span className="font-bold w-20 shrink-0 uppercase text-xs tracking-wide text-gray-700">
                {key === 'Subject' ? 'Subject' : key}:
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="px-5 py-4 leading-relaxed whitespace-pre-wrap">
        {withBlanks ? renderWithBlanks(body) : body}
      </div>
    </div>
  );
}
