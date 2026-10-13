import React, { useState } from 'react';
import { PortfolioProject, Language } from '../types';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { Eye, Clock, CheckCircle2, X, ArrowUpRight, FileText } from 'lucide-react';

interface PortfolioSectionProps {
  language: Language;
  onOrderSimilarProject: (project: PortfolioProject) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  language,
  onOrderSimilarProject,
}) => {
  const isAr = language === 'ar';

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const FILTERS = [
    { id: 'all', labelEn: 'All Projects', labelAr: 'جميع المشاريع' },
    { id: 'corporate', labelEn: 'Corporate & Conferences', labelAr: 'المؤتمرات وهوية الشركات' },
    { id: 'weddings', labelEn: 'Weddings & Engagements', labelAr: 'الأفراح والخطوبة' },
    { id: 'sebou3', labelEn: 'Sebou3 & Baby Shower', labelAr: 'السبوع والمواليد' },
    { id: 'giveaways', labelEn: 'Favors & Keepsakes', labelAr: 'التوزيعات والهدايا' },
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((proj) => {
    if (activeFilter === 'all') return true;
    return proj.category === activeFilter;
  });

  return (
    <section id="portfolio" className="py-16 bg-white border-b border-purple-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 uppercase tracking-wider mb-1">
              <span>{isAr ? 'معرض الإنجازات والجودة' : 'Dynamic Portfolio'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'أعمال سابقة عالية الدقة' : 'Verified Production Projects'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'نماذج حقيقية من مشاريع وتجهيزات تريندي إيفنتي' : 'Past High-Quality Print & Event Projects'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
              {isAr
                ? 'استكشف ما قمنا بتنفيذه للمؤتمرات الكبرى، حفلات الزفاف الفاخرة، والسبوع الملكي مع تفاصيل الخامات ومدة التسليم.'
                : 'Explore delivered projects across Cairo and Egypt, including corporate summits, luxury weddings, and royal baby showers.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-purple-900 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isAr ? f.labelAr : f.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const title = isAr ? project.titleAr : project.titleEn;
            const client = isAr ? project.clientAr : project.clientEn;
            const occasion = isAr ? project.occasionAr : project.occasionEn;
            const turnaround = isAr ? project.turnaroundAr : project.turnaroundEn;
            const categoryLabel = isAr ? project.categoryLabelAr : project.categoryLabelEn;

            return (
              <div
                key={project.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Container with Hover Overlay */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => setActiveModalProject(project)}
                >
                  <img
                    src={project.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-purple-950/20 group-hover:bg-purple-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-lg text-xs font-bold text-purple-950 shadow-sm">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isAr ? 'عرض تفاصيل المشروع' : 'View Project Case'}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 start-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-md text-[11px] font-semibold text-purple-900 shadow-2xs">
                    {categoryLabel}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Quiet Metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                      <span className="text-purple-800 font-medium truncate max-w-[180px]">{client}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400 inline" />
                        <span>{turnaround}</span>
                      </span>
                    </div>

                    <h3 
                      onClick={() => setActiveModalProject(project)}
                      className="text-base font-bold text-slate-900 hover:text-purple-900 transition-colors cursor-pointer mb-2 line-clamp-2"
                    >
                      {title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                      {isAr ? project.descriptionAr : project.descriptionEn}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      type="button"
                      className="text-xs font-semibold text-purple-900 hover:text-purple-700 flex items-center gap-1"
                    >
                      <span>{isAr ? 'تفاصيل المخرجات' : 'Deliverables'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOrderSimilarProject(project)}
                      type="button"
                      className="px-3 py-1.5 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 rounded-lg transition-colors border border-purple-200/80"
                    >
                      {isAr ? 'طلب مشروع مماثل' : 'Order Similar'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Details Modal */}
        {activeModalProject && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                <img
                  src={activeModalProject.image}
                  alt={isAr ? activeModalProject.titleAr : activeModalProject.titleEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setActiveModalProject(null)}
                  type="button"
                  className="absolute top-3 end-3 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-purple-800 font-semibold mb-1">
                  <span>{isAr ? activeModalProject.categoryLabelAr : activeModalProject.categoryLabelEn}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">
                    {isAr ? activeModalProject.clientAr : activeModalProject.clientEn}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">
                    {isAr ? activeModalProject.turnaroundAr : activeModalProject.turnaroundEn}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                  {isAr ? activeModalProject.titleAr : activeModalProject.titleEn}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {isAr ? activeModalProject.descriptionAr : activeModalProject.descriptionEn}
                </p>

                {/* Deliverables List */}
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 mb-6">
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2.5">
                    {isAr ? 'البنود المنفذة والتسليمات:' : 'Delivered Scope & Items:'}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {(isAr ? activeModalProject.deliverablesAr : activeModalProject.deliverablesEn).map(
                      (item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Materials Used */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {isAr ? 'الخامات المستخدمة في المشروع:' : 'Substrates & Materials:'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {(isAr ? activeModalProject.materialsAr : activeModalProject.materialsEn).join(' · ')}
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setActiveModalProject(null)}
                    type="button"
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>

                  <button
                    onClick={() => {
                      const proj = activeModalProject;
                      setActiveModalProject(null);
                      onOrderSimilarProject(proj);
                    }}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isAr ? 'طلب عرض سعر لمشروع مشابه' : 'Request Quote for Similar Project'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
