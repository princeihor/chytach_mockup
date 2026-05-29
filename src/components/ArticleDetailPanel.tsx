/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Article, RoleMode } from '../types';
import { 
  Building, 
  MapPin, 
  User, 
  Tag, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  Check,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface ArticleDetailPanelProps {
  article: Article | null;
  roleMode: RoleMode;
  isSaved: boolean;
  onToggleSave: () => void;
  onDrillDown: (facetType: 'year' | 'publication' | 'author' | 'person' | 'place' | 'theme', value: string) => void;
  onClose: () => void;
}

export default function ArticleDetailPanel({
  article,
  roleMode,
  isSaved,
  onToggleSave,
  onDrillDown,
  onClose,
}: ArticleDetailPanelProps) {
  if (!article) {
    return (
      <div id="empty-detail-panel" className="bg-white border border-[#E5E1D8] rounded-sm p-8 text-center text-stone-500 flex flex-col items-center justify-center h-full min-h-[400px]">
        <Info className="w-8 h-8 text-[#8B4513] mb-2" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 font-sans">
          No Selection
        </h3>
        <p className="text-xs max-w-[200px] mt-1 text-stone-400">
          Click on any article card in the starter set to inspect dense archival metadata, OCR text, and relational research paths.
        </p>
      </div>
    );
  }

  const isOcrWarning = article.ocrConfidence < 0.82;

  // Custom visual labels based on role
  const getSaveButtonText = () => {
    if (isSaved) {
      switch (roleMode) {
        case 'Researcher': return 'In Your Reading Set';
        case 'Editor': return 'In Your Source Pack';
        case 'Archivist': return 'In Your Review Pack';
      }
    } else {
      switch (roleMode) {
        case 'Researcher': return 'Save to Reading Set';
        case 'Editor': return 'Save to Source Pack';
        case 'Archivist': return 'Save to Review Pack';
      }
    }
  };

  return (
    <div id="article-detail-drawer" className="bg-white border border-[#E5E1D8] rounded-sm p-5 shadow-xs space-y-5 h-full overflow-y-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8]">
        <div>
          <span className="text-[9px] uppercase font-mono bg-[#8B4513] text-white px-2 py-0.5 rounded-xs">
            Archival Record Sheet
          </span>
          <p className="text-[10px] text-stone-550 font-mono mt-1">ID: {article.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#8B4513] hover:text-[#8B4513]/80 text-xs font-mono font-medium hover:underline"
        >
          [Close ×]
        </button>
      </div>

      {/* Core Meta Details block */}
      <div>
        <h3 className="text-[#1A1A1A] font-serif font-bold text-lg leading-tight italic">
          {article.title}
        </h3>
        
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-y border-[#E5E1D8] py-3 font-sans">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-mono">Publication</span>
            <span 
              onClick={() => onDrillDown('publication', article.publication)}
              className="font-medium text-stone-800 hover:underline hover:text-[#8B4513] cursor-pointer inline-flex items-center gap-1"
            >
              {article.publication}
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-mono">Date / Year</span>
            <span 
              onClick={() => onDrillDown('year', String(article.year))}
              className="font-medium text-stone-800 hover:underline hover:text-[#8B4513] cursor-pointer inline-flex items-center gap-1"
            >
              {article.year}
              <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-mono">Author</span>
            {article.author ? (
              <span 
                onClick={() => onDrillDown('author', article.author!)}
                className="font-medium text-stone-800 hover:underline hover:text-[#8B4513] cursor-pointer inline-flex items-center gap-1"
              >
                {article.author}
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            ) : (
              <span className="italic text-stone-400">[Anonymous]</span>
            )}
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-mono">Issue Coordinates</span>
            <span className="text-stone-700 font-mono text-[11px]">
              {article.issueNumber || 'N/A'}, {article.pageRange || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Role Action Box */}
      <div className="bg-[#F9F8F6] p-3 rounded-sm border border-[#E5E1D8]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-stone-500 font-semibold uppercase">
            Curational State
          </span>
          <div className="flex items-center gap-1">
            {isOcrWarning ? (
              <span className="text-[10px] font-mono bg-[#FFFBF0] rounded-sm border border-[#E5E1D8] text-[#8B4513] px-1.5 py-0.5 flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-3 h-3 text-[#8B4513]" />
                Degraded OCR ({(article.ocrConfidence * 100).toFixed(0)}%)
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-emerald-50 rounded-sm border border-emerald-200 text-emerald-800 px-1.5 py-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                High OCR ({(article.ocrConfidence * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>
        
        <p className="text-[11px] text-stone-600 mb-3 leading-relaxed">
          {roleMode === 'Researcher' && 'Assemble this record into your active research pack to compile a synthesized literature map.'}
          {roleMode === 'Editor' && 'Add this primary candidate to your stories pipeline. Highlight snippets to pitch story angles.'}
          {roleMode === 'Archivist' && 'Review metadata warnings, digitizing flags, and physical condition details for correction planning.'}
        </p>

        <button
          onClick={onToggleSave}
          className={`w-full text-xs font-semibold py-2 rounded-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors duration-150 cursor-pointer ${
            isSaved 
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
              : 'bg-[#8B4513] hover:bg-[#8B4513]/90 text-stone-100'
          }`}
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {getSaveButtonText()}
        </button>
      </div>

      {/* OCR/Transcription Excerpt Box */}
      <div className="space-y-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8B4513] font-mono flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-[#8B4513]" />
          OCR Transcription Excerpt
        </h4>
        <div className={`p-3 rounded-sm text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto ${
          isOcrWarning 
            ? 'bg-[#FFFBF0]/60 border border-[#E5E1D8] text-stone-700' 
            : 'bg-white border border-[#E5E1D8] text-[#1A1A1A]'
        }`}>
          {isOcrWarning && (
            <div className="text-[#8B4513] text-[10px] mb-2 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              <span>Warning: Visual layout contains stylized fonts. Structural text may contain typos.</span>
            </div>
          )}
          <span className="text-stone-300">" ... </span>
          {article.fullExcerpt}
          <span className="text-stone-300"> ... "</span>
        </div>
      </div>

      {/* Dynamic Archivist-only metadata audit details */}
      {roleMode === 'Archivist' && (
        <div className="bg-red-50/50 border border-red-200/60 p-3 rounded-sm space-y-2">
          <h4 className="text-[10px] uppercase font-mono tracking-wider font-semibold text-rose-850 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            Archival Quality Audit Log
          </h4>
          <div className="text-[11px] text-stone-700 space-y-1">
            <div><strong>Physical Condition:</strong> <span className="text-stone-900">{article.physicalCondition || 'Good'}</span></div>
            <div><strong>Preservation Tag:</strong> <span className="text-stone-900 font-mono text-[10px]">{article.preservationSignal || 'Archived'}</span></div>
            <div>
              <strong>Metadata Flagged Gaps:</strong>{' '}
              {article.metadataGaps && article.metadataGaps.length > 0 ? (
                <span className="text-rose-700 font-semibold">{article.metadataGaps.join(', ')}</span>
              ) : (
                <span className="text-emerald-700">None detected</span>
              )}
            </div>
            {article.archivalNotes && (
              <div className="text-[10px] text-stone-500 italic mt-1 border-t border-rose-200/50 pt-1">
                Note: {article.archivalNotes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Entities & Relational Drill Downs (Crucial for Scenario 2!) */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8B4513] font-mono flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          Relational Research Paths
        </h4>
        
        <div className="space-y-2.5 text-xs font-sans">
          {/* Themes Tags */}
          {article.themes.length > 0 && (
            <div>
              <span className="text-stone-450 text-[10px] font-mono uppercase block mb-1">Themes (click to focus)</span>
              <div className="flex flex-wrap gap-1">
                {article.themes.map(t => (
                  <button
                    key={t}
                    onClick={() => onDrillDown('theme', t)}
                    className="flex items-center gap-1 text-[10px] bg-[#F3F1ED] border border-[#E5E1D8] text-stone-700 hover:bg-[#FFFBF0] hover:text-[#8B4513] px-2 py-0.5 rounded-sm transition font-semibold"
                  >
                    <Tag className="w-2.5 h-2.5 text-stone-400" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People Tags */}
          {article.people.length > 0 && (
            <div>
              <span className="text-stone-455 text-[10px] font-mono uppercase block mb-1">Historical People</span>
              <div className="flex flex-wrap gap-1">
                {article.people.map(p => (
                  <button
                    key={p}
                    onClick={() => onDrillDown('person', p)}
                    className="flex items-center gap-1 text-[10px] bg-[#F3F1ED] border border-[#E5E1D8] text-stone-700 hover:bg-[#FFFBF0] hover:text-[#8B4513] px-2 py-0.5 rounded-sm transition"
                  >
                    <User className="w-2.5 h-2.5 text-stone-400" />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Places Tags */}
          {article.places.length > 0 && (
            <div>
              <span className="text-stone-455 text-[10px] font-mono uppercase block mb-1">Geographical Slices</span>
              <div className="flex flex-wrap gap-1">
                {article.places.map(pl => (
                  <button
                    key={pl}
                    onClick={() => onDrillDown('place', pl)}
                    className="flex items-center gap-1 text-[10px] bg-[#F3F1ED] border border-[#E5E1D8] text-stone-700 hover:bg-[#FFFBF0] hover:text-[#8B4513] px-2 py-0.5 rounded-sm transition"
                  >
                    <MapPin className="w-2.5 h-2.5 text-stone-400" />
                    {pl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editorial Highlights */}
      {roleMode === 'Editor' && article.editorialSnippet && (
        <div className="bg-[#FFFBF0] border border-[#E5E1D8] border-l-2 border-l-[#8B4513] p-3 rounded-xs space-y-1">
          <h4 className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#8B4513] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#8B4513]" />
            Editorial Angle Hook
          </h4>
          <p className="text-[11px] text-[#1A1A1A] leading-relaxed italic">
            "{article.editorialSnippet}"
          </p>
        </div>
      )}

      {/* Selection Justification */}
      <div className="pt-3 border-t border-[#E5E1D8] font-mono text-[10px] text-stone-500">
        <span className="font-semibold block uppercase text-stone-700 mb-0.5">Selection Algorithm Note</span>
        <p className="leading-normal">
          This record was integrated into your starter set as a <span className="text-[#8B4513] font-semibold">"{article.reasonBadge}"</span> candidate to guarantee balanced coverage across target decades and thematic entity circles.
        </p>
      </div>

    </div>
  );
}
