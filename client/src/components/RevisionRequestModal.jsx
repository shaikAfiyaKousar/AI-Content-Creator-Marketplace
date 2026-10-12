import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';

const RevisionRequestModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onSubmit(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Request Deliverable Revision
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Provide actionable guidance for the creator to iterate
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Feedback & Adjustments Needed *
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. Please adjust the rim lighting on the product bottle and increase the depth-of-field blur in the background. Keep the current color grading."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-amber-500 text-gray-900 dark:text-white outline-none leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Requesting a revision will move the project stage to <strong>Revision Requested</strong> and alert the creator.
            </span>
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
              disabled={submitting || !feedback.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Send Revision Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevisionRequestModal;
