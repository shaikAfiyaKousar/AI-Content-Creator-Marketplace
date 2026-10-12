import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import CreatorCard from '../components/CreatorCard';
import BriefCard from '../components/BriefCard';
import PortfolioModal from '../components/PortfolioModal';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingUp,
  Search,
  Star,
  Terminal,
  Video,
  Image,
  Sliders
} from 'lucide-react';

const LandingPage = () => {
  const [featuredCreators, setFeaturedCreators] = useState([]);
  const [featuredBriefs, setFeaturedBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [modalCreator, setModalCreator] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creatorsRes, briefsRes] = await Promise.all([
          api.get('/creators?sortBy=rating'),
          api.get('/briefs')
        ]);
        if (creatorsRes.data.success) {
          setFeaturedCreators(creatorsRes.data.creators.slice(0, 3));
        }
        if (briefsRes.data.success) {
          setFeaturedBriefs(briefsRes.data.briefs.slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to fetch landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenPortfolio = (item, creator) => {
    setModalItem(item);
    setModalCreator(creator);
  };

  const aiToolLogos = [
    { name: 'Midjourney', desc: 'Photorealism & Packshots' },
    { name: 'Runway Gen-3', desc: 'Cinematic Camera Motion' },
    { name: 'Flux', desc: 'Next-Gen Diffusion' },
    { name: 'ComfyUI', desc: 'Deterministic Node Pipelines' },
    { name: 'ElevenLabs', desc: 'Synthetic Voice Dubbing' },
    { name: 'Kling Alpha', desc: '60fps Dynamic Motion' },
    { name: 'Stable Diffusion', desc: 'Custom LoRA Architecture' },
    { name: 'Magnific AI', desc: '8K Ultra Upscaling' }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-gray-200 dark:border-gray-800/80">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/25 via-indigo-500/20 to-electric-500/25 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-300 text-xs font-semibold mb-6 animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>The AI-Native Creative Network for Brands & Agencies</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Hire elite <span className="bg-gradient-to-r from-brand-500 via-indigo-400 to-electric-400 bg-clip-text text-transparent">AI Creators</span> for your next breakthrough campaign.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover verified prompt engineers, LoRA trainers, and generative video directors.
            Publish creative briefs, evaluate model-verified portfolios, and manage projects from prompt to master render.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
            <Link
              to="/creators"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 via-indigo-600 to-electric-600 hover:from-brand-500 hover:to-electric-500 text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore AI Creators</span>
            </Link>

            <Link
              to="/briefs/create"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 hover:border-brand-500 text-gray-800 dark:text-gray-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Publish a Creative Brief</span>
              <ArrowRight className="w-4 h-4 text-brand-500" />
            </Link>
          </div>

          {/* Live Metrics Counter Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-white/60 dark:bg-dark-card/60 border border-gray-200 dark:border-gray-800/80 backdrop-blur-md shadow-sm">
            <div className="p-2 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
                98.4%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                AI Match Accuracy
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-500 font-mono">
                500+
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Verified AI Artists
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white font-mono">
                2,400+
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Completed Campaigns
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">
                &lt; 24h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Average Brief Match Time
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI Tools Ecosystem Bar */}
      <section className="py-8 bg-gray-100/60 dark:bg-dark-base/60 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
            Supported Generative Pipelines & Architectures
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {aiToolLogos.map((tool, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 text-center hover:border-brand-500/50 transition-colors"
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {tool.name}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                  {tool.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured AI Creators Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Prompt Masters & Video Directors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Featured AI Content Creators
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Top-rated artists with proven commercial prompt provenance and high-fidelity output.
            </p>
          </div>

          <Link
            to="/creators"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors self-start md:self-end"
          >
            <span>View all creators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCreators.map(creator => (
              <CreatorCard
                key={creator._id}
                creator={creator}
                onPreviewPortfolio={handleOpenPortfolio}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-100/40 dark:bg-dark-card/40 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
              How the AI Marketplace Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Designed specifically for the nuances of generative media production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-base border border-gray-200 dark:border-gray-800 shadow-sm relative group hover:border-brand-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                1. Post Creative Brief
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Specify exact deliverables, required generative tools (e.g., Midjourney, Runway, Flux), target budget, and lighting/prompt direction.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-brand-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Structured AI constraint builder</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-base border border-gray-200 dark:border-gray-800 shadow-sm relative group hover:border-brand-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                2. AI-Powered Matching
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Our smart matching engine evaluates tool overlap, portfolio styles, and availability to recommend top candidates with instant match explanations.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Multi-factor compatibility score</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-base border border-gray-200 dark:border-gray-800 shadow-sm relative group hover:border-brand-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                3. Deliver with Full Provenance
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Review 4K masters alongside exact generation prompts, seed numbers, and parameters. Request targeted revisions or approve for milestone release.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Escrow & C2PA verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creative Briefs Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-electric-600 dark:text-electric-400 mb-2">
              <Zap className="w-4 h-4" />
              <span>Active Brand Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Open Creative Briefs
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Apply to high-budget campaigns from visionary tech, gaming, and luxury retail brands.
            </p>
          </div>

          <Link
            to="/briefs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-electric-600 dark:text-electric-400 hover:text-electric-500 transition-colors self-start md:self-end"
          >
            <span>Explore all briefs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredBriefs.map(brief => (
            <BriefCard key={brief._id} brief={brief} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-brand-900 via-indigo-900 to-electric-900 border border-brand-500/30 shadow-2xl text-center text-white">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to elevate your generative production?
            </h2>
            <p className="text-sm text-purple-200 mb-8 leading-relaxed">
              Join leading global agencies and visionary creators scaling next-generation visuals on Synthetix.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register?role=brand"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-white text-gray-950 hover:bg-gray-100 transition-all shadow-lg"
              >
                Sign Up as a Brand
              </Link>
              <Link
                to="/register?role=creator"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-brand-600/60 hover:bg-brand-600 text-white border border-brand-400/40 transition-all"
              >
                Join as an AI Creator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Item Detail Modal */}
      {modalItem && (
        <PortfolioModal
          item={modalItem}
          creator={modalCreator}
          onClose={() => setModalItem(null)}
        />
      )}

    </div>
  );
};

export default LandingPage;
