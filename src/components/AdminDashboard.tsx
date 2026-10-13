import React, { useState, useEffect } from 'react';
import { QuotationRequest, InquiryMessage, QuoteStatus, Language } from '../types';
import { AdminStore } from '../services/adminStore';
import { CONTACT_INFO } from '../config/contact';
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
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, onBackToStore }) => {
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'quotes' | 'messages'>('quotes');
  const [quotes, setQuotes] = useState<QuotationRequest[]>([]);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal inspection
  const [inspectingQuote, setInspectingQuote] = useState<QuotationRequest | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuotes(AdminStore.getQuotes());
    setMessages(AdminStore.getMessages());
  };

  const handleUpdateQuoteStatus = (id: string, newStatus: QuoteStatus) => {
    const updated = AdminStore.updateQuoteStatus(id, newStatus);
    setQuotes(updated);
    if (inspectingQuote && inspectingQuote.id === id) {
      setInspectingQuote({ ...inspectingQuote, status: newStatus });
    }
  };

  const handleDeleteQuote = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this quote?')) {
      const updated = AdminStore.deleteQuote(id);
      setQuotes(updated);
      if (inspectingQuote?.id === id) {
        setInspectingQuote(null);
      }
    }
  };

  const handleToggleMessageStatus = (id: string, currentStatus: 'unread' | 'replied') => {
    const newStatus = currentStatus === 'unread' ? 'replied' : 'unread';
    const updated = AdminStore.updateMessageStatus(id, newStatus);
    setMessages(updated);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) {
      const updated = AdminStore.deleteMessage(id);
      setMessages(updated);
    }
  };

  // Metrics
  const totalQuotesCount = quotes.length;
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pending').length;
  const inProductionCount = quotes.filter((q) => q.status === 'in_production').length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const totalPipelineMin = quotes.reduce((acc, q) => acc + (q.estimatedTotalMinEGP || 0), 0);
  const totalPipelineMax = quotes.reduce((acc, q) => acc + (q.estimatedTotalMaxEGP || 0), 0);

  // Filter quotes
  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase().trim();
      const matchName = q.customerName.toLowerCase().includes(s);
      const matchPhone = q.customerPhone.includes(s);
      const matchId = q.id.toLowerCase().includes(s);
      const matchItem = q.itemSelection.toLowerCase().includes(s);
      const matchCity = q.customerCity.toLowerCase().includes(s);
      return matchName || matchPhone || matchId || matchItem || matchCity;
    }
    return true;
  });

  const getWhatsAppChatUrlForCustomer = (q: QuotationRequest) => {
    let cleanPhone = q.customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('01')) {
      cleanPhone = '20' + cleanPhone.substring(1);
    }
    const message = encodeURIComponent(
      `مرحباً ${q.customerName}، معكم مطبعة TrenDy EvenTy بخصوص طلب التسعيرة رقم (${q.id}) للبند: ${q.itemSelection}.\nيسعدنا مناقشة التفاصيل والبدء بالتنفيذ فوراً.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{isAr ? 'قيد المراجعة' : 'Pending'}</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <MessageCircle className="w-3 h-3 text-blue-600" />
            <span>{isAr ? 'تم التواصل' : 'Contacted'}</span>
          </span>
        );
      case 'in_production':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <TrendingUp className="w-3 h-3 text-purple-600" />
            <span>{isAr ? 'قيد التنفيذ والطباعة' : 'In Production'}</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{isAr ? 'مكتمل ومسلّم' : 'Completed'}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{isAr ? 'ملغي' : 'Cancelled'}</span>
          </span>
        );
    }
  };

  const exportToCSV = () => {
    const headers = ['Quote ID', 'Date', 'Customer Name', 'Phone', 'City', 'Item', 'Quantity', 'Status', 'Min EGP', 'Max EGP', 'Uploaded Design'];
    const rows = quotes.map((q) => [
      q.id,
      q.date,
      `"${q.customerName}"`,
      `"${q.customerPhone}"`,
      `"${q.customerCity}"`,
      `"${q.itemSelection.replace(/"/g, '""')}"`,
      q.quantity,
      q.status,
      q.estimatedTotalMinEGP,
      q.estimatedTotalMaxEGP,
      q.uploadedDesign ? `"${q.uploadedDesign.name}"` : 'None',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trendy_eventy_quotes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-purple-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{isAr ? 'العودة للمتجر والكتالوج' : 'Back to Store'}</span>
            </button>
            <div className="h-5 w-px bg-purple-800" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                TrenDy EvenTy Admin
              </span>
              <span className="text-[11px] font-medium text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                {isAr ? 'لوحة المراقبة والإدارة' : 'Monitoring Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-purple-200 hidden sm:inline">
              WhatsApp Sales: <strong className="text-white font-mono">{CONTACT_INFO.phoneDisplay}</strong>
            </span>
            <button
              onClick={exportToCSV}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-800 hover:bg-purple-700 text-white rounded-lg transition-colors border border-purple-700 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصدير إكسل CSV' : 'Export CSV'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{isAr ? 'إجمالي المقايسات' : 'Total Quotations'}</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {totalQuotesCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {pendingQuotesCount} {isAr ? 'طلب بانتظار المراجعة' : 'pending review'}
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
              <span>{isAr ? 'رسائل الواتساب الواردة' : 'Inquiry Messages'}</span>
              <Inbox className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 tabular-nums">
              {messages.length}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              {unreadMessagesCount} {isAr ? 'رسالة جديدة غير مقروءة' : 'unread messages'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{isAr ? 'قيمة العروض التقديرية' : 'Estimated Pipeline'}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">EGP</span>
            </div>
            <div className="text-lg font-black text-slate-900 tabular-nums truncate">
              {totalPipelineMin.toLocaleString()} - {totalPipelineMax.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isAr ? 'حجم المبيعات المتوقع' : 'Estimated gross revenue'}
            </div>
          </div>
        </div>

        {/* Tab Switcher: Quotes vs Messages */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('quotes')}
            type="button"
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'quotes'
                ? 'border-purple-900 text-purple-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isAr ? 'طلبات المقايسة والتسعير' : 'Quotation Requests'}</span>
            <span className="text-xs bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full font-mono">
              {quotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            type="button"
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-purple-900 text-purple-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isAr ? 'رسائل واستفسارات العملاء' : 'Customer Inquiries'}</span>
            {unreadMessagesCount > 0 && (
              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: QUOTES TABLE */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute inset-y-0 start-3 my-auto text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? 'ابحث باسم العميل، رقم الهاتف، رقم المقايسة، المدينة، أو البند...'
                      : 'Search by client name, phone, Ref ID, city, or product...'
                  }
                  className="w-full ps-9 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
                  <option value="pending">{isAr ? 'قيد المراجعة (Pending)' : 'Pending'}</option>
                  <option value="contacted">{isAr ? 'تم التواصل (Contacted)' : 'Contacted'}</option>
                  <option value="in_production">{isAr ? 'قيد التنفيذ (In Production)' : 'In Production'}</option>
                  <option value="completed">{isAr ? 'مكتمل (Completed)' : 'Completed'}</option>
                  <option value="cancelled">{isAr ? 'ملغي (Cancelled)' : 'Cancelled'}</option>
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

            {/* Quotes Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 text-start">{isAr ? 'رقم المقايسة والتاريخ' : 'Ref & Date'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'العميل والتواصل' : 'Customer & Contact'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'الخدمة المطلوبة' : 'Service & Qty'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'ملف التصميم المرفوع' : 'Design File'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'التقدير المالي' : 'Estimate (EGP)'}</th>
                      <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-4 text-end">{isAr ? 'إجراءات سريعة' : 'Actions'}</th>
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
                          {/* Ref ID & Date */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-extrabold text-purple-950 block">{q.id}</span>
                            <span className="text-[11px] text-slate-400 block">{q.date}</span>
                          </td>

                          {/* Customer Name & Phone */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{q.customerName}</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono">{q.customerPhone}</span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate max-w-[120px]">{q.customerCity}</span>
                            </div>
                          </td>

                          {/* Service & Qty */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block line-clamp-1">
                              {q.itemSelection}
                            </span>
                            <span className="text-[11px] text-purple-800 font-medium block">
                              {q.quantity} {isAr ? 'قطعة / وحدة' : 'Units'}
                            </span>
                          </td>

                          {/* Uploaded Design Badge */}
                          <td className="py-3.5 px-4">
                            {q.uploadedDesign ? (
                              <button
                                onClick={() => setInspectingQuote(q)}
                                type="button"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-[11px] font-semibold border border-purple-200 transition-colors"
                              >
                                <Upload className="w-3 h-3 text-purple-700" />
                                <span className="max-w-[110px] truncate">{q.uploadedDesign.name}</span>
                                <span className="text-[10px] text-purple-600 font-mono">({q.uploadedDesign.size})</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                {q.hasArtwork === 'need_design'
                                  ? (isAr ? 'طلب تصميم جديد' : 'Needs Design')
                                  : (isAr ? 'مسودة لوجو' : 'Logo draft')}
                              </span>
                            )}
                          </td>

                          {/* Estimate */}
                          <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                            {q.estimatedTotalMinEGP.toLocaleString()} - {q.estimatedTotalMaxEGP.toLocaleString()}
                          </td>

                          {/* Status Dropdown */}
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

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open Details Modal */}
                              <button
                                onClick={() => setInspectingQuote(q)}
                                type="button"
                                className="p-1.5 text-slate-500 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                                title={isAr ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* WhatsApp Direct Chat */}
                              <a
                                href={getWhatsAppChatUrlForCustomer(q)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                                title={isAr ? 'مراسلة العميل في الواتساب' : 'Chat with Customer on WhatsApp'}
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteQuote(q.id)}
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title={isAr ? 'حذف' : 'Delete'}
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

        {/* TAB 2: INQUIRIES & MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p>{isAr ? 'لا توجد رسائل واردة حالياً' : 'No messages received yet.'}</p>
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
                            {isAr ? 'جديد غير مقروء' : 'New Unread'}
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

                      <div className="text-[11px] text-slate-400">
                        {isAr ? 'المصدر:' : 'Source:'} {m.source === 'whatsapp_widget' ? 'نافذة الواتساب السريعة' : 'الموقع'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${m.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `أهلاً بك ${m.customerName}، معكم فريق مبيعات مطبعة TrenDy EvenTy بخصوص استفساركم.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isAr ? 'رد عبر الواتساب' : 'Reply on WhatsApp'}</span>
                      </a>

                      <button
                        onClick={() => handleToggleMessageStatus(m.id, m.status)}
                        type="button"
                        className="p-1.5 text-slate-500 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                        title={m.status === 'unread' ? 'Mark as replied' : 'Mark as unread'}
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
              {/* Modal Header */}
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

              {/* Modal Body */}
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

                      {/* If dataUrl is image, preview it */}
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

                {/* Key Specs Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <span className="text-slate-500 block">{isAr ? 'البند والكمية:' : 'Item & Quantity:'}</span>
                    <span className="font-bold text-slate-900 block text-sm">{inspectingQuote.itemSelection}</span>
                    <span className="text-purple-900 font-bold block">{inspectingQuote.quantity} {isAr ? 'وحدة' : 'units'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <span className="text-slate-500 block">{isAr ? 'التقدير المالي:' : 'Estimated Cost:'}</span>
                    <span className="font-bold text-purple-950 block text-sm tabular-nums">
                      {inspectingQuote.estimatedTotalMinEGP.toLocaleString()} - {inspectingQuote.estimatedTotalMaxEGP.toLocaleString()} EGP
                    </span>
                    <span className="text-slate-500 block">{isAr ? 'حسب المواصفات والكمية' : 'Tier estimate'}</span>
                  </div>
                </div>

                {/* Specific options */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
                  {inspectingQuote.materialChoice && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'الخامة:' : 'Material:'}</strong> {inspectingQuote.materialChoice}
                    </div>
                  )}
                  {inspectingQuote.finishingChoice && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'التشطيب:' : 'Finishing:'}</strong> {inspectingQuote.finishingChoice}
                    </div>
                  )}
                  {inspectingQuote.occasionType && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'المناسبة:' : 'Occasion:'}</strong> {inspectingQuote.occasionType}
                    </div>
                  )}
                  {inspectingQuote.customNamesDate && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'الأسماء والتاريخ:' : 'Names/Date:'}</strong> {inspectingQuote.customNamesDate}
                    </div>
                  )}
                  {inspectingQuote.colorTheme && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'ثيم الألوان:' : 'Color Theme:'}</strong> {inspectingQuote.colorTheme}
                    </div>
                  )}
                  {inspectingQuote.scentChoice && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'العطر:' : 'Scent:'}</strong> {inspectingQuote.scentChoice}
                    </div>
                  )}
                  {inspectingQuote.notes && (
                    <div>
                      <strong className="text-slate-900">{isAr ? 'ملاحظات العميل:' : 'Customer Notes:'}</strong> {inspectingQuote.notes}
                    </div>
                  )}
                </div>

                {/* Customer Details & Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-500 block">{isAr ? 'التواصل المباشر مع العميل:' : 'Customer Phone:'}</span>
                    <a
                      href={`tel:${inspectingQuote.customerPhone}`}
                      className="font-bold text-slate-900 font-mono hover:text-purple-700"
                    >
                      {inspectingQuote.customerPhone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={getWhatsAppChatUrlForCustomer(inspectingQuote)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isAr ? 'مراسلة العميل في الواتساب' : 'Chat on WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => setInspectingQuote(null)}
                      type="button"
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      {isAr ? 'إغلاق' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
