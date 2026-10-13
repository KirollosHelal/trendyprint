import React, { useState } from 'react';
import { MaterialDetail, Language } from '../types';
import { PRINTING_MATERIALS } from '../data/materialsData';
import { Search, Sparkles, ShieldCheck, Printer, Check, ArrowRight, MessageCircle } from 'lucide-react';

interface MaterialSearchSectionProps {
  language: Language;
  onFilterProductsByMaterial: (materialName: string) => void;
}

export const MaterialSearchSection: React.FC<MaterialSearchSectionProps> = ({
  language,
  onFilterProductsByMaterial,
}) => {
  const isAr = language === 'ar';

  const [searchMaterial, setSearchMaterial] = useState('');
  const [selectedMatCategory, setSelectedMatCategory] = useState<string>('all');

  const CATEGORY_TABS = [
    { id: 'all', labelEn: 'All Materials', labelAr: 'كافة الخامات' },
    { id: 'paper', labelEn: 'Papers & Cardstock', labelAr: 'الورق والكارتون' },
    { id: 'fabric', labelEn: 'Fabrics & Textiles', labelAr: 'الأقمشة والمنسوجات' },
    { id: 'plastic_acrylic', labelEn: 'Plastics & Acrylics', labelAr: 'البلاستيك والأكريليك' },
    { id: 'craft_natural', labelEn: 'Artisanal & Natural', labelAr: 'الحرف والمواد الطبيعية' },
  ];

  const filteredMaterials = PRINTING_MATERIALS.filter((mat) => {
    if (selectedMatCategory !== 'all' && mat.category !== selectedMatCategory) {
      return false;
    }

    if (searchMaterial.trim()) {
      const q = searchMaterial.toLowerCase().trim();
      const matchEn =
        mat.nameEn.toLowerCase().includes(q) ||
        mat.descriptionEn.toLowerCase().includes(q) ||
        mat.thicknessWeight.toLowerCase().includes(q) ||
        mat.printTechniqueEn.toLowerCase().includes(q) ||
        mat.bestUsesEn.some((u) => u.toLowerCase().includes(q)) ||
        mat.finishOptionsEn.some((f) => f.toLowerCase().includes(q));

      const matchAr =
        mat.nameAr.includes(q) ||
        mat.descriptionAr.includes(q) ||
        mat.printTechniqueAr.includes(q) ||
        mat.bestUsesAr.some((u) => u.includes(q)) ||
        mat.finishOptionsAr.some((f) => f.includes(q));

      return matchEn || matchAr;
    }

    return true;
  });

  return (
    <section id="materials" className="py-16 bg-slate-50 border-b border-purple-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">
            <span>{isAr ? 'محرك وخريطة الخامات' : 'Materials Guide & Search'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'دليل الخامات والمواصفات الفنية' : 'Technical Specifications'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isAr ? 'دليل خامات الطباعة والتصنيع المعتمدة' : 'Printing Materials & Substrate Encyclopedia'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            {isAr
              ? 'اختر الخامة المناسبة لمشروعك، وتعرف على أوزان الجرامات، تقنيات الطباعة، متانة الاستخدام، وتشطيبات السلوفان والفويل المتاحة.'
              : 'Search and compare substrates by weight, print techniques, durability ratings, and luxury finishing options.'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-purple-600" />
            </div>
            <input
              type="text"
              value={searchMaterial}
              onChange={(e) => setSearchMaterial(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث باسم الخامة، الجرامات، أو تقنية الطباعة (مثل: كوشيه، أكريليك، كانفاس، صويا، DTF...)'
                  : 'Search by material name, gsm, or technique (e.g. Couche, Acrylic, Canvas, Soy wax, DTF...)'
              }
              className="w-full ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
            />
            {searchMaterial && (
              <button
                onClick={() => setSearchMaterial('')}
                className="absolute inset-y-0 end-0 pe-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedMatCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMatCategory(tab.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-purple-900 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaterials.map((mat) => {
            const name = isAr ? mat.nameAr : mat.nameEn;
            const category = isAr ? mat.categoryAr : mat.categoryEn;
            const desc = isAr ? mat.descriptionAr : mat.descriptionEn;
            const bestUses = isAr ? mat.bestUsesAr : mat.bestUsesEn;
            const durability = isAr ? mat.durabilityAr : mat.durabilityEn;
            const technique = isAr ? mat.printTechniqueAr : mat.printTechniqueEn;
            const finishes = isAr ? mat.finishOptionsAr : mat.finishOptionsEn;

            return (
              <div
                key={mat.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-purple-200 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Weight Kickers */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-purple-800 uppercase tracking-wide">
                      {category}
                    </span>
                    <span className="font-mono tabular-nums text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {mat.thicknessWeight}
                    </span>
                  </div>

                  {/* Material Name */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {desc}
                  </p>

                  {/* Technical Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs bg-purple-50/40 p-3.5 rounded-lg border border-purple-100/60">
                    <div>
                      <span className="font-semibold text-slate-800 block mb-0.5 flex items-center gap-1">
                        <Printer className="w-3.5 h-3.5 text-purple-700 inline" />
                        {isAr ? 'تقنية الطباعة:' : 'Print Technique:'}
                      </span>
                      <span className="text-slate-600 leading-snug">{technique}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-800 block mb-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 inline" />
                        {isAr ? 'المتانة والمقاومة:' : 'Durability:'}
                      </span>
                      <span className="text-slate-600 leading-snug">{durability}</span>
                    </div>
                  </div>

                  {/* Finishes and Best Uses inline tags */}
                  <div className="mb-4 text-xs space-y-1.5">
                    <div>
                      <span className="font-semibold text-slate-700">
                        {isAr ? 'التشطيبات المتاحة:' : 'Finishes:'}
                      </span>{' '}
                      <span className="text-slate-600">{finishes.join(' · ')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">
                        {isAr ? 'أفضل الاستخدامات:' : 'Best Uses:'}
                      </span>{' '}
                      <span className="text-slate-600">{bestUses.join(' · ')}</span>
                    </div>
                  </div>
                </div>

                {/* Material Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
                  <button
                    onClick={() => onFilterProductsByMaterial(mat.nameEn.split(' ')[0])}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-900 hover:text-purple-700 transition-colors"
                  >
                    <span>{isAr ? 'عرض منتجات بهذه الخامة' : 'View products with this material'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>

                  <a
                    href={`https://wa.me/201067288084?text=${encodeURIComponent(
                      `Hello Trendy EvenTy, I have a question about this material: ${mat.nameEn} (${mat.thicknessWeight}). What is the cost and minimum order?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'استفسار واتساب عن الخامة' : 'Ask on WhatsApp'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
