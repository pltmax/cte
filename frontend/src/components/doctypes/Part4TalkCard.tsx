import React from 'react';
import type { Part4Talk } from '@/types/exam';
import { Part4Graphic } from '@/components/doctypes/Part4Graphic';

interface Part4TalkCardProps {
  talk: Part4Talk;
  questionRange?: string; // e.g. "71–73"
}

export function Part4TalkCard({ talk, questionRange }: Part4TalkCardProps) {
  return (
    <div className="border border-gray-800 bg-white text-sm text-gray-900 max-w-2xl">
      {/* Talk type header — mimics ETS instruction line */}
      <div className="bg-gray-100 border-b border-gray-800 px-5 py-2">
        <p className="text-xs text-gray-700">
          {questionRange && (
            <span className="font-bold">Questions {questionRange} </span>
          )}
          <span>
            refer to the following{' '}
            <span className="font-bold">{talk.title.toLowerCase()}</span>.
          </span>
        </p>
      </div>

      {/* Graphic — shown above questions in ETS format when present */}
      {talk.graphic && talk.graphic_doctype && talk.graphic_title && (
        <div className="border-b border-gray-800">
          <Part4Graphic
            title={talk.graphic_title}
            doctype={talk.graphic_doctype}
            data={talk.graphic}
          />
        </div>
      )}
    </div>
  );
}
