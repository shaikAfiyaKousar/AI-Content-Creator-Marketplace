import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import PortfolioModal from '../components/PortfolioModal';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Sparkles,
  MessageSquare,
  ExternalLink,
  Layers,
  Terminal,
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';

const CreatorProfilePage = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/creators/${id}`);
        if (res.data.success) {
          setCreator(res.data.creator);
          setPortfolio(res.data.portfolio);
        }
      } catch (err) {
        console.error('Failed to load creator profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400">Loading creator portfolio & credentials...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Creator not found</h2>
        <Link to="/creators" className="text-xs text-brand-500 underline">Back to creators</Link>
      </div>
    );
  }

  const user = creator.user || {};
  const filteredPortfolio = portfolio.filter(item => {
    if (mediaFilter === 'image') return item.mediaType === 'image';
    if (mediaFilter === 'video') return item.mediaType === 'video';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card overflow-hidden shadow-sm mb-8">
        
        {/* Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-brand-900 via-indigo-900 to-electric-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(139,92,246,0.3),_transparent_50%)]" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            
            {/* Avatar & Title */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-dark-card shadow-2xl"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <span className="p-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20" title="C2PA & Platform Verified">
                    <ShieldCheck className="w-4 h-4 fill-brand-500/20" />
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-medium">
                  {creator.tagline || 'AI Generative Artist'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {creator.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {creator.experienceYears || 3} years exp
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold capitalize">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {creator.availability || 'Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to={`/messages?to=${user._id}`}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-300 dark:border-gray-700 hover:border-gray-400 text-gray-800 dark:text-gray-200 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </Link>

              <Link
                to="/briefs/create"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Invite to Brief</span>
              </Link>
            </div>

          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-gray-100 dark:border-gray-800 my-6">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800/60">
              <div className="text-gray-400 text-[10px] uppercase font-semibold">Client Rating</div>
              <div className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{creator.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-xs text-gray-400 font-normal">({creator.reviewsCount || 0} reviews)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800/60">
              <div className="text-gray-400 text-[10px] uppercase font-semibold">Completed Projects</div>
              <div className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>{creator.completedProjects || 0} Delivered</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800/60">
              <div className="text-gray-400 text-[10px] uppercase font-semibold">Hourly Rate</div>
              <div className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>${creator.pricing?.hourlyRate || 75}/hr</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800/60">
              <div className="text-gray-400 text-[10px] uppercase font-semibold">Project Minimum</div>
              <div className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1 mt-0.5">
                <span className="font-mono text-brand-500">${creator.pricing?.projectMin || 500}</span>
              </div>
            </div>
          </div>

          {/* Bio & Skills Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                  About the Creator
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {creator.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                  Specialized Disciplines & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(creator.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Tools & Verified Badges Sidebar */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-500" />
                  <span>AI Workflows & Tools</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(creator.aiTools || []).map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {creator.badges?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                    Verified Badges
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {creator.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Portfolio Showcase Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Portfolio & Prompt Showcase
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Click any asset to inspect exact generation prompt, parameters, seed, and model checkpoints.
            </p>
          </div>

          {/* Media Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-gray-800 self-start sm:self-center">
            {['all', 'image', 'video'].map((tab) => (
              <button
                key={tab}
                onClick={() => setMediaFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  mediaFilter === tab
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Works' : tab === 'image' ? 'Images' : 'Video Motion'}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Gallery Grid */}
        {filteredPortfolio.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 p-8">
            <p className="text-xs text-gray-400">No portfolio items found in this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedPortfolioItem(item)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-brand-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-brand-400" />
                      <span>Inspect Prompt & Specs</span>
                    </span>
                  </div>
                  {item.mediaType === 'video' && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-purple-300 border border-purple-500/30">
                      Runway Video
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-dark-card">
                  <div>
                    <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                    <span>{item.generationParams?.model || 'Midjourney v6.1'}</span>
                    <span className="text-brand-400 hover:underline">View Prompt →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio Item Detail Modal */}
      {selectedPortfolioItem && (
        <PortfolioModal
          item={selectedPortfolioItem}
          creator={user}
          onClose={() => setSelectedPortfolioItem(null)}
        />
      )}

    </div>
  );
};

export default CreatorProfilePage;
