import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Menu, X, Globe, LayoutDashboard, Search, Briefcase, 
  FolderKanban, MessageSquare, Bell, User, ArrowLeftRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMode, setCurrentMode] = useState('client');
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
    const savedMode = localStorage.getItem('dashboardMode') || 'client';
    setCurrentMode(savedMode);
  }, [location]);

  const handleToggleMode = () => {
    const newMode = currentMode === 'client' ? 'professional' : 'client';
    setCurrentMode(newMode);
    localStorage.setItem('dashboardMode', newMode);
    window.dispatchEvent(new Event('storage'));
    navigate('/dashboard');
  };

  const isActive = (path) => location.pathname === path;

  // Navbar Dictionary for English and French translations
  const navText = {
    en: {
      dashboard: 'Dashboard',
      findPro: 'Find Professionals',
      findJobs: 'Find Jobs',
      myJobs: 'My Jobs',
      projects: 'Projects',
      messages: 'Messages',
      notifications: 'Notification',
      profile: 'Profile',
      clientView: 'Client View',
      proView: 'Professional View',
      login: 'Login',
      getStarted: 'Get Started'
    },
    fr: {
      dashboard: 'Tableau de bord',
      findPro: 'Trouver des Pros',
      findJobs: 'Trouver des Emplois',
      myJobs: 'Mes Emplois',
      projects: 'Projets',
      messages: 'Messages',
      notifications: 'Notifications',
      profile: 'Profil',
      clientView: 'Vue Client',
      proView: 'Vue Professionnel',
      login: 'Connexion',
      getStarted: 'Commencer'
    }
  };

  const t = navText[lang] || navText.en;

  const renderNavLinks = () => {
    if (!currentUser) return null;

    const getLinkStyle = (path) => `
      flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
      ${isActive(path) 
        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-inner' 
        : 'text-slate-300 hover:text-white border border-transparent'}
    `;

    return (
      <div className="hidden lg:flex items-center space-x-1 text-xs font-semibold">
        <Link to="/dashboard" className={getLinkStyle('/dashboard')}>
          <LayoutDashboard className="h-4 w-4 text-teal-400" /> {t.dashboard}
        </Link>

        {currentMode === 'client' ? (
          <Link to="/services" className={getLinkStyle('/services')}>
            <Search className="h-4 w-4 text-teal-400" /> {t.findPro}
          </Link>
        ) : (
          <Link to="/find-jobs" className={getLinkStyle('/find-jobs')}>
            <Search className="h-4 w-4 text-emerald-400" /> {t.findJobs}
          </Link>
        )}

        <Link to="/my-jobs" className={getLinkStyle('/my-jobs')}>
          <Briefcase className="h-4 w-4 text-teal-400" /> {t.myJobs}
        </Link>

        <Link to="/projects" className={getLinkStyle('/projects')}>
          <FolderKanban className="h-4 w-4 text-teal-400" /> {t.projects}
        </Link>

        <Link to="/messages" className={getLinkStyle('/messages')}>
          <MessageSquare className="h-4 w-4 text-teal-400" /> {t.messages}
        </Link>

        <Link to="/notifications" className={getLinkStyle('/notifications')}>
          <Bell className="h-4 w-4 text-emerald-400" /> {t.notifications}
        </Link>

        <Link to="/profile" className={getLinkStyle('/profile')}>
          <User className="h-3.5 w-3.5 text-teal-400" /> {t.profile}
        </Link>
      </div>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-[#0A0D14] via-[#111622] to-[#0A0D14] border-b border-slate-800/80 sticky top-0 z-50 text-white shadow-lg flex-shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-800 p-2 rounded-xl border border-emerald-400/30 shadow-md">
                <div className="absolute -top-1 w-4 h-1 bg-emerald-400 rounded-full"></div>
                <Users className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-200" />
              </div>
              <div>
                <div className="text-base sm:text-2xl font-black tracking-tight flex items-center">
                  <span className="text-white">YuFon-</span>
                  <span className="text-emerald-400">ProLink</span>
                  <span className="text-[8px] text-slate-400 align-super ml-0.5">™</span>
                </div>
                <div className="text-[8px] sm:text-[11px] font-semibold text-slate-300 tracking-wider">
                  Connect <span className="text-emerald-400">•</span> Hire <span className="text-emerald-400">•</span> Build
                </div>
              </div>
            </Link>

            <div className="hidden lg:block h-10 w-[1px] bg-slate-800 mx-2"></div>

            {renderNavLinks()}
          </div>

          {/* Right Action Buttons: Border-free unless hovered/active */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser && (
              <button
                onClick={handleToggleMode}
                className="flex items-center gap-1.5 bg-[#111622] hover:bg-slate-800 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md border-0"
                title="Switch View Mode"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                {currentMode === 'client' ? t.clientView : t.proView}
              </button>
            )}

            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1.5 bg-[#111622] hover:bg-slate-800 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md border-0"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </button>

            {!currentUser && (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium px-3 py-1.5 text-sm transition">
                  {t.login}
                </Link>
                <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition shadow-md">
                  {t.getStarted}
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1 bg-[#111622] text-emerald-300 px-2.5 py-2 rounded-lg text-xs font-bold border-0"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang === 'en' ? '🇫🇷' : '🇬🇧'}
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg bg-[#111622] text-emerald-300 focus:outline-none border-0"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0A0D14] border-t border-slate-800 px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          {!currentUser ? (
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2 rounded-lg bg-[#111622] text-white font-medium text-sm">
                {t.login}
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow">
                {t.getStarted}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 text-xs font-semibold">
              <button 
                onClick={() => { setIsOpen(false); handleToggleMode(); }}
                className="w-full text-left py-2 px-3 bg-emerald-500/20 text-emerald-300 rounded-lg flex items-center justify-between"
              >
                <span>{currentMode === 'client' ? t.proView : t.clientView}</span>
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </button>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.dashboard}</Link>
              {currentMode === 'client' ? (
                <Link to="/services" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.findPro}</Link>
              ) : (
                <Link to="/find-jobs" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.findJobs}</Link>
              )}
              <Link to="/my-jobs" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.myJobs}</Link>
              <Link to="/projects" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.projects}</Link>
              <Link to="/messages" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.messages}</Link>
              <Link to="/notifications" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.notifications}</Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="py-2 px-3 bg-[#111622] rounded-lg">{t.profile}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}