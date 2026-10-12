import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  PlusCircle,
  X,
  Calendar,
  DollarSign,
  FileText,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Layers
} from 'lucide-react';

const POPULAR_TOOLS = [
  'Midjourney',
  'Runway',
  'Flux',
  'Stable Diffusion',
  'ComfyUI',
  'ElevenLabs',
  'Kling',
  'Magnific AI',
  'Photoshop GenFill',
  'ChatGPT'
];

const CATEGORIES = [
  'Advertising & Commercials',
  'Photorealistic Renders',
  'Motion & Video',
  'Character Design',
  'Sci-Fi & Cyberpunk',
  'Product Renders',
  'Fashion & Editorial',
  'Voice & Audio'
];

const CreateBriefPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Advertising & Commercials',
    budgetMin: 800,
    budgetMax: 2000,
    deadline: '',
    promptGuidelines: '',
    targetAudience: '',
    deliverables: ['3 High-Resolution 4K Key Renders', 'Full prompt documentation and generation seed logs'],
    requiredAiTools: ['Midjourney', 'Flux']
  });

  const [newDeliverable, setNewDeliverable] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTool = (tool) => {
    setFormData(prev => {
      const exists = prev.requiredAiTools.includes(tool);
      return {
        ...prev,
        requiredAiTools: exists
          ? prev.requiredAiTools.filter(t => t !== tool)
          : [...prev.requiredAiTools, tool]
      };
    });
  };

  const handleAddDeliverable = () => {
    if (!newDeliverable.trim()) return;
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, newDeliverable.trim()]
    }));
    setNewDeliverable('');
  };

  const handleRemoveDeliverable = (idx) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.deadline) {
      setError('Please fill in title, description, and deadline date');
      return;
    }

    if (formData.requiredAiTools.length === 0) {
      setError('Please select at least one required AI tool');
      return;
    }

    if (formData.deliverables.length === 0) {
      setError('Please specify at least one deliverable');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/briefs', formData);
      if (res.data.success) {
        navigate(`/briefs/${res.data.brief._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish creative brief');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>New Campaign Commission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Publish a Creative Brief
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Specify your project scope, desired generative AI toolchain, budget range, and creative direction.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Specs Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <FileText className="w-4 h-4 text-brand-500" />
            <span>Project Scope & Category</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next-Gen Cyberpunk Game Cinematic Teaser & Key Art"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Creative Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Deadline Date *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Project Brief Description & Requirements *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the campaign background, aesthetic goals, aspect ratios, mood boards, and overall vision..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* AI Toolchain & Deliverables Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Terminal className="w-4 h-4 text-brand-500" />
            <span>Required Generative Toolchain</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Desired AI Tools / Workflows:
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TOOLS.map((tool) => {
                const isSelected = formData.requiredAiTools.includes(tool);
                return (
                  <button
                    type="button"
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-dark-base text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{tool}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Prompt Guidelines, Negative Prompts & Style Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Clean cinematic lighting, titanium textures, volumetric fog, avoid oversaturation or cartoonish stylization."
              value={formData.promptGuidelines}
              onChange={(e) => setFormData({ ...formData, promptGuidelines: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>

          {/* Deliverables List Builder */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Deliverables Checklist *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add deliverable (e.g. 5x 4K Master Renders, 1x 15s 9:16 Video)"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); } }}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5">
              {formData.deliverables.map((d, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 text-xs flex items-center justify-between"
                >
                  <span className="text-gray-800 dark:text-gray-200 font-medium">✓ {d}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(idx)}
                    className="text-gray-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Budget Range (USD)</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Minimum Budget ($)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={formData.budgetMin}
                onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Maximum Budget ($)
              </label>
              <input
                type="number"
                min="200"
                step="50"
                required
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              placeholder="e.g. Gen-Z gamers, luxury beauty consumers, enterprise buyers"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/brand')}
            className="px-5 py-3 rounded-xl text-xs font-bold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 via-indigo-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Publishing Brief...' : 'Publish Creative Brief & Match Creators'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateBriefPage;
