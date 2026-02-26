import React from 'react';
import { renderWithBlanks } from '@/components/doctypes/utils';

interface AdvertisementDocProps {
  text: string;
  withBlanks?: boolean;
}

export function AdvertisementDoc({ text, withBlanks = false }: AdvertisementDocProps) {
  const paragraphs = text.split(/\n\n+/);
  const headline = paragraphs[0] ?? '';
  const rest = paragraphs.slice(1);

  return (
    <div className="border-2 border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* Headline */}
      <div className="border-b-2 border-gray-800 px-5 py-3 text-center bg-gray-100">
        <p className="font-bold text-base tracking-wide">
          {withBlanks ? renderWithBlanks(headline) : headline}
        </p>
      </div>

      {/* Body sections */}
      <div className="px-5 py-4 space-y-3">
        {rest.map((para, i) => {
          const isCallout =
            para.toUpperCase() === para ||
            para.startsWith('Special') ||
            para.startsWith('★') ||
            /^\$\d/.test(para) ||
            para.toLowerCase().startsWith('call') ||
            para.toLowerCase().startsWith('visit') ||
            para.toLowerCase().startsWith('enroll');

          if (isCallout) {
            return (
              <div key={i} className="border border-gray-800 px-4 py-2 bg-gray-50 text-center font-semibold">
                {withBlanks ? renderWithBlanks(para) : para}
              </div>
            );
          }
          return (
            <p key={i} className="leading-relaxed whitespace-pre-wrap">
              {withBlanks ? renderWithBlanks(para) : para}
            </p>
          );
        })}
      </div>
    </div>
  );
}
