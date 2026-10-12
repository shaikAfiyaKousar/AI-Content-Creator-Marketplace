import React, { useState } from 'react';
import { X, CheckCircle2, Star, Sparkles } from 'lucide-react';

const CompleteReviewModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('Outstanding quality, exceptional AI prompt precision and fast turnaround!');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
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
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Approve Deliverables & Complete Project
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Release milestone funds and rate creator performance
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Creator Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 ml-2 font-mono">
                {rating}.0 / 5.0
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Public Review & Feedback *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the creator's communication, tool mastery, and asset quality..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-emerald-500 text-gray-900 dark:text-white outline-none leading-relaxed"
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>
              This will mark the project stage as <strong>Completed</strong> and update the creator's profile rating.
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
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {submitting ? 'Completing...' : 'Approve & Release Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteReviewModal;
