import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  MessageSquare,
  Settings,
  Sparkles,
  PlusCircle,
  FolderGit2
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const isBrand = user?.role === 'brand';

  const brandNav = [
    { to: '/dashboard/brand', label: 'Brand Overview', icon: LayoutDashboard },
    { to: '/briefs/create', label: 'Post New Brief', icon: PlusCircle },
    { to: '/briefs', label: 'All Creative Briefs', icon: FileText },
    { to: '/creators', label: 'Discover Creators', icon: Users },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/settings', label: 'Brand Settings', icon: Settings }
  ];

  const creatorNav = [
    { to: '/dashboard/creator', label: 'Creator Hub', icon: LayoutDashboard },
    { to: '/briefs', label: 'Explore Briefs', icon: FileText },
    { to: `/creators/${user?.id}`, label: 'My Public Profile', icon: Users },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/settings', label: 'Portfolio & Skills', icon: FolderGit2 },
    { to: '/settings', label: 'Account Settings', icon: Settings }
  ];

  const links = isBrand ? brandNav : creatorNav;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-card p-4 shadow-sm">
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-gradient-to-r from-brand-900/20 to-electric-900/20 border border-brand-500/20">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/40"
          />
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {user?.name}
            </h3>
            <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {user?.role} Portal
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.to}
                end={item.to === '/dashboard/brand' || item.to === '/dashboard/creator'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
