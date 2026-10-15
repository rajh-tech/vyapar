import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  LogIn,
  UserCheck,
  Globe,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { User, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  language: Language;
  onLanguageToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenAuth,
  onLogout,
  language,
  onLanguageToggle,
}) => {
  const t = getTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 text-white transition-all">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16">
          {/* Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  Vyapar<span className="text-indigo-400">AI</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Fashion
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setCurrentView('landing')}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentView === 'landing' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => {
                setCurrentView('landing');
                setTimeout(() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navFeatures}
            </button>
            <button
              onClick={() => {
                setCurrentView('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => {
                setCurrentView('landing');
                setTimeout(() => {
                  document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.navPricing}
            </button>
            {user && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'dashboard' ? 'text-indigo-400 font-semibold' : ''
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                {t.navDashboard}
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={onLanguageToggle}
              title="Switch language between English and Hindi"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5 hidden sm:inline" />
                  <span className="truncate max-w-[110px] sm:max-w-[150px]">
                    {user.businessName}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 sm:p-2 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.navGetStarted}</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle for landing mode */}
            {currentView === 'landing' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Landing Dropdown Menu */}
      {mobileMenuOpen && currentView === 'landing' && (
        <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setCurrentView('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
          >
            {t.navFeatures}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800 font-medium"
          >
            {t.navPricing}
          </button>
        </div>
      )}
    </header>
  );
};
