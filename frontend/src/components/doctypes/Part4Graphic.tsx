import React from 'react';
import type { Part4GraphicDocType } from '@/types/exam';

interface Part4GraphicProps {
  title: string;
  doctype: Part4GraphicDocType;
  data: Record<string, string>;
}

/** Parse a value like "5%" → 5 or "-2%" → -2 */
function parseNumeric(val: string): number {
  const m = val.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
}

/** Simple two-column table used for most graphic types */
function TwoColumnTable({
  entries,
  leftHeader,
  rightHeader,
}: {
  entries: [string, string][];
  leftHeader: string;
  rightHeader: string;
}) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-800 px-3 py-1.5 text-left font-bold text-xs uppercase tracking-wide">
            {leftHeader}
          </th>
          <th className="border border-gray-800 px-3 py-1.5 text-left font-bold text-xs uppercase tracking-wide">
            {rightHeader}
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([key, value], i) => (
          <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border border-gray-800 px-3 py-1.5">{key}</td>
            <td className="border border-gray-800 px-3 py-1.5">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Part4Graphic({ title, doctype, data }: Part4GraphicProps) {
  const entries = Object.entries(data) as [string, string][];

  function renderGraphic() {
    switch (doctype) {
      case 'directory':
        return <TwoColumnTable entries={entries} leftHeader="Location" rightHeader="Department / Section" />;

      case 'floor_plan':
        return <TwoColumnTable entries={entries} leftHeader="Room" rightHeader="Exhibit" />;

      case 'weather_chart':
        return <TwoColumnTable entries={entries} leftHeader="Day" rightHeader="Conditions" />;

      case 'schedule':
        return <TwoColumnTable entries={entries} leftHeader="Time" rightHeader="Event" />;

      case 'table':
        return <TwoColumnTable entries={entries} leftHeader="Plan" rightHeader="Details" />;

      case 'timeline': {
        return (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 px-3 py-1.5 text-left font-bold text-xs uppercase tracking-wide w-8">
                  #
                </th>
                <th className="border border-gray-800 px-3 py-1.5 text-left font-bold text-xs uppercase tracking-wide">
                  Milestone
                </th>
                <th className="border border-gray-800 px-3 py-1.5 text-left font-bold text-xs uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([milestone, status], i) => (
                <tr key={milestone} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-800 px-3 py-1.5 text-center text-gray-500">
                    {i + 1}
                  </td>
                  <td className="border border-gray-800 px-3 py-1.5">{milestone}</td>
                  <td className="border border-gray-800 px-3 py-1.5">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      case 'chart': {
        const values = entries.map(([, v]) => parseNumeric(v));
        const maxVal = Math.max(...values.map(Math.abs), 1);
        return (
          <div className="px-4 py-3">
            {/* Simple bar chart — monochrome */}
            <div className="flex items-end justify-around gap-3 h-24 border-b border-gray-800 mb-2">
              {entries.map(([label, val], i) => {
                const num = parseNumeric(val);
                const heightPct = (Math.abs(num) / maxVal) * 88;
                return (
                  <div key={label} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-xs font-bold text-gray-700">{val}</span>
                    <div
                      className={`w-full ${num < 0 ? 'bg-gray-400' : 'bg-gray-800'}`}
                      style={{ height: `${Math.max(heightPct, 4)}px` }}
                    />
                  </div>
                );
              })}
            </div>
            {/* X-axis labels */}
            <div className="flex justify-around gap-3">
              {entries.map(([label]) => (
                <div key={label} className="flex-1 text-center text-xs text-gray-600">
                  {label}
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return <TwoColumnTable entries={entries} leftHeader="Item" rightHeader="Value" />;
    }
  }

  return (
    <div className="bg-white">
      {/* Graphic title */}
      <div className="bg-gray-100 border-b border-gray-800 px-4 py-1.5">
        <p className="font-bold text-xs uppercase tracking-wider text-gray-800">{title}</p>
      </div>
      <div className="p-4">{renderGraphic()}</div>
    </div>
  );
}
