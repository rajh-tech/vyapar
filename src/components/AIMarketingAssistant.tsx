import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  RefreshCw,
  Share2,
  Package,
  Layers,
  ArrowRight,
  Send,
  MessageCircle,
  HelpCircle,
  Info,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api';
import {
  Product,
  MarketingPlatform,
  MarketingTone,
  Language,
  MarketingContentResponse,
  SavedContent,
} from '../types';
import { getTranslation } from '../utils/translations';

interface AIMarketingAssistantProps {
  products: Product[];
  onContentSaved: (content: SavedContent) => void;
  language: Language;
  shopName: string;
}

export const AIMarketingAssistant: React.FC<AIMarketingAssistantProps> = ({
  products,
  onContentSaved,
  language,
  shopName,
}) => {
  const t = getTranslation(language);
  const resultRef = useRef<HTMLDivElement>(null);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Sarees & Ethnic');
  const [price, setPrice] = useState<number | ''>(1999);
  const [discount, setDiscount] = useState('Flat 30% OFF this week');
  const [targetAudience, setTargetAudience] = useState('Women looking for festive ethnic wear');
  const [platform, setPlatform] = useState<MarketingPlatform>('Instagram');
  const [contentLanguage, setContentLanguage] = useState<Language>(language);
  const [tone, setTone] = useState<MarketingTone>('Festive');

  // Generation result states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarketingContentResponse | null>(null);
  const [editableCaption, setEditableCaption] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Auto-fill from selected inventory product
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setCategory(prod.category);
      setPrice(prod.price);
      if (prod.originalPrice && prod.originalPrice > prod.price) {
        const discountPercent = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
        setDiscount(`Flat ${discountPercent}% OFF (MRP ₹${prod.originalPrice})`);
      }
      if (prod.description) {
        setTargetAudience(`Shoppers looking for ${prod.category.toLowerCase()} with premium styling`);
      }
    }
  };

  const handleGenerate = async () => {
    if (!productName || !price) {
      setError('Please provide at least product name and price.');
      return;
    }

    setError(null);
    setLoading(true);
    setIsSaved(false);

    try {
      const res = await api.generateMarketing({
        productName: productName.trim(),
        category,
        price: Number(price),
        discount: discount.trim(),
        targetAudience: targetAudience.trim(),
        platform,
        language: contentLanguage,
        tone,
        shopName,
      });

      setResult(res.data);
      setEditableCaption(res.data.caption);

      // Smooth scroll on mobile to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `${result.headline}\n\n${editableCaption}\n\n📌 Highlights:\n${result.highlights.map((h) => `• ${h}`).join('\n')}\n\n👉 ${result.callToAction}\n\n${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      const saved = await api.saveContent({
        contentType: 'marketing',
        title: `${platform} - ${productName} (₹${price})`,
        inputDetails: {
          productName,
          category,
          price,
          discount,
          platform,
          tone,
        },
        content: editableCaption,
      });
      onContentSaved(saved.content);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError('Failed to save content: ' + err.message);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!editableCaption) return;
    const text = encodeURIComponent(editableCaption);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const platforms: MarketingPlatform[] = ['Instagram', 'WhatsApp', 'Facebook', 'General'];
  const tones: MarketingTone[] = ['Festive', 'Trendy', 'Premium', 'Friendly', 'Professional'];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {t.menuMarketing}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'hi'
                ? 'अपने कपड़ों के लिए विज्ञापन, पोस्ट और प्रचार संदेश तुरंत लिखें'
                : 'Create high-converting promotional campaigns with Gemini AI'}
            </p>
          </div>
        </div>

        {/* Quick Inventory Thumb Chips */}
        {products.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Tap to Fast-Fill from Your Products:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProductSelect(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    selectedProductId === p.id
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Package className="w-3 h-3 text-indigo-400" />
                  <span>{p.name}</span>
                  <span className="font-mono text-[10px] opacity-80">₹{p.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
            <span>Promotion Parameters</span>
            <span className="text-[11px] text-indigo-400 font-normal">
              Gemini 3.8 Flash
            </span>
          </h2>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.productName} *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Pure Chanderi Silk Kurti Set"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.category}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Sarees & Ethnic"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.price} *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="1999"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Discount / Special Offer */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.discountOffer}
            </label>
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. Flat 25% OFF or Festive Special"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.targetAudience}
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Wedding shoppers, college students..."
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.marketingPlatform}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                    platform === p
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Tone & Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.toneOfVoice}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as MarketingTone)}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {tones.map((ton) => (
                  <option key={ton} value={ton}>
                    {ton}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.preferredLanguage}
              </label>
              <select
                value={contentLanguage}
                onChange={(e) => setContentLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.generateContent}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Card (7 cols) */}
        <div ref={resultRef} className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <span>Generated Campaign Preview</span>
              {result && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Ready
                </span>
              )}
            </h3>

            {result && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  title="Regenerate"
                  className="p-1.5 sm:p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? t.saved : t.saveToAccount}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? t.copied : t.copyText}</span>
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-16 sm:py-20 text-center space-y-4">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-200">
                Crafting promotional copy with Gemini AI...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Analyzing fabric appeal, Indian Rupee pricing, and high-converting retail angles.
              </p>
            </div>
          ) : !result ? (
            <div className="py-14 sm:py-20 text-center border-2 border-dashed border-slate-800 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                No content generated yet
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto px-4">
                Enter your product details on the left and click &ldquo;{t.generateContent}&rdquo;. VyaparAI will craft headlines, highlights, captions, and hashtags.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Headline */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                  Catchy Headline
                </span>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">{result.headline}</p>
              </div>

              {/* Editable Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Marketing Caption (Editable):
                  </label>
                  <span className="text-[10px] text-slate-400">Tweak text anytime</span>
                </div>
                <textarea
                  rows={6}
                  value={editableCaption}
                  onChange={(e) => setEditableCaption(e.target.value)}
                  className="w-full p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Highlights */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Product Highlights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold">
                    Call To Action
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">{result.callToAction}</p>
                </div>
                {platform === 'WhatsApp' && (
                  <button
                    onClick={handleOpenWhatsApp}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.openInWhatsApp}</span>
                  </button>
                )}
              </div>

              {/* Hashtags */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Recommended Hashtags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-indigo-300 font-mono"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
