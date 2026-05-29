/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Article, RoleMode } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  FileText, 
  FolderPlus, 
  FolderMinus, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Plus,
  HelpCircle
} from 'lucide-react';

interface ArticleCardProps {
  key?: string | number;
  article: Article;
  roleMode: RoleMode;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onFindMoreLikeThis?: (key: string, value: string) => void;
}

export default function ArticleCard({
  article,
  roleMode,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
  onFindMoreLikeThis,
}: ArticleCardProps) {
  const ocrLevel = article.ocrConfidence;
  const isOcrLow = ocrLevel < 0.82;

  // Render correct color coding list for selection reasons
  const getReasonBadgeStyles = (reason: Article['reasonBadge']) => {
    switch (reason) {
      case 'High relevance':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Representative year':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Representative publication':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Key entity':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Bridge article':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Rare but important':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High OCR confidence':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Quality warning':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold animate-pulse';
      default:
        return 'bg-stone-50 text-stone-600 border-stone-200';
    }
  };

  // Define role specific naming for the "Add to saved" CTA
  const getSaveButtonText = () => {
    if (isSaved) {
      switch (roleMode) {
        case 'Researcher': return 'Saved in Reading Set';
        case 'Editor': return 'Saved in Source Pack';
        case 'Archivist': return 'Saved in Review Pack';
      }
    } else {
      switch (roleMode) {
        case 'Researcher': return 'Add to Reading Set';
        case 'Editor': return 'Add to Source Pack';
        case 'Archivist': return 'Add to Review Pack';
      }
    }
  };

  return (
    <div
      id={`article-card-${article.id}`}
      className={`p-4 border rounded-sm transition-all duration-200 bg-white shadow-xs ${
        isSelected 
          ? 'border-[#8B4513] ring-1 ring-[#8B4513]/30 shadow-md' 
          : 'border-[#E5E1D8] hover:border-[#8B4513] hover:shadow-xs'
      }`}
    >
      {/* Upper Meta row */}
      <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-stone-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700 hover:underline cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            if (onFindMoreLikeThis) onFindMoreLikeThis('publication', article.publication);
          }}>
            {article.publication}
          </span>
          <span>•</span>
          <span className="hover:underline cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            if (onFindMoreLikeThis) onFindMoreLikeThis('year', String(article.year));
          }}>
            {article.year}
          </span>
        </div>
        
        {/* OCR Confidence Badge info */}
        <div className="flex items-center gap-1">
          {isOcrLow ? (
            <div className="flex items-center gap-0.5 text-[#8B4513] font-semibold bg-amber-50 px-1.5 py-0.5 rounded-sm border border-[#FAD390]" title="Low confidence OCR. Recommended for correction scan.">
              <ShieldAlert className="w-3 h-3 text-[#8B4513]" />
              <span>OCR {(ocrLevel * 100).toFixed(0)}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-0.5 text-stone-500 bg-[#F3F1ED] px-1.5 py-0.5 rounded-sm" title="Highly trustworthy digitized text.">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>OCR {(ocrLevel * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Article Title */}
      <h4 
        onClick={onSelect}
        className="text-[#1A1A1A] font-serif font-bold text-sm leading-snug cursor-pointer hover:text-[#8B4513] transition"
      >
        {article.title}
      </h4>

      {/* Author and Genre line */}
      <div className="flex items-center gap-2 mt-1 mb-2 text-[11px] text-stone-500">
        {article.author ? (
          <span className="font-medium text-stone-700 hover:underline cursor-pointer" onClick={(e) => {
            e.stopPropagation();
            if (onFindMoreLikeThis && article.author) onFindMoreLikeThis('author', article.author);
          }}>
            By {article.author}
          </span>
        ) : (
          <span className="italic text-stone-400">Anonymous Author</span>
        )}
        <span>•</span>
        <span className="text-[10px] bg-[#F3F1ED] px-1.5 py-0.2 rounded-sm text-stone-600 uppercase font-mono tracking-wider">
          {article.documentType}
        </span>
      </div>

      {/* Short Dynamic Snippet (max 2 lines clamp) */}
      <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed mb-3">
        {article.snippet}
      </p>

      {/* Reason Badge indicators & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5E1D8]">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${getReasonBadgeStyles(article.reasonBadge)}`}>
          {article.reasonBadge}
        </span>

        {/* Action Button layout adapts according to active role model */}
        <div className="flex items-center gap-1">
          {/* Secondary Action - Drill Down & Quality triggers */}
          {roleMode === 'Researcher' && (
            <button
              id={`more-like-this-${article.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onFindMoreLikeThis && article.themes.length > 0) {
                  onFindMoreLikeThis('theme', article.themes[0]);
                }
              }}
              className="text-[10px] text-stone-600 hover:bg-[#F3F1ED] border border-[#E5E1D8] px-2 py-1 rounded-sm transition"
            >
              More like this
            </button>
          )}

          {roleMode === 'Editor' && (
            <button
              id={`find-supporting-${article.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onFindMoreLikeThis && article.people.length > 0) {
                   onFindMoreLikeThis('person', article.people[0]);
                } else if (onFindMoreLikeThis && article.themes.length > 0) {
                  onFindMoreLikeThis('theme', article.themes[0]);
                }
              }}
              className="text-[10px] text-stone-600 hover:bg-[#F3F1ED] border border-[#E5E1D8] px-2 py-1 rounded-sm transition"
              title="Locate overlapping files to support story angle"
            >
              Find support
            </button>
          )}

          {roleMode === 'Archivist' && (
            <button
              id={`inspect-quality-${article.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(); // open right panel to view gaps
              }}
              className="text-[10px] text-stone-600 hover:bg-[#F3F1ED] border border-[#E5E1D8] px-2 py-1 rounded-sm transition"
            >
              Inspect quality
            </button>
          )}

          {/* Primary Action - Save to list */}
          <button
            id={`toggle-save-${article.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm flex items-center gap-1 transition-all ${
              isSaved 
                ? 'bg-[#8B4513] text-white border border-[#8B4513]' 
                : 'text-[#8B4513] border border-[#8B4513] hover:bg-[#8B4513] hover:text-white'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {getSaveButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
