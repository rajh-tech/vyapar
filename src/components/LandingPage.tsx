import React from 'react';
import {
  Sparkles,
  Instagram,
  MessageSquare,
  Image as ImageIcon,
  Package,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Share2,
  Store,
  Layers,
  Check,
  ChevronRight,
  IndianRupee,
  Star,
  Users,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { InfoModal, InfoModalType } from './InfoModal';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, language }) => {
  const t = getTranslation(language);
  const [infoModalType, setInfoModalType] = React.useState<InfoModalType>(null);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>
                {language === 'hi'
                  ? 'भारतीय कपड़ा व्यापारियों और बुटीक के लिए विशेष AI'
                  : 'Built specifically for clothing shops & boutiques in India'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              {language === 'hi'
                ? 'AI के साथ बढ़ाएं अपनी कपड़ों की दुकान का व्यापार'
                : 'Grow Your Clothing Business with AI'}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-300 leading-relaxed font-normal px-2">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>{language === 'hi' ? 'मुफ्त शुरू करें' : 'Start Free'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'hi' ? 'सुविधाएं देखें' : 'Explore Features'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Trust badge */}
            <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Works in English & Hindi
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Indian Rupee (₹) pricing
              </span>
            </p>
          </div>

          {/* Interactive Visual Dashboard Preview Illustration */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/50 to-slate-900 shadow-2xl">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              {/* App Mockup Bar */}
              <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    app.vyaparai.in/dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-800/50">
                  <Store className="w-3.5 h-3.5" />
                  <span>Shree Ganesh Fashion Hub (Jaipur)</span>
                </div>
              </div>

              {/* Inside Mockup Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/90">
                {/* Mock Card 1: WhatsApp Broadcast Output */}
                <div className="bg-slate-950 rounded-xl p-4 border border-emerald-500/20 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <MessageSquare className="w-4 h-4" /> WhatsApp Broadcast
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                      Ready to Send
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-950/30 border border-emerald-800/30 rounded-lg text-xs text-slate-200 leading-relaxed font-sans">
                    <p className="font-bold text-emerald-300">🌟 Festive Saree Restock Alert!</p>
                    <p className="mt-1">
                      Pure Banarasi Silk Zari Saree is now back in Peacock Blue.
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      Offer Price: <span className="text-emerald-400 font-bold">₹2,499</span> (MRP ₹3,999)
                    </p>
                    <p className="mt-2 text-[10px] text-slate-400">
                      Reply with &apos;BOOK&apos; to claim yours!
                    </p>
                  </div>
                </div>

                {/* Mock Card 2: Instagram Caption Generator */}
                <div className="bg-slate-950 rounded-xl p-4 border border-pink-500/20 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-pink-400">
                      <Instagram className="w-4 h-4" /> Instagram Caption
                    </span>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full">
                      Festive Tone
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed">
                    <p className="text-slate-100">
                      👑 Royal elegance redefined! Bring timeless heritage to your celebrations with our handwoven silk collection. ✨
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-indigo-400">
                      <span>#BanarasiSaree</span>
                      <span>#EthnicWear</span>
                      <span>#IndianBoutique</span>
                    </div>
                  </div>
                </div>

                {/* Mock Card 3: Real Inventory Count */}
                <div className="bg-slate-950 rounded-xl p-4 border border-indigo-500/20 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                        <Package className="w-4 h-4" /> Inventory Alerts
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                        2 Low Stock
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="truncate pr-2">Anarkali Kurti Set</span>
                        <span className="text-amber-400 font-bold">4 pcs left</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="truncate pr-2">Daily Cotton Kurti</span>
                        <span className="text-rose-400 font-bold">2 pcs left</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Total Catalogue</span>
                    <span className="font-semibold text-white">48 Styles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features-section" className="py-20 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              {language === 'hi' ? 'दुकानदारों के लिए सुविधाएं' : 'POWERFUL RETAIL SUITE'}
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              {language === 'hi'
                ? 'कपड़ों की दुकान के हर काम को आसान बनाएं'
                : 'Everything Your Clothing Shop Needs to Thrive'}
            </p>
            <p className="mt-4 text-base text-slate-400">
              {language === 'hi'
                ? 'बिना किसी जटिलता के सरल और सीधे AI टूल्स'
                : 'Designed with zero tech friction so anyone can start generating results in seconds.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. AI Marketing Assistant</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate high-converting headlines, promotional highlights, and compelling marketing copy tailored to your clothing products and target shoppers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-pink-500/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-5 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Instagram Caption Generator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create 3 tailored caption variations with attention hooks, calls to action, and strategic hashtags specifically for Indian fashion trends.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. WhatsApp Promotion Generator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Craft polite, impactful WhatsApp broadcast messages formatted with bold pricing, offer deadlines, and a direct click-to-chat copy button.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">4. AI Promotional Poster Creator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Choose from New Arrivals, Festive Deals, and Clearance templates. Customize prices, store details, and export crisp PNG posters instantly.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">5. Product and Inventory Management</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Keep track of styles, sizes, colours, and stock levels in INR (₹). Receive automatic low-stock alerts before your bestselling items run out.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">6. Business Insights Dashboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                View real-time stock summaries, recently generated campaigns, and quick-action shortcuts computed directly from your saved business records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works-section" className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              {language === 'hi' ? 'आसान प्रक्रिया' : 'SIMPLE 3-STEP PROCESS'}
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              {language === 'hi' ? 'कैसे काम करता है VyaparAI' : 'How VyaparAI Works'}
            </p>
            <p className="mt-3 text-slate-400">
              No technical expertise needed. Built for busy retail shop owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg mb-6 shadow-md shadow-indigo-600/30">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Step 1: Enter product details</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Choose an item from your catalog or enter the product name, price in ₹, special discount, and target audience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-lg mb-6 shadow-md shadow-purple-600/30">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Step 2: Generate marketing content</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                VyaparAI drafts ready-to-use captions, WhatsApp broadcasts, and promotional posters in English or natural Hindi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mb-6 shadow-md shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Step 3: Review, edit & share</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tweak any text, copy with one click, or send directly to your customer WhatsApp lists and Instagram followers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
                {language === 'hi' ? 'दुकानदारों के लिए लाभ' : 'PRACTICAL ADVANTAGES'}
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {language === 'hi'
                  ? 'दुकान के काम में समय बचाएं और प्रचार को आसान बनाएं'
                  : 'Focus on Serving Customers While AI Handles Marketing'}
              </h2>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                Running a retail boutique involves sourcing fabrics, managing inventory, and handling walk-in customers. VyaparAI simplifies everyday promotion so you stay consistent.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Save time creating promotional content</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Generate weeks of social posts and broadcasts in minutes instead of staring at a blank screen.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Generate ideas for product marketing</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Get creative angles for festive seasons, seasonal clearance, wedding collections, and weekend deals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Create consistent promotional messages</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Maintain a polished, professional brand voice across Instagram, WhatsApp, and poster flyers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Keep product information organized</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Store prices, sizes, colours, and quantity in one neat catalogue without loose notebooks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Make digital marketing easier for small businesses</h4>
                    <p className="text-xs text-slate-400 mt-0.5">No expensive agencies or complicated software — clean tools designed for Indian retailers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right quote card */}
            <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 p-8 rounded-3xl border border-indigo-500/30 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-base sm:text-lg text-slate-200 italic leading-relaxed">
                &ldquo;Earlier I would spend hours thinking of what to write on WhatsApp when new sarees arrived. With VyaparAI, I just enter the price and color, and in 5 seconds I have a message ready with emojis and offer details!&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 pt-6 border-t border-slate-800">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  RS
                </div>
                <div>
                  <h5 className="font-semibold text-white text-sm">Rajesh Sharma</h5>
                  <p className="text-xs text-slate-400">Shree Ganesh Fashion Hub, Jaipur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing-section" className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              {language === 'hi' ? 'पारदर्शी मूल्य' : 'SIMPLE PLANS'}
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              {language === 'hi' ? 'अपनी दुकान के अनुसार प्लान चुनें' : 'Affordable Pricing for Every Boutique'}
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              Start free today. Transparent pricing in Indian Rupees (₹).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-900 rounded-2xl p-7 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-white">Free Plan</h3>
                <p className="text-xs text-slate-400 mt-1">For testing tools and new stores</p>
                <div className="mt-5 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-slate-400 text-xs ml-1.5">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Limited AI content generations
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic marketing tools
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic product management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Standard poster templates
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('register')}
                className="mt-8 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Starter Plan (RECOMMENDED) */}
            <div className="bg-slate-900 rounded-2xl p-7 border-2 border-indigo-500 relative flex flex-col justify-between shadow-xl shadow-indigo-600/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Recommended
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Starter Plan</h3>
                <p className="text-xs text-indigo-300 mt-1">Best for small clothing boutiques</p>
                <div className="mt-5 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹199</span>
                  <span className="text-slate-400 text-xs ml-1.5">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Higher AI usage limits
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Instagram caption generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> WhatsApp message generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Complete product catalogue
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" /> Low-stock alerts
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('register')}
                className="mt-8 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Choose Starter
              </button>
            </div>

            {/* Growth Plan */}
            <div className="bg-slate-900 rounded-2xl p-7 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <h3 className="text-lg font-bold text-white">Growth Plan</h3>
                <p className="text-xs text-slate-400 mt-1">For expanding fashion stores</p>
                <div className="mt-5 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹499</span>
                  <span className="text-slate-400 text-xs ml-1.5">/month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" /> Maximum AI usage limits
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" /> Advanced marketing templates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" /> Expanded product management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" /> Business insights dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" /> High-res poster export
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('register')}
                className="mt-8 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Choose Growth
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  V
                </div>
                <span className="font-bold text-white text-base">VyaparAI</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Smart Business. Simple Growth. Designed specifically for small clothing shops and fashion retailers in India.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Features</h4>
              <ul className="space-y-2">
                <li>AI Marketing Assistant</li>
                <li>Instagram Caption Generator</li>
                <li>WhatsApp Promotion Generator</li>
                <li>Promotional Poster Creator</li>
                <li>Inventory & Stock Tracker</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Pricing & Plans</h4>
              <ul className="space-y-2">
                <li>Free Plan (₹0)</li>
                <li>Starter Plan (₹199)</li>
                <li>Growth Plan (₹499)</li>
                <li>Boutique Custom Plan</li>
              </ul>
            </div>

              <h4 className="text-white font-semibold mb-3">Legal & Support</h4>
              <ul className="space-y-2">
                <li
                  onClick={() => setInfoModalType('about')}
                  className="hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  About VyaparAI
                </li>
                <li
                  onClick={() => setInfoModalType('contact')}
                  className="hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  Contact Support
                </li>
                <li
                  onClick={() => setInfoModalType('privacy')}
                  className="hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  Privacy Policy
                </li>
                <li
                  onClick={() => setInfoModalType('terms')}
                  className="hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  Terms and Conditions
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} VyaparAI Technologies Pvt. Ltd. All rights reserved.</p>
            <p>Made with ❤️ for Indian fashion retailers and clothing entrepreneurs.</p>
          </div>
        </div>
      </footer>

      {/* Info & Legal Modal */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        language={language}
      />
    </div>
  );
};
