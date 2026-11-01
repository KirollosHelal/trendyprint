import React, { useState } from 'react';
import { Language } from '../types';
import { CONTACT_INFO } from '../config/contact';
import { MessageCircle, Globe, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="/" 
          className="flex items-center gap-2 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-md"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center text-amber-300 font-extrabold text-base sm:text-lg shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-purple-950 font-sans leading-none">
              TrenDy EvenTy
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-purple-700 tracking-wide mt-0.5">
              {isAr ? 'لتجهيز جميع المناسبات والطباعة' : 'Print Atelier & Event Craft'}
            </span>
          </div>
        </a>

        {/* Zone 2: Desktop 4-5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
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

        {/* Zone 3: Actions (Language toggle + Primary RFQ + Mobile Hamburger Toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            type="button"
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 whitespace-nowrap shrink-0 min-h-[36px]"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Quick WhatsApp Link for Sales on tablet/desktop */}
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsAppDigits}?text=${encodeURIComponent(
              'Hello Trendy EvenTy, I am interested in your printing and event services.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/80 whitespace-nowrap shrink-0 font-mono min-h-[36px]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{CONTACT_INFO.phoneDisplay}</span>
          </a>

          {/* Primary Action Button */}
          <button
            onClick={onRequestQuote}
            type="button"
            className="px-3 sm:px-3.5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 active:bg-purple-950 rounded-lg transition-colors shadow-sm hover:shadow whitespace-nowrap shrink-0 min-h-[36px]"
          >
            {isAr ? 'طلب تسعيرة' : 'Get Quote'}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            <a
              href="#catalogue"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:text-purple-950 hover:bg-purple-50 transition-colors"
            >
              {isAr ? 'الكتالوج وخدمات الطباعة' : 'Services Catalogue'}
            </a>
            <a
              href="#materials"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:text-purple-950 hover:bg-purple-50 transition-colors"
            >
              {isAr ? 'دليل الخامات والورق' : 'Materials Guide'}
            </a>
            <a
              href="#portfolio"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:text-purple-950 hover:bg-purple-50 transition-colors"
            >
              {isAr ? 'معرض الأعمال السابقة' : 'Portfolio Showcase'}
            </a>
            <a
              href="#about"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:text-purple-950 hover:bg-purple-50 transition-colors"
            >
              {isAr ? 'عن المطبعة والموقع بشبرا' : 'About & Location'}
            </a>
          </nav>

          <div className="mt-4 pt-4 border-t border-purple-100 flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsAppDigits}?text=${encodeURIComponent(
                'Hello Trendy EvenTy, I am interested in your printing and event services.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? `تحدث واتساب: ${CONTACT_INFO.phoneDisplay}` : `WhatsApp Sales: ${CONTACT_INFO.phoneDisplay}`}</span>
            </a>
            <button
              onClick={() => {
                closeMenu();
                onRequestQuote();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 active:bg-purple-950 rounded-xl shadow-xs min-h-[44px]"
            >
              {isAr ? 'طلب مقايسة وتسعيرة مخصصة' : 'Request Tailored Quote'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
