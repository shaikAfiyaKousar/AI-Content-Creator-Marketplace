import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Terminal,
  Image,
  DollarSign,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AI_TOOLS_AVAILABLE = [
  'Midjourney',
  'Runway',
  'Flux',
  'Stable Diffusion',
  'ComfyUI',
  'ElevenLabs',
  'Kling',
  'ChatGPT',
  'DALL-E',
  'Magnific AI',
  'Photoshop GenFill'
];

const ProfileSettingsPage = () => {
  const { user, profile, updateProfileState, isCreator, isBrand } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [tagline, setTagline] = useState(profile?.tagline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [companyName, setCompanyName] = useState(profile?.companyName || '');
  const [industry, setIndustry] = useState(profile?.industry || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [hourlyRate, setHourlyRate] = useState(profile?.pricing?.hourlyRate || 80);
  const [projectMin, setProjectMin] = useState(profile?.pricing?.projectMin || 500);
  const [availability, setAvailability] = useState(profile?.availability || 'available');
  const [skillsStr, setSkillsStr] = useState((profile?.skills || []).join(', '));
  const [selectedTools, setSelectedTools] = useState(profile?.aiTools || ['Midjourney', 'Flux']);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Portfolio Management State (Creator)
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortCategory, setNewPortCategory] = useState('Advertising & Commercials');
  const [newPortPrompt, setNewPortPrompt] = useState('');
  const [newPortTools, setNewPortTools] = useState('Midjourney v6.1');
  const [newPortModel, setNewPortModel] = useState('Midjourney v6.1');
  const [addingPort, setAddingPort] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar);
    }
    if (profile) {
      setTagline(profile.tagline || '');
      setBio(profile.bio || '');
      setCompanyName(profile.companyName || '');
      setIndustry(profile.industry || '');
      setWebsite(profile.website || '');
      setHourlyRate(profile.pricing?.hourlyRate || 80);
      setProjectMin(profile.pricing?.projectMin || 500);
      setAvailability(profile.availability || 'available');
      setSkillsStr((profile.skills || []).join(', '));
      setSelectedTools(profile.aiTools || ['Midjourney', 'Flux']);
    }

    if (isCreator && user) {
      fetchCreatorPortfolio();
    }
  }, [user, profile]);

  const fetchCreatorPortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const res = await api.get(`/creators/${user.id}`);
      if (res.data.success) {
        setPortfolioItems(res.data.portfolio);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const toggleTool = (tool) => {
    setSelectedTools(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const skillsArray = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name,
        avatar,
        bio,
        ...(isBrand
          ? { companyName, industry, website }
          : {
              tagline,
              skills: skillsArray,
              aiTools: selectedTools,
              availability,
              pricing: { hourlyRate: Number(hourlyRate), projectMin: Number(projectMin), currency: 'USD' }
            })
      };

      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        updateProfileState(res.data.user, res.data.profile);
        setProfileSuccess('Profile successfully updated!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddPortfolioItem = async (e) => {
    e.preventDefault();
    if (!newPortTitle || !newPortUrl) return;

    setAddingPort(true);
    try {
      const toolsArr = newPortTools.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.post('/creators/portfolio', {
        title: newPortTitle,
        mediaUrl: newPortUrl,
        category: newPortCategory,
        promptUsed: newPortPrompt,
        aiToolsUsed: toolsArr,
        generationParams: { model: newPortModel }
      });

      if (res.data.success) {
        setPortfolioItems(prev => [res.data.portfolioItem, ...prev]);
        setNewPortTitle('');
        setNewPortUrl('');
        setNewPortPrompt('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingPort(false);
    }
  };

  const handleDeletePortfolioItem = async (itemId) => {
    try {
      const res = await api.delete(`/creators/portfolio/${itemId}`);
      if (res.data.success) {
        setPortfolioItems(prev => prev.filter(i => i._id !== itemId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Account Settings & Profile Management
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Customize your public presence, verified AI tools, and portfolio showcases.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          General Profile
        </button>

        {isCreator && (
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Portfolio Manager ({portfolioItems.length})</span>
          </button>
        )}
      </div>

      {profileSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {profileError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      {/* Tab 1: Profile Settings Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <User className="w-4 h-4 text-brand-500" />
              <span>Identity & Avatar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {isBrand ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Creator Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photorealistic Commercial Packshots & Runway Motion"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Bio & Background
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none leading-relaxed"
              />
            </div>

            {/* Creator Specific Toolchain & Pricing */}
            {isCreator && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Specialized Skills (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={skillsStr}
                    onChange={(e) => setSkillsStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Verified AI Tools
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AI_TOOLS_AVAILABLE.map((tool) => {
                      const isSelected = selectedTools.includes(tool);
                      return (
                        <button
                          type="button"
                          key={tool}
                          onClick={() => toggleTool(tool)}
                          className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                              : 'bg-gray-50 dark:bg-dark-base text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400'
                          }`}
                        >
                          {tool}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Project Minimum ($)
                    </label>
                    <input
                      type="number"
                      value={projectMin}
                      onChange={(e) => setProjectMin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Availability Status
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                    >
                      <option value="available">Available for work</option>
                      <option value="busy">Busy / Limited</option>
                      <option value="booked">Booked out</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Creator Portfolio Management */}
      {activeTab === 'portfolio' && isCreator && (
        <div className="space-y-6">
          
          {/* Add Item Form */}
          <form onSubmit={handleAddPortfolioItem} className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Plus className="w-4 h-4 text-brand-500" />
              <span>Upload & Document New AI Artwork</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holographic Cyberpunk Packshot"
                  value={newPortTitle}
                  onChange={(e) => setNewPortTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Media Image/Video URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newPortUrl}
                  onChange={(e) => setNewPortUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newPortCategory}
                  onChange={(e) => setNewPortCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                >
                  <option value="Advertising & Commercials">Advertising & Commercials</option>
                  <option value="Photorealistic Renders">Photorealistic Renders</option>
                  <option value="Motion & Video">Motion & Video</option>
                  <option value="Product Renders">Product Renders</option>
                  <option value="Fashion & Editorial">Fashion & Editorial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  AI Tools Used
                </label>
                <input
                  type="text"
                  placeholder="Midjourney v6.1, Flux Dev"
                  value={newPortTools}
                  onChange={(e) => setNewPortTools(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Model Checkpoint
                </label>
                <input
                  type="text"
                  placeholder="Midjourney v6.1 / Flux Schnell"
                  value={newPortModel}
                  onChange={(e) => setNewPortModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Generation Prompt Provenance *
              </label>
              <textarea
                rows={3}
                placeholder="Full generation prompt and parameter flags..."
                value={newPortPrompt}
                onChange={(e) => setNewPortPrompt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingPort}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{addingPort ? 'Adding...' : 'Add to Portfolio'}</span>
              </button>
            </div>
          </form>

          {/* Existing Items List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              Existing Portfolio Items ({portfolioItems.length})
            </h3>

            {portfolioItems.length === 0 ? (
              <p className="text-xs text-gray-400">No portfolio items added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-black">
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-400 uppercase font-mono block">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {(item.aiToolsUsed || []).slice(0, 2).join(', ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePortfolioItem(item._id)}
                        className="text-gray-400 hover:text-rose-500"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default ProfileSettingsPage;
