import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Instagram,
  MessageSquare,
  Image as ImageIcon,
  Package,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Globe,
  ChevronRight,
  Store,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { AIMarketingAssistant } from './components/AIMarketingAssistant';
import { InstagramGenerator } from './components/InstagramGenerator';
import { WhatsAppGenerator } from './components/WhatsAppGenerator';
import { PosterCreator } from './components/PosterCreator';
import { ProductManagement } from './components/ProductManagement';
import { SavedContentModal } from './components/SavedContentModal';
import { SettingsModal } from './components/SettingsModal';

import { api, getStoredToken } from './services/api';
import { User, Product, SavedContent, BusinessSettings, Language } from './types';
import { getTranslation } from './utils/translations';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Navigation
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Pre-fill state when jumping from a product card to AI Marketing
  const [prefilledProduct, setPrefilledProduct] = useState<Product | null>(null);

  // Language
  const [language, setLanguage] = useState<Language>('en');

  // App Data
  const [products, setProducts] = useState<Product[]>([]);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const t = getTranslation(language);

  // Initialize Auth
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res.user);
        setCurrentView('dashboard');
      } catch (err) {
        console.warn('Initial session check failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  // Fetch app data when user is authenticated
  const refreshData = async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [prodsRes, contentRes, settingsRes] = await Promise.all([
        api.getProducts(),
        api.getSavedContent(),
        api.getSettings(),
      ]);
      setProducts(prodsRes.products);
      setSavedContent(contentRes.contents);
      setSettings(settingsRes.settings);
      if (settingsRes.settings?.preferredLanguage) {
        setLanguage(settingsRes.settings.preferredLanguage);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentView('dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setCurrentView('landing');
    setProducts([]);
    setSavedContent([]);
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLanguageToggle = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
    if (settings && user) {
      api.updateSettings({ preferredLanguage: next }).catch(console.error);
    }
  };

  // Product actions
  const handleAddProduct = async (productData: Partial<Product>) => {
    const res = await api.createProduct(productData);
    setProducts((prev) => [res.product, ...prev]);
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    const res = await api.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)));
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Content actions
  const handleContentSaved = (newContent: SavedContent) => {
    setSavedContent((prev) => [newContent, ...prev]);
  };

  const handleDeleteContent = async (id: string) => {
    await api.deleteSavedContent(id);
    setSavedContent((prev) => prev.filter((c) => c.id !== id));
  };

  // Settings actions
  const handleUpdateSettings = async (updates: Partial<BusinessSettings>) => {
    const res = await api.updateSettings(updates);
    setSettings(res.settings);
    if (updates.businessName && user) {
      setUser({ ...user, businessName: updates.businessName });
    }
  };

  // Low stock calculation
  const lowStockThreshold = settings?.lowStockThreshold ?? 5;
  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity <= lowStockThreshold
  ).length;

  const navMenuItems = [
    { id: 'dashboard', label: t.menuDashboard, icon: LayoutDashboard },
    { id: 'marketing', label: t.menuMarketing, icon: Sparkles },
    { id: 'instagram', label: t.menuInstagram, icon: Instagram },
    { id: 'whatsapp', label: t.menuWhatsApp, icon: MessageSquare },
    { id: 'posters', label: t.menuPosters, icon: ImageIcon },
    { id: 'products', label: t.menuProducts, icon: Package },
    {
      id: 'inventory',
      label: t.menuInventory,
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount}` : null,
    },
    { id: 'saved', label: t.menuSavedContent, icon: FileText },
    { id: 'settings', label: t.menuSettings, icon: SettingsIcon },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-11 h-11 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium tracking-wide">
          Loading VyaparAI...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'dashboard' && !user) {
            handleOpenAuth('login');
          } else {
            setCurrentView(view);
          }
        }}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        language={language}
        onLanguageToggle={handleLanguageToggle}
      />

      {/* Main Content Area */}
      {currentView === 'landing' ? (
        <LandingPage onOpenAuth={handleOpenAuth} language={language} />
      ) : (
        /* Authenticated Dashboard View */
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800/80 shrink-0">
            {/* Store Badge in Sidebar */}
            <div className="p-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-indigo-600/30">
                  <Store className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {user?.businessName || 'My Boutique'}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {user?.businessCategory || 'Fashion Retailer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation items */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-98 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom User Info & Logout */}
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* Mobile Quick Horizontal Scrollable Tool Chips */}
          <div className="lg:hidden fixed top-15 sm:top-16 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 shadow-sm">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'marketing', label: 'AI Copy', icon: Sparkles },
              { id: 'instagram', label: 'Instagram', icon: Instagram },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'posters', label: 'Posters', icon: ImageIcon },
              { id: 'products', label: 'Catalog', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
              { id: 'saved', label: 'Saved', icon: FileText },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map((chip) => {
              const Icon = chip.icon;
              const isSelected = activeTab === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveTab(chip.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{chip.label}</span>
                  {chip.badge && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center font-mono">
                      {chip.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Floating Mobile Dock Bar (Bottom Navigation) */}
          <nav className="lg:hidden fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl px-2 py-1.5 shadow-2xl shadow-black/80 flex items-center justify-around">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`p-2 flex flex-col items-center gap-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              className={`p-2 flex flex-col items-center gap-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'marketing' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px]">AI Copy</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`relative p-2 flex flex-col items-center gap-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'products' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-[10px]">Products</span>
              {lowStockCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('posters')}
              className={`p-2 flex flex-col items-center gap-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'posters' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-[10px]">Posters</span>
            </button>

            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 flex flex-col items-center gap-0.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px]">More</span>
            </button>
          </nav>

          {/* Full Mobile Drawer Overlay */}
          {isMobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
              <div className="w-72 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between shadow-2xl h-full animate-in slide-in-from-right duration-200">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-white text-sm truncate max-w-[170px]">
                        {user?.businessName}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {navMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                            activeTab === item.id
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="text-xs text-slate-400">
                    <p className="font-bold text-white truncate">{user?.fullName}</p>
                    <p className="text-[11px] truncate font-mono text-slate-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileSidebarOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 border border-rose-500/20 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Screen View */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 pb-32 lg:pb-12 bg-slate-950">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'dashboard' && user && (
                <Dashboard
                  user={user}
                  products={products}
                  savedContent={savedContent}
                  settings={settings}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAddProduct={() => {
                    setActiveTab('products');
                    setIsAddProductOpen(true);
                  }}
                  language={language}
                />
              )}

              {activeTab === 'marketing' && (
                <AIMarketingAssistant
                  products={products}
                  onContentSaved={handleContentSaved}
                  language={language}
                  shopName={user?.businessName || 'Our Boutique'}
                />
              )}

              {activeTab === 'instagram' && (
                <InstagramGenerator
                  products={products}
                  onContentSaved={handleContentSaved}
                  language={language}
                />
              )}

              {activeTab === 'whatsapp' && (
                <WhatsAppGenerator
                  products={products}
                  onContentSaved={handleContentSaved}
                  language={language}
                  shopName={user?.businessName || 'Our Boutique'}
                  shopPhone={settings?.phone}
                />
              )}

              {activeTab === 'posters' && (
                <PosterCreator
                  products={products}
                  language={language}
                  defaultShopName={user?.businessName || 'Shree Ganesh Fashion Hub'}
                  defaultPhone={settings?.phone}
                  defaultAddress={settings?.address}
                />
              )}

              {(activeTab === 'products' || activeTab === 'inventory') && (
                <ProductManagement
                  products={products}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  settings={settings}
                  language={language}
                  isAddModalOpenInitially={isAddProductOpen}
                  onCloseInitialModal={() => setIsAddProductOpen(false)}
                />
              )}

              {activeTab === 'saved' && (
                <SavedContentModal
                  savedContent={savedContent}
                  onDeleteContent={handleDeleteContent}
                  language={language}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsModal
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  language={language}
                  onLanguageChange={(newLang) => setLanguage(newLang)}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
        language={language}
      />
    </div>
  );
}
