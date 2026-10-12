import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectTimeline from '../components/ProjectTimeline';
import DeliverableSubmitModal from '../components/DeliverableSubmitModal';
import RevisionRequestModal from '../components/RevisionRequestModal';
import CompleteReviewModal from '../components/CompleteReviewModal';
import {
  Briefcase,
  DollarSign,
  Calendar,
  Sparkles,
  UploadCloud,
  RotateCcw,
  CheckCircle2,
  Star,
  ExternalLink,
  MessageSquare,
  Terminal,
  Clock,
  Layers,
  Send,
  User,
  ShieldCheck
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Chat in project workspace
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${id}`);
      if (res.data.success) {
        setProject(res.data.project);

        // Fetch thread messages between brand and creator for this project
        const otherUserId = res.data.project.brand._id === user?.id
          ? res.data.project.creator._id
          : res.data.project.brand._id;

        const msgRes = await api.get(`/messages/thread/${otherUserId}?projectId=${id}`);
        if (msgRes.data.success) {
          setChatMessages(msgRes.data.messages);
        }
      }
    } catch (err) {
      console.error('Error fetching project', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id, user]);

  const handleDeliverableSubmit = async (payload) => {
    setSubmittingAction(true);
    try {
      const res = await api.post(`/projects/${id}/deliverables`, payload);
      if (res.data.success) {
        setProject(res.data.project);
        setDeliverableModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRevisionSubmit = async (feedback) => {
    setSubmittingAction(true);
    try {
      const res = await api.post(`/projects/${id}/revisions`, { feedback });
      if (res.data.success) {
        setProject(res.data.project);
        setRevisionModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleCompleteSubmit = async ({ rating, feedback }) => {
    setSubmittingAction(true);
    try {
      const res = await api.put(`/projects/${id}/complete`, { rating, feedback });
      if (res.data.success) {
        setProject(res.data.project);
        setReviewModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !project) return;
    setSendingMsg(true);

    const receiverId = project.brand._id === user?.id
      ? project.creator._id
      : project.brand._id;

    try {
      const res = await api.post('/messages', {
        receiverId,
        content: newMessage.trim(),
        projectId: project._id
      });
      if (res.data.success) {
        setChatMessages(prev => [...prev, res.data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message', err);
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400">Loading project collaboration workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Project not found</h2>
        <Link to="/" className="text-xs text-brand-500 underline">Back to home</Link>
      </div>
    );
  }

  const isBrand = user && project.brand._id === user.id;
  const isCreator = user && project.creator._id === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                Active Project Workspace
              </span>
              <span className="text-xs font-mono text-gray-400">
                ID: {project._id.slice(-8)}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {project.title}
            </h1>
          </div>

          {/* Action Buttons for Current Stage */}
          <div className="flex flex-wrap items-center gap-2">
            {isCreator && project.stage !== 'Completed' && (
              <button
                onClick={() => setDeliverableModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit Deliverables</span>
              </button>
            )}

            {isBrand && project.stage !== 'Completed' && (
              <>
                <button
                  onClick={() => setRevisionModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>

                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Complete</span>
                </button>
              </>
            )}

            {project.stage === 'Completed' && (
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Project Successfully Completed</span>
              </span>
            )}
          </div>
        </div>

        {/* Milestone Stage Timeline */}
        <div className="pt-2">
          <ProjectTimeline currentStage={project.stage} />
        </div>

        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Brand Partner</span>
            <span className="font-bold text-gray-900 dark:text-white mt-0.5 block truncate">
              {project.brand.name}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">AI Creator</span>
            <span className="font-bold text-gray-900 dark:text-white mt-0.5 block truncate">
              {project.creator.name}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Commission Budget</span>
            <span className="font-bold font-mono text-emerald-500 mt-0.5 block">
              ${project.budget} USD
            </span>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Current Stage</span>
            <span className="font-bold text-brand-400 mt-0.5 block capitalize">
              {project.stage}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Body: Deliverables / Revision Logs + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Deliverables & Revisions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Deliverables Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-brand-500" />
                <span>Submitted Deliverables ({project.deliverables?.length || 0})</span>
              </h2>

              {isCreator && project.stage !== 'Completed' && (
                <button
                  onClick={() => setDeliverableModalOpen(true)}
                  className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
                >
                  <span>+ Submit Asset</span>
                </button>
              )}
            </div>

            {project.deliverables?.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs text-gray-400 mb-1">No deliverables uploaded yet.</p>
                {isCreator && (
                  <button
                    onClick={() => setDeliverableModalOpen(true)}
                    className="text-xs font-bold text-brand-500 underline"
                  >
                    Upload first render now
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {project.deliverables.map((deliv, idx) => (
                  <div
                    key={deliv._id || idx}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-base border border-gray-100 dark:border-gray-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-gray-400">
                          Deliverable #{idx + 1} • {new Date(deliv.submittedAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                          {deliv.title}
                        </h3>
                      </div>

                      <a
                        href={deliv.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:border-brand-500 text-gray-800 dark:text-gray-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <span>View Master</span>
                        <ExternalLink className="w-3 h-3 text-brand-500" />
                      </a>
                    </div>

                    {/* Preview Image if valid image URL */}
                    <div className="rounded-xl overflow-hidden max-h-64 bg-black border border-gray-800">
                      <img
                        src={deliv.url}
                        alt={deliv.title}
                        className="w-full h-full object-cover max-h-64"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    {deliv.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-dark-card p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                        {deliv.notes}
                      </p>
                    )}

                    {deliv.promptUsed && (
                      <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-[11px] font-mono text-gray-300">
                        <span className="text-brand-400 block text-[10px] font-semibold mb-1">PROMPT LOG:</span>
                        "{deliv.promptUsed}"
                      </div>
                    )}

                    {deliv.aiToolsUsed?.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-gray-400">Tools:</span>
                        {deliv.aiToolsUsed.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revisions History Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>Revision Feedback History ({project.revisions?.length || 0})</span>
            </h2>

            {project.revisions?.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No revision requests logged. Production is running smoothly.</p>
            ) : (
              <div className="space-y-3">
                {project.revisions.map((rev, idx) => (
                  <div
                    key={rev._id || idx}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                      <span>Revision #{idx + 1}</span>
                      <span>{new Date(rev.requestedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 dark:text-amber-200 leading-relaxed font-medium">
                      "{rev.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Review / Rating Display if Completed */}
          {project.review?.rating && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/30 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Campaign Review</span>
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  {[...Array(project.review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 font-mono">{project.review.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-gray-200 italic leading-relaxed">
                "{project.review.comment}"
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Direct Messaging Stream */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-6 shadow-sm flex flex-col h-[600px]">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  Project Workspace Chat
                </h3>
                <p className="text-[11px] text-gray-400">
                  Direct communication between Brand and Creator
                </p>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-400">
                  No messages yet. Send a message to coordinate workflow.
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-gray-400 mb-0.5">
                        {isMe ? 'You' : msg.sender?.name || 'Partner'}
                      </span>
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                            : 'bg-gray-100 dark:bg-dark-base text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                type="text"
                placeholder="Type project message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
              />
              <button
                type="submit"
                disabled={sendingMsg || !newMessage.trim()}
                className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>

      </div>

      {/* Deliverable Modal */}
      <DeliverableSubmitModal
        isOpen={deliverableModalOpen}
        onClose={() => setDeliverableModalOpen(false)}
        onSubmit={handleDeliverableSubmit}
        submitting={submittingAction}
      />

      {/* Revision Modal */}
      <RevisionRequestModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        onSubmit={handleRevisionSubmit}
        submitting={submittingAction}
      />

      {/* Complete Review Modal */}
      <CompleteReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleCompleteSubmit}
        submitting={submittingAction}
      />

    </div>
  );
};

export default ProjectDetailsPage;
