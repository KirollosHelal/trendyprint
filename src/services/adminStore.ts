import { QuotationRequest, InquiryMessage, QuoteStatus } from '../types';

const QUOTES_STORAGE_KEY = 'trendy_eventy_quotes_v1';
const MESSAGES_STORAGE_KEY = 'trendy_eventy_messages_v1';

const INITIAL_DEMO_QUOTES: QuotationRequest[] = [
  {
    id: 'TE-9241',
    date: '2026-10-12 14:35',
    category: 'printing',
    itemSelection: 'Business Cards (كروت شخصية فاخرة)',
    quantity: 1000,
    materialChoice: 'ورق كوشيه 350 جم فاخر (Couche 350gsm)',
    finishingChoice: 'سلوفان حراري مط + بصمة فويل ذهبي (Gold Foil)',
    hasArtwork: 'yes',
    uploadedDesign: {
      name: 'Forge_Business_Cards_PrintReady.pdf',
      size: '4.2 MB',
      type: 'application/pdf',
      dataUrl: undefined,
    },
    customerName: 'م. أحمد توفيق',
    customerPhone: '01012345678',
    customerCity: 'القاهرة - التجمع الخامس',
    notes: 'اللوجو ذهبي لامع بارز مع زوايا دائرية، مطلوب تسليم خلال 3 أيام.',
    estimatedTotalMinEGP: 650,
    estimatedTotalMaxEGP: 1200,
    status: 'in_production',
  },
  {
    id: 'TE-8820',
    date: '2026-10-12 11:15',
    category: 'decor',
    itemSelection: 'Ornate Welcome Board Mirror (مرآة ترحيبية كلاسيكية)',
    quantity: 1,
    occasionType: 'حفل زفاف (Wedding)',
    customNamesDate: 'سارة & مايكل - 28/10/2026',
    setupItems: ['Welcome Mirror', 'Audio Guestbook', 'Easel Stand'],
    hasArtwork: 'need_design',
    customerName: 'سارة كمال',
    customerPhone: '01287654321',
    customerCity: 'مصر الجديدة - القاهرة',
    notes: 'إطار مذهب أنتيك مع ورد أبيض وخضرة، التوصيل والتركيب في قاعة الفرح.',
    estimatedTotalMinEGP: 1800,
    estimatedTotalMaxEGP: 2600,
    status: 'contacted',
  },
  {
    id: 'TE-8104',
    date: '2026-10-11 18:40',
    category: 'candles',
    itemSelection: 'Mini Bubble Candles (توزيعات شمع ميني بابلز)',
    quantity: 150,
    occasionType: 'سبوع واستقبال مولود (Sebou3)',
    customNamesDate: 'Baby Noah - 15/11/2026',
    colorTheme: 'بيبي بلو وباستيل أبيض',
    scentChoice: 'فانيليا فرنسية دافئة (French Vanilla)',
    hasArtwork: 'have_draft',
    uploadedDesign: {
      name: 'Baby_Noah_Theme_Card.png',
      size: '1.8 MB',
      type: 'image/png',
      dataUrl: undefined,
    },
    customerName: 'د. ندى الشريف',
    customerPhone: '01198765432',
    customerCity: 'شبرا مصر - القاهرة',
    notes: 'مع فيونكة ستان زرقاء وكارت إهداء بالاسم وتاريخ الولادة.',
    estimatedTotalMinEGP: 3000,
    estimatedTotalMaxEGP: 4800,
    status: 'pending',
  },
  {
    id: 'TE-7745',
    date: '2026-10-10 16:20',
    category: 'printing',
    itemSelection: 'Roll Up Banner (رول اب بانر إعلاني)',
    quantity: 4,
    materialChoice: 'فيلم جراي باك للرول اب (Greyback Anti-Curl)',
    finishingChoice: 'سلوفان مط مانع للمعان',
    hasArtwork: 'yes',
    uploadedDesign: {
      name: 'GILS_Summit_Rollup_Final.pdf',
      size: '12.5 MB',
      type: 'application/pdf',
      dataUrl: undefined,
    },
    customerName: 'أ. طارق عبد الرحمن',
    customerPhone: '01065432198',
    customerCity: 'القرية الذكية - 6 أكتوبر',
    notes: 'مقاس 85×200 سم مع قواعد ألومنيوم عريضة وحقائب مبطنة.',
    estimatedTotalMinEGP: 3000,
    estimatedTotalMaxEGP: 4400,
    status: 'completed',
  },
  {
    id: 'TE-7412',
    date: '2026-10-09 20:10',
    category: 'resin',
    itemSelection: 'Resin Alphabet Keychain (ميداليات مفاتيح ريزن حروف)',
    quantity: 80,
    occasionType: 'ليلة الحنة (Henna Night)',
    customNamesDate: 'Letter initials for all bridal guests',
    colorTheme: 'وردي وفوشيا ورقائق ذهب 24 قيراط',
    hasArtwork: 'have_draft',
    customerName: 'مريم عادل',
    customerPhone: '01511223344',
    customerCity: 'المعادي - القاهرة',
    notes: 'شراشيب حرير باللون الوردي وحلقات مفاتيح ذهبية متينة.',
    estimatedTotalMinEGP: 2240,
    estimatedTotalMaxEGP: 3360,
    status: 'completed',
  },
];

const INITIAL_DEMO_MESSAGES: InquiryMessage[] = [
  {
    id: 'msg-101',
    date: '2026-10-12 17:20',
    customerName: 'كريم البنا',
    customerPhone: '01099887766',
    message: 'مساء الخير، هل متاح تأجير هاتف الأوديو جيست بوك فقط ليوم الجمعة القادمة في التجمع؟ وما هي تكلفته؟',
    source: 'whatsapp_widget',
    status: 'unread',
  },
  {
    id: 'msg-102',
    date: '2026-10-12 15:45',
    customerName: 'شركة النيل للبرمجيات',
    customerPhone: '01233445566',
    message: 'محتاجين تسعيرة 50 تيشرت قطن دراي فت مطبوع لوجو الشركة مع 50 كاب و50 مج لسيمينار داخلي.',
    source: 'quick_inquiry',
    status: 'replied',
  },
  {
    id: 'msg-103',
    date: '2026-10-11 12:10',
    customerName: 'ياسمين حسام',
    customerPhone: '01122334455',
    message: 'السلام عليكم، عايزة اعرف مقاسات برطمانات الشمع المعطرة للتوزيعات وهل بتيجي بالعلب ولا لأ؟',
    source: 'whatsapp_widget',
    status: 'replied',
  },
];

export const AdminStore = {
  getQuotes(): QuotationRequest[] {
    try {
      const stored = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load quotes from localStorage', e);
    }
    // Seed initial demo data
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_QUOTES));
    return INITIAL_DEMO_QUOTES;
  },

  addQuote(quote: QuotationRequest): QuotationRequest[] {
    const quotes = this.getQuotes();
    const updated = [quote, ...quotes];
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save quote to localStorage', e);
    }
    return updated;
  },

  updateQuoteStatus(id: string, status: QuoteStatus): QuotationRequest[] {
    const quotes = this.getQuotes();
    const updated = quotes.map((q) => (q.id === id ? { ...q, status } : q));
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update quote status', e);
    }
    return updated;
  },

  deleteQuote(id: string): QuotationRequest[] {
    const quotes = this.getQuotes();
    const updated = quotes.filter((q) => q.id !== id);
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete quote', e);
    }
    return updated;
  },

  getMessages(): InquiryMessage[] {
    try {
      const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load messages from localStorage', e);
    }
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_MESSAGES));
    return INITIAL_DEMO_MESSAGES;
  },

  addMessage(msg: InquiryMessage): InquiryMessage[] {
    const messages = this.getMessages();
    const updated = [msg, ...messages];
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save message to localStorage', e);
    }
    return updated;
  },

  updateMessageStatus(id: string, status: 'unread' | 'replied'): InquiryMessage[] {
    const messages = this.getMessages();
    const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update message status', e);
    }
    return updated;
  },

  deleteMessage(id: string): InquiryMessage[] {
    const messages = this.getMessages();
    const updated = messages.filter((m) => m.id !== id);
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete message', e);
    }
    return updated;
  },
};
