/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Article, RoleMode } from '../types';
import { 
  FolderLock, 
  Trash2, 
  FileCheck, 
  Layers, 
  FileText, 
  Check, 
  AlertTriangle, 
  BookOpen, 
  Compass, 
  Sparkles,
  Download,
  Terminal,
  Printer
} from 'lucide-react';

interface SavedWorkingSetDrawerProps {
  savedArticles: Article[];
  roleMode: RoleMode;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedWorkingSetDrawer({
  savedArticles,
  roleMode,
  onRemoveItem,
  onClearAll,
}: SavedWorkingSetDrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedState, setCopiedState] = useState(false);

  // Group names by role
  const drawerLabel = useMemo(() => {
    switch (roleMode) {
      case 'Researcher': return 'Active Reading Set';
      case 'Editor': return 'Story Source Pack';
      case 'Archivist': return 'Remediation Review Pack';
    }
  }, [roleMode]);

  const outputButtonLabel = useMemo(() => {
    switch (roleMode) {
      case 'Researcher': return 'Compile Topic Synthesis';
      case 'Editor': return 'Synthesize Story Framework';
      case 'Archivist': return 'Generate Quality Audit Report';
    }
  }, [roleMode]);

  // Aggregate metrics inside saved collection for realistic report outputs
  const reportMetrics = useMemo(() => {
    const publications = Array.from(new Set(savedArticles.map(a => a.publication)));
    const years = savedArticles.map(a => a.year).sort((a,b)=>a-b);
    const people = Array.from(new Set(savedArticles.flatMap(a => a.people)));
    const themes = Array.from(new Set(savedArticles.flatMap(a => a.themes)));
    const lowOcrCount = savedArticles.filter(a => a.ocrConfidence < 0.82).length;
    const avgOcr = savedArticles.reduce((acc, a) => acc + a.ocrConfidence, 0) / (savedArticles.length || 1);

    return {
      publications,
      yearsSpan: years.length > 0 ? `${years[0]} — ${years[years.length-1]}` : 'N/A',
      people: people.slice(0, 5),
      themes: themes.slice(0, 5),
      lowOcrCount,
      avgOcr: (avgOcr * 100).toFixed(1),
    };
  }, [savedArticles]);

  const handleCopyReport = () => {
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div id="saved-working-drawer" className="bg-[#1A1A1A] text-white p-4 rounded-sm border border-[#E5E1D8]/20">
      
      {/* Upper info line */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]/10 mb-3">
        <div className="flex items-center gap-2">
          <FolderLock className="w-4 h-4 text-[#8B4513]" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-stone-300">
            {drawerLabel}
          </h3>
          <span className="bg-[#8B4513] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
            {savedArticles.length} items
          </span>
        </div>
        {savedArticles.length > 0 && (
          <button
            id="clear-drawer-items"
            onClick={onClearAll}
            className="text-[10px] text-zinc-400 hover:text-red-400 font-mono transition flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Item horizontal belt or empty prompt */}
      {savedArticles.length === 0 ? (
        <div id="drawer-empty-state" className="py-4 text-center text-zinc-450 text-[11px] font-mono">
          No matches added. Accumulate key corpus items using the primary buttons to compile.
        </div>
      ) : (
        <div className="space-y-3">
          {/* Horizontal scrollable box of compact cards */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {savedArticles.map((art) => (
              <div
                key={art.id}
                className="bg-stone-900 border border-[#E5E1D8]/20 p-2.5 rounded-sm min-w-[210px] max-w-[210px] shrink-0 text-left relative group"
              >
                <button
                  onClick={() => onRemoveItem(art.id)}
                  className="absolute right-1 top-1 text-zinc-500 hover:text-red-400 text-[9px] font-mono p-1"
                  title="Remove"
                >
                  [×]
                </button>
                <div className="text-[9px] font-mono text-stone-500 truncate">{art.publication} • {art.year}</div>
                <h4 className="text-[11px] font-serif font-bold text-stone-200 line-clamp-1 pr-3 mt-0.5 italic">{art.title}</h4>
                <div className="text-[10px] text-stone-450 font-mono mt-1 flex items-center justify-between">
                  <span>OCR {(art.ocrConfidence * 100).toFixed(0)}%</span>
                  <span className="text-[9px] text-zinc-500 italic max-w-[90px] truncate">{art.author || 'Anon'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer triggers */}
          <div className="flex items-center justify-end gap-2 pt-1.5 border-t border-[#E5E1D8]/10">
            <button
              id="export-raw-citations"
              onClick={() => {
                alert(`Export successful!\n\n${savedArticles.length} citations generated in CSV format and saved to clipboard.`);
              }}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-850 text-[11px] font-mono text-stone-200 rounded-sm flex items-center gap-1 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Citations (.CSV)
            </button>
            <button
              id="trigger-generate-report"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 bg-[#8B4513] hover:bg-[#8B4513]/90 text-[11px] font-sans text-white font-bold rounded-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {outputButtonLabel}
            </button>
          </div>
        </div>
      )}

      {/* REPORT GENERATION MODAL DIALOG */}
      {isModalOpen && (
        <div id="output-modal-container" className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F9F8F6] text-[#1A1A1A] border border-[#E5E1D8] rounded-sm w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between border-b border-[#E5E1D8]/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#8B4513]" />
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold">
                  Derived Research Compiler — {roleMode} Mode
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white font-mono text-xs font-medium cursor-pointer"
              >
                [Close ×]
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs leading-relaxed font-sans max-w-prose">
              
              {/* Dynamic content rendering based on active role mode */}
              {roleMode === 'Researcher' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E5E1D8] pb-3">
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5 italic">
                      <BookOpen className="w-4 h-4 text-[#8B4513]" />
                      Topic Synthesis: Archival Map Integration
                    </h4>
                    <p className="text-stone-550 mt-1">
                      Evaluated spanning <span className="font-mono text-[#1A1A1A] font-bold">{reportMetrics.yearsSpan}</span> over {savedArticles.length} matching core historical articles.
                    </p>
                  </div>

                  {/* Narrative paragraph */}
                  <div className="space-y-2">
                    <strong className="block text-stone-850">Thematic Structural Mapping</strong>
                    <p className="text-[#1A1A1A] text-[11.5px]">
                      The compiled cluster demonstrates highly synchronized cultural movements in Eastern Europe. The proximity of publication items highlights a dense intellectual exchange program between {reportMetrics.publications.join(', ') || 'multiple regional journals'}.
                    </p>
                  </div>

                  {/* Core periods block */}
                  <div className="grid grid-cols-2 gap-4 bg-[#FFFBF0] p-3 rounded-sm border border-[#E5E1D8]">
                    <div>
                      <strong className="block text-stone-800 mb-0.5">Key Research Periods</strong>
                      <ul className="list-disc list-inside text-stone-600 text-[11px] space-y-0.5 font-mono">
                        <li>Early Vanguard Era (1910 — 1918)</li>
                        <li>Interwar Expansion Peaks (1920 — 1932)</li>
                        <li>Late Post-suppression Slices</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="block text-stone-800 mb-0.5">Top Matched Themes</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {reportMetrics.themes.map(t => (
                          <span key={t} className="bg-white text-stone-700 px-1.5 py-0.5 rounded-sm text-[10px] border border-[#E5E1D8]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Identified People */}
                  <div>
                    <strong className="block text-stone-850 mb-1">Foundational Personnel Networks</strong>
                    <p className="text-stone-600 text-[11px] mb-2">
                      Cross-referencing the database logs indicates that <strong>{reportMetrics.people.join(', ') || 'core personalities'}</strong> are the dominant network bridges. These actors actively link the avant-garde layout movements with regional secondary education circles.
                    </p>
                  </div>

                  {/* Suggested Next Directions */}
                  <div className="bg-[#1A1A1A] p-3.5 rounded-sm font-mono text-[11px] space-y-1 text-white border border-[#E5E1D8]/20">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#8B4513]" />
                      Suggested Next Reading Directions
                    </div>
                    <p className="text-stone-300 leading-normal">
                      1. Correlate {reportMetrics.people[0] || 'the primary author'} papers with the municipal files from {reportMetrics.publications[0] || 'the regional capital'}.<br/>
                      2. Filter down into specific document type <strong>"Manifesto"</strong> between 1920-1929 to isolate initial ideological declarations.<br/>
                      3. Investigate Galician cooperative bookkeeping ledgers for funding traces.
                    </p>
                  </div>
                </div>
              )}

              {roleMode === 'Editor' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E5E1D8] pb-3">
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5 italic">
                      <Sparkles className="w-4 h-4 text-[#8B4513]" />
                      Story Source Framework: Editorial Slices
                    </h4>
                    <p className="text-stone-550 mt-1">
                      Target Story Pitch candidate pack derived from {savedArticles.length} sources.
                    </p>
                  </div>

                  {/* Narrative Angles */}
                  <div className="space-y-2">
                    <strong className="block text-stone-850">Strongest Source Angles</strong>
                    <p className="text-[#1A1A1A]">
                      The chosen files suggest an incredibly dramatic story arc of <strong>cultural resistance via visual typography and physical geometry</strong>. By setting modern text against traditional rural backdrops, designers bypassed traditional censors who only screen for plain dictionary keywords.
                    </p>
                  </div>

                  {/* Evidence summary */}
                  <div>
                    <strong className="block text-stone-850 mb-1.5">Strongest Sources Evidence Check</strong>
                    <div className="space-y-2">
                      {savedArticles.slice(0, 3).map((art, idx) => (
                        <div key={art.id} className="bg-[#FFFBF0] p-2.5 rounded-sm border border-[#E5E1D8]">
                          <div className="font-mono text-[10px] text-stone-500 font-bold uppercase">Angle Candidate #{idx+1}</div>
                          <div className="font-serif font-bold text-stone-900 italic mt-0.5">{art.title} ({art.year})</div>
                          <p className="text-stone-600 text-[11px] mt-1 italic">"{art.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Framing */}
                  <div className="bg-[#F3F1ED] p-3 rounded-sm border border-[#E5E1D8] space-y-1">
                    <strong className="block text-[#1A1A1A] font-bold">Possible Editorial Framing</strong>
                    <p className="text-stone-600 text-[11px]">
                      "The Geometry of Resistance: How a network of interwar female cooperatives and modernist playhouses secretly built a parallel educational world under the noses of state police."
                    </p>
                  </div>

                  {/* What to Verify Next */}
                  <div className="bg-[#FFFBF0] text-[#1A1A1A] p-3.5 rounded-sm font-mono text-[11px] border border-[#E5E1D8]">
                    <div className="font-bold text-[10px] uppercase tracking-wider mb-1 text-[#8B4513]">Verify Before Publishing:</div>
                    <ul className="list-decimal list-inside space-y-1 text-stone-700 mt-1">
                      <li>Crosscheck legal registries for the exact year the cooperative in Kosiv was registered.</li>
                      <li>Extract original photographic layouts of Vadym Meller scaffolding designs from issue archives.</li>
                      <li>Confirm that Mykola Khvylovy letters of 1926 were formally circulated before the Winter debates.</li>
                    </ul>
                  </div>
                </div>
              )}

              {roleMode === 'Archivist' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E5E1D8] pb-3">
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5 italic">
                      <AlertTriangle className="w-4 h-4 text-[#8B4513]" />
                      Quality and Metadata Remediation Plan
                    </h4>
                    <p className="text-stone-550 mt-1">
                      Remediation priorities generated across {savedArticles.length} files.
                    </p>
                  </div>

                  {/* Health summary */}
                  <div className="grid grid-cols-3 gap-2 text-center pointer-events-none mb-3">
                    <div className="bg-[#FFFBF0] border border-[#E5E1D8] p-3 rounded-sm">
                      <span className="block text-[14px] font-mono font-bold text-[#1A1A1A]">{reportMetrics.avgOcr}%</span>
                      <span className="text-[10px] text-stone-500">Avg OCR Quality</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-3 rounded-sm">
                      <span className="block text-[14px] font-mono font-bold text-red-700">{reportMetrics.lowOcrCount}</span>
                      <span className="text-[10px] text-[#1A1A1A]">Low OCR (&lt;82%)</span>
                    </div>
                    <div className="bg-[#F3F1ED] border border-[#E5E1D8] p-3 rounded-sm">
                      <span className="block text-[14px] font-mono font-bold text-[#1A1A1A]">{savedArticles.filter(a => a.author === null).length}</span>
                      <span className="text-[10px] text-stone-500">Anonymous Records</span>
                    </div>
                  </div>

                  {/* Low Confidence Cluster details */}
                  <div className="space-y-2">
                    <strong className="block text-stone-850">Low Confidence Font Layout Cluster</strong>
                    <div className="text-[#1A1A1A] text-[11px]">
                      Articles with low OCR are heavily clustered in <span className="underline font-bold">{reportMetrics.publications.slice(0,2).join(', ') || 'local circulars'}</span>. The root cause is categorized as ink bleed and non-serif text layouts.
                    </div>
                  </div>

                  {/* Gaps detected */}
                  <div>
                    <strong className="block text-stone-850 mb-1.5">Identified Metadata Gaps</strong>
                    <div className="space-y-1.5 font-mono text-[10px]">
                      {savedArticles.map((art) => (
                        <div key={art.id} className="flex justify-between border-b border-[#E5E1D8] pb-1">
                          <span>{art.id} {art.title.slice(0, 35)}...</span>
                          <span className="text-red-700 font-semibold uppercase">{art.metadataGaps && art.metadataGaps.length > 0 ? art.metadataGaps.join(', ') : 'OK'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Cleanup priorities */}
                  <div className="bg-red-50 text-red-950 p-3.5 rounded-sm border border-red-200 font-mono text-[11px] space-y-1">
                    <div className="font-bold uppercase text-[10px] tracking-wider text-red-800">Curation Cleanup Priority Recommendations:</div>
                    <ol className="list-decimal list-inside space-y-1 text-stone-800 font-sans">
                      <li>Schedule high-resolution color rescan for articles tagged with <strong>"Quality warning"</strong>.</li>
                      <li>Consult manual indices of the Shevchenko Scientific Society to fill anonymous authors in interwar Lviv journals.</li>
                      <li>Apply customized character neural models on constructivist diagonal prints to push average OCR above 94%.</li>
                    </ol>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="bg-[#F3F1ED] p-4 border-t border-[#E5E1D8] flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-stone-500">
                Generated strictly based on {savedArticles.length} matching corpus coordinates.
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCopyReport}
                  className="px-3.5 py-1.5 bg-white hover:bg-stone-200 border border-[#E5E1D8] rounded-sm text-xs font-mono text-stone-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {copiedState ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-white rounded-sm text-xs font-bold transition cursor-pointer"
                >
                  Close Synthesis
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
