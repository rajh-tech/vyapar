import React from 'react';
import { X, ShieldCheck, FileText, Mail, Phone, MapPin, Sparkles, Store, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

export type InfoModalType = 'about' | 'contact' | 'privacy' | 'terms' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
  language: Language;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, language }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Gradient Header */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0" />

        {/* Modal Title Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            {type === 'about' && <Store className="w-5 h-5 text-indigo-400" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-indigo-400" />}
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-purple-400" />}
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {type === 'about' && (language === 'hi' ? 'व्यापारAI के बारे में' : 'About VyaparAI')}
              {type === 'contact' && (language === 'hi' ? 'संपर्क एवं सहायता' : 'Contact Support')}
              {type === 'privacy' && (language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy')}
              {type === 'terms' && (language === 'hi' ? 'नियम एवं शर्तें' : 'Terms and Conditions')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {type === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-200">
                <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Smart Business. Simple Growth.
                </h4>
                <p>
                  VyaparAI is an AI business assistant designed specifically for small clothing shops, saree stores, boutique owners, and fashion retailers in India.
                </p>
              </div>
              <p>
                Our mission is to empower local Indian garment retailers with modern digital marketing tools without the complexity of traditional enterprise software. From generating high-converting Instagram reels captions and festive WhatsApp broadcast copy to designing 1:1 promotional flyers and managing stock levels, VyaparAI keeps Indian retail simple and affordable.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-white block mb-0.5">Dual-Language Ready</span>
                  <span className="text-slate-400 text-xs">Full support for English and Hindi retail vernacular.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-bold text-white block mb-0.5">Indian Rupee (₹) Pricing</span>
                  <span className="text-slate-400 text-xs">Customized for Indian consumer pricing conventions.</span>
                </div>
              </div>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <p>
                Need help setting up your store or generating marketing copy? Our support team is here to assist you:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-sm">Customer Support Email</h5>
                    <p className="text-slate-400 mt-0.5">support@vyaparai.in</p>
                    <span className="text-[11px] text-emerald-400 font-medium">Response within 2-4 business hours</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-sm">WhatsApp Retail Helpline</h5>
                    <p className="text-slate-400 mt-0.5">+91 98765 43210</p>
                    <span className="text-[11px] text-slate-400">Available Monday to Saturday, 9:00 AM - 8:00 PM IST</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-sm">Headquarters</h5>
                    <p className="text-slate-400 mt-0.5">
                      VyaparAI Technologies Pvt. Ltd., Textile Tower, B-Block, MI Road, Jaipur, Rajasthan 302001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your business catalog and inventory data are strictly private and isolated.</span>
              </div>
              <h4 className="font-bold text-white text-sm">1. Data Storage & Ownership</h4>
              <p>
                All product information, prices, inventory numbers, and business settings uploaded to VyaparAI remain the exclusive property of your business. Your data is isolated per shop account and is never shared with competitors or unauthorized third parties.
              </p>
              <h4 className="font-bold text-white text-sm">2. AI Processing Privacy</h4>
              <p>
                When you generate marketing content, only the relevant product parameters (name, category, price, discount) are securely transmitted via encrypted server proxy to Google Gemini API. Your master database credentials and passwords are protected with PBKDF2 cryptographic hashing and are never exposed in transit.
              </p>
              <h4 className="font-bold text-white text-sm">3. No Data Selling</h4>
              <p>
                We do not sell, rent, or monetize your retail store details or customer contacts to advertising networks.
              </p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-3.5">
              <h4 className="font-bold text-white text-sm">1. Acceptance of Terms</h4>
              <p>
                By using VyaparAI, you agree to these Terms and Conditions. VyaparAI provides AI-assisted content drafting and catalog organization for clothing retailers.
              </p>
              <h4 className="font-bold text-white text-sm">2. Content Review Responsibility</h4>
              <p>
                While VyaparAI generates optimized promotional copy using advanced generative AI models, shop owners are responsible for verifying final product descriptions, prices, discounts, and return policies before broadcasting them to customers.
              </p>
              <h4 className="font-bold text-white text-sm">3. Pricing & Subscription Plans</h4>
              <p>
                VyaparAI offers a Free plan (₹0/mo) as well as Starter (₹199/mo) and Growth (₹499/mo) plans. Usage quotas reset monthly. Paid payment gateways will be announced with clear advance notice.
              </p>
              <h4 className="font-bold text-white text-sm">4. Acceptable Use</h4>
              <p>
                Users agree not to use the marketing tools for unlawful products, counterfeit garments, or spam broadcasting in violation of WhatsApp and Instagram community guidelines.
              </p>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
          >
            {language === 'hi' ? 'समझ गया / बंद करें' : 'Understood & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
