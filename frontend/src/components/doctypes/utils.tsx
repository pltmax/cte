import React from 'react';

/** Blank span that replaces _______ in Part 6 texts */
export function Blank() {
  return (
    <span className="inline-block border-b border-gray-900 min-w-[64px] align-bottom mx-0.5" />
  );
}

/** Renders text, replacing every _______ with a Blank */
export function renderWithBlanks(text: string): React.ReactNode {
  const parts = text.split('_______');
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && <Blank />}
    </React.Fragment>
  ));
}

/** Parses leading "Key: Value\n" header lines from a document text block */
export function parseHeaderBody(text: string): {
  headers: { key: string; value: string }[];
  body: string;
} {
  const lines = text.split('\n');
  const headers: { key: string; value: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^(To|From|Date|Subject|Re|Cc|BCC|Sender):\s*(.+)$/i);
    if (m) {
      headers.push({ key: m[1], value: m[2] });
      i++;
    } else if (lines[i] === '' && headers.length > 0) {
      i++;
      break;
    } else {
      break;
    }
  }
  return { headers, body: lines.slice(i).join('\n') };
}
