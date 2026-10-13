import React from 'react';
import { Language } from '../types';
import { MapPin, Phone, Mail, MessageCircle, Clock, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
  onRequestQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onRequestQuote }) => {
  const isAr = language === 'ar';

  return (
    <footer id="about" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-amber-300 font-black text-lg">
                T
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                TrenDy EvenTy
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {isAr
                ? 'مطبعة وورشة متخصصة في تجهيز جميع المناسبات والفعاليات في القاهرة وشبرا مصر. نحول أفكارك إلى واقع مطبوع بدقة وفخامة متناهية.'
                : 'Premier bespoke printing atelier & celebration favors workshop based in Shoubra Masr, Cairo. Transforming concepts into tactile reality with uncompromising craftsmanship.'}
            </p>

            <div className="text-xs text-purple-400 font-semibold italic">
              "Work until its done."
            </div>

            {/* Occasions list */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {isAr ? 'نجهز لكم:' : 'We Specialize In:'}
              </span>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'سبوع · أعياد ميلاد · حنة · خطوبة · فرح · مؤتمرات · مناسبات الشركات'
                  : 'Baby Showers · Birthdays · Henna Nights · Engagements · Weddings · Corporate Summits'}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'أقسام الكتالوج' : 'Catalogue Sections'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#catalogue" className="hover:text-purple-300 transition-colors">
                  {isAr ? 'خدمات الطباعة والدعاية' : 'Commercial Printing'}
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-purple-300 transition-colors">
                  {isAr ? 'توزيعات الشموع العطرية' : 'Artisanal Soy Candles'}
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-purple-300 transition-colors">
                  {isAr ? 'توزيعات الريزن والميداليات' : 'Epoxy Resin Keepsakes'}
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-purple-300 transition-colors">
                  {isAr ? 'ديكورات ومرايا الترحيب' : 'Welcome Mirrors & Audio Guestbook'}
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-purple-300 transition-colors">
                  {isAr ? 'دليل الخامات والمواصفات' : 'Material Substrates Guide'}
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-purple-300 transition-colors">
                  {isAr ? 'معرض الأعمال المنفذة' : 'Client Portfolio'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Workshop Location */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'العنوان والتواصل' : 'Location & Contact'}
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  {isAr ? '8 شارع البصاء - شبرا مصر، القاهرة' : '8 El basaa Street - Shoubra Masr, Cairo, Egypt'}
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="tel:01031450254" className="hover:text-white transition-colors font-mono">
                  01031450254 / +20 103 145 0254
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href="mailto:helalgroup2020@gmail.com" className="hover:text-white transition-colors">
                  helalgroup2020@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  {isAr ? 'السبت - الخميس: 10:00 ص - 10:00 م' : 'Sat - Thu: 10:00 AM - 10:00 PM'}
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onRequestQuote}
                type="button"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-purple-800 hover:bg-purple-700 rounded-xl transition-colors text-center shadow-xs"
              >
                {isAr ? 'طلب تسعيرة رسمية فورية' : 'Request Official Quote'}
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TrenDy EvenTy · Shoubra Masr, Cairo. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>{isAr ? 'صنع بكل حب للمناسبات في مصر' : 'Crafted with passion in Egypt'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
