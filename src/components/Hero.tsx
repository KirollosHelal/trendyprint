import React from 'react';
import { Language } from '../types';
import { Search, MessageCircle, FileText, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  searchQuery,
  onSearchChange,
  onRequestQuote,
}) => {
  const isAr = language === 'ar';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-white to-slate-50 border-b border-purple-100/60 pt-8 pb-14">
      {/* Subtle decorative background light glow */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Screen 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Brand Story & Search */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet Kickers with subtle dot separator (No Pill Box) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-900 tracking-wide mb-3">
              <span className="uppercase text-purple-700 font-bold">TrenDy EvenTy Atelier</span>
              <span aria-hidden="true" className="text-purple-400">·</span>
              <span className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-600 inline" />
                {isAr ? 'شبرا مصر، القاهرة' : 'Shoubra Masr, Cairo'}
              </span>
              <span aria-hidden="true" className="text-purple-400">·</span>
              <span className="text-slate-500 italic">"Work until its done."</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight lg:leading-[1.15] mb-4"
              style={{ textWrap: 'balance' }}
            >
              {isAr ? (
                <>
                  يمكننا تصميم و طباعة <span className="text-purple-900 underline decoration-purple-300 decoration-wavy">أي فكرة</span> لتجهيز جميع مناسباتكم
                </>
              ) : (
                <>
                  We Can Design & Print <span className="text-purple-900 underline decoration-purple-300 decoration-wavy">Any Idea</span> for Every Celebration
                </>
              )}
            </h1>

            {/* Subheading with exact occasions from catalogue */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 max-w-2xl">
              {isAr ? (
                <>
                  كتالوج شامل لخدمات الطباعة الفاخرة، توزيعات الشموع والريزن المصنوعة يدوياً، وديكورات الحفلات. نجهز بالكامل:
                  <strong className="text-purple-950 font-semibold block mt-1">
                    سبوع · أعياد ميلاد · حنة · خطوبة · فرح · مؤتمرات · مناسبات الشركات
                  </strong>
                </>
              ) : (
                <>
                  End-to-end bespoke printing, artisanal soy candles, crystal resin keepsakes, and entrance decor for:
                  <strong className="text-purple-950 font-semibold block mt-1">
                    Baby Showers (Sebou3) · Birthdays · Henna Nights · Engagements · Weddings · Corporate Summits
                  </strong>
                </>
              )}
            </p>

            {/* Integrated Real-Time Quick Search Input */}
            <div className="relative mb-6 max-w-xl">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث بالمنتج أو الخامة (مثل: كروت شخصية، رول اب، شمع صويا، ريزن، أكريليك، كانفاس...)'
                    : 'Search products or materials (e.g. Business cards, Rollup, Soy wax, Resin, Acrylic, Canvas...)'
                }
                className="w-full ps-11 pe-4 py-3 bg-white border border-purple-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-xs transition-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 end-0 pe-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>

            {/* CTAs: WhatsApp Direct Chat + Instant Quote Modal */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={onRequestQuote}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-purple-900 hover:bg-purple-800 active:bg-purple-950 rounded-xl shadow-sm hover:shadow transition-all focus-visible:ring-2 focus-visible:ring-purple-600"
              >
                <FileText className="w-4 h-4" />
                <span>{isAr ? 'طلب مقايسة وتسعيرة مخصصة' : 'Request Tailored Quote'}</span>
              </button>

              <a
                href={`https://wa.me/201031450254?text=${encodeURIComponent(
                  'Hello Trendy EvenTy, I would like to inquire about your services from your catalogue.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'تواصل واتساب مع المبيعات' : 'Chat on WhatsApp with Sales'}</span>
              </a>

              <a
                href="#catalogue"
                className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 hover:text-purple-900 hover:bg-purple-50/50 rounded-xl transition-colors"
              >
                <span>{isAr ? 'استعراض الكتالوج' : 'View Catalogue'}</span>
                <span aria-hidden="true">&darr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Image with Measured Framing */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-100 group">
              <img
                src="/src/assets/images/trendy_hero_atelier_1791875439349.jpg"
                alt="TrenDy EvenTy Printing Atelier and Event Decor Showcase"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-purple-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase mb-1">
                  {isAr ? 'ورشة ومطبعة تريندي إيفنتي' : 'Trendy EvenTy Workshop'}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {isAr
                    ? 'جودة طباعة استثنائية وخامات مختارة بعناية لأجمل اللحظات'
                    : 'Exceptional Print Quality & Curated Materials for Every Moment'}
                </h3>
                <p className="text-xs text-purple-200 mt-1 font-mono">
                  8 El basaa Street, Shoubra Masr · +20 103 145 0254
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Key Metrics / Trust Strip (Placed below the hero split per guidelines) */}
        <div className="mt-12 pt-8 border-t border-purple-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 tabular-nums">
              100%
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              {isAr ? 'تنفيذ أي فكرة مخصصة' : 'Custom Design & Print Capability'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {isAr ? 'من الفكرة حتى التسليم' : 'From concept to turnkey delivery'}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 tabular-nums">
              26+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              {isAr ? 'خدمة ومنتج بالكتالوج' : 'Catalogue Services & Favors'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {isAr ? 'مطبوعات، شموع، ريزن وديكور' : 'Print, Candles, Resin & Decor'}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 tabular-nums">
              3 - 5
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              {isAr ? 'أيام متوسط سرعة التنفيذ' : 'Days Average Turnaround'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {isAr ? 'مع إمكانية الطلبات العاجلة' : 'Express rush orders available'}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 tabular-nums">
              Direct
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              {isAr ? 'دعم واستشارة فورية واتساب' : 'Direct WhatsApp Sales Support'}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {isAr ? 'فريق المبيعات بشبرا مصر' : 'Local showroom in Shoubra Masr'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
