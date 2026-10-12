import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Clock, Briefcase, Sparkles, ArrowRight, Eye } from 'lucide-react';

const CreatorCard = ({ creator, onPreviewPortfolio }) => {
  const user = creator.user || {};
  const previews = creator.portfolioPreviews || [];

  const getAvailabilityClass = (avail) => {
    switch (avail) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'busy':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 flex flex-col justify-between overflow-hidden">
      
      {/* Top Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition-all"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-card flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/creators/${user._id || creator._id}`}
                  className="font-bold text-gray-900 dark:text-white hover:text-brand-500 text-sm transition-colors"
                >
                  {user.name}
                </Link>
                <ShieldCheck className="w-4 h-4 text-brand-500 fill-brand-500/20" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                {creator.tagline || 'AI Visual Media Artist'}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${getAvailabilityClass(
              creator.availability
            )}`}
          >
            {creator.availability || 'Available'}
          </span>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {creator.bio}
        </p>

        {/* AI Tools Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(creator.aiTools || []).slice(0, 4).map((tool, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20"
            >
              {tool}
            </span>
          ))}
          {(creator.aiTools || []).length > 4 && (
            <span className="text-[10px] font-mono text-gray-400 self-center">
              +{creator.aiTools.length - 4} more
            </span>
          )}
        </div>

        {/* Portfolio Previews Grid */}
        {previews.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] font-medium text-gray-400 mb-1.5 flex items-center justify-between">
              <span>Recent AI Works</span>
              <span className="text-[10px] text-brand-400">Click to inspect prompt</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {previews.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onPreviewPortfolio && onPreviewPortfolio(item, user)}
                  className="group/thumb relative aspect-video rounded-lg overflow-hidden cursor-pointer bg-gray-900 border border-gray-800"
                >
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Stats Bar */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-gray-900 dark:text-white">
              {creator.rating?.toFixed(1) || '5.0'}
            </span>
            <span className="text-[10px] text-gray-400">
              ({creator.reviewsCount || 0})
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <Briefcase className="w-3 h-3 text-indigo-400" />
            <span>{creator.completedProjects || 0} projects</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 block">Rate from</span>
            <span className="font-bold text-gray-900 dark:text-white">
              ${creator.pricing?.hourlyRate || 75}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-gray-50/80 dark:bg-dark-base/50 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2">
        <Link
          to={`/creators/${user._id || creator._id}`}
          className="flex-1 py-2 px-3 rounded-xl text-center text-xs font-semibold bg-brand-600/10 hover:bg-brand-600 text-brand-600 hover:text-white dark:bg-brand-500/20 dark:hover:bg-brand-600 dark:text-brand-300 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/messages?to=${user._id || creator._id}`}
          className="py-2 px-3 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Message
        </Link>
      </div>

    </div>
  );
};

export default CreatorCard;
