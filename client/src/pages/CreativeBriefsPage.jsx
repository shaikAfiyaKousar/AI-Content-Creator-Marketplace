import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BriefCard from '../components/BriefCard';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Sparkles,
  DollarSign,
  Calendar,
  X,
  RefreshCw
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Advertising & Commercials',
  'Photorealistic Renders',
  'Motion & Video',
  'Character Design',
  'Product Renders',
  'Fashion & Editorial'
];

const CreativeBriefsPage = () => {
  const { user, isBrand } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTool, setSelectedTool] = useState('All Tools');

  const fetchBriefs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedTool !== 'All Tools') params.aiTool = selectedTool;

      const res = await api.get('/briefs', { params });
      if (res.data.success) {
        setBriefs(res.data.briefs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, [selectedCategory, selectedTool]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBriefs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Explore Creative Briefs</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
              {briefs.length} active
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Apply to commercial campaigns, packshot renders, and AI video productions.
          </p>
        </div>

        {isBrand && (
          <Link
            to="/briefs/create"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 flex items-center gap-2 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Brief</span>
          </Link>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search briefs by title, brand, keywords, or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none shadow-sm focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
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

      {/* Briefs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : briefs.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            No creative briefs found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-4">
            Try adjusting your search terms or selecting "All Categories".
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All Categories'); }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {briefs.map((brief) => (
            <BriefCard key={brief._id} brief={brief} />
          ))}
        </div>
      )}

    </div>
  );
};

export default CreativeBriefsPage;
