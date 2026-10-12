import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, Zap, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, quickSwitch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.user) {
        if (res.user.role === 'brand') {
          navigate('/dashboard/brand');
        } else {
          navigate('/dashboard/creator');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      const res = await quickSwitch(demoEmail, 'password123');
      if (res && res.user) {
        if (res.user.role === 'brand') {
          navigate('/dashboard/brand');
        } else {
          navigate('/dashboard/creator');
        }
      }
    } catch (err) {
      setError('Failed to log in with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-electric-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Sign In to Synthetix
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Access your AI creator portfolio or brand brief dashboard
          </p>
        </div>

        {/* Demo Fast Login Pill Box for Evaluators */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-950/40 to-indigo-950/40 border border-brand-500/30 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Instant Demo Logins (One-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('brand@apex.com')}
              className="p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-indigo-500/30 text-left text-gray-200 transition-colors"
            >
              <div className="font-bold text-indigo-400 text-[11px]">Apex Studios</div>
              <div className="text-[10px] text-gray-400 truncate">Brand Account</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('creator@elena.com')}
              className="p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-purple-500/30 text-left text-gray-200 transition-colors"
            >
              <div className="font-bold text-purple-400 text-[11px]">Elena Rostova</div>
              <div className="text-[10px] text-gray-400 truncate">Creator (Flux/Midjourney)</div>
            </button>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-gray-50 dark:bg-dark-base border border-gray-200 dark:border-gray-800 focus:border-brand-500 text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
