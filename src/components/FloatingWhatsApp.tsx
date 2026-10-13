import React, { useState } from 'react';
import { Language } from '../types';
import { CONTACT_INFO, getWhatsAppLink } from '../config/contact';
import { AdminStore } from '../services/adminStore';
import { MessageCircle, X, Send, Phone, Check } from 'lucide-react';

interface FloatingWhatsAppProps {
  language: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const QUICK_QUESTIONS = [
    {
      en: 'Inquiring about custom wedding entrance decor & favors',
      ar: 'استفسار عن تجهيز مدخل الفرح وتوزيعات الزفاف والشموع',
    },
    {
      en: 'Need quotation for corporate printing (Rollups, flags, shirts)',
      ar: 'طلب تسعيرة مطبوعات شركات (رول اب، أعلام، تيشرتات، دروع)',
    },
    {
      en: 'Baby shower / Sebou3 custom giveaways & chocolates package',
      ar: 'باقة سبوع متكاملة (شموع، شوكولاتة، زجاجات مياه، أوديو بوك)',
    },
  ];

  const handleSend = (text: string) => {
    // Record message in AdminStore
    const newMsg = {
      id: `msg-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      customerName: customerName || (isAr ? 'زائر واتساب' : 'WhatsApp Visitor'),
      customerPhone: customerPhone || CONTACT_INFO.phone,
      message: text,
      source: 'whatsapp_widget' as const,
      status: 'unread' as const,
    };
    AdminStore.addMessage(newMsg);

    const url = `https://wa.me/${CONTACT_INFO.whatsAppDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      setIsOpen(false);
      setCustomText('');
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div 
          className="mb-3 w-80 sm:w-92 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-label="WhatsApp Sales Chat"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-purple-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">
                  {isAr ? 'فريق مبيعات تريندي إيفنتي' : 'TrenDy EvenTy Sales'}
                </h4>
                <p className="text-[11px] text-purple-200 font-mono">
                  {CONTACT_INFO.phoneDisplay} · {isAr ? 'متصل الآن' : 'Online'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-purple-200 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Body */}
          <div className="p-4 bg-slate-50/70 space-y-3">
            {sentNotice ? (
              <div className="py-6 text-center text-emerald-700 space-y-2">
                <Check className="w-8 h-8 mx-auto" />
                <p className="text-xs font-bold">
                  {isAr ? 'جاري فتح المحادثة في الواتساب...' : 'Opening WhatsApp conversation...'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  {isAr
                    ? `أهلاً بك! تواصل مباشرة مع فريق المبيعات على الواتساب (${CONTACT_INFO.phoneDisplay}) بشبرا مصر.`
                    : `Welcome! Connect directly with our sales specialists on WhatsApp (${CONTACT_INFO.phoneDisplay}).`}
                </p>

                {/* Optional Customer info inputs */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'اسمك (اختياري)' : 'Your Name'}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={isAr ? 'رقم الهاتف' : 'Your Phone'}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isAr ? 'أسئلة شائعة بنقرة واحدة:' : 'Quick Questions:'}
                  </span>
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(isAr ? q.ar : q.en)}
                      className="w-full text-start p-2 bg-white hover:bg-purple-50 text-[11px] text-slate-700 hover:text-purple-950 rounded-lg border border-slate-200 transition-colors shadow-2xs"
                    >
                      {isAr ? q.ar : q.en}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customText.trim()) {
                          handleSend(customText);
                        }
                      }}
                      placeholder={isAr ? 'اكتب رسالتك للمبيعات...' : 'Type your message...'}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      onClick={() => customText.trim() && handleSend(customText)}
                      disabled={!customText.trim()}
                      className="p-2 text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Phone link fallback with updated number */}
                <div className="text-center pt-1">
                  <a
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="text-[11px] text-slate-500 hover:text-purple-900 font-medium inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-purple-700" />
                    <span>
                      {isAr ? `أو اتصل مباشرة: ${CONTACT_INFO.phoneDisplay}` : `Or Call: ${CONTACT_INFO.phoneInternational}`}
                    </span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="text-xs font-bold whitespace-nowrap">
          {isOpen ? (isAr ? 'إغلاق الدردشة' : 'Close Chat') : (isAr ? `واتساب ${CONTACT_INFO.phoneDisplay}` : `Chat ${CONTACT_INFO.phoneDisplay}`)}
        </span>
      </button>
    </div>
  );
};
