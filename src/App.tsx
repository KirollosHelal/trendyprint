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
import { AdminLogin } from './components/AdminLogin';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('trendy_admin_token'));
  const [adminEmail, setAdminEmail] = useState<string>(localStorage.getItem('trendy_admin_email') || 'kirilloshelal@gmail.com');

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

  // Handle URL changes & popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

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
    if (currentPath.startsWith('/admin')) {
      navigateTo('/');
    }
    setTimeout(() => {
      const elem = document.getElementById('catalogue');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoginSuccess = (token: string, email: string) => {
    setAdminToken(token);
    setAdminEmail(email);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('trendy_admin_token');
    setAdminToken(null);
    navigateTo('/');
  };

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');

  // --- ROUTE 1: ADMIN ROUTE (/admin) ---
  if (isAdminRoute) {
    if (!adminToken) {
      return (
        <AdminLogin
          language={language}
          onLoginSuccess={handleLoginSuccess}
          onBackToStore={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminDashboard
        language={language}
        adminEmail={adminEmail}
        onLogout={handleAdminLogout}
        onBackToStore={() => navigateTo('/')}
      />
    );
  }

  // --- ROUTE 2: STOREFRONT ROUTE (/) ---
  return (
    <div className={`min-h-screen flex flex-col bg-[#faf9fd] text-slate-900 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {/* Top Bar (Strict 3-zone contract, admin tab removed as requested) */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onRequestQuote={handleOpenGeneralQuote}
      />

      {/* Storefront Main Content */}
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

      {/* Floating WhatsApp Sales Widget (Updated number 01031450254) */}
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
