/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoleMode = 'Researcher' | 'Editor' | 'Archivist';

export interface Article {
  id: string;
  topics: string[]; // Association with core topics
  title: string;
  publication: string;
  year: number;
  author: string | null;
  snippet: string;
  fullExcerpt: string;
  ocrConfidence: number; // 0.0 to 1.0
  documentType: 'Editorial' | 'Feature Article' | 'Review' | 'Letter to Editor' | 'Reportage' | 'Academic Essay' | 'Manifesto';
  language: 'Ukrainian' | 'Yiddish' | 'Polish' | 'German' | 'Russian';
  themes: string[];
  people: string[];
  places: string[];
  organizations: string[];
  reasonBadge: 
    | 'High relevance'
    | 'Representative year'
    | 'Representative publication'
    | 'Key entity'
    | 'Bridge article'
    | 'Rare but important'
    | 'High OCR confidence'
    | 'Quality warning';
  // Context & Metadata details
  issueNumber?: string;
  pageRange?: string;
  physicalCondition?: 'Excellent' | 'Good' | 'Brittle' | 'Faded' | 'Water Damaged';
  preservationSignal?: 'Archived' | 'Needs Digitization Review' | 'Flagged for Rescan' | 'Restricted Access';
  metadataGaps?: string[];
  archivalNotes?: string;
  editorialSnippet?: string; // Highlighting story angles
}

export interface ActiveFilters {
  searchQuery: string;
  selectedYear: number | null;
  publications: string[];
  authors: string[];
  documentTypes: string[];
  languages: string[];
  themes: string[];
  people: string[];
  places: string[];
  organizations: string[];
  highConfidenceOnly: boolean;
  ocrQuality: 'all' | 'high' | 'low';
}

export interface TopicOverview {
  topic: string;
  articlesCount: number;
  issuesCount: number;
  publicationsCovered: number;
  yearRange: string;
  avgOcrConfidence: number;
  narrativeText: {
    Researcher: string;
    Editor: string;
    Archivist: string;
  };
}

export interface SavedOutput {
  id: string;
  title: string;
  publication: string;
  year: number;
}
