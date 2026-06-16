import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import AppToastContainer from './ui/AppToast';
import { 
  Home, User, Briefcase, FileText, Gift, Award, Compass, 
  Menu, X, Bell, Globe, LogOut, PlusCircle, Users, 
  CheckCircle, BarChart2, AlertTriangle, Shield, Check, Info
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    language, setLanguage, currentUser, logoutUser, notifications, markNotificationRead, toasts, removeToast
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const activeNotifs = notifications.filter(n => !n.is_read);

  // Choose navigation links based on user role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { path: '/', label: t.home, icon: Home },
        { path: '/about', label: t.about, icon: Info },
        { path: '/login', label: t.login, icon: User },
      ];
    }

    if (currentUser.role === 'Job Seeker') {
      return [
        { path: '/seeker', label: t.dashboard, icon: Home },
        { path: '/seeker/profile', label: t.profile, icon: User },
        { path: '/seeker/jobs', label: t.jobs, icon: Compass },
        { path: '/seeker/applications', label: t.applications, icon: FileText },
        { path: '/seeker/offers', label: t.offers, icon: Gift },

        { path: '/seeker/guidance', label: t.skillGap, icon: Award },
      ];
    }

    if (currentUser.role === 'Business') {
      return [
        { path: '/business', label: t.dashboard, icon: Home },
        { path: '/business/profile', label: t.profile, icon: User },
        { path: '/business/post', label: t.postAJob, icon: PlusCircle },
        { path: '/business/jobs', label: t.manageJobs, icon: Briefcase },
        { path: '/business/applicants', label: t.applicants, icon: Users },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-4 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-600 hover:text-indigo-600 p-1 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/20">
              KS
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
              {t.brand}
            </span>
          </Link>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors shadow-sm cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Kannada' : 'English'}</span>
          </button>

          {/* Notifications bell */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {activeNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {activeNotifs.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="fixed inset-x-4 top-16 md:absolute md:inset-auto md:right-0 md:mt-2.5 w-[calc(100vw-32px)] md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-800">
                      {language === 'kn' ? 'ಅಧಿಸೂಚನೆಗಳು' : 'Notifications'}
                    </span>
                    {activeNotifs.length > 0 && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
                        {activeNotifs.length} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-5 text-center text-xs text-slate-400">
                        {language === 'kn' ? 'ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ' : 'No notifications yet'}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            markNotificationRead(notif.id);
                            // Auto navigate to relevant pages
                            if (notif.type === 'offer') navigate('/seeker/offers');
                            if (notif.type === 'interview') navigate(currentUser.role === 'Job Seeker' ? '/seeker/applications' : '/business/applicants');
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                            !notif.is_read ? 'bg-indigo-50/20' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-indigo-600 mb-1">
                              {language === 'kn' ? notif.titleKannada : notif.title}
                            </span>
                            {!notif.is_read && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {language === 'kn' ? notif.messageKannada : notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Logout */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="font-bold text-xs text-slate-800">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {currentUser.role === 'Job Seeker' ? t.jobSeeker : t.business}
                </span>
              </div>
              
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center font-bold text-sm text-indigo-600 border border-indigo-200">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={() => {
                  logoutUser();
                  navigate('/login');
                }}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title={t.logout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              {t.login}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav (Desktop) */}
        {currentUser && (
          <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </aside>
        )}

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileMenuOpen && currentUser && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full p-5 shadow-2xl z-40">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-slate-800">{t.brand} Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                  navigate('/login');
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Optional shortcut bar for quick mobile feel) */}
      {currentUser && (
        <nav className="lg:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200/80 px-4 py-2.5 flex justify-around items-center shadow-lg">
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center space-y-1 p-1 text-[10px] font-bold ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="max-w-[70px] truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
      {/* Global Toast Stack */}
      <AppToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Layout;
