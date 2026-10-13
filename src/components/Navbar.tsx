import React from 'react';
import { Language } from '../types';
import { MessageCircle, Globe, Phone } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  onRequestQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onRequestQuote,
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <a 
          href="#" 
          className="flex items-center gap-2 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-md"
        >
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-800 to-indigo-900 flex items-center justify-center text-amber-300 font-extrabold text-lg shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-purple-950 font-sans leading-none">
              TrenDy EvenTy
            </span>
            <span className="text-[11px] font-medium text-purple-700 tracking-wide mt-0.5">
              {isAr ? 'لتجهيز جميع المناسبات والطباعة' : 'Print Atelier & Event Craft'}
            </span>
          </div>
        </a>

        {/* Zone 2: Clean 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <a
            href="#catalogue"
            className="hover:text-purple-900 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'الكتالوج والخدمات' : 'Services Catalogue'}
          </a>
          <a
            href="#materials"
            className="hover:text-purple-900 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'دليل الخامات والطباعة' : 'Materials Guide'}
          </a>
          <a
            href="#portfolio"
            className="hover:text-purple-900 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'معرض الأعمال' : 'Portfolio'}
          </a>
          <a
            href="#about"
            className="hover:text-purple-900 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'عن تريندي إيفنتي' : 'About & Location'}
          </a>
        </nav>

        {/* Zone 3: Actions (Language toggle + Primary RFQ Button + WhatsApp Quick Call) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200/60 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-purple-600"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-purple-700" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Quick WhatsApp Link for Sales */}
          <a
            href="https://wa.me/201067288084?text=Hello%20Trendy%20EvenTy%2C%20I%20am%20interested%20in%20your%20printing%20and%20event%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/80 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>01067288084</span>
          </a>

          {/* Primary Action Button */}
          <button
            onClick={onRequestQuote}
            type="button"
            className="px-4 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 active:bg-purple-950 rounded-lg transition-colors shadow-sm hover:shadow whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-purple-600"
          >
            {isAr ? 'طلب تسعيرة فورية' : 'Request Quote'}
          </button>
        </div>
      </div>
    </header>
  );
};
