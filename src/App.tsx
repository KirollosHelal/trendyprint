/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProductItem, PortfolioProject, CategoryId, Language, QuotationRequest } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogueSection } from './components/CatalogueSection';
import { MaterialSearchSection } from './components/MaterialSearchSection';
import { PortfolioSection } from './components/PortfolioSection';
import { QuoteModal } from './components/QuoteModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // Modals state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<ProductItem | null>(null);
  const [quoteCategory, setQuoteCategory] = useState<CategoryId>('printing');
  
  const [detailsProduct, setDetailsProduct] = useState<ProductItem | null>(null);

  // Sync RTL / LTR direction with document element
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleOpenGeneralQuote = () => {
    setSelectedProductForQuote(null);
    setQuoteCategory('printing');
    setIsQuoteModalOpen(true);
  };

  const handleSelectProductForQuote = (product: ProductItem) => {
    setSelectedProductForQuote(product);
    setQuoteCategory(product.categoryId);
    setIsQuoteModalOpen(true);
  };

  const handleOrderSimilarProject = (project: PortfolioProject) => {
    setSelectedProductForQuote(null);
    if (project.category === 'corporate') {
      setQuoteCategory('printing');
    } else if (project.category === 'weddings') {
      setQuoteCategory('decor');
    } else if (project.category === 'sebou3') {
      setQuoteCategory('giveaways_others');
    } else {
      setQuoteCategory('resin');
    }
    setIsQuoteModalOpen(true);
  };

  const handleFilterProductsByMaterial = (materialName: string) => {
    setSearchQuery(materialName);
    setSelectedCategory('all');
    if (isAdminView) {
      setIsAdminView(false);
    }
    // Smooth scroll to catalogue
    setTimeout(() => {
      const elem = document.getElementById('catalogue');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#faf9fd] text-slate-900 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {/* Top Bar Contract (Strict 3-zone one-row bar) */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onRequestQuote={handleOpenGeneralQuote}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
        isAdminActive={isAdminView}
      />

      {isAdminView ? (
        /* Admin Monitoring Dashboard Page */
        <AdminDashboard
          language={language}
          onBackToStore={() => setIsAdminView(false)}
        />
      ) : (
        /* Storefront Experience */
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            language={language}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRequestQuote={handleOpenGeneralQuote}
          />

          {/* Full Services Catalogue with Category-Specific Filters */}
          <CatalogueSection
            language={language}
            searchQuery={searchQuery}
            onSelectProductForQuote={handleSelectProductForQuote}
            onViewProductDetails={setDetailsProduct}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Dedicated Printing Materials Search Guide */}
          <MaterialSearchSection
            language={language}
            onFilterProductsByMaterial={handleFilterProductsByMaterial}
          />

          {/* Dynamic Portfolio Section */}
          <PortfolioSection
            language={language}
            onOrderSimilarProject={handleOrderSimilarProject}
          />
        </main>
      )}

      {/* Footer (shown on storefront or bottom) */}
      {!isAdminView && (
        <Footer
          language={language}
          onRequestQuote={handleOpenGeneralQuote}
        />
      )}

      {/* Floating WhatsApp Sales Widget (Always available with updated number 01031450254) */}
      <FloatingWhatsApp language={language} />

      {/* Request for Quotation (RFQ) Form Modal with Design Upload Option */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setSelectedProductForQuote(null);
        }}
        language={language}
        initialProduct={selectedProductForQuote}
        initialCategory={quoteCategory}
        onQuoteCreated={() => {
          // If in admin view or store view, updates will be reflected
        }}
      />

      {/* Product Details Specs Modal */}
      <ItemDetailsModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        language={language}
        onRequestQuoteForThis={handleSelectProductForQuote}
      />
    </div>
  );
}
