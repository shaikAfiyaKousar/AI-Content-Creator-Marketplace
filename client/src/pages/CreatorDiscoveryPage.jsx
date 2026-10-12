import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import CreatorCard from '../components/CreatorCard';
import PortfolioModal from '../components/PortfolioModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  Star,
  DollarSign,
  Briefcase,
  Check,
  RefreshCw
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Advertising & Commercials',
  'Photorealistic Renders',
  'Motion & Video',
  'Character Design',
  'Sci-Fi & Cyberpunk',
  'Product Renders',
  'Fashion & Editorial',
  'Voice & Audio'
];

const AI_TOOLS = [
  'All Tools',
  'Midjourney',
  'Runway',
  'Flux',
  'ComfyUI',
  'Stable Diffusion',
  'ElevenLabs',
  'Kling',
  'ChatGPT',
  'DALL-E'
];

const CreatorDiscoveryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [selectedTool, setSelectedTool] = useState(searchParams.get('aiTool') || 'All Tools');
  const [availability, setAvailability] = useState('all');
  const [maxRate, setMaxRate] = useState(150);
  const [minRating, setMinRating] = useState(4.0);
  const [sortBy, setSortBy] = useState('rating');

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Portfolio modal
  const [modalItem, setModalItem] = useState(null);
  const [modalCreator, setModalCreator] = useState(null);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedTool !== 'All Tools') params.aiTool = selectedTool;
      if (availability !== 'all') params.availability = availability;
      if (maxRate < 150) params.maxRate = maxRate;
      if (minRating > 4.0) params.minRating = minRating;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/creators', { params });
      if (res.data.success) {
        setCreators(res.data.creators);
      }
    } catch (err) {
      console.error('Error fetching creators', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [selectedCategory, selectedTool, availability, maxRate, minRating, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCreators();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All Categories');
    setSelectedTool('All Tools');
    setAvailability('all');
    setMaxRate(150);
    setMinRating(4.0);
    setSortBy('rating');
  };

  const activeFiltersCount =
    (selectedCategory !== 'All Categories' ? 1 : 0) +
    (selectedTool !== 'All Tools' ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (maxRate < 150 ? 1 : 0) +
    (minRating > 4.0 ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title & Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Discover AI Content Creators</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                {creators.length} verified
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Filter by AI model workflows, verified prompt portfolios, hourly rates, and availability.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, prompt style, LoRA, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); fetchCreators(); }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Filter Pill Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-brand-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid + Filter Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filter Sidebar (Desktop) */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-brand-500 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* AI Tool Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                AI Tool Workflow
              </label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
              >
                {AI_TOOLS.map((tool) => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
            </div>

            {/* Hourly Rate Slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Max Hourly Rate</span>
                <span className="font-mono font-bold text-brand-500">${maxRate}/hr</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                step="5"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>$40</span>
                <span>$150+</span>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Availability Status
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Statuses' },
                  { id: 'available', label: 'Available Now' },
                  { id: 'busy', label: 'Busy / Booked' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                    <input
                      type="radio"
                      name="avail"
                      checked={availability === item.id}
                      onChange={() => setAvailability(item.id)}
                      className="accent-brand-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sort Results By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="projects">Most Completed Projects</option>
                <option value="experience">Most Experience</option>
                <option value="rate_asc">Rate: Low to High</option>
                <option value="rate_desc">Rate: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Creator Results Feed */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                No creators found matching these filters
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
                Try widening your search terms, raising the rate threshold, or selecting "All Tools".
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <CreatorCard
                  key={creator._id}
                  creator={creator}
                  onPreviewPortfolio={(item, user) => {
                    setModalItem(item);
                    setModalCreator(user);
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Portfolio Item Detail Modal */}
      {modalItem && (
        <PortfolioModal
          item={modalItem}
          creator={modalCreator}
          onClose={() => setModalItem(null)}
        />
      )}

    </div>
  );
};

export default CreatorDiscoveryPage;
