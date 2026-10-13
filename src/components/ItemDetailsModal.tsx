import React from 'react';
import { ProductItem, Language } from '../types';
import { X, MessageCircle, FileText, Check, ShieldCheck, Tag } from 'lucide-react';

interface ItemDetailsModalProps {
  product: ProductItem | null;
  onClose: () => void;
  language: Language;
  onRequestQuoteForThis: (product: ProductItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  product,
  onClose,
  language,
  onRequestQuoteForThis,
}) => {
  if (!product) return null;
  const isAr = language === 'ar';

  const name = isAr ? product.nameAr : product.nameEn;
  const tagline = isAr ? product.taglineAr : product.taglineEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const materials = isAr ? product.materialsUsedAr : product.materialsUsed;
  const occasions = isAr ? product.suggestedOccasionsAr : product.suggestedOccasions;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Trendy EvenTy Sales,\nI would like to inquire about: ${product.nameEn} (${name})\nPrice estimate: ${product.estimatedPriceRange}\nMOQ: ${product.moq} ${isAr ? product.unitAr : product.unit}\n\nPlease share catalog details and timeline.`
    );
    window.open(`https://wa.me/201031450254?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Frame */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            type="button"
            className="absolute top-3 end-3 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute top-3 start-3 px-2.5 py-1 bg-white/95 rounded-md text-xs font-bold text-purple-950 shadow-2xs">
            {isAr ? `صفحة الكتالوج: ${product.cataloguePage}` : `Catalogue Page: ${product.cataloguePage}`}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-1.5 text-xs text-purple-800 font-semibold mb-1">
            <span className="uppercase tracking-wide">
              {product.categoryId === 'printing' && (isAr ? 'خدمات الطباعة' : 'Printing')}
              {product.categoryId === 'candles' && (isAr ? 'شموع عطرية' : 'Candles')}
              {product.categoryId === 'resin' && (isAr ? 'ريزن إيبوكسي' : 'Epoxy Resin')}
              {product.categoryId === 'giveaways_others' && (isAr ? 'توزيعات وضيافة' : 'Giveaways')}
              {product.categoryId === 'decor' && (isAr ? 'ديكورات ومناسبات' : 'Decor')}
              {product.categoryId === 'custom_catering' && (isAr ? 'طلبات خاصة' : 'Custom Request')}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500 font-normal">
              {isAr ? `الحد الأدنى: ${product.moq} ${product.unitAr}` : `MOQ: ${product.moq} ${product.unit}`}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mb-1">
            {name}
          </h3>

          <p className="text-xs font-medium text-purple-900/80 mb-4">
            {tagline}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            {description}
          </p>

          {/* Specs breakdown */}
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 mb-6 space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-800 block mb-1">
                {isAr ? 'الخامات المستخدمة والتصنيع:' : 'Materials Used:'}
              </span>
              <div className="flex flex-wrap gap-1.5 text-slate-700">
                {materials.map((m, i) => (
                  <span key={i} className="bg-white px-2.5 py-1 rounded-md border border-purple-100">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">
                {isAr ? 'المناسبات والفعاليات المقترحة:' : 'Recommended Occasions:'}
              </span>
              <div className="text-slate-600">
                {occasions.join(' · ')}
              </div>
            </div>

            <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
              <span className="font-bold text-slate-800">
                {isAr ? 'متوسط السعر التقريبي:' : 'Estimated Unit Price:'}
              </span>
              <span className="font-extrabold text-purple-950 font-mono text-sm tabular-nums">
                {product.estimatedPriceRange}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleWhatsApp}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'استفسار واتساب' : 'WhatsApp Chat'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRequestQuoteForThis(product);
              }}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'طلب عرض سعر لهذا البند' : 'Request RFQ for This'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
