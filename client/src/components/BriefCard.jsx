import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const BriefCard = ({ brief }) => {
  const brand = brief.brand || {};
  const brandProfile = brief.brandProfile || {};

  const deadlineFormatted = new Date(brief.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card hover:border-brand-500/40 transition-all duration-300 p-5 flex flex-col justify-between group shadow-sm hover:shadow-md">
      <div>
        {/* Top meta */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {brief.category}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${getStatusBadge(
                brief.status
              )}`}
            >
              {brief.status === 'in_progress' ? 'Assigned & In Progress' : brief.status}
            </span>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-end">
              <span>${brief.budgetMin?.toLocaleString()}</span>
              <span className="text-gray-400 mx-1">-</span>
              <span>${brief.budgetMax?.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">USD Budget</span>
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/briefs/${brief._id}`}
          className="text-base font-bold text-gray-900 dark:text-white hover:text-brand-500 transition-colors line-clamp-1 group-hover:text-brand-400"
        >
          {brief.title}
        </Link>

        {/* Brand preview */}
        <div className="flex items-center gap-2 mt-1 mb-3 text-xs text-gray-500 dark:text-gray-400">
          <span>Posted by <strong className="text-gray-700 dark:text-gray-300">{brandProfile.companyName || brand.name || 'Verified Brand'}</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Due {deadlineFormatted}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
          {brief.description}
        </p>

        {/* Required Tools Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] text-gray-400 self-center mr-1">Required AI:</span>
          {(brief.requiredAiTools || []).map((tool, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-electric-500/10 text-electric-600 dark:text-electric-300 border border-electric-500/20"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Users className="w-3.5 h-3.5 text-brand-500" />
          <span>{brief.applicationsCount || 0} applications</span>
        </div>

        <Link
          to={`/briefs/${brief._id}`}
          className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 text-gray-800 dark:text-gray-200 transition-all flex items-center gap-1"
        >
          <span>View Brief & Apply</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default BriefCard;
