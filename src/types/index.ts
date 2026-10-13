export type CategoryId = 
  | 'all'
  | 'printing'
  | 'candles'
  | 'resin'
  | 'giveaways_others'
  | 'decor'
  | 'custom_catering';

export type Language = 'en' | 'ar';

export type QuoteStatus = 'pending' | 'contacted' | 'in_production' | 'completed' | 'cancelled';

export interface UploadedDesign {
  name: string;
  size: string;
  type: string;
  dataUrl?: string; // base64 representation for preview/download
}

export interface ProductItem {
  id: string;
  categoryId: CategoryId;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  fallbackGradient: string;
  materialsUsed: string[];
  materialsUsedAr: string[];
  suggestedOccasions: string[];
  suggestedOccasionsAr: string[];
  moq: number; // Minimum order quantity
  unit: string;
  unitAr: string;
  estimatedPriceRange: string;
  cataloguePage: number;
  featured?: boolean;
}

export interface MaterialDetail {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'paper' | 'fabric' | 'plastic_acrylic' | 'craft_natural' | 'rigid_sign';
  categoryEn: string;
  categoryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  thicknessWeight: string;
  bestUsesEn: string[];
  bestUsesAr: string[];
  durabilityEn: string;
  durabilityAr: string;
  printTechniqueEn: string;
  printTechniqueAr: string;
  finishOptionsEn: string[];
  finishOptionsAr: string[];
  relatedProductIds: string[];
}

export interface PortfolioProject {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'corporate' | 'weddings' | 'sebou3' | 'giveaways' | 'decor';
  categoryLabelEn: string;
  categoryLabelAr: string;
  image: string;
  clientEn: string;
  clientAr: string;
  occasionEn: string;
  occasionAr: string;
  turnaroundEn: string;
  turnaroundAr: string;
  materialsEn: string[];
  materialsAr: string[];
  descriptionEn: string;
  descriptionAr: string;
  deliverablesEn: string[];
  deliverablesAr: string[];
}

export interface QuotationRequest {
  id: string;
  date: string;
  category: CategoryId;
  itemSelection: string;
  quantity: number;
  materialChoice?: string;
  finishingChoice?: string;
  occasionType?: string;
  customNamesDate?: string;
  colorTheme?: string;
  scentChoice?: string;
  setupItems?: string[];
  hasArtwork: 'yes' | 'need_design' | 'have_draft';
  uploadedDesign?: UploadedDesign | null;
  eventDate?: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  notes?: string;
  estimatedTotalMinEGP: number;
  estimatedTotalMaxEGP: number;
  status: QuoteStatus;
}

export interface InquiryMessage {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  message: string;
  source: 'whatsapp_widget' | 'contact_form' | 'quick_inquiry';
  status: 'unread' | 'replied';
}
