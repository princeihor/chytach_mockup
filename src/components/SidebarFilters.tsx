/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Article, ActiveFilters } from '../types';
import { ShieldCheck, ShieldAlert, RotateCcw, Search, ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarFiltersProps {
  articles: Article[]; // Currently filtered list (before applying specific filters or for tracking)
  unfilteredArticles: Article[]; // Absolute list for calculating baseline facets
  filters: ActiveFilters;
  onUpdateFilters: (updater: (prev: ActiveFilters) => ActiveFilters) => void;
  onResetAllFilters: () => void;
}

export default function SidebarFilters({
  articles,
  unfilteredArticles,
  filters,
  onUpdateFilters,
  onResetAllFilters,
}: SidebarFiltersProps) {
  // Collapsible accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    publications: true,
    themes: true,
    entities: true,
    metadata: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper search fields for sidebar filters
  const [pubSearch, setPubSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [themeSearch, setThemeSearch] = useState('');
  const [entitySearch, setEntitySearch] = useState('');

  // 1. Calculate the counts dynamically based on the current active articles
  const facetCounts = useMemo(() => {
    const counts = {
      publications: {} as Record<string, number>,
      authors: {} as Record<string, number>,
      documentTypes: {} as Record<string, number>,
      languages: {} as Record<string, number>,
      themes: {} as Record<string, number>,
      people: {} as Record<string, number>,
      places: {} as Record<string, number>,
      organizations: {} as Record<string, number>,
    };

    articles.forEach((art) => {
      // Publication
      counts.publications[art.publication] = (counts.publications[art.publication] || 0) + 1;
      
      // Author
      if (art.author) {
        counts.authors[art.author] = (counts.authors[art.author] || 0) + 1;
      } else {
        counts.authors['[Anonymous / Unknown]'] = (counts.authors['[Anonymous / Unknown]'] || 0) + 1;
      }

      // Doc Type
      counts.documentTypes[art.documentType] = (counts.documentTypes[art.documentType] || 0) + 1;

      // Language
      counts.languages[art.language] = (counts.languages[art.language] || 0) + 1;

      // Themes
      art.themes.forEach((t) => {
        counts.themes[t] = (counts.themes[t] || 0) + 1;
      });

      // People
      art.people.forEach((p) => {
        counts.people[p] = (counts.people[p] || 0) + 1;
      });

      // Places
      art.places.forEach((pl) => {
        counts.places[pl] = (counts.places[pl] || 0) + 1;
      });

      // Organizations
      art.organizations.forEach((org) => {
        counts.organizations[org] = (counts.organizations[org] || 0) + 1;
      });
    });

    return counts;
  }, [articles]);

  // Master baseline for sorted item names to display even if count is 0
  const baselineFacets = useMemo(() => {
    const list = {
      publications: [] as string[],
      authors: [] as string[],
      themes: [] as string[],
      people: [] as string[],
      places: [] as string[],
      organizations: [] as string[],
      documentTypes: [] as string[],
      languages: [] as string[],
    };

    const pubSet = new Set<string>();
    const authSet = new Set<string>();
    const themeSet = new Set<string>();
    const peopleSet = new Set<string>();
    const placeSet = new Set<string>();
    const orgSet = new Set<string>();
    const docSet = new Set<string>();
    const langSet = new Set<string>();

    unfilteredArticles.forEach((art) => {
      pubSet.add(art.publication);
      if (art.author) authSet.add(art.author);
      art.themes.forEach(t => themeSet.add(t));
      art.people.forEach(p => peopleSet.add(p));
      art.places.forEach(p => placeSet.add(p));
      art.organizations.forEach(o => orgSet.add(o));
      docSet.add(art.documentType);
      langSet.add(art.language);
    });

    list.publications = Array.from(pubSet).sort();
    list.authors = Array.from(authSet).sort();
    list.themes = Array.from(themeSet).sort();
    list.people = Array.from(peopleSet).sort();
    list.places = Array.from(placeSet).sort();
    list.organizations = Array.from(orgSet).sort();
    list.documentTypes = Array.from(docSet).sort();
    list.languages = Array.from(langSet).sort();

    return list;
  }, [unfilteredArticles]);

  // Helper function to manage selection array updates
  const toggleFilterItem = (field: keyof ActiveFilters, item: string) => {
    onUpdateFilters((prev) => {
      const currentArray = prev[field] as string[];
      let updatedArray: string[];
      if (currentArray.includes(item)) {
        updatedArray = currentArray.filter((x) => x !== item);
      } else {
        updatedArray = [...currentArray, item];
      }
      return {
        ...prev,
        [field]: updatedArray,
      };
    });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.selectedYear !== null ||
      filters.publications.length > 0 ||
      filters.authors.length > 0 ||
      filters.documentTypes.length > 0 ||
      filters.languages.length > 0 ||
      filters.themes.length > 0 ||
      filters.people.length > 0 ||
      filters.places.length > 0 ||
      filters.organizations.length > 0 ||
      filters.highConfidenceOnly ||
      filters.ocrQuality !== 'all'
    );
  }, [filters]);

  return (
    <div id="sidebar-filters-panel" className="w-full bg-[#F9F8F6] border-r border-[#E5E1D8] p-4 h-full flex flex-col overflow-y-auto">
      {/* Controls Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E1D8] mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] font-sans">
          Archive Facets
        </h2>
        {hasActiveFilters && (
          <button
            id="reset-all-filters-btn"
            onClick={onResetAllFilters}
            className="flex items-center gap-1 text-[11px] text-[#8B4513] hover:text-[#8B4513]/85 font-medium font-mono hover:underline cursor-pointer transition"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-5 flex-1 select-none text-xs">
        
        {/* SECTION: Publications */}
        <div className="border-b border-[#E5E1D8] pb-3">
          <button
            onClick={() => toggleSection('publications')}
            className="flex items-center justify-between w-full text-stone-800 font-semibold mb-2 hover:text-stone-900 font-sans"
          >
            <span>Publication Source ({filters.publications.length} active)</span>
            {openSections.publications ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openSections.publications && (
            <div className="mt-2 space-y-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1.5 w-3 h-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter publication..."
                  value={pubSearch}
                  onChange={(e) => setPubSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 border border-[#E5E1D8] bg-white rounded-sm text-[11px] focus:outline-hidden focus:border-[#8B4513] font-sans"
                />
              </div>
              <div className="max-h-28 overflow-y-auto pr-1 space-y-1">
                {baselineFacets.publications
                  .filter(pub => pub.toLowerCase().includes(pubSearch.toLowerCase()))
                  .map((pub) => {
                    const count = facetCounts.publications[pub] || 0;
                    const isActive = filters.publications.includes(pub);
                    return (
                      <label
                        key={pub}
                        className={`flex items-center justify-between p-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer transition ${
                          isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleFilterItem('publications', pub)}
                            className="rounded-xs accent-[#8B4513] bg-white border-stone-300"
                          />
                          <span className="truncate max-w-[130px]">{pub}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-200/30 px-1 py-0.5 rounded">
                          {count}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION: Themes */}
        <div className="border-b border-[#E5E1D8] pb-3">
          <button
            onClick={() => toggleSection('themes')}
            className="flex items-center justify-between w-full text-stone-800 font-semibold mb-2 hover:text-stone-900 font-sans"
          >
            <span>Themes & Topics ({filters.themes.length} active)</span>
            {openSections.themes ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openSections.themes && (
            <div className="mt-2 space-y-2">
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1.5 w-3 h-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter themes..."
                  value={themeSearch}
                  onChange={(e) => setThemeSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 border border-[#E5E1D8] bg-white rounded-sm text-[11px] focus:outline-hidden focus:border-[#8B4513] font-sans"
                />
              </div>
              <div className="max-h-32 overflow-y-auto pr-1 space-y-1">
                {baselineFacets.themes
                  .filter(theme => theme.toLowerCase().includes(themeSearch.toLowerCase()))
                  .map((theme) => {
                    const count = facetCounts.themes[theme] || 0;
                    const isActive = filters.themes.includes(theme);
                    return (
                      <label
                        key={theme}
                        className={`flex items-center justify-between p-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer transition ${
                          isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleFilterItem('themes', theme)}
                            className="rounded-xs accent-[#8B4513] bg-white border-stone-300"
                          />
                          <span>{theme}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-200/30 px-1 py-0.5 rounded">
                          {count}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION: Entities (People, Places, Organizations merged for high density) */}
        <div className="border-b border-[#E5E1D8] pb-3">
          <button
            onClick={() => toggleSection('entities')}
            className="flex items-center justify-between w-full text-stone-800 font-semibold mb-2 hover:text-stone-900 font-sans"
          >
            <span>Historical Entities</span>
            {openSections.entities ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openSections.entities && (
            <div className="mt-2 space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 w-3 h-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search historical records..."
                  value={entitySearch}
                  onChange={(e) => setEntitySearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 border border-[#E5E1D8] bg-white rounded-sm text-[11px] focus:outline-hidden focus:border-[#8B4513] font-sans"
                />
              </div>

              {/* People subsection */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block mb-1">
                  People ({filters.people.length} active)
                </span>
                <div className="max-h-24 overflow-y-auto pr-1 space-y-1">
                  {baselineFacets.people
                    .filter(p => p.toLowerCase().includes(entitySearch.toLowerCase()))
                    .map((person) => {
                      const count = facetCounts.people[person] || 0;
                      const isActive = filters.people.includes(person);
                      return (
                        <label
                          key={person}
                          className={`flex items-center justify-between p-0.5 px-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer transition ${
                            isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleFilterItem('people', person)}
                              className="rounded-xs scale-90 accent-[#8B4513] bg-white"
                            />
                            <span className="truncate max-w-[130px] text-[11px]">{person}</span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-400">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Places subsection */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block mb-1">
                  Geographic Places ({filters.places.length} active)
                </span>
                <div className="max-h-24 overflow-y-auto pr-1 space-y-1">
                  {baselineFacets.places
                    .filter(p => p.toLowerCase().includes(entitySearch.toLowerCase()))
                    .map((place) => {
                      const count = facetCounts.places[place] || 0;
                      const isActive = filters.places.includes(place);
                      return (
                        <label
                          key={place}
                          className={`flex items-center justify-between p-0.5 px-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer transition ${
                            isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleFilterItem('places', place)}
                              className="rounded-xs scale-90 accent-[#8B4513] bg-white font-sans"
                            />
                            <span className="truncate max-w-[130px] text-[11px]">{place}</span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-400">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* Orgs subsection */}
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block mb-1">
                  Organizations ({filters.organizations.length} active)
                </span>
                <div className="max-h-24 overflow-y-auto pr-1 space-y-1">
                  {baselineFacets.organizations
                    .filter(o => o.toLowerCase().includes(entitySearch.toLowerCase()))
                    .map((org) => {
                      const count = facetCounts.organizations[org] || 0;
                      const isActive = filters.organizations.includes(org);
                      return (
                        <label
                          key={org}
                          className={`flex items-center justify-between p-0.5 px-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer transition ${
                            isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleFilterItem('organizations', org)}
                              className="rounded-xs scale-90 accent-[#8B4513] bg-white font-sans"
                            />
                            <span className="truncate max-w-[130px] text-[11px]">{org}</span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-400">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* SECTION: Metadata & Quality */}
        <div>
          <button
            onClick={() => toggleSection('metadata')}
            className="flex items-center justify-between w-full text-stone-800 font-semibold mb-2 hover:text-stone-900 font-sans"
          >
            <span>Corpus Metrics & OCR</span>
            {openSections.metadata ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openSections.metadata && (
            <div className="mt-2 space-y-3 font-mono">
              {/* Document Type */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                  Document Genre
                </span>
                <div className="space-y-1 font-sans">
                  {baselineFacets.documentTypes.map((type) => {
                    const count = facetCounts.documentTypes[type] || 0;
                    const isActive = filters.documentTypes.includes(type);
                    return (
                      <label
                        key={type}
                        className={`flex items-center justify-between p-0.5 px-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer text-[11px] transition ${
                          isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleFilterItem('documentTypes', type)}
                            className="rounded-xs scale-90 accent-[#8B4513]"
                          />
                          <span>{type}</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Language */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                  Original Language
                </span>
                <div className="space-y-1 font-sans">
                  {baselineFacets.languages.map((lang) => {
                    const count = facetCounts.languages[lang] || 0;
                    const isActive = filters.languages.includes(lang);
                    return (
                      <label
                        key={lang}
                        className={`flex items-center justify-between p-0.5 px-1 rounded-sm hover:bg-[#F3F1ED] cursor-pointer text-[11px] transition ${
                          isActive ? 'bg-[#FFFBF0] text-[#8B4513] border-l-2 border-[#8B4513] pl-2 font-semibold' : 'text-stone-600 pl-2'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleFilterItem('languages', lang)}
                            className="rounded-xs scale-90 accent-[#8B4513]"
                          />
                          <span>{lang}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#4A4A4A]">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* OCR Segment Controls */}
              <div className="border-t border-[#E5E1D8] pt-2 space-y-2">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#4A4A4A] block mb-1">
                    OCR Quality Range
                  </label>
                  <select
                    value={filters.ocrQuality}
                    onChange={(e) => {
                      const val = e.target.value as 'all' | 'high' | 'low';
                      onUpdateFilters(prev => ({ ...prev, ocrQuality: val }));
                    }}
                    className="w-full bg-white border border-[#E5E1D8] p-1.5 text-[11px] font-mono text-stone-750 rounded-sm focus:outline-hidden focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513]/20"
                  >
                    <option value="all">All OCR Ranges</option>
                    <option value="high">High Confidence (≥ 80%)</option>
                    <option value="low">Degraded Confidence (&lt; 80%)</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 p-1 rounded-sm bg-[#F3F1ED] hover:bg-stone-200/50 cursor-pointer text-[10px]">
                  <input
                    type="checkbox"
                    checked={filters.highConfidenceOnly}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      onUpdateFilters(prev => ({ ...prev, highConfidenceOnly: checked }));
                    }}
                    className="accent-[#8B4513]"
                  />
                  <div className="flex items-center gap-1 text-stone-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>High-Confidence Only</span>
                  </div>
                </label>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
