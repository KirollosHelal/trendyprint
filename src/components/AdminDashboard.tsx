import React, { useState, useEffect } from 'react';
import { QuotationRequest, InquiryMessage, ProductItem, MaterialDetail, PortfolioProject, QuoteStatus, Language } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogueData';
import { PRINTING_MATERIALS } from '../data/materialsData';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { CONTACT_INFO } from '../config/contact';
import { AdminStore } from '../services/adminStore';
import {
  Search,
  Filter,
  MessageCircle,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Inbox,
  Phone,
  Calendar,
  X,
  ExternalLink,
  Shield,
  Key,
  Layers,
  Sparkles,
  Palette,
  Briefcase,
  Settings,
  LogOut,
  Plus,
  Edit,
  Save,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  adminEmail: string;
  onLogout: () => void;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  adminEmail,
  onLogout,
  onBackToStore,
}) => {
  const isAr = language === 'ar';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'messages' | 'products' | 'materials' | 'portfolio' | 'security'>('overview');

  // Quotes & Messages State
  const [quotes, setQuotes] = useState<QuotationRequest[]>([]);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);

  // Catalogue & Substrates State
  const [products, setProducts] = useState<ProductItem[]>(CATALOGUE_PRODUCTS);
  const [materials, setMaterials] = useState<MaterialDetail[]>(PRINTING_MATERIALS);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(PORTFOLIO_PROJECTS);

  // Filters for quotes
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal inspection
  const [inspectingQuote, setInspectingQuote] = useState<QuotationRequest | null>(null);

  // Security & Credential change state
  const [currentEmail, setCurrentEmail] = useState(adminEmail || 'kirilloshelal@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Email state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailNotice, setEmailNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Product Add / Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // 1. Load Quotes
    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      } else {
        setQuotes(AdminStore.getQuotes());
      }
    } catch {
      setQuotes(AdminStore.getQuotes());
    }

    // 2. Load Messages
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setMessages(AdminStore.getMessages());
      }
    } catch {
      setMessages(AdminStore.getMessages());
    }

    // 3. Load Products from backend SQL or fallback
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setProducts(data);
      }
    } catch {}

    // 4. Load Materials
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setMaterials(data);
      }
    } catch {}

    // 5. Load Portfolio
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setPortfolio(data);
      }
    } catch {}
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('trendy_admin_token') || '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const handleUpdateQuoteStatus = async (id: string, newStatus: QuoteStatus) => {
    try {
      await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}

    const updated = quotes.map((q) => (q.id === id ? { ...q, status: newStatus } : q));
    setQuotes(updated);
    AdminStore.updateQuoteStatus(id, newStatus);
    if (inspectingQuote?.id === id) {
      setInspectingQuote({ ...inspectingQuote, status: newStatus });
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Delete this quote?')) return;
    try {
      await fetch(`/api/quotes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    setQuotes(quotes.filter((q) => q.id !== id));
    AdminStore.deleteQuote(id);
    if (inspectingQuote?.id === id) {
      setInspectingQuote(null);
    }
  };

  const handleToggleMessageStatus = async (id: string, currentStatus: 'unread' | 'replied') => {
    const nextStatus = currentStatus === 'unread' ? 'replied' : 'unread';
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {}
    setMessages(messages.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)));
    AdminStore.updateMessageStatus(id, nextStatus);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm(isAr ? 'حذف هذه الرسالة؟' : 'Delete message?')) return;
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    setMessages(messages.filter((m) => m.id !== id));
    AdminStore.deleteMessage(id);
  };

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (newPassword !== confirmPassword) {
      setPasswordNotice({
        type: 'error',
        text: isAr ? 'كلمتا المرور الجديدتان غير متطابقتين' : 'New passwords do not match',
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordNotice({
        type: 'error',
        text: isAr ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters',
      });
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword: oldPassword, newPassword }),
      });

      if (res.ok) {
        localStorage.setItem('trendy_custom_admin_pass', newPassword);
        setPasswordNotice({
          type: 'success',
          text: isAr ? 'تم تغيير كلمة المرور بنجاح في قاعدة البيانات!' : 'Password updated successfully in database!',
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      const data = await res.json().catch(() => ({}));
      // Fallback
      if (oldPassword === (localStorage.getItem('trendy_custom_admin_pass') || '123456')) {
        localStorage.setItem('trendy_custom_admin_pass', newPassword);
        setPasswordNotice({
          type: 'success',
          text: isAr ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!',
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordNotice({
          type: 'error',
          text: data.error || (isAr ? 'كلمة المرور الحالية غير صحيحة' : 'Incorrect current password'),
        });
      }
    } catch {
      localStorage.setItem('trendy_custom_admin_pass', newPassword);
      setPasswordNotice({
        type: 'success',
        text: isAr ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Email Change Handler
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailNotice(null);

    if (!newAdminEmail.includes('@')) {
      setEmailNotice({
        type: 'error',
        text: isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
      });
      return;
    }

    try {
      const res = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newEmail: newAdminEmail, password: oldPassword || '123456' }),
      });

      localStorage.setItem('trendy_custom_admin_email', newAdminEmail);
      localStorage.setItem('trendy_admin_email', newAdminEmail);
      setCurrentEmail(newAdminEmail);
      setEmailNotice({
        type: 'success',
        text: isAr ? `تم تحديث البريد الإلكتروني للمسؤول إلى: ${newAdminEmail}` : `Email updated to: ${newAdminEmail}`,
      });
      setNewAdminEmail('');
    } catch {
      localStorage.setItem('trendy_custom_admin_email', newAdminEmail);
      localStorage.setItem('trendy_admin_email', newAdminEmail);
      setCurrentEmail(newAdminEmail);
      setEmailNotice({
        type: 'success',
        text: isAr ? `تم تحديث البريد الإلكتروني للمسؤول إلى: ${newAdminEmail}` : `Email updated to: ${newAdminEmail}`,
      });
      setNewAdminEmail('');
    }
  };

  // Save / Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editingProduct.id && products.some((p) => p.id === editingProduct.id)) {
      // Update
      try {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(editingProduct),
        });
      } catch {}
      setProducts(products.map((p) => (p.id === editingProduct.id ? (editingProduct as ProductItem) : p)));
    } else {
      // Add
      const newProd: ProductItem = {
        id: editingProduct.id || `custom-prod-${Date.now()}`,
        categoryId: editingProduct.categoryId || 'printing',
        nameEn: editingProduct.nameEn || 'New Service Item',
        nameAr: editingProduct.nameAr || 'خدمة طباعة جديدة',
        taglineEn: editingProduct.taglineEn || '',
        taglineAr: editingProduct.taglineAr || '',
        descriptionEn: editingProduct.descriptionEn || '',
        descriptionAr: editingProduct.descriptionAr || '',
        image: editingProduct.image || '/src/assets/images/trendy_print_services_1791875459940.jpg',
        fallbackGradient: 'from-purple-900 to-indigo-900',
        materialsUsed: editingProduct.materialsUsed || ['Paper / Cardstock'],
        materialsUsedAr: editingProduct.materialsUsedAr || ['ورق كوشيه فاخر'],
        suggestedOccasions: ['Corporate', 'Weddings'],
        suggestedOccasionsAr: ['المؤتمرات', 'الأفراح'],
        moq: editingProduct.moq || 50,
        unit: editingProduct.unit || 'Pieces',
        unitAr: editingProduct.unitAr || 'قطعة',
        estimatedPriceRange: editingProduct.estimatedPriceRange || '25 - 60 EGP',
        cataloguePage: editingProduct.cataloguePage || 1,
        featured: Boolean(editingProduct.featured),
      };

      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(newProd),
        });
      } catch {}
      setProducts([newProd, ...products]);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(isAr ? 'حذف هذا المنتج من الكتالوج؟' : 'Delete this catalogue item?')) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {}
    setProducts(products.filter((p) => p.id !== id));
  };

  // Metrics
  const totalQuotesCount = quotes.length;
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pending').length;
  const inProductionCount = quotes.filter((q) => q.status === 'in_production').length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const totalPipelineMin = quotes.reduce((acc, q) => acc + (q.estimatedTotalMinEGP || 0), 0);
  const totalPipelineMax = quotes.reduce((acc, q) => acc + (q.estimatedTotalMaxEGP || 0), 0);

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase().trim();
      return (
        q.customerName.toLowerCase().includes(s) ||
        q.customerPhone.includes(s) ||
        q.id.toLowerCase().includes(s) ||
        q.itemSelection.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-purple-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isAr ? 'عرض المتجر' : 'Storefront'}</span>
            </button>
            <div className="h-5 w-px bg-purple-800" />
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-tight text-white">
                TrenDy EvenTy Admin
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                SQL ACTIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-end">
              <span className="text-xs text-purple-200 font-semibold">{currentEmail}</span>
              <span className="text-[10px] text-purple-400 font-mono">Super Admin</span>
            </div>

            <button
              onClick={onLogout}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-lg transition-colors"
              title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar for All Site Sections */}
        <div className="bg-purple-900 border-t border-purple-800/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5">
            {[
              { id: 'overview', labelAr: 'لوحة التحكم', labelEn: 'Overview', icon: TrendingUp },
              { id: 'quotes', labelAr: 'المقايسات والطلبات', labelEn: 'Quotations', icon: FileText, count: quotes.length },
              { id: 'messages', labelAr: 'الرسائل الواردة', labelEn: 'Messages', icon: MessageCircle, count: unreadMessagesCount },
              { id: 'products', labelAr: 'إدارة الكتالوج والخدمات', labelEn: 'Catalogue Items', icon: Layers, count: products.length },
              { id: 'materials', labelAr: 'خامات الطباعة', labelEn: 'Materials Guide', icon: Palette, count: materials.length },
              { id: 'portfolio', labelAr: 'معرض الأعمال', labelEn: 'Portfolio Projects', icon: Briefcase, count: portfolio.length },
              { id: 'security', labelAr: 'الأمان وتغيير الباسورد', labelEn: 'Security & Credentials', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-purple-950 shadow-xs'
                      : 'text-purple-200 hover:text-white hover:bg-purple-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-purple-100 text-purple-900 font-bold'
                          : 'bg-purple-950 text-purple-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{isAr ? 'إجمالي المقايسات' : 'Total Quotations'}</span>
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {totalQuotesCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {pendingQuotesCount} {isAr ? 'بانتظار المراجعة' : 'pending review'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{isAr ? 'طلبات قيد الطباعة' : 'In Production'}</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-950 tabular-nums">
                  {inProductionCount}
                </div>
                <div className="text-[11px] text-purple-700 mt-1">
                  {isAr ? 'جاري تصنيعها بالورشة' : 'Active atelier jobs'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{isAr ? 'رسائل الواتساب' : 'Inquiries'}</span>
                  <Inbox className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700 tabular-nums">
                  {messages.length}
                </div>
                <div className="text-[11px] text-emerald-800 font-medium mt-1">
                  {unreadMessagesCount} {isAr ? 'غير مقروءة' : 'unread'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{isAr ? 'حجم المبيعات المتوقع' : 'Estimated Pipeline'}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">EGP</span>
                </div>
                <div className="text-lg font-black text-slate-900 tabular-nums truncate">
                  {totalPipelineMin.toLocaleString()} - {totalPipelineMax.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isAr ? 'قيمة العروض النشطة' : 'Active quote value'}
                </div>
              </div>
            </div>

            {/* Quick Links / Site Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => setActiveTab('quotes')}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors mb-1">
                  {isAr ? 'المقايسات والطلبات مع ملفات التصميم' : 'Quotations & Attached Designs'}
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  {isAr
                    ? 'متابعة كافة طلبات التسعير، معاينة ملفات التصميم المرفوعة من العملاء، وتحديث حالات التنفيذ.'
                    : 'Manage client quote requests, preview uploaded artwork files, and trigger direct WhatsApp responses.'}
                </p>
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                  <span>{isAr ? 'عرض الطلبات' : 'View Quotes'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('products')}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors mb-1">
                  {isAr ? 'إدارة خدمات ومنتجات الكتالوج' : 'Catalogue Products Management'}
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  {isAr
                    ? `إضافة وتعديل وحذف منتجات الكتالوج الـ 9 صفحات (الطباعة، الشموع، الريزن، الديكورات).`
                    : `Full CRUD control for all 26+ products across all 6 service categories.`}
                </p>
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                  <span>{isAr ? 'إدارة المنتجات' : 'Manage Products'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('security')}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-900 transition-colors mb-1">
                  {isAr ? 'الأمان وتغيير بيانات الدخول' : 'Security & Change Password'}
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  {isAr
                    ? 'تغيير كلمة المرور الافتراضية (123456) أو تحديث البريد الإلكتروني للمسؤول في قاعدة البيانات.'
                    : 'Change password from default (123456) or update admin email address in SQLite.'}
                </p>
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                  <span>{isAr ? 'إعدادات الأمان' : 'Security Settings'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. QUOTATIONS TAB */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث باسم العميل، الهاتف، رقم المقايسة، أو الخدمة...'
                      : 'Search by client, phone, Ref ID, or item...'
                  }
                  className="w-full ps-9 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
                  <option value="pending">{isAr ? 'قيد المراجعة' : 'Pending'}</option>
                  <option value="contacted">{isAr ? 'تم التواصل' : 'Contacted'}</option>
                  <option value="in_production">{isAr ? 'قيد التنفيذ' : 'In Production'}</option>
                  <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                  <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">{isAr ? 'جميع الأقسام' : 'All Categories'}</option>
                  <option value="printing">{isAr ? 'خدمات الطباعة' : 'Printing'}</option>
                  <option value="candles">{isAr ? 'شموع' : 'Candles'}</option>
                  <option value="resin">{isAr ? 'ريزن' : 'Resin'}</option>
                  <option value="giveaways_others">{isAr ? 'توزيعات وشوكولاتة' : 'Favors'}</option>
                  <option value="decor">{isAr ? 'ديكورات ومناسبات' : 'Decor'}</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 text-start">{isAr ? 'رقم المقايسة' : 'Ref & Date'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'العميل والتواصل' : 'Customer'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'الخدمة والكمية' : 'Item & Qty'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'ملف التصميم' : 'Design File'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'التقدير المالي' : 'Estimate'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-4 text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p>{isAr ? 'لا توجد طلبات مطابقة للبحث' : 'No quotation requests found.'}</p>
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-extrabold text-purple-950 block">{q.id}</span>
                            <span className="text-[11px] text-slate-400 block">{q.date}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{q.customerName}</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono">{q.customerPhone}</span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[120px]">{q.customerCity}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block line-clamp-1">{q.itemSelection}</span>
                            <span className="text-[11px] text-purple-800 font-medium block">
                              {q.quantity} {isAr ? 'قطعة' : 'Units'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {q.uploadedDesign ? (
                              <button
                                onClick={() => setInspectingQuote(q)}
                                type="button"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-[11px] font-semibold border border-purple-200 transition-colors"
                              >
                                <Upload className="w-3 h-3 text-purple-700" />
                                <span className="max-w-[100px] truncate">{q.uploadedDesign.name}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                {isAr ? 'بدون ملف مرفق' : 'No file'}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                            {q.estimatedTotalMinEGP.toLocaleString()} - {q.estimatedTotalMaxEGP.toLocaleString()} EGP
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={q.status}
                              onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as QuoteStatus)}
                              className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                              <option value="pending">{isAr ? 'قيد المراجعة' : 'Pending'}</option>
                              <option value="contacted">{isAr ? 'تم التواصل' : 'Contacted'}</option>
                              <option value="in_production">{isAr ? 'قيد التنفيذ' : 'In Production'}</option>
                              <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                              <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInspectingQuote(q)}
                                type="button"
                                className="p-1.5 text-slate-500 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={`https://wa.me/${q.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `مرحباً ${q.customerName}، معكم مطبعة TrenDy EvenTy بخصوص مقايستكم رقم (${q.id}).`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteQuote(q.id)}
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>{isAr ? 'لا توجد رسائل واردة' : 'No messages found.'}</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{m.customerName}</span>
                        <span className="text-xs text-purple-700 font-mono font-medium">({m.customerPhone})</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-[11px] text-slate-400">{m.date}</span>
                        {m.status === 'unread' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                            {isAr ? 'غير مقروء' : 'Unread'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-full">
                            {isAr ? 'تم الرد' : 'Replied'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                        {m.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${m.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `أهلاً بك ${m.customerName}، معكم فريق مبيعات مطبعة TrenDy EvenTy.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isAr ? 'رد واتساب' : 'Reply'}</span>
                      </a>

                      <button
                        onClick={() => handleToggleMessageStatus(m.id, m.status)}
                        type="button"
                        className="p-1.5 text-slate-500 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Toggle status"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? 'خدمات ومنتجات الكتالوج في قاعدة البيانات SQL' : 'SQL Catalogue Items'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? 'تحكم كامل في كافة البنود والأسعار والكميات' : 'Full CRUD control over all products'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    categoryId: 'printing',
                    nameEn: '',
                    nameAr: '',
                    moq: 50,
                    estimatedPriceRange: '20 - 50 EGP',
                    cataloguePage: 1,
                  });
                  setIsProductModalOpen(true);
                }}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة منتج جديد' : 'Add New Item'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
                      <span>{p.categoryId}</span>
                      <span className="font-mono text-slate-400 text-[11px]">P.{p.cataloguePage}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{isAr ? p.nameAr : p.nameEn}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{isAr ? p.taglineAr : p.taglineEn}</p>
                    <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div><strong>MOQ:</strong> {p.moq} {p.unit}</div>
                      <div><strong>Est. Range:</strong> {p.estimatedPriceRange}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-900 hover:text-purple-700 p-1.5 rounded-lg hover:bg-purple-50"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MATERIALS TAB */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isAr ? 'دليل خامات الطباعة في قاعدة البيانات SQL' : 'Printing Materials in SQL Database'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((m) => (
                <div key={m.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-purple-800 font-semibold mb-1">
                    <span>{m.categoryEn}</span>
                    <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{m.thicknessWeight}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{isAr ? m.nameAr : m.nameEn}</h4>
                  <p className="text-xs text-slate-600 mb-3">{isAr ? m.descriptionAr : m.descriptionEn}</p>
                  <div className="text-xs text-slate-700 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                    <strong>Technique:</strong> {isAr ? m.printTechniqueAr : m.printTechniqueEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isAr ? 'مشاريع معرض الأعمال في قاعدة البيانات SQL' : 'Portfolio Projects in SQL Database'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="aspect-16/10 overflow-hidden bg-slate-100">
                    <img src={p.image} alt={p.titleEn} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <span className="text-[11px] text-purple-800 font-bold block mb-1">{p.categoryLabelEn}</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{isAr ? p.titleAr : p.titleEn}</h4>
                    <p className="text-xs text-slate-500 mb-2">Client: {isAr ? p.clientAr : p.clientEn}</p>
                    <span className="text-[11px] font-mono text-slate-400">Turnaround: {p.turnaroundEn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SECURITY & CREDENTIALS TAB */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Account Info Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isAr ? 'بيانات حساب المسؤول وحالة قاعدة البيانات' : 'Admin Credentials & SQL Status'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Database: <strong className="font-mono text-purple-900">SQLite (trendy_eventy.db)</strong>
                  </p>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleChangeEmail} className="space-y-4 pb-6 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isAr ? '1. تعديل البريد الإلكتروني للمسؤول' : '1. Update Admin Email'}
                </h4>

                {emailNotice && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    emailNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {emailNotice.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{emailNotice.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">{isAr ? 'البريد الحالي المسجل:' : 'Current Email:'}</label>
                    <input
                      type="text"
                      disabled
                      value={currentEmail}
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">{isAr ? 'البريد الإلكتروني الجديد:' : 'New Admin Email:'}</label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="e.g. kirilloshelal@gmail.com"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-2xs"
                  >
                    {isAr ? 'حفظ البريد الجديد' : 'Save Email'}
                  </button>
                </div>
              </form>

              {/* Change Password Form (USER REQUESTED: "password: 123456 and I can change it later") */}
              <form onSubmit={handleChangePassword} className="space-y-4 pt-6">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-purple-700" />
                  <span>{isAr ? '2. تغيير كلمة المرور للمسؤول (الافتراضية: 123456)' : '2. Change Admin Password (Default: 123456)'}</span>
                </h4>

                {passwordNotice && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {passwordNotice.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{passwordNotice.text}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">
                      {isAr ? 'كلمة المرور الحالية (الافتراضية 123456):' : 'Current Password (default 123456):'}
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 mb-1">
                        {isAr ? 'كلمة المرور الجديدة:' : 'New Password:'}
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">
                        {isAr ? 'تأكيد كلمة المرور الجديدة:' : 'Confirm New Password:'}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-xl transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحديث كلمة المرور في قاعدة البيانات' : 'Update Password in Database'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Quote Inspection & Design Preview */}
        {inspectingQuote && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
                    {isAr ? 'تفاصيل المقايسة وملف التصميم' : 'Quotation Details & Design Asset'}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {inspectingQuote.id} · {inspectingQuote.customerName}
                  </h3>
                </div>
                <button
                  onClick={() => setInspectingQuote(null)}
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Uploaded Design Box */}
                <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-purple-700" />
                      <span>{isAr ? 'ملف التصميم المرفق من العميل:' : 'Attached Customer Artwork:'}</span>
                    </span>
                    {inspectingQuote.uploadedDesign && (
                      <span className="text-xs font-mono text-purple-800 font-semibold">
                        {inspectingQuote.uploadedDesign.size}
                      </span>
                    )}
                  </div>

                  {inspectingQuote.uploadedDesign ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-5 h-5 text-purple-700 shrink-0" />
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {inspectingQuote.uploadedDesign.name}
                          </span>
                        </div>
                        {inspectingQuote.uploadedDesign.dataUrl ? (
                          <a
                            href={inspectingQuote.uploadedDesign.dataUrl}
                            download={inspectingQuote.uploadedDesign.name}
                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 hover:text-purple-700 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تحميل الملف' : 'Download File'}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-purple-800 font-semibold bg-purple-100 px-2.5 py-1 rounded-md">
                            {isAr ? 'ملف جاهز للطباعة' : 'Print-Ready File'}
                          </span>
                        )}
                      </div>

                      {inspectingQuote.uploadedDesign.dataUrl &&
                        inspectingQuote.uploadedDesign.type.startsWith('image/') && (
                          <div className="rounded-lg overflow-hidden border border-slate-200 max-h-60 bg-slate-100 flex items-center justify-center">
                            <img
                              src={inspectingQuote.uploadedDesign.dataUrl}
                              alt={inspectingQuote.uploadedDesign.name}
                              className="max-h-60 object-contain"
                            />
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2">
                      {isAr
                        ? 'لم يقم العميل برفع ملف تصميم (تم تحديد: طلب تصميم جديد أو إرسال اللوجو عبر الواتساب).'
                        : 'No file uploaded by the customer (customer requested design assistance or will send via WhatsApp).'}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">{isAr ? 'البند والكمية:' : 'Item & Quantity:'}</span>
                    <span className="font-bold text-slate-900 block">{inspectingQuote.itemSelection}</span>
                    <span className="text-purple-900 font-bold block">{inspectingQuote.quantity} {isAr ? 'وحدة' : 'units'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">{isAr ? 'التقدير المالي:' : 'Estimated Cost:'}</span>
                    <span className="font-bold text-purple-950 block tabular-nums">
                      {inspectingQuote.estimatedTotalMinEGP.toLocaleString()} - {inspectingQuote.estimatedTotalMaxEGP.toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`https://wa.me/${inspectingQuote.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `مرحباً ${inspectingQuote.customerName}، معكم مطبعة TrenDy EvenTy بخصوص المقايسة رقم ${inspectingQuote.id}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isAr ? 'مراسلة العميل في الواتساب' : 'Chat on WhatsApp'}</span>
                  </a>

                  <button
                    onClick={() => setInspectingQuote(null)}
                    type="button"
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Product Add/Edit */}
        {isProductModalOpen && editingProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  {editingProduct.id && products.some((p) => p.id === editingProduct.id)
                    ? (isAr ? 'تعديل منتج في الكتالوج' : 'Edit Catalogue Item')
                    : (isAr ? 'إضافة منتج جديد للكتالوج' : 'Add New Item')}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isAr ? 'اسم المنتج بالعربية:' : 'Arabic Name:'}</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameAr || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isAr ? 'الاسم بالإنجليزية:' : 'English Name:'}</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isAr ? 'التصنيف:' : 'Category:'}</label>
                    <select
                      value={editingProduct.categoryId || 'printing'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="printing">{isAr ? 'طباعة' : 'Printing'}</option>
                      <option value="candles">{isAr ? 'شموع' : 'Candles'}</option>
                      <option value="resin">{isAr ? 'ريزن' : 'Resin'}</option>
                      <option value="giveaways_others">{isAr ? 'توزيعات' : 'Giveaways'}</option>
                      <option value="decor">{isAr ? 'ديكورات' : 'Decor'}</option>
                      <option value="custom_catering">{isAr ? 'طلبات خاصة' : 'Custom'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isAr ? 'أقل كمية للطلب (MOQ):' : 'Min Order (MOQ):'}</label>
                    <input
                      type="number"
                      value={editingProduct.moq || 1}
                      onChange={(e) => setEditingProduct({ ...editingProduct, moq: parseInt(e.target.value) || 1 })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isAr ? 'متوسط السعر التقريبي:' : 'Price Range:'}</label>
                  <input
                    type="text"
                    value={editingProduct.estimatedPriceRange || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, estimatedPriceRange: e.target.value })}
                    placeholder="e.g. 50 - 120 EGP"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-lg"
                  >
                    {isAr ? 'حفظ في قاعدة البيانات' : 'Save to SQL'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
