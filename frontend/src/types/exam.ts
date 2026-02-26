export type ReadingDocType =
  | 'email'
  | 'memo'
  | 'notice'
  | 'letter'
  | 'advertisement'
  | 'article'
  | 'press_release';

export type Part4GraphicDocType =
  | 'directory'
  | 'weather_chart'
  | 'schedule'
  | 'chart'
  | 'timeline'
  | 'floor_plan'
  | 'table';

export interface ReadingDoc {
  doctype: ReadingDocType;
  text: string;
  withBlanks?: boolean;
}

export interface Part4Talk {
  title: string;
  text: string;
  graphic_title: string | null;
  graphic_doctype: Part4GraphicDocType | null;
  graphic: Record<string, string> | null;
}
