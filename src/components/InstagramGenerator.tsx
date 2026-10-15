import React, { useState, useRef } from 'react';
import {
  Instagram,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  RefreshCw,
  Package,
  Layers,
  Heart,
  MessageCircle,
  Share2,
  Hash,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Language, InstagramCaptionResponse, SavedContent } from '../types';
import { getTranslation } from '../utils/translations';

interface InstagramGeneratorProps {
  products: Product[];
  onContentSaved: (content: SavedContent) => void;
  language: Language;
}

export const InstagramGenerator: React.FC<InstagramGeneratorProps> = ({
  products,
  onContentSaved,
  language,
}) => {
  const t = getTranslation(language);
  const resultRef = useRef<HTMLDivElement>(null);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | ''>(1499);
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('Festive 30% OFF');
  const [targetAudience, setTargetAudience] = useState('Fashion influencers & ethnic wear lovers');
  const [contentLanguage, setContentLanguage] = useState<Language>(language);
  const [captionStyle, setCaptionStyle] = useState<'Trendy' | 'Festive' | 'Minimalist' | 'Storytelling' | 'Offer-Focused'>('Trendy');

  // Result states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InstagramCaptionResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setPrice(prod.price);
      setDescription(prod.description);
      if (prod.originalPrice && prod.originalPrice > prod.price) {
        setDiscount(`Flat ₹${prod.originalPrice - prod.price} OFF (Was ₹${prod.originalPrice})`);
      }
    }
  };

  const handleGenerate = async () => {
    if (!productName || !price) {
      setError('Product name and price are required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.generateInstagram({
        productName: productName.trim(),
        price: Number(price),
        description: description.trim(),
        discount: discount.trim(),
        targetAudience: targetAudience.trim(),
        language: contentLanguage,
        captionStyle,
      });

      setResult(res.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to generate Instagram captions.');
    } finally {
      setLoading(false);
    }
  };

  const copyVariation = (caption: string, index: number) => {
    const fullPost = `${result?.hook}\n\n${caption}\n\n${result?.callToAction}\n\n${result?.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullPost);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const saveVariation = async (variation: { title: string; caption: string }, index: number) => {
    try {
      const saved = await api.saveContent({
        contentType: 'instagram',
        title: `Insta (${variation.title}) - ${productName}`,
        inputDetails: {
          productName,
          price,
          style: captionStyle,
        },
        content: `${result?.hook}\n\n${variation.caption}\n\n${result?.callToAction}\n\n${result?.hashtags.join(' ')}`,
      });
      onContentSaved(saved.content);
      setSavedIndex(index);
      setTimeout(() => setSavedIndex(null), 3000);
    } catch (err: any) {
      setError('Save failed: ' + err.message);
    }
  };

  const copyHashtags = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.hashtags.join(' '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const styles: Array<'Trendy' | 'Festive' | 'Minimalist' | 'Storytelling' | 'Offer-Focused'> = [
    'Trendy',
    'Festive',
    'Minimalist',
    'Storytelling',
    'Offer-Focused',
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-600/30 shrink-0">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.instaHeader}</h1>
            <p className="text-xs sm:text-sm text-slate-400">{t.instaSub}</p>
          </div>
        </div>

        {/* Quick select chips */}
        {products.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Select Product:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProductSelect(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    selectedProductId === p.id
                      ? 'bg-pink-600 text-white border-pink-500 font-bold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Package className="w-3 h-3 text-pink-400" />
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
            <span>Instagram Settings</span>
            <span className="text-[11px] text-pink-400 font-normal">3 Viral Variations</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.productName} *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Lavender Georgette Anarkali Suit"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.price} *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="1499"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.discountOffer}
              </label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g. Flat 20% OFF"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Product Description / Fabric Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Pure breathable fabric with hand embroidery and matching dupatta..."
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Caption Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {styles.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCaptionStyle(st)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                    captionStyle === st
                      ? 'bg-pink-600 text-white border-pink-500 shadow-sm font-bold'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.preferredLanguage}
            </label>
            <select
              value={contentLanguage}
              onChange={(e) => setContentLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="en">English (with Indian fashion terms)</option>
              <option value="hi">हिंदी (Hindi / Hinglish viral vibe)</option>
            </select>
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <Instagram className="w-4 h-4" />
                <span>Generate 3 Captions</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: 3 Variations & Hashtags (7 cols) */}
        <div ref={resultRef} className="lg:col-span-7 space-y-5">
          {!result && !loading ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 sm:p-12 text-center border-dashed">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto mb-3">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Generate Instagram Posts</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Fill in the details to generate 3 diverse caption angles: Trendy aesthetic, Storytelling heritage, and Urgent sales deal.
              </p>
            </div>
          ) : loading ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-14 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">Generating Instagram Captions...</p>
              <p className="text-xs text-slate-400">
                Crafting hooks, styling emojis, and hand-picking trending Indian fashion tags.
              </p>
            </div>
          ) : (
            <>
              {/* Hook & Call to Action banner */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> High-Engagement Hook Line
                  </span>
                  <button
                    onClick={() => {
                      if (result?.hook) {
                        navigator.clipboard.writeText(result.hook);
                        setCopiedHook(true);
                        setTimeout(() => setCopiedHook(false), 2000);
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 active:scale-95"
                  >
                    {copiedHook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHook ? t.copied : 'Copy Hook'}</span>
                  </button>
                </div>
                <p className="text-sm font-semibold text-white italic">
                  &ldquo;{result?.hook}&rdquo;
                </p>
                <div className="text-xs text-slate-400 pt-1 flex items-center gap-1">
                  <span className="font-semibold text-slate-300">CTA:</span> {result?.callToAction}
                </div>
              </div>

              {/* 3 Variations */}
              <div className="space-y-3.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-pink-400" />
                  <span>{t.captionVariations}</span>
                </h3>

                {result?.variations.map((v, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 truncate">
                        Variation {idx + 1}: {v.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => saveVariation(v, idx)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700 active:scale-95"
                        >
                          {savedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Bookmark className="w-3 h-3" />}
                          <span>{savedIndex === idx ? t.saved : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => copyVariation(v.caption, idx)}
                          className="px-2.5 sm:px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === idx ? t.copied : 'Copy Post'}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                      {v.caption}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hashtags Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-pink-400" />
                    <span>{t.recommendedHashtags}</span>
                  </span>
                  <button
                    onClick={copyHashtags}
                    className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 active:scale-95"
                  >
                    {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTags ? t.copied : 'Copy All Tags'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result?.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-mono"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
