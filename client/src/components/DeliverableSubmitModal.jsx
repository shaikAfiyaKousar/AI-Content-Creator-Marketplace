import React, { useState } from 'react';
import { X, UploadCloud, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

const DeliverableSubmitModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    notes: '',
    promptUsed: '',
    aiToolsUsed: 'Midjourney v6.1, Photoshop'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const toolsArray = formData.aiToolsUsed
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSubmit({
      ...formData,
      aiToolsUsed: toolsArray
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Submit Project Deliverable
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Provide the asset link and AI prompt provenance logs
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Deliverable Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Key Art 4K Render (Final Pass)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Asset Media URL or Cloud Storage Link *
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/... or Google Drive / Dropbox link"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              AI Tools Applied (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="Midjourney v6.1, Flux Dev, Magnific AI"
              value={formData.aiToolsUsed}
              onChange={(e) => setFormData({ ...formData, aiToolsUsed: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Generation Prompt / Parameters Used
            </label>
            <textarea
              rows={3}
              placeholder="Full prompt, seed, model checkpoint, and lighting guidance..."
              value={formData.promptUsed}
              onChange={(e) => setFormData({ ...formData, promptUsed: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Creator Notes & Handover Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Explain variations provided, aspect ratios, color grading details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? 'Submitting...' : 'Upload & Mark Submitted'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliverableSubmitModal;
