import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, Shield, Zap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-electric-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-brand-500 to-electric-400 bg-clip-text text-transparent">
                Synthetix
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              The AI-native marketplace connecting enterprise brands and visionary agencies with elite prompt engineers, model trainers, and generative media creators.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-500">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-mono">Midjourney · Flux · Runway · ComfyUI</span>
            </div>
          </div>

          {/* For Brands */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              For Brands & Agencies
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/creators" className="hover:text-brand-500 transition-colors">
                  Browse AI Creators
                </Link>
              </li>
              <li>
                <Link to="/briefs/create" className="hover:text-brand-500 transition-colors">
                  Publish Creative Brief
                </Link>
              </li>
              <li>
                <Link to="/creators?category=Advertising+%26+Commercials" className="hover:text-brand-500 transition-colors">
                  Commercial AI Renders
                </Link>
              </li>
              <li>
                <Link to="/creators?aiTool=Runway" className="hover:text-brand-500 transition-colors">
                  Runway Gen-3 Video Teams
                </Link>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              For AI Creators
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/register" className="hover:text-brand-500 transition-colors">
                  Join as a Creator
                </Link>
              </li>
              <li>
                <Link to="/briefs" className="hover:text-brand-500 transition-colors">
                  Explore Open Briefs
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-brand-500 transition-colors">
                  Showcase AI Portfolio
                </Link>
              </li>
              <li>
                <span className="text-gray-400 dark:text-gray-500">Escrow Milestone Protection</span>
              </li>
            </ul>
          </div>

          {/* Platform Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              AI Verification
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Every portfolio item includes full prompt documentation, model parameters, seed numbers, and verified commercial usage clearances.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3 h-3" /> C2PA Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                <Zap className="w-3 h-3" /> Fast Match
              </span>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-100 dark:border-gray-800/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Synthetix AI Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Engineered with passion for generative creators</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
