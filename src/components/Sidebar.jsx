import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Target,
  Building,
  Brain
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Дашборд', color: 'from-blue-500 to-cyan-500' },
  { path: '/crm', icon: Building, label: 'CRM', color: 'from-purple-500 to-pink-500' },
  { path: '/contacts', icon: Users, label: 'Контакты', color: 'from-indigo-500 to-purple-500' },
  { path: '/tasks', icon: CheckSquare, label: 'Задачи', color: 'from-orange-500 to-red-500' },
  { path: '/calendar', icon: Calendar, label: 'Календарь', color: 'from-teal-500 to-cyan-500' },
  { path: '/reports', icon: BarChart3, label: 'Отчеты', color: 'from-pink-500 to-rose-500' },
  { path: '/analytics', icon: Brain, label: 'Аналитика', color: 'from-emerald-500 to-teal-500' },
  { path: '/settings', icon: Settings, label: 'Настройки', color: 'from-gray-500 to-slate-500' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover-lift"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white shadow-xl z-30 lg:relative ${isCollapsed ? 'w-20' : 'w-70'}`}>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 bg-white rounded-lg shadow-lg hover-lift"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">I4</span>
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-xl font-bold gradient-text">Indik4 CRM</h1>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 hover-lift ${
                      isActive 
                        ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                    {!isCollapsed && (
                      <span className="font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">Выйти</span>}
            </button>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover-lift lg:flex hidden"
          >
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
