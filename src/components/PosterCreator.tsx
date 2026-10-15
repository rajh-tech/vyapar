import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Download,
  Sparkles,
  Package,
  Layers,
  Palette,
  Phone,
  MapPin,
  Tag,
  Check,
  Store,
  Eye,
  Sliders,
  Share2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Product, Language, PosterData } from '../types';
import { getTranslation } from '../utils/translations';

interface PosterCreatorProps {
  products: Product[];
  language: Language;
  defaultShopName: string;
  defaultPhone?: string;
  defaultAddress?: string;
}

export const PosterCreator: React.FC<PosterCreatorProps> = ({
  products,
  language,
  defaultShopName,
  defaultPhone,
  defaultAddress,
}) => {
  const t = getTranslation(language);
  const posterRef = useRef<HTMLDivElement>(null);

  // Mobile view mode toggle (Edit vs Live Preview)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Poster configuration state
  const [template, setTemplate] = useState<
    'festive_offer' | 'new_arrival' | 'seasonal_sale' | 'clearance' | 'special_discount'
  >('festive_offer');
  const [shopName, setShopName] = useState(defaultShopName || 'Shree Ganesh Fashion Hub');
  const [productName, setProductName] = useState('Pure Banarasi Silk Zari Saree');
  const [headline, setHeadline] = useState('GRAND FESTIVE COLLECTION');
  const [subheadline, setSubheadline] = useState('Special Wedding & Festival Edition');
  const [price, setPrice] = useState<number | ''>(2499);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(3999);
  const [discountTag, setDiscountTag] = useState('FLAT 38% OFF');
  const [contactNumber, setContactNumber] = useState(defaultPhone || '+91 98765 43210');
  const [addressOrWebsite, setAddressOrWebsite] = useState(defaultAddress || 'Shop No. 14, Main Market, Jaipur');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
  );
  const [exporting, setExporting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');

  // Handle inventory auto-fill
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setProductName(prod.name);
      setPrice(prod.price);
      if (prod.originalPrice) {
        setOriginalPrice(prod.originalPrice);
        const percent = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
        setDiscountTag(`FLAT ${percent}% OFF`);
      }
      if (prod.imageUrl) {
        setImageUrl(prod.imageUrl);
      }
    }
  };

  const templates = [
    { id: 'festive_offer', label: 'Festive Offers', desc: 'Diwali, Eid, Weddings' },
    { id: 'new_arrival', label: 'New Arrivals', desc: 'Boutique look & sleek lines' },
    { id: 'seasonal_sale', label: 'Seasonal Sale', desc: 'Vibrant discount badge' },
    { id: 'clearance', label: 'Clearance', desc: 'Urgent red clearance banner' },
    { id: 'special_discount', label: 'Special Discount', desc: 'Minimalist luxury styling' },
  ];

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setExporting(true);

    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.95,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `VyaparAI-Poster-${productName.replace(/\s+/g, '-').slice(0, 18)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export poster image:', err);
      alert('You can also take a quick screenshot of the poster preview!');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.posterHeader}</h1>
            <p className="text-xs sm:text-sm text-slate-400">{t.posterSub}</p>
          </div>
        </div>

        {/* Mobile Tab Pill Switcher (Editor vs Preview) */}
        <div className="lg:hidden mt-4 flex p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'editor'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Details</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'preview'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Poster Preview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Form Controls (5 cols) - hidden on mobile if preview tab active */}
        <div
          className={`lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white">Poster Customizer</h2>
            <button
              onClick={() => setMobileTab('preview')}
              className="lg:hidden text-xs text-purple-400 font-semibold flex items-center gap-1"
            >
              <span>Preview</span>
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.chooseTemplate}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplate(tmpl.id as any)}
                  className={`p-2 sm:p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between active:scale-98 ${
                    template === tmpl.id
                      ? 'bg-purple-950/50 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <span className="font-bold block truncate">{tmpl.label}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{tmpl.desc}</span>
                  </div>
                  {template === tmpl.id && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Select from Inventory */}
          {products.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-purple-400" />
                <span>Auto-fill from Products:</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Manual or choose product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Shop / Boutique Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Product Title</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Discount Tag</label>
              <input
                type="text"
                value={discountTag}
                onChange={(e) => setDiscountTag(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Offer Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">MRP / Strikethrough</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Product Photo URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t.contactNumber}</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t.shopAddress}</label>
              <input
                type="text"
                value={addressOrWebsite}
                onChange={(e) => setAddressOrWebsite(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Quick jump to preview on mobile */}
          <div className="lg:hidden pt-2">
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>View Generated Poster & Export</span>
            </button>
          </div>
        </div>

        {/* Right Live Poster Canvas (7 cols) */}
        <div
          className={`lg:col-span-7 flex flex-col items-center w-full ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-slate-300">
              Live Poster (Square 1:1 Canvas)
            </span>
            <button
              onClick={() => setMobileTab('editor')}
              className="lg:hidden text-xs text-purple-400 font-semibold flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Back to Edit</span>
            </button>
          </div>

          {/* THE RESPONSIVE POSTER CANVAS */}
          <div
            ref={posterRef}
            className="w-full max-w-[340px] sm:max-w-[440px] aspect-square rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between p-4 sm:p-6 select-none border border-slate-700"
            style={{
              backgroundColor:
                template === 'festive_offer'
                  ? '#0f172a'
                  : template === 'clearance'
                  ? '#450a0a'
                  : template === 'seasonal_sale'
                  ? '#1e1b4b'
                  : template === 'new_arrival'
                  ? '#090d16'
                  : '#18181b',
              backgroundImage:
                template === 'festive_offer'
                  ? 'radial-gradient(circle at top right, rgba(217, 119, 6, 0.3), transparent 60%)'
                  : template === 'clearance'
                  ? 'radial-gradient(circle at bottom, rgba(239, 68, 68, 0.35), transparent 70%)'
                  : 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.3), transparent 70%)',
            }}
          >
            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/15">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-extrabold text-white tracking-wide uppercase truncate">
                    {shopName}
                  </h4>
                  <p className="text-[8px] sm:text-[9px] text-slate-300 uppercase tracking-widest truncate">
                    Clothing & Fashion Store
                  </p>
                </div>
              </div>

              {/* Discount Tag */}
              <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] sm:text-xs shadow-md uppercase tracking-wider shrink-0">
                {discountTag}
              </div>
            </div>

            {/* Poster Middle Content */}
            <div className="relative z-10 my-auto py-2 flex items-center gap-3 sm:gap-4">
              {/* Product Photo */}
              <div className="w-32 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 bg-slate-800">
                <img
                  src={imageUrl}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <span className="inline-block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-amber-300 border border-white/10 mb-1.5 sm:mb-2 truncate max-w-full">
                  {headline}
                </span>
                <h3 className="text-xs sm:text-base font-extrabold text-white leading-tight line-clamp-2">
                  {productName}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-300 mt-1 line-clamp-1">{subheadline}</p>

                {/* Price Box */}
                <div className="mt-2.5 sm:mt-3.5 p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-[9px] text-slate-300 uppercase font-medium">Special Offer</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      ₹{price}
                    </span>
                    {originalPrice && (
                      <span className="text-[11px] sm:text-xs text-slate-400 line-through font-mono">
                        ₹{originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Bar */}
            <div className="relative z-10 pt-2 sm:pt-3 border-t border-white/15 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-200">
              <div className="flex items-center gap-1 truncate max-w-[170px] sm:max-w-[220px]">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{addressOrWebsite}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span className="font-semibold text-white">{contactNumber}</span>
              </div>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="w-full max-w-[340px] sm:max-w-[440px] mt-4 space-y-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={exporting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? t.downloading : t.downloadPoster}</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Instant high-resolution PNG export for WhatsApp Status & Instagram Stories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
