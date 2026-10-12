import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import MatchBadge from '../components/MatchBadge';
import {
  Calendar,
  DollarSign,
  Briefcase,
  Users,
  Sparkles,
  Terminal,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  AlertCircle,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

const BriefDetailsPage = () => {
  const { id } = useParams();
  const { user, isBrand, isCreator } = useAuth();
  const navigate = useNavigate();

  const [brief, setBrief] = useState(null);
  const [applications, setApplications] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBrandTab, setActiveBrandTab] = useState('applications');

  // Application form state (Creator)
  const [pitch, setPitch] = useState('');
  const [proposedRate, setProposedRate] = useState(1200);
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [sampleUrls, setSampleUrls] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(null);
  const [applyError, setApplyError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);

  const fetchBriefData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/briefs/${id}`);
      if (res.data.success) {
        setBrief(res.data.brief);
        setHasApplied(res.data.hasApplied);
        setUserApplication(res.data.userApplication);
        if (res.data.brief.budgetMin) {
          setProposedRate(res.data.brief.budgetMin);
        }

        // If current user is the owner brand of this brief
        if (user && res.data.brief.brand?._id === user.id) {
          const [appsRes, recsRes] = await Promise.all([
            api.get(`/applications/brief/${id}`),
            api.get(`/match/recommendations/${id}`)
          ]);
          if (appsRes.data.success) setApplications(appsRes.data.applications);
          if (recsRes.data.success) setAiRecommendations(recsRes.data.recommendations);
        }
      }
    } catch (err) {
      console.error('Error fetching brief data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplying(true);

    try {
      const samples = sampleUrls
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await api.post(`/applications/${id}`, {
        pitch,
        proposedRate: Number(proposedRate),
        estimatedDeliveryDays: Number(deliveryDays),
        samplePortfolioUrls: samples
      });

      if (res.data.success) {
        setApplySuccess(res.data);
        setHasApplied(true);
        setUserApplication(res.data.application);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    setStatusError('');
    setUpdatingApplicationId(appId);
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        if (newStatus === 'accepted' && res.data.project) {
          // Project created! Direct brand to project workspace
          navigate(`/projects/${res.data.project._id}`);
        } else {
          fetchBriefData();
        }
      }
    } catch (err) {
      setStatusError(err.response?.data?.message || err.message || 'Could not update this application. Please try again.');
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400">Loading creative brief & AI matching specifications...</p>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Brief not found</h2>
        <Link to="/briefs" className="text-xs text-brand-500 underline">Back to all briefs</Link>
      </div>
    );
  }

  const isBriefOwner = user && brief.brand?._id === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link to="/briefs" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-500 flex items-center gap-1">
          ← Back to Creative Briefs
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            {brief.category}
          </span>
          <span className="text-xs font-semibold capitalize px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {brief.status === 'in_progress' ? 'Assigned' : brief.status}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Brief Specs / Right Brand Card & Apply Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Brief Specs */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {brief.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 font-bold text-emerald-500 font-mono text-sm">
                  <DollarSign className="w-4 h-4" />
                  ${brief.budgetMin?.toLocaleString()} - ${brief.budgetMax?.toLocaleString()} USD
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due {new Date(brief.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand-500" />
                  {brief.applicationsCount || 0} applications
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                Project Overview & Requirements
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {brief.description}
              </p>
            </div>

            {/* Deliverables Checklist */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-500" />
                <span>Required Deliverables</span>
              </h3>
              <div className="space-y-2">
                {(brief.deliverables || []).map((deliv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-md bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Tools & Prompt Guidelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold uppercase text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-brand-500" />
                  <span>Required AI Tools</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(brief.requiredAiTools || []).map((tool, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {brief.targetAudience && (
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase text-gray-900 dark:text-white mb-2">
                    Target Audience
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {brief.targetAudience}
                  </p>
                </div>
              )}
            </div>

            {brief.promptGuidelines && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                  Prompt Guidelines & Lighting Direction
                </h3>
                <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-200 font-mono text-xs leading-relaxed">
                  "{brief.promptGuidelines}"
                </div>
              </div>
            )}
          </div>

          {/* If Brand Owner: Applications Management Section */}
          {isBriefOwner && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Brief Management & Submissions
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Evaluate applicant pitches with automated AI matching scores.
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-dark-base border border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setActiveBrandTab('applications')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeBrandTab === 'applications'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Applications ({applications.length})
                  </button>
                  <button
                    onClick={() => setActiveBrandTab('matchmaker')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      activeBrandTab === 'matchmaker'
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>AI Matchmaker</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Applications Received */}
              {activeBrandTab === 'applications' && (
                <div className="space-y-4">
                  {statusError && (
                    <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-500">
                      {statusError}
                    </p>
                  )}
                  {applications.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400">
                      No applications submitted for this brief yet.
                    </div>
                  ) : (
                    applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.creator?.avatar}
                              alt={app.creator?.name}
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/20"
                            />
                            <div>
                              <Link
                                to={`/creators/${app.creator?._id}`}
                                className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500"
                              >
                                {app.creator?.name}
                              </Link>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Proposed: <strong className="text-emerald-500 font-mono">${app.proposedRate}</strong> • Delivery: <strong>{app.estimatedDeliveryDays} days</strong>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MatchBadge score={app.aiMatchScore} reason={app.aiMatchReason} />
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border capitalize text-gray-400">
                              {app.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                          "{app.pitch}"
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <Link
                            to={`/messages?to=${app.creator?._id}`}
                            className="text-xs text-brand-500 hover:underline flex items-center gap-1"
                          >
                            <span>Chat with creator</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>

                          {app.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                                disabled={updatingApplicationId !== null}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleUpdateAppStatus(app._id, 'accepted')}
                                disabled={updatingApplicationId !== null}
                                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{updatingApplicationId === app._id ? 'Updating...' : 'Accept & Launch Project'}</span>
                              </button>
                            </div>
                          )}

                          {app.status === 'accepted' && (
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accepted & Project Active</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: AI Matchmaker Ranked Recommendations */}
              {activeBrandTab === 'matchmaker' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-400 leading-relaxed">
                    <strong>AI Recommendation Engine:</strong> Ranked creators based on required AI tool mastery ({(brief.requiredAiTools || []).join(', ')}), past packshot & commercial portfolio items, pricing alignment, and availability.
                  </div>

                  {aiRecommendations.map((rec) => (
                    <div
                      key={rec.creator._id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={rec.creator.avatar}
                          alt={rec.creator.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/creators/${rec.creator._id}`}
                              className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500"
                            >
                              {rec.creator.name}
                            </Link>
                            <MatchBadge score={rec.aiMatchScore} reason={rec.aiMatchReason} factors={rec.factors} />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {rec.profile?.tagline}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 italic leading-relaxed">
                            "{rec.aiMatchReason}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          to={`/creators/${rec.creator._id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-brand-500"
                        >
                          View Portfolio
                        </Link>
                        <Link
                          to={`/messages?to=${rec.creator._id}`}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white"
                        >
                          Invite
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right Column: Brand Profile & Creator Application Form */}
        <div className="space-y-6">
          
          {/* Brand Info Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              Commissioning Brand
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={brief.brand?.avatar}
                alt={brief.brand?.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {brief.brandProfile?.companyName || brief.brand?.name}
                </h4>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {brief.brandProfile?.industry || 'Digital Media & Brand Studio'}
                </div>
              </div>
            </div>

            {brief.brandProfile?.bio && (
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {brief.brandProfile.bio}
              </p>
            )}

            <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{brief.brandProfile?.location || 'Global Remote'}</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Brand
              </span>
            </div>
          </div>

          {/* Creator Application Card */}
          {isCreator && (
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Submit Campaign Pitch
                </h3>
              </div>

              {hasApplied ? (
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Pitch Submitted</span>
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border capitalize text-purple-300">
                      {userApplication?.status || 'Pending Review'}
                    </span>
                  </div>

                  {userApplication?.aiMatchScore > 0 && (
                    <div>
                      <MatchBadge
                        score={userApplication.aiMatchScore}
                        reason={userApplication.aiMatchReason}
                      />
                    </div>
                  )}

                  <p className="text-xs text-gray-300 italic">
                    "{userApplication?.pitch}"
                  </p>

                  <div className="text-[11px] text-gray-400 border-t border-brand-500/20 pt-2 flex justify-between font-mono">
                    <span>Proposed: ${userApplication?.proposedRate}</span>
                    <span>Delivery: {userApplication?.estimatedDeliveryDays} days</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  {applyError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{applyError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Pitch & AI Technical Approach *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Explain your approach, model checkpoints, LoRA consistency, lighting setup, and past relevant projects..."
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Proposed Rate ($) *
                      </label>
                      <input
                        type="number"
                        required
                        value={proposedRate}
                        onChange={(e) => setProposedRate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Est. Days *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="60"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Relevant Sample Links (One per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://images.unsplash.com/...&#10;https://..."
                      value={sampleUrls}
                      onChange={(e) => setSampleUrls(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{applying ? 'Evaluating & Submitting...' : 'Submit Pitch (Instant AI Match)'}</span>
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default BriefDetailsPage;
