import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  PlusCircle,
  FileText,
  Users,
  Briefcase,
  DollarSign,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const BrandDashboard = () => {
  const { user, profile } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [briefsRes, projectsRes, creatorsRes] = await Promise.all([
          api.get('/briefs/brand/my-briefs'),
          api.get('/projects'),
          api.get('/creators?sortBy=rating')
        ]);

        if (briefsRes.data.success) setBriefs(briefsRes.data.briefs);
        if (projectsRes.data.success) setProjects(projectsRes.data.projects);
        if (creatorsRes.data.success) setTopCreators(creatorsRes.data.creators.slice(0, 3));
      } catch (err) {
        console.error('Error fetching brand dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalApplications = briefs.reduce((acc, b) => acc + (b.applicationsCount || 0), 0);
  const activeProjects = projects.filter(p => p.stage !== 'Completed');
  const completedProjects = projects.filter(p => p.stage === 'Completed');
  const totalSpend = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

  const getStageColor = (stage) => {
    switch (stage) {
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Submitted': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Revision Requested': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 space-y-8">
          
          {/* Dashboard Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-950/40 to-electric-950/40 border border-brand-500/20 backdrop-blur-sm gap-4 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-brand-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Brand Operations Hub</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'Brand Partner'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage your generative campaigns, evaluate creator pitches, and review deliverables.
              </p>
            </div>

            <Link
              to="/briefs/create"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 self-start sm:self-auto hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Creative Brief</span>
            </Link>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Briefs</span>
                <FileText className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
                {briefs.length}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Published campaigns
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
                {totalApplications}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Creator pitches received
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                <Briefcase className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-purple-500 font-mono">
                {activeProjects.length}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Active project workspaces
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Allocated</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-500 font-mono">
                ${totalSpend.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Project budget volume
              </div>
            </div>
          </div>

          {/* Active Projects Tracker */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  <span>Active Project Workspaces ({projects.length})</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track stages from generation kick-off to deliverable approval.
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-400 mb-2">No active projects yet. Publish a brief or accept an application to begin.</p>
                <Link to="/briefs/create" className="text-xs font-bold text-brand-500 underline">
                  Post a brief now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={project.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={project.creator?.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/20"
                      />
                      <div>
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
                        >
                          {project.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span>Creator: <strong className="text-gray-700 dark:text-gray-300">{project.creator?.name}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-emerald-500 font-semibold">${project.budget}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${getStageColor(project.stage)}`}>
                        {project.stage}
                      </span>
                      <Link
                        to={`/projects/${project._id}`}
                        className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:border-brand-500 text-gray-800 dark:text-gray-200 transition-colors flex items-center gap-1"
                      >
                        <span>Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Published Briefs Section */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span>My Published Creative Briefs</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Review applicant pitches and evaluate AI matching scores.
                </p>
              </div>

              <Link
                to="/briefs/create"
                className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
              >
                <span>+ New Brief</span>
              </Link>
            </div>

            {briefs.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-400">You haven't posted any creative briefs yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {briefs.map((brief) => (
                  <div
                    key={brief._id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 border border-brand-500/20">
                          {brief.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Due: {new Date(brief.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        to={`/briefs/${brief._id}`}
                        className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
                      >
                        {brief.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-mono">${brief.budgetMin} - ${brief.budgetMax}</span>
                        <span>•</span>
                        <span>Tools: {(brief.requiredAiTools || []).join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/briefs/${brief._id}`}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-sm flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View {brief.applicationsCount || 0} Pitches</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Recommended Creators Widget */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                  <span>Top AI Creators Ready to Collaborate</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Vetted talent available for prompt engineering and commercial production.
                </p>
              </div>

              <Link
                to="/creators"
                className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCreators.map((c) => (
                <div
                  key={c._id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={c.user?.avatar}
                      alt={c.user?.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/20"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        {c.user?.name}
                      </div>
                      <div className="text-[11px] text-brand-500 font-mono">
                        ${c.pricing?.hourlyRate}/hr • {c.rating}★
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                    {c.tagline}
                  </p>
                  <Link
                    to={`/creators/${c._id}`}
                    className="w-full py-1.5 rounded-lg text-center text-xs font-semibold bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:border-brand-500 text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    View Portfolio
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default BrandDashboard;
