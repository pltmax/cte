import React from 'react';
import { parseHeaderBody, renderWithBlanks } from '@/components/doctypes/utils';

interface EmailDocProps {
  text: string;
  withBlanks?: boolean;
}

export function EmailDoc({ text, withBlanks = false }: EmailDocProps) {
  const { headers, body } = parseHeaderBody(text);

  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* Header rows */}
      {headers.length > 0 && (
        <div className="bg-gray-100 border-b border-gray-800">
          {headers.map(({ key, value }) => (
            <div
              key={key}
              className="flex border-b border-gray-300 last:border-b-0 px-4 py-1.5"
            >
              <span className="font-bold w-20 shrink-0 uppercase text-xs tracking-wide text-gray-700">
                {key}:
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
