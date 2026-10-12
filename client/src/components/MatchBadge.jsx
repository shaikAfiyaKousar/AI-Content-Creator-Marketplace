import React, { useState } from 'react';
import { Sparkles, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const MatchBadge = ({ score, reason, factors }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getScoreColor = (s) => {
    if (s >= 90) return 'from-emerald-500 to-teal-500 text-emerald-400 border-emerald-500/30';
    if (s >= 75) return 'from-brand-500 to-indigo-500 text-brand-400 border-brand-500/30';
    if (s >= 60) return 'from-blue-500 to-cyan-500 text-blue-400 border-blue-500/30';
    return 'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-gray-900/80 backdrop-blur shadow-sm hover:scale-105 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
        <span className="text-xs font-bold font-mono text-white">
          {score}% AI Match
        </span>
        <Info className="w-3 h-3 text-gray-400 ml-0.5" />
      </div>

      {showTooltip && (
        <div className="absolute left-0 top-full mt-2 w-72 p-3 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl z-50 text-xs text-gray-200 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-bold text-white mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Match Breakdown ({score}%)</span>
          </div>

          <p className="text-[11px] text-gray-300 leading-relaxed mb-2">
            {reason || 'Multi-factor compatibility calculation based on tools, category, and budget.'}
          </p>

          {factors && (
            <div className="space-y-1 pt-1.5 border-t border-gray-800 text-[10px] font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Tool Overlap:</span>
                <span className="text-emerald-400 font-semibold">{factors.toolScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category Fit:</span>
                <span className="text-purple-400 font-semibold">{factors.categoryScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Budget Compatibility:</span>
                <span className="text-blue-400 font-semibold">{factors.budgetScore}%</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchBadge;
