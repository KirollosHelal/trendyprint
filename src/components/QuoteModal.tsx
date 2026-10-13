import React, { useState, useEffect } from 'react';
import { ProductItem, CategoryId, Language, QuotationRequest } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogueData';
import { X, MessageCircle, CheckCircle2, Calculator, Send, Copy, FileText, Sparkles } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  initialProduct?: ProductItem | null;
  initialCategory?: CategoryId;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  language,
  initialProduct,
  initialCategory,
}) => {
  const isAr = language === 'ar';

  const [category, setCategory] = useState<CategoryId>(initialCategory || 'printing');
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProduct?.id || '');
  const [quantity, setQuantity] = useState<number>(initialProduct?.moq || 50);

  // Printing specific
  const [materialChoice, setMaterialChoice] = useState<string>('couche-350');
  const [finishingChoice, setFinishingChoice] = useState<string>('matte-laminate');
  const [hasArtwork, setHasArtwork] = useState<'yes' | 'need_design' | 'have_draft'>('have_draft');

  // Giveaways / Candles / Resin specific
  const [occasionType, setOccasionType] = useState<string>('sebou3');
  const [customNamesDate, setCustomNamesDate] = useState<string>('');
  const [colorTheme, setColorTheme] = useState<string>('purple-gold');
  const [scentChoice, setScentChoice] = useState<string>('vanilla');

  // Decoration specific
  const [decorSetupItems, setDecorSetupItems] = useState<string[]>(['welcome-mirror']);
  const [eventDate, setEventDate] = useState<string>('');

  // Customer details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerCity, setCustomerCity] = useState<string>('Cairo / Shoubra');
  const [notes, setNotes] = useState<string>('');

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [quoteRef, setQuoteRef] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync when initialProduct or initialCategory changes
  useEffect(() => {
    if (initialProduct) {
      setCategory(initialProduct.categoryId);
      setSelectedProduct(initialProduct.id);
      setQuantity(Math.max(initialProduct.moq, 50));
    } else if (initialCategory && initialCategory !== 'all') {
      setCategory(initialCategory);
      const firstInCat = CATALOGUE_PRODUCTS.find((p) => p.categoryId === initialCategory);
      if (firstInCat) {
        setSelectedProduct(firstInCat.id);
        setQuantity(firstInCat.moq);
      }
    }
  }, [initialProduct, initialCategory]);

  if (!isOpen) return null;

  // Filter products by selected category
  const availableProducts = CATALOGUE_PRODUCTS.filter(
    (p) => category === 'all' || p.categoryId === category
  );

  // Estimate price calculations (in EGP)
  const calculateEstimate = (): { min: number; max: number } => {
    const currentProd = CATALOGUE_PRODUCTS.find((p) => p.id === selectedProduct);
    let unitMin = 15;
    let unitMax = 35;

    if (currentProd) {
      if (currentProd.id === 'business-cards') {
        const packs = Math.max(1, Math.ceil(quantity / 200));
        return { min: packs * 150, max: packs * 280 };
      } else if (currentProd.id === 'rollup-banner') {
        return { min: quantity * 750, max: quantity * 1100 };
      } else if (currentProd.id === 'event-flags') {
        return { min: quantity * 600, max: quantity * 950 };
      } else if (currentProd.id === 'custom-tshirts') {
        unitMin = 150;
        unitMax = 220;
      } else if (currentProd.id === 'tote-bags') {
        unitMin = 50;
        unitMax = 85;
      } else if (currentProd.id === 'ceramic-mugs') {
        unitMin = 70;
        unitMax = 110;
      } else if (currentProd.id === 'wood-acrylic-shields') {
        unitMin = 280;
        unitMax = 550;
      } else if (currentProd.id === 'decor-audio-guestbook') {
        return { min: 1400, max: 2500 };
      } else if (currentProd.id === 'decor-welcome-mirror') {
        return { min: 950, max: 1900 };
      } else if (currentProd.id === 'candle-mini-bubbles') {
        unitMin = 20;
        unitMax = 32;
      } else if (currentProd.id === 'resin-keychain') {
        unitMin = 28;
        unitMax = 42;
      } else if (currentProd.id === 'giveaway-chocolates') {
        unitMin = 14;
        unitMax = 25;
      }
    }

    return { min: quantity * unitMin, max: quantity * unitMax };
  };

  const estimate = calculateEstimate();

  // Generate WhatsApp Message
  const constructWhatsAppMessage = () => {
    const currentProd = CATALOGUE_PRODUCTS.find((p) => p.id === selectedProduct);
    const prodName = currentProd ? (isAr ? currentProd.nameAr : currentProd.nameEn) : selectedProduct;
    const catLabel =
      category === 'printing'
        ? isAr ? 'خدمات الطباعة' : 'Printing Services'
        : category === 'candles'
        ? isAr ? 'توزيعات الشموع' : 'Scented Candles'
        : category === 'resin'
        ? isAr ? 'توزيعات ريزن' : 'Resin Favors'
        : category === 'decor'
        ? isAr ? 'ديكورات وتجهيز' : 'Event Decoration'
        : isAr ? 'توزيعات وضيافة' : 'Giveaways & Favors';

    let msg = `*طلب مقايسة وتسعيرة جديدة - TrenDy EvenTy*\n`;
    msg += `---------------------------------\n`;
    msg += `*الاسم:* ${customerName || 'عميل محترم'}\n`;
    msg += `*الهاتف:* ${customerPhone || 'غير محدد'}\n`;
    msg += `*المدينة:* ${customerCity}\n`;
    msg += `*الخدمة:* ${prodName} (${catLabel})\n`;
    msg += `*الكمية المطلوبة:* ${quantity}\n`;

    if (category === 'printing') {
      msg += `*الخامة:* ${materialChoice}\n`;
      msg += `*التشطيب:* ${finishingChoice}\n`;
      msg += `*جاهزية التصميم:* ${hasArtwork}\n`;
    } else if (category === 'candles' || category === 'resin' || category === 'giveaways_others') {
      msg += `*المناسبة:* ${occasionType}\n`;
      msg += `*الأسماء والتاريخ:* ${customNamesDate || 'لم يحدد بعد'}\n`;
      msg += `*ثيم الألوان:* ${colorTheme}\n`;
      if (category === 'candles') msg += `*العطر:* ${scentChoice}\n`;
    } else if (category === 'decor') {
      msg += `*تاريخ المناسبة:* ${eventDate || 'قريباً'}\n`;
      msg += `*العناصر المطلوبة:* ${decorSetupItems.join(', ')}\n`;
    }

    if (notes) {
      msg += `*ملاحظات خاصة:* ${notes}\n`;
    }

    msg += `*التقدير التقريبي:* ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()} ج.م\n`;
    msg += `---------------------------------\n`;
    msg += `برجاء تأكيد الإتاحة ومراجعة التكلفة والبدء في التنفيذ. شكراً لكم!`;

    return encodeURIComponent(msg);
  };

  const handleSendToWhatsApp = () => {
    const text = constructWhatsAppMessage();
    const url = `https://wa.me/201067288084?text=${text}`;
    window.open(url, '_blank');
  };

  const handleSubmitSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `#TE-${Math.floor(1000 + Math.random() * 9000)}`;
    setQuoteRef(newRef);
    setIsSubmitted(true);
  };

  const handleCopySummary = () => {
    const currentProd = CATALOGUE_PRODUCTS.find((p) => p.id === selectedProduct);
    const summary = `TrenDy EvenTy Quote ${quoteRef}\nProduct: ${currentProd?.nameEn || selectedProduct}\nQuantity: ${quantity}\nEstimate: ${estimate.min} - ${estimate.max} EGP\nCustomer: ${customerName} (${customerPhone})\nLocation: Shoubra Masr, Cairo`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
              {isAr ? 'نموذج طلب التسعيرة والمقايسة' : 'Request for Quotation (RFQ)'}
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isAr ? 'احصل على عرض سعر رسمي فوري' : 'Get Instant Tailored Estimate'}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
              {isAr ? 'تم استلام طلب المقايسة بنجاح' : 'Quotation Submitted Successfully'}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-2">
              {isAr ? `رقم الطلب المرجعي: ${quoteRef}` : `Reference ID: ${quoteRef}`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
              {isAr
                ? 'فريق مبيعات تريندي إيفنتي بشبرا مصر جاهز لمساعدتك! يمكنك إرسال هذه المقايسة مباشرة للواتساب للتأكيد الفوري.'
                : 'Our sales team at Shoubra Masr is ready to assist you. Send this directly to WhatsApp for instant confirmation.'}
            </p>

            {/* Estimated Pricing Badge */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6 max-w-sm w-full">
              <div className="text-xs text-purple-800 font-semibold mb-1">
                {isAr ? 'التقدير المالي المتوقع:' : 'Estimated Cost Range:'}
              </div>
              <div className="text-2xl font-extrabold text-purple-950 tabular-nums">
                {estimate.min.toLocaleString()} - {estimate.max.toLocaleString()} EGP
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {quantity} {isAr ? 'قطعة / وحدة' : 'Units'} · {isAr ? 'شامل الطباعة والتجهيز' : 'Including custom fabrication'}
              </div>
            </div>

            {/* Post-submit buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={handleSendToWhatsApp}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'فتح المحادثة في الواتساب الآن' : 'Chat & Confirm on WhatsApp'}</span>
              </button>

              <button
                onClick={handleCopySummary}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ ملخص المقايسة' : 'Copy Summary')}</span>
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                type="button"
                className="px-4 py-2.5 text-xs font-semibold text-purple-900 hover:bg-purple-50 rounded-xl transition-colors"
              >
                {isAr ? 'تم وإغلاق' : 'Done & Close'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitSave} className="p-6 space-y-6">
            {/* Step 1: Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isAr ? '1. اختر تصنيف الخدمة المطلوب:' : '1. Select Service Category:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'printing', en: 'Printing Services', ar: 'خدمات الطباعة' },
                  { id: 'candles', en: 'Scented Candles', ar: 'توزيعات الشموع' },
                  { id: 'resin', en: 'Epoxy Resin', ar: 'توزيعات الريزن' },
                  { id: 'giveaways_others', en: 'Chocolates & Favors', ar: 'شوكولاتة وتوزيعات' },
                  { id: 'decor', en: 'Event Decoration', ar: 'ديكورات ومناسبات' },
                  { id: 'custom_catering', en: 'Special Requests', ar: 'طلبات وتورتة خاصة' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id as CategoryId);
                      const first = CATALOGUE_PRODUCTS.find((p) => p.categoryId === cat.id);
                      if (first) {
                        setSelectedProduct(first.id);
                        setQuantity(first.moq);
                      }
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-start transition-colors ${
                      category === cat.id
                        ? 'border-purple-800 bg-purple-900 text-white font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isAr ? cat.ar : cat.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Specific Product & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'المنتج / البند المحدد:' : 'Selected Item / Service:'}
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {isAr ? p.nameAr : p.nameEn} (MOQ: {p.moq})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isAr ? 'الكمية المطلوبة:' : 'Quantity Needed:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 tabular-nums"
                  />
                  <div className="flex gap-1 shrink-0">
                    {[50, 100, 200, 500].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuantity(num)}
                        className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Category-Specific Customized Fields */}
            {category === 'printing' && (
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-4">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                  {isAr ? 'مواصفات الطباعة والخامات:' : 'Printing & Material Specifications:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'خامة الورق / النسيج:' : 'Substrate / Paper:'}
                    </label>
                    <select
                      value={materialChoice}
                      onChange={(e) => setMaterialChoice(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="couche-350">ورق كوشيه 350 جم فاخر (Couche 350gsm)</option>
                      <option value="couche-250">ورق كوشيه 250 جم (Couche 250gsm)</option>
                      <option value="canvas-cotton">قماش كانفاس قطني 12 أونصة (Cotton Canvas)</option>
                      <option value="greyback-film">فيلم جراي باك للرول اب (Greyback Anti-Curl)</option>
                      <option value="cast-acrylic">أكريليك شفاف 3 مم - 5 مم (Cast Acrylic)</option>
                      <option value="kraft-card">ورق كرافت طبيعي ريفي (Natural Kraft)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'التشطيب والإضافات:' : 'Finishing & Lamination:'}
                    </label>
                    <select
                      value={finishingChoice}
                      onChange={(e) => setFinishingChoice(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="matte-laminate">سلوفان حراري مط (Thermal Matte)</option>
                      <option value="glossy-laminate">سلوفان لامع (Glossy)</option>
                      <option value="gold-foil">بصمة فويل ذهبي بارزة (Gold Hot Foil)</option>
                      <option value="spot-uv">يو في موضعي كشافة (Spot UV Varnish)</option>
                      <option value="standard">تشطيب عادي بدون سلوفان (Standard)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 text-xs">
                    {isAr ? 'حالة ملفات التصميم:' : 'Artwork Readiness:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    {[
                      { id: 'yes', labelAr: 'عندي تصميم جاهز', labelEn: 'Ready PDF/AI' },
                      { id: 'have_draft', labelAr: 'معي لوجو وبيانات', labelEn: 'Have Logo/Text' },
                      { id: 'need_design', labelAr: 'أحتاج تصميم جديد', labelEn: 'Need Design' },
                    ].map((art) => (
                      <button
                        key={art.id}
                        type="button"
                        onClick={() => setHasArtwork(art.id as any)}
                        className={`p-2 rounded-lg border text-center transition-colors ${
                          hasArtwork === art.id
                            ? 'border-purple-700 bg-purple-100 text-purple-900 font-bold'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {isAr ? art.labelAr : art.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(category === 'candles' || category === 'resin' || category === 'giveaways_others') && (
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-4">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                  {isAr ? 'تخصيص التوزيعات والمناسبة:' : 'Personalization & Occasion:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'نوع المناسبة:' : 'Occasion:'}
                    </label>
                    <select
                      value={occasionType}
                      onChange={(e) => setOccasionType(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="sebou3">سبوع واستقبال مولود (Sebou3 / Baby Shower)</option>
                      <option value="wedding">حفل زفاف وفرح (Wedding)</option>
                      <option value="engagement">خطوبة وكتب كتاب (Engagement / Katb Ketab)</option>
                      <option value="henna">ليلة الحنة (Henna Night)</option>
                      <option value="birthday">عيد ميلاد (Birthday Party)</option>
                      <option value="corporate">فعالية ومؤتمر شركات (Corporate Event)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'الأسماء والتاريخ المطبوع:' : 'Names & Date to Print:'}
                    </label>
                    <input
                      type="text"
                      value={customNamesDate}
                      onChange={(e) => setCustomNamesDate(e.target.value)}
                      placeholder={isAr ? 'مثال: أحمد ونور - 15/11/2025' : 'e.g. Sarah & Michael - Oct 2026'}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'ثيم الألوان المطلوب:' : 'Color Palette Theme:'}
                    </label>
                    <input
                      type="text"
                      value={colorTheme}
                      onChange={(e) => setColorTheme(e.target.value)}
                      placeholder={isAr ? 'أبيض وذهبي، باستيل بينك، بيبي بلو...' : 'White & Gold, Pastel Pink, Sage Green...'}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  {category === 'candles' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {isAr ? 'الرائحة المفضلة للشمع:' : 'Scent Choice:'}
                      </label>
                      <select
                        value={scentChoice}
                        onChange={(e) => setScentChoice(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="vanilla">فانيليا فرنسية دافئة (French Vanilla)</option>
                        <option value="lavender">لافندر مهدئ (Lavender Dream)</option>
                        <option value="musk-amber">مسك أبيض وعنبر ملكي (White Musk & Amber)</option>
                        <option value="rose">ورد جوري وياسمين (Peony & Rose)</option>
                        <option value="unscented">بدون عطر (Unscented Pure Soy)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {category === 'decor' && (
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 space-y-4">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                  {isAr ? 'تجهيزات الديكور وتاريخ الفعالية:' : 'Decor Package & Event Date:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'تاريخ الحفل المتوقع:' : 'Target Event Date:'}
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isAr ? 'مكان القاعة / المناسبة:' : 'Venue / Hall Location:'}
                    </label>
                    <input
                      type="text"
                      placeholder={isAr ? 'القاهرة، الجيزة، شبرا، فيلا...' : 'Cairo, Giza, Villa, Hall...'}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Customer Details */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                {isAr ? 'بيانات التواصل والتسليم:' : 'Contact & Delivery Information:'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">
                    {isAr ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'اسم العميل' : 'Your Name'}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    {isAr ? 'رقم الهاتف / الواتساب *' : 'WhatsApp Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    {isAr ? 'المدينة / الحي' : 'City / Area'}
                  </label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder={isAr ? 'شبرا مصر، القاهرة' : 'Cairo, Shoubra'}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 text-xs">
                  {isAr ? 'ملاحظات أو تفاصيل إضافية:' : 'Special Notes or Requirements:'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'أي فكرة خاصة ترغب في تنفيذها أو ميعاد تسليم محدد...' : 'Any custom dimensions, colors, or deadline requests...'}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            {/* Live Pricing Breakdown Bar */}
            <div className="bg-purple-950 text-white p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <div className="text-[11px] text-purple-200">
                    {isAr ? 'التقدير المالي التقريبي:' : 'Estimated Price Range:'}
                  </div>
                  <div className="text-lg font-extrabold text-amber-300 tabular-nums">
                    {estimate.min.toLocaleString()} - {estimate.max.toLocaleString()} EGP
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-purple-200 hidden sm:block text-end">
                {isAr ? 'تسعير تقريبي بناءً على الكمية والخامات' : 'Transparent tier estimate'}
              </span>
            </div>

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'إرسال المقايسة مباشرة للواتساب' : 'Send Directly to WhatsApp'}</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 active:bg-purple-950 rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'حفظ المقايسة واستلام رقم مرجعي' : 'Save & Get Quotation Slip'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
