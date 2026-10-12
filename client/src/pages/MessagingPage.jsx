import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Sparkles,
  ExternalLink,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

const MessagingPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialPartnerId = searchParams.get('to');

  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/messages/conversations');
        if (res.data.success) {
          setConversations(res.data.conversations);

          // If query param 'to' is present, find or select that partner
          if (initialPartnerId) {
            const existing = res.data.conversations.find(c => c.user._id === initialPartnerId);
            if (existing) {
              setActivePartner(existing.user);
            } else {
              // Fetch user info for initial partner
              try {
                const creatorRes = await api.get(`/creators/${initialPartnerId}`);
                if (creatorRes.data.success) {
                  setActivePartner(creatorRes.data.creator.user);
                }
              } catch (e) {
                // Ignore
              }
            }
          } else if (res.data.conversations.length > 0) {
            setActivePartner(res.data.conversations[0].user);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [initialPartnerId]);

  // Load messages for active partner
  useEffect(() => {
    if (!activePartner) return;

    const fetchThread = async () => {
      try {
        const res = await api.get(`/messages/thread/${activePartner._id}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Error fetching thread', err);
      }
    };

    fetchThread();
  }, [activePartner]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;

    setSending(true);
    try {
      const res = await api.post('/messages', {
        receiverId: activePartner._id,
        content: newMessage.trim()
      });

      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
        setNewMessage('');

        // Refresh conversation snippet
        const convRes = await api.get('/messages/conversations');
        if (convRes.data.success) {
          setConversations(convRes.data.conversations);
        }
      }
    } catch (err) {
      console.error('Error sending message', err);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    "Could you share your available turnaround time for a 4K packshot?",
    "What LoRA models or checkpoints do you recommend for character consistency?",
    "I reviewed the deliverables and left feedback in the workspace.",
    "Would you be interested in a 15-second Runway Gen-3 campaign?"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card overflow-hidden shadow-sm flex flex-col md:flex-row h-[78vh]">
        
        {/* Left Sidebar: Conversations List */}
        <aside className="w-full md:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-dark-base/50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <span>Messages</span>
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Brand and creator collaborations
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
            {conversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-gray-400">
                No active message threads yet. Explore creators or open a brief to chat!
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.user;
                const isActive = activePartner?._id === partner._id;
                return (
                  <div
                    key={partner._id}
                    onClick={() => setActivePartner(partner)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-brand-500/10 border-l-4 border-brand-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/20"
                      />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-500 border-2 border-white dark:border-dark-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {partner.name}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          {new Date(conv.lastDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                      {conv.project && (
                        <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 mt-1 truncate max-w-[150px]">
                          {conv.project.title}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane: Active Thread */}
        <main className="flex-1 flex flex-col bg-white dark:bg-dark-card">
          {activePartner ? (
            <>
              {/* Top Contact Bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activePartner.avatar}
                    alt={activePartner.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span>{activePartner.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 capitalize">
                        {activePartner.role}
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Verified Collaborator
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activePartner.role === 'creator' && (
                    <Link
                      to={`/creators/${activePartner._id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:border-brand-500 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-gray-400">
                    Send a message to begin discussing requirements or commissioning assets.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {isMe ? 'You' : activePartner.name}
                          </span>
                          <span className="text-[9px] text-gray-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none shadow-md'
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

              {/* Quick AI Prompt Helpers */}
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-dark-base/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-400" /> Quick Prompts:
                </span>
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewMessage(q)}
                    className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 hover:border-brand-500 text-gray-600 dark:text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                <input
                  type="text"
                  placeholder={`Message ${activePartner.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mt-1">
                Choose a creator or brand from the left sidebar to start messaging.
              </p>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

export default MessagingPage;
