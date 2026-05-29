/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Article, ActiveFilters, RoleMode, TopicOverview } from './types';
import { CORE_TOPICS, TOPICS_OVERVIEWS, ALL_ARTICLES } from './data';
import TimelineChart from './components/TimelineChart';
import SidebarFilters from './components/SidebarFilters';
import ArticleCard from './components/ArticleCard';
import ArticleDetailPanel from './components/ArticleDetailPanel';
import SavedWorkingSetDrawer from './components/SavedWorkingSetDrawer';
import { 
  Building, 
  MapPin, 
  User, 
  Tag, 
  Layers, 
  Search, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  HelpCircle, 
  X, 
  FileText, 
  Compass, 
  GraduationCap, 
  Boxes,
  Activity,
  Award,
  BookMarked
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [roleMode, setRoleMode] = useState<RoleMode>('Researcher');
  const [selectedTopic, setSelectedTopic] = useState<string>('Modernism');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  
  // Active faceted Filters
  const [filters, setFilters] = useState<ActiveFilters>({
    searchQuery: '',
    selectedYear: null,
    publications: [],
    authors: [],
    documentTypes: [],
    languages: [],
    themes: [],
    people: [],
    places: [],
    organizations: [],
    highConfidenceOnly: false,
    ocrQuality: 'all',
  });

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>('art-001'); // default selection
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(['art-001', 'art-003']); // default saved items to make the demo feel instantly live
  const [isSearchingLoading, setIsSearchingLoading] = useState(false);

  // Sync Input changes with filters on form submits
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingLoading(true);
    setTimeout(() => {
      setSearchQuery(searchInputValue);
      setFilters(prev => ({ ...prev, searchQuery: searchInputValue }));
      setIsSearchingLoading(false);
    }, 380);
  };

  // Quick select sample topic chip (resets other filters to keep path coherent)
  const handleTopicChipSelect = (topic: string) => {
    setIsSearchingLoading(true);
    setSelectedTopic(topic);
    setSearchInputValue('');
    setSearchQuery('');
    setFilters({
      searchQuery: '',
      selectedYear: null,
      publications: [],
      authors: [],
      documentTypes: [],
      languages: [],
      themes: [],
      people: [],
      places: [],
      organizations: [],
      highConfidenceOnly: false,
      ocrQuality: 'all',
    });
    // Set first corresponding article of selected topic as active detail
    const sampleArticle = ALL_ARTICLES.find(art => art.topics.includes(topic));
    if (sampleArticle) {
      setSelectedArticleId(sampleArticle.id);
    } else {
      setSelectedArticleId(null);
    }
    setTimeout(() => {
      setIsSearchingLoading(false);
    }, 250);
  };

  // Reset all filters state
  const handleResetFilters = () => {
    setSearchInputValue('');
    setSearchQuery('');
    setFilters({
      searchQuery: '',
      selectedYear: null,
      publications: [],
      authors: [],
      documentTypes: [],
      languages: [],
      themes: [],
      people: [],
      places: [],
      organizations: [],
      highConfidenceOnly: false,
      ocrQuality: 'all',
    });
  };

  // Switch role and apply subtle sorting or selections changes
  const handleRoleSwitch = (role: RoleMode) => {
    setRoleMode(role);
    // Dynamic defaults adjustment based on role mode for testing scenarios
    if (role === 'Archivist') {
      // Archivists are often drawn to audit warning blocks
      const lowOcrArticle = ALL_ARTICLES.find(art => art.topics.includes(selectedTopic) && art.ocrConfidence < 0.81);
      if (lowOcrArticle) setSelectedArticleId(lowOcrArticle.id);
    } else if (role === 'Editor') {
      // Editors like highly visual feature layouts
      const featureArt = ALL_ARTICLES.find(art => art.topics.includes(selectedTopic) && art.documentType === 'Feature Article');
      if (featureArt) setSelectedArticleId(featureArt.id);
    }
  };

  // 2. Compute Filtered Matches
  const filteredArticles = useMemo(() => {
    return ALL_ARTICLES.filter((article) => {
      // Must match core Selected Topic (tag array match)
      if (!article.topics.includes(selectedTopic)) return false;

      // Text search query match (title, snippet, excerpt, author, publication, themes)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const strToTest = [
          article.title,
          article.snippet,
          article.author || '',
          article.publication,
          ...article.themes,
          ...article.people,
          ...article.places,
        ].join(' ').toLowerCase();

        if (!strToTest.includes(query)) return false;
      }

      // Selected Year Filter (timeline select)
      if (filters.selectedYear !== null) {
        // Group near even year spans (range limit to current selected year +- 1 for smooth spectrum)
        const diff = Math.abs(article.year - filters.selectedYear);
        if (diff > 1) return false;
      }

      // Facet check: Publications
      if (filters.publications.length > 0 && !filters.publications.includes(article.publication)) {
        return false;
      }

      // Facet check: Authors
      if (filters.authors.length > 0) {
        const itemAuthor = article.author || '[Anonymous / Unknown]';
        if (!filters.authors.includes(itemAuthor)) return false;
      }

      // Facet check: Document Type
      if (filters.documentTypes.length > 0 && !filters.documentTypes.includes(article.documentType)) {
        return false;
      }

      // Facet check: Languages
      if (filters.languages.length > 0 && !filters.languages.includes(article.language)) {
        return false;
      }

      // Facet check: Themes (Match if article contains ANY of the filtered themes)
      if (filters.themes.length > 0) {
        const hasThemeMatch = article.themes.some(t => filters.themes.includes(t));
        if (!hasThemeMatch) return false;
      }

      // Facet check: People
      if (filters.people.length > 0) {
        const hasPeopleMatch = article.people.some(p => filters.people.includes(p));
        if (!hasPeopleMatch) return false;
      }

      // Facet check: Places
      if (filters.places.length > 0) {
        const hasPlacesMatch = article.places.some(p => filters.places.includes(p));
        if (!hasPlacesMatch) return false;
      }

      // Facet check: Organizations
      if (filters.organizations.length > 0) {
        const hasOrgMatch = article.organizations.some(o => filters.organizations.includes(o));
        if (!hasOrgMatch) return false;
      }

      // OCR Quality selection
      if (filters.ocrQuality === 'high' && article.ocrConfidence < 0.81) return false;
      if (filters.ocrQuality === 'low' && article.ocrConfidence >= 0.81) return false;

      // Toggle: high-confidence only
      if (filters.highConfidenceOnly && article.ocrConfidence < 0.85) return false;

      return true;
    });
  }, [selectedTopic, searchQuery, filters]);

  // Use selected article ID from overall database list (or fallback)
  const activeSelectedArticle = useMemo(() => {
    return ALL_ARTICLES.find(art => art.id === selectedArticleId) || null;
  }, [selectedArticleId]);

  // Aggregate stats on Currently Filtered list
  const activeMetrics = useMemo(() => {
    const publicationsSet = new Set(filteredArticles.map(a => a.publication));
    const years = filteredArticles.map(a => a.year);
    const minYear = years.length > 0 ? Math.min(...years) : 1900;
    const maxYear = years.length > 0 ? Math.max(...years) : 1990;
    const sumOcr = filteredArticles.reduce((acc, a) => acc + a.ocrConfidence, 0);
    const avgOcr = filteredArticles.length > 0 ? sumOcr / filteredArticles.length : 0.85;

    return {
      articlesCount: filteredArticles.length,
      publicationsCount: publicationsSet.size,
      yearsSpectrum: minYear === maxYear ? `${minYear}` : `${minYear} — ${maxYear}`,
      averageOcrPercent: (avgOcr * 100).toFixed(0),
    };
  }, [filteredArticles]);

  // 3. Simulated Relevance/Balanced Ordering algorithm for custom Starter Set (limiting to exact 20 articles)
  const starterSetCurated = useMemo(() => {
    // We want a stable, intelligent sort order.
    // - In Researcher Mode: Sorted by balanced representation:
    //   Ensure early elements represent strong highlights, followed by years span, followed by rare items.
    // - In Editor Mode: Sorted with elements of high story potential (high text richness, prominent authors) first.
    // - In Archivist Mode: Sorted with low OCR confidence or high flagged gaps FIRST to focus attention on correction.
    
    const candidates = [...filteredArticles];

    if (roleMode === 'Archivist') {
      // Prioritize low OCR levels and density of metadata gaps
      candidates.sort((a, b) => {
        const aGaps = a.metadataGaps?.length || 0;
        const bGaps = b.metadataGaps?.length || 0;
        if (bGaps !== aGaps) return bGaps - aGaps; // more gaps first
        return a.ocrConfidence - b.ocrConfidence; // lower OCR first
      });
    } else if (roleMode === 'Editor') {
      // Prioritize prominent authors and custom editorial interest
      candidates.sort((a, b) => {
        const aVal = a.author ? 2 : 1;
        const bVal = b.author ? 2 : 1;
        if (bVal !== aVal) return bVal - aVal; // authors first
        return b.ocrConfidence - a.ocrConfidence; // then cleaner scans
      });
    } else {
      // Default: Researcher. Sort by simulated balanced score:
      // High trust items first, balanced representations
      candidates.sort((a, b) => {
        // High relevance items (the primary curated items art-001 to art-010) ranked high
        const aCurValue = a.id.startsWith('art-00') ? 10 : 1;
        const bCurValue = b.id.startsWith('art-00') ? 10 : 1;
        if (bCurValue !== aCurValue) return bCurValue - aCurValue;
        return b.year - a.year; // newer items first for fresh layout
      });
    }

    // Assign / adjust the reason badges contextually if not pre-seeded
    const final20 = candidates.slice(0, 20).map((art, index) => {
      // We can dynamically assign reasonBadges on scaled items to avoid random distributions
      if (art.ocrConfidence < 0.72) {
        return { ...art, reasonBadge: 'Quality warning' as const };
      }
      if (index === 0 || index === 1) {
        return { ...art, reasonBadge: 'High relevance' as const };
      }
      if (index === 2 || index === 3) {
        return { ...art, reasonBadge: 'Key entity' as const };
      }
      if (index === 4 || index === 5) {
        return { ...art, reasonBadge: 'Representative publication' as const };
      }
      if (index === 6 || index === 7) {
        return { ...art, reasonBadge: 'Representative year' as const };
      }
      if (index === 12 || index === 13) {
        return { ...art, reasonBadge: 'Rare but important' as const };
      }
      return art;
    });

    return final20;
  }, [filteredArticles, roleMode]);

  // Convert saved IDs back into full article definitions for the drawer
  const savedArticlesList = useMemo(() => {
    return ALL_ARTICLES.filter(art => savedArticleIds.includes(art.id));
  }, [savedArticleIds]);

  // Toggle active saved list status
  const handleToggleSaveArticle = (id: string) => {
    setSavedArticleIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRemoveSavedArticle = (id: string) => {
    setSavedArticleIds(prev => prev.filter(x => x !== id));
  };

  const handleClearSavedArticles = () => {
    setSavedArticleIds([]);
  };

  // Cross-relational drill-down handler inside details (Scenario 2 context)
  const handleDrillDownFacetMatch = (
    facetType: 'year' | 'publication' | 'author' | 'person' | 'place' | 'theme', 
    value: string
  ) => {
    setFilters((prev) => {
      switch (facetType) {
        case 'year':
          return { ...prev, selectedYear: parseInt(value, 10) };
        case 'publication':
          return { ...prev, publications: Array.from(new Set([...prev.publications, value])) };
        case 'author':
          return { ...prev, authors: Array.from(new Set([...prev.authors, value])) };
        case 'person':
          return { ...prev, people: Array.from(new Set([...prev.people, value])) };
        case 'place':
          return { ...prev, places: Array.from(new Set([...prev.places, value])) };
        case 'theme':
          return { ...prev, themes: Array.from(new Set([...prev.themes, value])) };
        default:
          return prev;
      }
    });

    // Bring visual alignment to top
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Action helper for "More like this" inside the cards
  const handleFindMoreLikeThisOnCard = (key: string, value: string) => {
    if (key === 'publication') {
      setFilters(prev => ({ ...prev, publications: [value] }));
    } else if (key === 'year') {
      setFilters(prev => ({ ...prev, selectedYear: parseInt(value, 10) }));
    } else if (key === 'author') {
      setFilters(prev => ({ ...prev, authors: [value] }));
    } else if (key === 'theme') {
      setFilters(prev => ({ ...prev, themes: [value] }));
    } else if (key === 'person') {
      setFilters(prev => ({ ...prev, people: [value] }));
    }
  };

  // Helper arrays of current configured active paths for breadcrumbs
  const activePathList = useMemo(() => {
    const list: { key: string; label: string; onRemove: () => void }[] = [];
    
    if (filters.selectedYear !== null) {
      list.push({
        key: 'year',
        label: `Year: ${filters.selectedYear}s`,
        onRemove: () => setFilters(prev => ({ ...prev, selectedYear: null })),
      });
    }
    filters.publications.forEach(pub => {
      list.push({
        key: `pub-${pub}`,
        label: `Pub: ${pub}`,
        onRemove: () => setFilters(prev => ({ ...prev, publications: prev.publications.filter(x => x !== pub) })),
      });
    });
    filters.authors.forEach(auth => {
      list.push({
        key: `auth-${auth}`,
        label: `Author: ${auth}`,
        onRemove: () => setFilters(prev => ({ ...prev, authors: prev.authors.filter(x => x !== auth) })),
      });
    });
    filters.themes.forEach(th => {
      list.push({
        key: `th-${th}`,
        label: `Theme: ${th}`,
        onRemove: () => setFilters(prev => ({ ...prev, themes: prev.themes.filter(x => x !== th) })),
      });
    });
    filters.people.forEach(p => {
      list.push({
        key: `p-${p}`,
        label: `Person: ${p}`,
        onRemove: () => setFilters(prev => ({ ...prev, people: prev.people.filter(x => x !== p) })),
      });
    });
    filters.places.forEach(p => {
      list.push({
        key: `pl-${p}`,
        label: `Place: ${p}`,
        onRemove: () => setFilters(prev => ({ ...prev, places: prev.places.filter(x => x !== p) })),
      });
    });
    filters.organizations.forEach(o => {
      list.push({
        key: `o-${o}`,
        label: `Org: ${o}`,
        onRemove: () => setFilters(prev => ({ ...prev, organizations: prev.organizations.filter(x => x !== o) })),
      });
    });
    if (filters.highConfidenceOnly) {
      list.push({
        key: 'high-confidence',
        label: 'High-Confidence OCR Only',
        onRemove: () => setFilters(prev => ({ ...prev, highConfidenceOnly: false })),
      });
    }
    if (filters.ocrQuality !== 'all') {
      list.push({
        key: 'ocr-quality',
        label: `OCR Range: ${filters.ocrQuality}`,
        onRemove: () => setFilters(prev => ({ ...prev, ocrQuality: 'all' })),
      });
    }
    return list;
  }, [filters]);

  const overviewNarrative = useMemo(() => {
    const defaultBlock = TOPICS_OVERVIEWS[selectedTopic];
    if (!defaultBlock) return '';
    return defaultBlock.narrativeText[roleMode];
  }, [selectedTopic, roleMode]);

  // Primary Action text for overall summary cards
  const activePromptQuestion = useMemo(() => {
    switch (roleMode) {
      case 'Researcher': return 'What exists in the archive on this topic, and what should I read first?';
      case 'Editor': return 'What material here can become a strong story or editorial angle?';
      case 'Archivist': return 'What is the state of this corpus, what is missing, and what needs review?';
    }
  }, [roleMode]);

  return (
    <div id="app-root-container" className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#8B4513]/10 selection:text-[#8B4513]">
      
      {/* 1. TOP BAR BRAND HEADER */}
      <header className="bg-white border-b border-[#E5E1D8] py-3.5 px-6 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="bg-[#8B4513] text-white p-2 rounded-sm shadow-xs border border-[#8B4513]/20">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-wider font-sans uppercase text-[#1A1A1A]">
                  Archive Topic Map
                </h1>
                <span className="bg-[#8B4513] text-white text-[10px] font-mono px-1.5 py-0.5 rounded uppercase">
                  Durable Index v4.1
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Multidimensional Semantic Explorer for Historic Print Corpuses (1900—1990)
              </p>
            </div>
          </div>

          {/* Core Unified Search Container */}
          <form onSubmit={handleSearchSubmit} className="flex-1 md:max-w-md relative">
            <input
              type="text"
              id="global-corpus-search"
              placeholder="Search a topic, person, place, or concept..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              className="w-full bg-[#F3F1ED] text-[#1A1A1A] text-xs pl-9 pr-24 py-2 border border-[#E5E1D8] rounded-sm focus:outline-hidden focus:border-[#8B4513] focus:ring-1 focus:ring-[#8B4513]/30 transition-all font-sans placeholder:text-stone-400"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            <div className="absolute right-1 top-1.5 flex gap-1">
              {searchInputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInputValue('');
                    setSearchQuery('');
                    setFilters(p => ({ ...p, searchQuery: '' }));
                  }}
                  className="text-stone-400 hover:text-stone-600 text-[10px] uppercase font-mono px-1"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                id="search-confirm-btn"
                className="bg-[#1A1A1A] hover:bg-black text-[10px] uppercase font-bold text-white px-2.5 py-1 rounded-sm transition cursor-pointer"
              >
                Scan
              </button>
            </div>
          </form>

          {/* Mode Switcher Block */}
          <div id="role-switcher-tabs" className="bg-[#F3F1ED] p-1 rounded-sm border border-[#E5E1D8] flex items-center">
            {(['Researcher', 'Editor', 'Archivist'] as const).map((mode) => {
              const isActive = roleMode === mode;
              return (
                <button
                  key={mode}
                  id={`role-tab-${mode.toLowerCase()}`}
                  onClick={() => handleRoleSwitch(mode)}
                  className={`text-[10px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition ${
                    isActive
                      ? 'bg-white text-[#1A1A1A] font-bold shadow-xs border border-[#E5E1D8]'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* SAMPLE TOPIC RECOMMENDATION CHIPS BAR */}
      <section className="bg-[#F3F1ED] border-b border-[#E5E1D8] py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold font-mono text-[#8B4513] uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#8B4513]" />
            Core Topics:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {CORE_TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  id={`topic-chip-${topic.replaceAll(' ', '-').toLowerCase()}`}
                  onClick={() => handleTopicChipSelect(topic)}
                  className={`text-[11px] px-3.5 py-1.5 border rounded-sm font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#8B4513] text-white border-[#8B4513] shadow-xs'
                      : 'bg-white text-stone-700 border-[#E5E1D8] hover:bg-stone-50 hover:border-stone-400'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
          
          <span className="hidden lg:inline text-[9px] font-mono text-stone-500 bg-white border border-[#E5E1D8] px-2 py-0.5 rounded-full ml-auto">
            Role Focus: <strong className="text-[#8B4513]">{activePromptQuestion}</strong>
          </span>
        </div>
      </section>

      {/* 2. THREE-PANEL MASTER GRID CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 min-h-[500px] border-b border-[#E5E1D8]">
        
        {/* LEFT COLUMN: Sidebar facet filters (1/4 width) */}
        <aside className="lg:col-span-1 min-h-[400px]">
          <SidebarFilters
            articles={filteredArticles}
            unfilteredArticles={ALL_ARTICLES.filter(a => a.topics.includes(selectedTopic))}
            filters={filters}
            onUpdateFilters={setFilters}
            onResetAllFilters={handleResetFilters}
          />
        </aside>

        {/* MAIN CENTER COLUMN: Core statistics, context charts & starter set (2/4 width) */}
        <section id="main-research-area" className="lg:col-span-2 p-5 border-r border-[#E5E1D8] overflow-y-auto space-y-6">
          
          {/* SEARCH LOADER INDICATOR */}
          {isSearchingLoading && (
            <div id="search-spinner" className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1A1A1A] text-white flex items-center gap-2 p-3.5 rounded-sm border border-[#E5E1D8] shadow-xl font-mono text-[11px]">
              <div className="w-3.5 h-3.5 rounded-full border-t-2 border-[#8B4513] animate-spin" />
              <span>Querying database, index matrices re-allocating...</span>
            </div>
          )}

          {/* ACTIVE FILTER PIPELINE BREADCRUMBS */}
          <div className="flex items-center justify-between gap-4 p-3 bg-[#F3F1ED] border border-[#E5E1D8] rounded-sm">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#8B4513] shrink-0" />
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-sans">
                <span className="text-stone-500 font-bold uppercase text-[9.5px] font-mono">Path Trace:</span>
                <span className="bg-[#FFFBF0] border border-[#8B4513]/30 text-[#8B4513] px-2 py-0.5 rounded-xs font-semibold">
                  Topic: {selectedTopic}
                </span>
                
                {activePathList.map((pathItem) => (
                  <span
                    key={pathItem.key}
                    className="bg-white border border-[#E5E1D8] text-stone-700 px-2 py-0.5 rounded-xs flex items-center gap-1 animate-fadeIn"
                  >
                    <span>{pathItem.label}</span>
                    <button
                      onClick={pathItem.onRemove}
                      className="text-[9px] text-[#8B4513] hover:text-[#8B4513]/85 rounded font-mono px-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {activePathList.length === 0 && (
                  <span className="text-stone-400 italic">No secondary drills applied. Select items below to narrow path.</span>
                )}
              </div>
            </div>

            {activePathList.length > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-mono text-[#8B4513] hover:underline shrink-0"
              >
                Clear Drills
              </button>
            )}
          </div>

          {/* BLOCK A: Topic Overview Panel */}
          <div id="topic-intro-panel" className="bg-white border border-[#E5E1D8] p-5 rounded-sm shadow-xs relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-white bg-[#8B4513] px-2 py-0.5 rounded-sm">
                Topic Matrix Map
              </span>
              <div className="text-[10px] font-mono text-stone-500">
                Mode Active: <strong className="text-[#8B4513]">{roleMode} Focus</strong>
              </div>
            </div>

            <h2 className="text-[#1A1A1A] font-serif font-bold text-2xl tracking-tight mb-2 italic">
              {selectedTopic}
            </h2>

            {/* Sub Narrative interpretation paragraph (Dynamic by Role Mode) */}
            <p className="text-stone-650 text-xs leading-relaxed border-l-2 border-[#8B4513] pl-3 italic mb-4">
              "{overviewNarrative}"
            </p>

            {/* Quick Metrics grid (Emphasis shifts based on active switch) */}
            <div className="grid grid-cols-4 gap-2 border-t border-[#E5E1D8] pt-4 text-center">
              
              <div className={`p-2 rounded-sm border transition-colors ${roleMode === 'Researcher' ? 'bg-[#FFFBF0] border-[#8B4513]' : 'bg-[#F9F8F6] border-[#E5E1D8]'}`}>
                <span className="block text-base font-bold font-serif text-[#1A1A1A] tracking-tight">
                  {activeMetrics.articlesCount}
                </span>
                <span className="text-[9.5px] uppercase font-mono text-stone-550">Matches</span>
              </div>

              <div className="p-2 rounded-sm border bg-[#F9F8F6] border-[#E5E1D8]">
                <span className="block text-base font-bold font-serif text-[#1A1A1A] tracking-tight">
                  {activeMetrics.publicationsCount}
                </span>
                <span className="text-[9.5px] uppercase font-mono text-stone-550">Publications</span>
              </div>

              <div className="p-2 rounded-sm border bg-[#F9F8F6] border-[#E5E1D8]">
                <span className="block text-base font-bold font-serif text-[#1A1A1A] tracking-tight">
                  {activeMetrics.yearsSpectrum}
                </span>
                <span className="text-[9.5px] uppercase font-mono text-stone-550">Years Span</span>
              </div>

              <div className={`p-2 rounded-sm border transition-colors ${roleMode === 'Archivist' ? 'bg-[#FFFBF0] border-[#8B4513]' : 'bg-[#F9F8F6] border-[#E5E1D8]'}`}>
                <span className="block text-base font-bold font-serif text-[#1A1A1A] tracking-tight">
                  {activeMetrics.averageOcrPercent}%
                </span>
                <span className="text-[9.5px] uppercase font-mono text-stone-550">Avg OCR</span>
              </div>

            </div>
          </div>

          {/* BLOCK B: TIMELINE block */}
          <TimelineChart
            articles={filteredArticles}
            selectedYear={filters.selectedYear}
            onSelectYear={(year) => setFilters(prev => ({ ...prev, selectedYear: year }))}
          />

          {/* BLOCK C: Topic Context Mental Map Block */}
          <div id="topic-context-mental-block" className="bg-white border border-[#E5E1D8] p-5 rounded-sm shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] font-sans flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-[#8B4513]" />
                Active Relational Mapping Elements
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Click any surrounding taxonomy tag to focus results and update active starter set.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                        {/* Left facet items */}
              <div className="space-y-3">
                
                {/* Related Themes block */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500 block mb-1">
                    Matched Themes ({(Array.from(new Set(filteredArticles.flatMap(a=>a.themes))) as string[]).length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.from(new Set(filteredArticles.flatMap(a => a.themes))) as string[]).slice(0, 10).map((t) => (
                      <button
                        key={t}
                        onClick={() => handleDrillDownFacetMatch('theme', t)}
                        className="text-[10px] bg-[#F3F1ED] text-stone-700 hover:bg-[#FFFBF0] hover:text-[#8B4513] border border-[#E5E1D8] rounded-sm px-2 py-0.5 font-semibold transition"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Places block */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500 block mb-1">
                    Geographies Located
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.from(new Set(filteredArticles.flatMap(a => a.places))) as string[]).slice(0, 6).map((p) => (
                      <button
                        key={p}
                        onClick={() => handleDrillDownFacetMatch('place', p)}
                        className="text-[10px] bg-[#F3F1ED] text-stone-700 hover:bg-[#FFFBF0] hover:text-[#8B4513] border border-[#E5E1D8] rounded-sm px-2 py-0.5 transition flex items-center gap-0.5"
                      >
                        <MapPin className="w-2.5 h-2.5 text-stone-400" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right facet items */}
              <div className="space-y-3">
                
                {/* Top People block */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-stone-500 block mb-1">
                    Historical Figures Registered ({(Array.from(new Set(filteredArticles.flatMap(a=>a.people))) as string[]).length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.from(new Set(filteredArticles.flatMap(a => a.people))) as string[]).slice(0, 6).map((p) => (
                      <button
                        key={p}
                        onClick={() => handleDrillDownFacetMatch('person', p)}
                        className="text-[10px] bg-[#F3F1ED] text-stone-800 hover:bg-[#FFFBF0] hover:text-[#8B4513] border border-[#E5E1D8] rounded-sm px-1.5 py-0.5 transition flex items-center gap-0.5"
                      >
                        <User className="w-2.5 h-2.5 text-stone-400" />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narrative anchor note */}
                <div className="bg-[#FFFBF0]/60 border border-[#E5E1D8] p-2.5 rounded-sm">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8B4513] block mb-0.5">
                    Historical Significance Anchor
                  </span>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    This selection marks a watershed transition from Imperial print censorship to highly innovative regional linguistic expression, capturing unique Eastern European dialectics.
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* BLOCK D: STARTER SET COMPONENT LIST */}
          <div className="space-y-3">
            
            {/* Curated set title */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-stone-900 font-serif font-bold text-sm italic">
                  {roleMode === 'Researcher' && `Where to start: ${starterSetCurated.length} articles that explain this topic`}
                  {roleMode === 'Editor' && `Target Story Source Candidates (${starterSetCurated.length})`}
                  {roleMode === 'Archivist' && `Critical remediation candidates and problem records (${starterSetCurated.length})`}
                </h3>
                <p className="text-[11.5px] text-stone-500">
                  This curated catalog balances relevance, source diversity, metadata consistency, and scan readabilities.
                </p>
              </div>
              
              {/* Small explanation tooltip */}
              <span className="text-[10px] text-stone-600 bg-[#F3F1ED] border border-[#E5E1D8] px-2 py-1 rounded-sm font-mono group relative cursor-pointer hover:bg-stone-200 transition">
                Selection Logic Legend
                <div className="hidden group-hover:block absolute z-10 bottom-full right-0 bg-[#1A1A1A] text-white p-3.5 rounded-sm text-[10px] min-w-[280px] shadow-lg leading-relaxed space-y-1.5 font-mono border border-[#E5E1D8]">
                  <div className="text-[#FFFBF0] font-bold border-b border-[#E5E1D8] pb-1">COMPREHENSIVE BALANCED RANKING</div>
                  <div>• <strong>8 Relevance items:</strong> highest exact query matching indices.</div>
                  <div>• <strong>4 Period markers:</strong> anchors representation of sparse decades.</div>
                  <div>• <strong>4 Publication bridges:</strong> ensures cross-regional coverage.</div>
                  <div>• <strong>4 Rare indicators:</strong> targets anomalous metadata cases.</div>
                </div>
              </span>
            </div>

            {/* List of articles */}
            {starterSetCurated.length === 0 ? (
              <div id="starter-set-empty" className="bg-white border border-[#E5E1D8] text-center p-12 rounded-sm space-y-3 text-stone-500">
                <Compass className="w-8 h-8 mx-auto text-stone-300 animate-pulse" />
                <h4 className="text-stone-700 font-sans font-bold">No Matching Documents Located</h4>
                <p className="text-xs max-w-sm mx-auto leading-relaxed">
                  The active faceted filters have narrowed the topic map beyond available records. Reset secondary facets or update your text query to regain catalog depth.
                </p>
                <button
                  id="reset-filter-fallback-btn"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white rounded-sm text-xs font-sans font-bold transition cursor-pointer"
                >
                  Clear Active Filters
                </button>
              </div>
            ) : (
              <div id="starter-set-items" className="space-y-3.5">
                {starterSetCurated.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    roleMode={roleMode}
                    isSelected={selectedArticleId === article.id}
                    isSaved={savedArticleIds.includes(article.id)}
                    onSelect={() => setSelectedArticleId(article.id)}
                    onToggleSave={() => handleToggleSaveArticle(article.id)}
                    onFindMoreLikeThis={handleFindMoreLikeThisOnCard}
                  />
                ))}
              </div>
            )}

            {/* Pagination note to sustain authentic high volume layout constraints */}
            {filteredArticles.length > 20 && (
              <div className="text-center py-3 bg-[#F9F8F6] border border-[#E5E1D8] text-stone-500 font-mono text-[10px] rounded-sm">
                And {filteredArticles.length - 20} other documents matches trace. Utilize facets and drill-down tags to isolate exact records.
              </div>
            )}

          </div>

        </section>

        {/* RIGHT COLUMN: DETAIL INSPECTION PANEL (1/4 width) */}
        <aside id="inspector-column" className="lg:col-span-1 p-4 bg-[#F9F8F6] overflow-y-auto">
          <ArticleDetailPanel
            article={activeSelectedArticle}
            roleMode={roleMode}
            isSaved={activeSelectedArticle ? savedArticleIds.includes(activeSelectedArticle.id) : false}
            onToggleSave={() => activeSelectedArticle && handleToggleSaveArticle(activeSelectedArticle.id)}
            onDrillDown={handleDrillDownFacetMatch}
            onClose={() => setSelectedArticleId(null)}
          />
        </aside>

      </main>

      {/* 4. WORKING SAVED SET DRAWER (Bottom Fixed Layout) */}
      <footer className="bg-[#1A1A1A] p-4 border-t border-[#E5E1D8]/20 mt-auto shrink-0 z-40">
        <div className="max-w-7xl mx-auto">
          <SavedWorkingSetDrawer
            savedArticles={savedArticlesList}
            roleMode={roleMode}
            onRemoveItem={handleRemoveSavedArticle}
            onClearAll={handleClearSavedArticles}
          />
        </div>
      </footer>

    </div>
  );
}
