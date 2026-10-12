import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Terminal, Sliders, ExternalLink, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioModal = ({ item, creator, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopyPrompt = () => {
    if (item.promptUsed) {
      navigator.clipboard.writeText(item.promptUsed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const params = item.generationParams || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Media Display */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden group">
          {item.mediaType === 'video' ? (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[350px]">
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-brand-600/90 text-white text-xs font-semibold backdrop-blur flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 60fps Runway Motion Sequence
                </span>
              </div>
            </div>
          ) : (
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[80vh] p-2"
            />
          )}

          {/* C2PA Provenance badge */}
          <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur border border-white/10 text-[11px] text-gray-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Provenance Verified</span>
          </div>
        </div>

        {/* Right Side: Metadata & Prompt Inspector */}
        <div className="md:w-2/5 p-6 overflow-y-auto max-h-[85vh] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {item.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 leading-snug">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            {/* Creator info */}
            {creator && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 mb-5">
                <img
                  src={creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={creator.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    Created by {creator.name}
                  </div>
                  <Link
                    to={`/creators/${creator._id || creator.id}`}
                    onClick={onClose}
                    className="text-[11px] text-brand-500 hover:underline flex items-center gap-1"
                  >
                    <span>View creator profile</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Tools Used */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>AI Tools Applied</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(item.aiToolsUsed || []).map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Section */}
            {item.promptUsed && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-brand-500" />
                    <span>Generation Prompt</span>
                  </h4>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-[11px] font-medium text-brand-500 hover:text-brand-400 flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 font-mono text-[11px] leading-relaxed select-all">
                  "{item.promptUsed}"
                </div>
              </div>
            )}

            {/* Negative Prompt if exists */}
            {item.negativePrompt && (
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Negative Prompt
                </h4>
                <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-rose-300 font-mono text-[11px] leading-relaxed">
                  {item.negativePrompt}
                </div>
              </div>
            )}

            {/* Technical Generation Specs */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-500" />
                <span>Model Specs & Parameters</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Model</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {params.model || 'Midjourney v6.1'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Seed</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {params.seed || '4829104'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px]">Steps</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {params.steps || 35}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px]">CFG Scale</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {params.cfgScale || 7.0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          {creator && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                to={`/creators/${creator._id || creator.id}`}
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Hire {creator.name} For Your Campaign</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PortfolioModal;
