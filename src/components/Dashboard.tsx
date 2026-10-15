import React from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  FileText,
  Instagram,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  PlusCircle,
  ArrowRight,
  Clock,
  ChevronRight,
  Copy,
  Check,
  CheckCircle2,
  Store,
  Tag,
  Zap,
} from 'lucide-react';
import { User, Product, SavedContent, BusinessSettings, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface DashboardProps {
  user: User;
  products: Product[];
  savedContent: SavedContent[];
  settings: BusinessSettings | null;
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  products,
  savedContent,
  settings,
  onNavigateTab,
  onOpenAddProduct,
  language,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const t = getTranslation(language);

  const threshold = settings?.lowStockThreshold ?? 5;

  // Real statistics computed from database
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.quantity > threshold).length;
  const lowStockProducts = products.filter((p) => p.quantity > 0 && p.quantity <= threshold).length;
  const outOfStockProducts = products.filter((p) => p.quantity === 0).length;
  const contentGeneratedCount = savedContent.length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Modern Welcome Banner with ambient gradient */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-5 sm:p-8 text-white shadow-xl shadow-indigo-950/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2.5 sm:mb-3 border border-indigo-500/30">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span className="truncate max-w-[200px] sm:max-w-none">{user.businessCategory}</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            {t.welcomeBack} {user.businessName}! 👋
          </h1>
          <p className="mt-1.5 sm:mt-2 text-slate-300 text-xs sm:text-base leading-relaxed">
            {t.dashboardSubtext}
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={() => onNavigateTab('marketing')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.generateContent}</span>
            </button>
            <button
              onClick={onOpenAddProduct}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700/80 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.addProduct}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 p-4 sm:p-5 rounded-2xl shadow-sm cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 truncate pr-1">
              {t.totalProducts}
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-white">{totalProducts}</div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Catalogue styles</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </p>
        </div>

        {/* Products in Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-4 sm:p-5 rounded-2xl shadow-sm cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 truncate pr-1">
              {t.inStock}
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-white">{inStockProducts}</div>
          <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>Ready to ship</span>
          </p>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className={`p-4 sm:p-5 rounded-2xl shadow-sm cursor-pointer transition-all active:scale-98 border ${
            lowStockProducts > 0
              ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-500/70'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[11px] sm:text-xs font-medium text-amber-400 truncate pr-1">
              {t.lowStock}
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-white">
            {lowStockProducts}
            {outOfStockProducts > 0 && (
              <span className="text-[11px] font-semibold text-rose-400 ml-1.5">
                (+{outOfStockProducts} out)
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
            {lowStockProducts > 0
              ? `Re-order: ≤ ${threshold} pcs`
              : 'Inventory healthy'}
          </p>
        </div>

        {/* Content Generated */}
        <div
          onClick={() => onNavigateTab('saved')}
          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 p-4 sm:p-5 rounded-2xl shadow-sm cursor-pointer transition-all active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400 truncate pr-1">
              {t.contentGenerated}
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-white">{contentGeneratedCount}</div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>Saved promos</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </p>
        </div>
      </div>

      {/* Quick Action Tools Bar */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>{t.quickActions}</span>
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">1-Click Launchers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Action 1: Instagram */}
          <div
            onClick={() => onNavigateTab('instagram')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 cursor-pointer transition-all active:scale-95 shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-2.5 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-pink-300 transition-colors leading-tight">
                {t.actionInstagram}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Viral captions & Indian hashtags
            </p>
          </div>

          {/* Action 2: WhatsApp */}
          <div
            onClick={() => onNavigateTab('whatsapp')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all active:scale-95 shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-emerald-300 transition-colors leading-tight">
                {t.actionWhatsApp}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Concise broadcast for customer groups
            </p>
          </div>

          {/* Action 3: Marketing Ideas */}
          <div
            onClick={() => onNavigateTab('marketing')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all active:scale-95 shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-indigo-300 transition-colors leading-tight">
                {t.actionMarketing}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Full campaign with highlights & CTA
            </p>
          </div>

          {/* Action 4: Promotional Poster */}
          <div
            onClick={() => onNavigateTab('posters')}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all active:scale-95 shadow-sm group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-purple-300 transition-colors leading-tight">
                {t.actionPoster}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              1:1 flyers for WhatsApp status
            </p>
          </div>

          {/* Action 5: Add Product */}
          <div
            onClick={onOpenAddProduct}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all active:scale-95 shadow-sm group col-span-2 sm:col-span-1 flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors leading-tight">
                {t.actionAddProduct}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
              Add new sarees, kurtis, or shirts
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Generated AI Content */}
        <div className="bg-slate-900/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Recent AI Creations</span>
            </h3>
            <button
              onClick={() => onNavigateTab('saved')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedContent.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>{t.noActivityYet}</p>
              <button
                onClick={() => onNavigateTab('marketing')}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 font-semibold transition-colors inline-block cursor-pointer"
              >
                Create your first marketing post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedContent.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.contentType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleCopy(item.content, item.id)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t.copyText}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Products */}
        <div className="bg-slate-900/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>Catalog Overview</span>
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {products.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>No products in your catalog yet.</p>
              <button
                onClick={onOpenAddProduct}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 font-semibold transition-colors inline-block cursor-pointer"
              >
                + Add your first product
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 3).map((prod) => {
                const isLow = prod.quantity > 0 && prod.quantity <= threshold;
                const isOut = prod.quantity === 0;

                return (
                  <div
                    key={prod.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {prod.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="truncate max-w-[100px] sm:max-w-none">{prod.category}</span>
                          <span>•</span>
                          <span className="text-white font-semibold font-mono">₹{prod.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOut
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isLow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : `${prod.quantity} in stock`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
