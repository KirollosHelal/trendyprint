/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProductItem, PortfolioProject, CategoryId, Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogueSection } from './components/CatalogueSection';
import { MaterialSearchSection } from './components/MaterialSearchSection';
import { PortfolioSection } from './components/PortfolioSection';
import { QuoteModal } from './components/QuoteModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
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
    // Smooth scroll to catalogue
    const elem = document.getElementById('catalogue');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#faf9fd] text-slate-900 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {/* Top Bar Contract (Strict 3-zone one-row bar) */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onRequestQuote={handleOpenGeneralQuote}
      />

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

      {/* Footer */}
      <Footer
        language={language}
        onRequestQuote={handleOpenGeneralQuote}
      />

      {/* Floating WhatsApp Sales Widget */}
      <FloatingWhatsApp language={language} />

      {/* Request for Quotation (RFQ) Form Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setSelectedProductForQuote(null);
        }}
        language={language}
        initialProduct={selectedProductForQuote}
        initialCategory={quoteCategory}
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
