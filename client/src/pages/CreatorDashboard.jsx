import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Briefcase,
  FileText,
  DollarSign,
  Star,
  Sparkles,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

const CreatorDashboard = () => {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [openBriefs, setOpenBriefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorData = async () => {
      setLoading(true);
      try {
        const [appsRes, projectsRes, briefsRes] = await Promise.all([
          api.get('/applications/creator/my-applications'),
          api.get('/projects'),
          api.get('/briefs?status=open')
        ]);

        if (appsRes.data.success) setApplications(appsRes.data.applications);
        if (projectsRes.data.success) setProjects(projectsRes.data.projects);
        if (briefsRes.data.success) setOpenBriefs(briefsRes.data.briefs.slice(0, 3));
      } catch (err) {
        console.error('Error fetching creator dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, []);

  const activeProjects = projects.filter(p => p.stage !== 'Completed');
  const completedProjects = projects.filter(p => p.stage === 'Completed');
  const totalEarnings = completedProjects.reduce((acc, p) => acc + (p.budget || 0), 0);

  const getStageColor = (stage) => {
    switch (stage) {
      case 'In Progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Submitted': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Revision Requested': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getAppStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 space-y-8">
          
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-purple-950/40 to-indigo-950/40 border border-brand-500/20 backdrop-blur-sm gap-4 shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-brand-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Creator Production Hub</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'Creator'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Track brief submissions, deliver generative assets, and collaborate with brands.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/briefs"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Find Open Briefs</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                <Briefcase className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
                {activeProjects.length}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Currently rendering
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Pitches Submitted</span>
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
                {applications.length}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Campaign proposals
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Rating</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {profile?.rating || '4.95'}★
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {profile?.reviewsCount || 28} verified reviews
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Completed</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-500 font-mono">
                ${totalEarnings.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Released earnings
              </div>
            </div>
          </div>

          {/* Active Projects Workspace Tracker */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  <span>My Active Workspaces ({projects.length})</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Submit master renders, review revision requests, and message brand managers.
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-400 mb-2">You don't have any active projects yet.</p>
                <Link to="/briefs" className="text-xs font-bold text-brand-500 underline">
                  Browse open briefs to pitch
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
                        src={project.brand?.avatar}
                        alt={project.brand?.name}
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
                          <span>Brand: <strong className="text-gray-700 dark:text-gray-300">{project.brand?.name}</strong></span>
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
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-sm flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Deliverables Workspace</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications Status Section */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <span>My Pitches & Applications</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track the status of your applications and AI compatibility scores.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-400">No applications submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">
                          {app.aiMatchScore}% AI Match
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        to={`/briefs/${app.brief?._id}`}
                        className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-500"
                      >
                        {app.brief?.title}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Proposed Rate: <strong className="text-emerald-500 font-mono">${app.proposedRate}</strong> • Delivery: <strong>{app.estimatedDeliveryDays} days</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${getAppStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <Link
                        to={`/briefs/${app.brief?._id}`}
                        className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-500"
                      >
                        View Brief
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Briefs to Pitch */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                  <span>Fresh Open Briefs Matching Your AI Stack</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Campaigns actively seeking your specific generative tools.
                </p>
              </div>

              <Link to="/briefs" className="text-xs font-bold text-brand-500 hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {openBriefs.map((brief) => (
                <div
                  key={brief._id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {brief.category}
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-2 line-clamp-1">
                      {brief.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {brief.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-500">
                      ${brief.budgetMin} - ${brief.budgetMax}
                    </span>
                    <Link
                      to={`/briefs/${brief._id}`}
                      className="py-1 px-2.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white"
                    >
                      Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default CreatorDashboard;
