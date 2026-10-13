import React, { useState } from 'react';
import { ProductItem, CategoryId, Language } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogueData';
import { MessageCircle, FileText, Eye, Sparkles, Filter, Layers } from 'lucide-react';

interface CatalogueSectionProps {
  language: Language;
  searchQuery: string;
  onSelectProductForQuote: (product: ProductItem) => void;
  onViewProductDetails: (product: ProductItem) => void;
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
}

export const CatalogueSection: React.FC<CatalogueSectionProps> = ({
  language,
  searchQuery,
  onSelectProductForQuote,
  onViewProductDetails,
  selectedCategory,
  onSelectCategory,
}) => {
  const isAr = language === 'ar';

  const CATEGORY_TABS: { id: CategoryId; labelEn: string; labelAr: string; count: number }[] = [
    {
      id: 'all',
      labelEn: 'All Services',
      labelAr: 'جميع الخدمات',
      count: CATALOGUE_PRODUCTS.length,
    },
    {
      id: 'printing',
      labelEn: 'Printing Services',
      labelAr: 'خدمات الطباعة',
      count: CATALOGUE_PRODUCTS.filter((p) => p.categoryId === 'printing').length,
    },
    {
      id: 'candles',
      labelEn: 'Scented Candles',
      labelAr: 'توزيعات الشموع',
      count: CATALOGUE_PRODUCTS.filter((p) => p.categoryId === 'candles').length,
    },
    {
      id: 'resin',
      labelEn: 'Epoxy Resin',
      labelAr: 'توزيعات الريزن',
      count: CATALOGUE_PRODUCTS.filter((p) => p.categoryId === 'resin').length,
    },
    {
      id: 'giveaways_others',
      labelEn: 'Chocolates & Favors',
      labelAr: 'شوكولاتة وتوزيعات أخرى',
      count: CATALOGUE_PRODUCTS.filter((p) => p.categoryId === 'giveaways_others').length,
    },
    {
      id: 'decor',
      labelEn: 'Event Decoration',
      labelAr: 'ديكورات وتجهيز الحفلات',
      count: CATALOGUE_PRODUCTS.filter((p) => p.categoryId === 'decor').length,
    },
    {
      id: 'custom_catering',
      labelEn: 'Special Requests',
      labelAr: 'تورتة ووجبات خاصة',
      count: CATALOGUE_PRODUCTS.filter((p) => p.categoryId === 'custom_catering').length,
    },
  ];

  // Filtering products
  const filteredProducts = CATALOGUE_PRODUCTS.filter((item) => {
    // Category check
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchEn =
        item.nameEn.toLowerCase().includes(q) ||
        item.taglineEn.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q) ||
        item.materialsUsed.some((m) => m.toLowerCase().includes(q)) ||
        item.suggestedOccasions.some((o) => o.toLowerCase().includes(q));

      const matchAr =
        item.nameAr.includes(q) ||
        item.taglineAr.includes(q) ||
        item.descriptionAr.includes(q) ||
        item.materialsUsedAr.some((m) => m.includes(q)) ||
        item.suggestedOccasionsAr.some((o) => o.includes(q));

      return matchEn || matchAr;
    }

    return true;
  });

  const getWhatsAppItemLink = (item: ProductItem) => {
    const itemName = isAr ? item.nameAr : item.nameEn;
    const text = encodeURIComponent(
      `Hello Trendy EvenTy Sales,\nI would like to inquire about this service from your catalogue:\n*Item:* ${itemName}\n*Min Order:* ${item.moq} ${isAr ? item.unitAr : item.unit}\n*Estimated Range:* ${item.estimatedPriceRange}\n\nPlease let me know availability and exact quotation.`
    );
    return `https://wa.me/201067288084?text=${text}`;
  };

  return (
    <section id="catalogue" className="py-16 bg-white border-b border-purple-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">
              <span>{isAr ? 'الكتالوج الرسمي الكامل' : 'Official Catalogue'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? '9 صفحات شاملة الخدمات' : '9-Page Service Archive'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'خدمات الطباعة والتوزيعات وتجهيز الحفلات' : 'Printing, Custom Favors & Event Styling'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              {isAr
                ? 'تصفح كافة البنود من كتالوج تريندي إيفنتي، واطلب تسعيرة دقيقة أو تحدث مباشرة مع فريق المبيعات.'
                : 'Explore all items from our print catalogue. Request a tailored quotation or chat instantly on WhatsApp.'}
            </p>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 shrink-0">
            <span className="font-semibold text-purple-950 tabular-nums">{filteredProducts.length}</span>
            <span>{isAr ? 'عنصر معروض' : 'items displayed'}</span>
            {searchQuery && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-purple-700 italic">"{searchQuery}"</span>
              </>
            )}
          </div>
        </div>

        {/* Category Tabs: Segmented interactive control buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-purple-50/70 rounded-xl overflow-x-auto mb-10 border border-purple-100 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 ${
                  isActive
                    ? 'bg-purple-900 text-white shadow-xs font-semibold'
                    : 'text-slate-700 hover:text-purple-950 hover:bg-purple-100/70'
                }`}
              >
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                <span
                  className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-purple-800 text-purple-100' : 'bg-purple-200/60 text-purple-800'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid: 3-column desktop */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {isAr ? 'لم نجد أي خدمات تطابق بحثك' : 'No items found matching your search'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {isAr
                ? 'جرب البحث بكلمات أخرى أو اختر "جميع الخدمات"، أو تواصل معنا مباشرة لتنفيذ فكرتك المخصصة.'
                : 'Try adjusting your search terms, select "All Services", or chat directly with our team.'}
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const name = isAr ? product.nameAr : product.nameEn;
              const tagline = isAr ? product.taglineAr : product.taglineEn;
              const materials = isAr ? product.materialsUsedAr : product.materialsUsed;

              return (
                <article
                  key={product.id}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Lead with imagery (65-75% card visual emphasis) */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Quiet catalogue page tag (top corner) */}
                    <div className="absolute top-3 end-3 px-2 py-1 bg-white/90 backdrop-blur-xs rounded-md text-[11px] font-semibold text-purple-950 shadow-xs">
                      {isAr ? `صفحة ${product.cataloguePage}` : `Page ${product.cataloguePage}`}
                    </div>
                  </div>

                  {/* Card Content with Zero-Pill Discipline */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Unboxed Metadata: Category and Occasion */}
                    <div className="flex items-center gap-1.5 text-xs text-purple-800 font-medium mb-1.5">
                      <span className="uppercase tracking-wide text-[11px]">
                        {product.categoryId === 'printing' && (isAr ? 'طباعة تجارية' : 'Printing')}
                        {product.categoryId === 'candles' && (isAr ? 'شموع عطرية' : 'Candles')}
                        {product.categoryId === 'resin' && (isAr ? 'ريزن إيبوكسي' : 'Epoxy Resin')}
                        {product.categoryId === 'giveaways_others' && (isAr ? 'توزيعات وضيافة' : 'Giveaways')}
                        {product.categoryId === 'decor' && (isAr ? 'ديكورات مناسبات' : 'Decor')}
                        {product.categoryId === 'custom_catering' && (isAr ? 'طلبات خاصة' : 'Custom Request')}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 truncate text-[11px]">
                        {isAr ? `أقل كمية: ${product.moq} ${product.unitAr}` : `MOQ: ${product.moq} ${product.unit}`}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                      {name}
                    </h3>

                    {/* Tagline / Subtitle */}
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 mb-3">
                      {tagline}
                    </p>

                    {/* Materials list inline without pill tags */}
                    <div className="text-[11px] text-slate-500 mb-4 flex-1">
                      <span className="font-medium text-slate-700">
                        {isAr ? 'الخامات:' : 'Materials:'}
                      </span>{' '}
                      <span className="text-slate-600">
                        {materials.slice(0, 2).join(' · ')}
                      </span>
                    </div>

                    {/* Price Range & Primary Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {isAr ? 'متوسط السعر' : 'Est. Range'}
                        </span>
                        <span className="text-xs font-bold text-purple-950 tabular-nums">
                          {product.estimatedPriceRange}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Details Modal Trigger */}
                        <button
                          onClick={() => onViewProductDetails(product)}
                          type="button"
                          className="p-2 text-slate-500 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                          title={isAr ? 'عرض المواصفات' : 'View Specs'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Direct WhatsApp Chat Trigger */}
                        <a
                          href={getWhatsAppItemLink(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                          title={isAr ? 'استفسار عبر الواتساب' : 'Inquire on WhatsApp'}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Category RFQ Quote Button */}
                        <button
                          onClick={() => onSelectProductForQuote(product)}
                          type="button"
                          className="px-3 py-1.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-lg transition-colors shadow-2xs whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-purple-600"
                        >
                          {isAr ? 'طلب تسعيرة' : 'Get Quote'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
