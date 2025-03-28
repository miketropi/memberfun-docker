import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Bell, Settings, Calendar, Gamepad2, Trophy } from 'lucide-react';

const DashboardTabs = ({ notifications = [] }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'home', path: '/dashboard/overview' },
    { id: 'challenges', label: 'Challenges', icon: 'gamepad', path: '/dashboard/challenges' },
    { id: 'seminars', label: 'Seminars', icon: 'calendar', path: '/dashboard/seminars' },
    // { id: 'documents', label: 'Documents', icon: 'document', path: '/dashboard/documents' },
    // { id: 'notifications', label: 'Notifications', icon: 'bell', badge: unreadCount, path: '/dashboard/notifications' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', path: '/dashboard/leaderboard' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/dashboard/settings' }
  ];
  
  return (
    <div className="flex overflow-x-auto border-b border-gray-200 bg-white">
      {tabs.map(tab => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) => `
            relative flex items-center py-4 px-6 text-sm font-medium transition-colors
            ${isActive
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
            }
          `}
        >
          {getIcon(tab.icon)}
          <span className="ml-2">{tab.label}</span>
          {tab.badge > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {tab.badge}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );
};

const getIcon = (iconName) => {
  switch (iconName) {
    case 'home':
      return <Home className="h-5 w-5" />;
    case 'gamepad':
      return <Gamepad2 className="h-5 w-5" />;
    case 'document':
      return <FileText className="h-5 w-5" />;
    case 'bell':
      return <Bell className="h-5 w-5" />;
    case 'settings':
      return <Settings className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'trophy':
      return <Trophy className="h-5 w-5" />;
    default:
      return null;
  }
};

export default DashboardTabs;