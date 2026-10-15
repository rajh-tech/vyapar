import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Share2,
  Package,
  Calendar,
  Send,
  CheckCheck,
  Store,
  Phone,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Language, WhatsAppPromotionResponse, SavedContent } from '../types';
import { getTranslation } from '../utils/translations';

interface WhatsAppGeneratorProps {
  products: Product[];
  onContentSaved: (content: SavedContent) => void;
  language: Language;
  shopName: string;
  shopPhone?: string;
}

export const WhatsAppGenerator: React.FC<WhatsAppGeneratorProps> = ({
  products,
  onContentSaved,
  language,
  shopName,
  shopPhone,
}) => {
  const t = getTranslation(language);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | ''>(999);
  const [discount, setDiscount] = useState('Flat 40% OFF');
  const [expiryDate, setExpiryDate] = useState('This Sunday Midnight');
  const [contentLanguage, setContentLanguage] = useState<Language>(language);
  const [messageStyle, setMessageStyle] = useState<
    'Direct & Urgent' | 'Friendly & Warm' | 'Festive Celebration' | 'VIP Customer Special'
  >('Direct & Urgent');
  const [editableMessage, setEditableMessage] = useState('');

  // Results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WhatsAppPromotionResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setPrice(prod.price);
      if (prod.originalPrice && prod.originalPrice > prod.price) {
        setDiscount(`Special Price (MRP ₹${prod.originalPrice})`);
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
    setIsSaved(false);

    try {
      const res = await api.generateWhatsApp({
        productName: productName.trim(),
        price: Number(price),
        discount: discount.trim(),
        expiryDate: expiryDate.trim(),
        language: contentLanguage,
        messageStyle,
        shopName,
        phone: shopPhone,
      });

      setResult(res.data);
      setEditableMessage(res.data.message);
    } catch (err: any) {
      setError(err.message || 'Failed to generate WhatsApp promotion.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!editableMessage) return;
    navigator.clipboard.writeText(editableMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!editableMessage) return;
    try {
      const saved = await api.saveContent({
        contentType: 'whatsapp',
        title: `WhatsApp - ${productName} (₹${price})`,
        inputDetails: {
          productName,
          price,
          discount,
          style: messageStyle,
        },
        content: editableMessage,
      });
      onContentSaved(saved.content);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError('Save failed: ' + err.message);
    }
  };

  const handleOpenWhatsApp = () => {
    if (!editableMessage) return;
    const url = `https://wa.me/?text=${encodeURIComponent(editableMessage)}`;
    window.open(url, '_blank');
  };

  const styles: Array<
    'Direct & Urgent' | 'Friendly & Warm' | 'Festive Celebration' | 'VIP Customer Special'
  > = [
    'Direct & Urgent',
    'Friendly & Warm',
    'Festive Celebration',
    'VIP Customer Special',
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.waHeader}</h1>
            <p className="text-xs sm:text-sm text-slate-400">{t.waSub}</p>
          </div>
        </div>

        {/* Quick select chips */}
        {products.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Choose from Your Catalog:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProductSelect(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    selectedProductId === p.id
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Package className="w-3 h-3 text-emerald-400" />
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
            <span>Broadcast Settings</span>
            <span className="text-[11px] text-emerald-400 font-normal">WhatsApp Format</span>
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
              placeholder="e.g. Daily Wear Pure Cotton Kurti"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                placeholder="999"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
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
                placeholder="e.g. Flat 30% OFF"
                className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.offerExpiry}
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="e.g. Valid till Sunday midnight or Only 15 pieces left"
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.messageStyle}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setMessageStyle(st)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-left transition-all active:scale-95 cursor-pointer ${
                    messageStyle === st
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm font-semibold'
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
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English (Polite Indian Retail)</option>
              <option value="hi">हिंदी (Namaste / Customer Special)</option>
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
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.generating}</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Create WhatsApp Message</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output: Simulated WhatsApp Phone (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">WhatsApp Broadcast</span>
              {result && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Ready
                </span>
              )}
            </div>

            {editableMessage && (
              <div className="flex items-center gap-1.5 sm:gap-2">
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
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? t.copied : t.copyBroadcast}</span>
                </button>
              </div>
            )}
          </div>

          {!editableMessage && !loading ? (
            <div className="py-16 sm:py-20 text-center border-2 border-dashed border-slate-800 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                Ready to Draft Broadcast
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto px-4">
                Enter price and product info to generate a personalized broadcast message with WhatsApp markdown formatting.
              </p>
            </div>
          ) : loading ? (
            <div className="py-16 sm:py-20 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-white">Drafting WhatsApp Message...</p>
              <p className="text-xs text-slate-400">
                Formatting bold typography, Indian Rupee symbols, and polite greeting emojis.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* WhatsApp Smartphone Chat Bubble Preview */}
              <div className="w-full max-w-[340px] sm:max-w-md mx-auto bg-slate-950/90 rounded-2xl p-4 border border-slate-800 shadow-xl">
                {/* Chat header */}
                <div className="flex items-center gap-2.5 pb-2.5 mb-2.5 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {shopName.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white truncate max-w-[200px]">{shopName}</h5>
                    <p className="text-[10px] text-emerald-400">Online • Verified Store</p>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="bg-[#054740] rounded-xl rounded-tr-none p-3.5 text-xs text-slate-100 leading-relaxed shadow-sm border border-emerald-700/40 font-sans whitespace-pre-line">
                  {editableMessage}
                  <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-emerald-300">
                    <span>Just now</span>
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Edit textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Edit Message Text Directly:
                </label>
                <textarea
                  rows={6}
                  value={editableMessage}
                  onChange={(e) => setEditableMessage(e.target.value)}
                  className="w-full p-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp App / Web</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? t.copied : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
