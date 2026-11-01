/**
 * Centralized Image Asset Mapping
 * Uses public URL paths served from /public/images/ to guarantee universal compatibility
 * across both Node.js (Express server.ts) and client Vite builds without ERR_UNKNOWN_FILE_EXTENSION.
 */

export const IMAGES = {
  heroAtelier: '/images/trendy_hero_atelier_1791875439349.jpg',
  printServices: '/images/trendy_print_services_1791875459940.jpg',
  candleGiveaways: '/images/trendy_candle_giveaways_1791875460402.jpg',
  resinCrafts: '/images/trendy_resin_crafts_1791875461581.jpg',
  eventDecor: '/images/trendy_event_decor_1791875461108.jpg',
  portfolioCorporate: '/images/trendy_portfolio_corporate_1791875484625.jpg',
  portfolioBabyShower: '/images/trendy_portfolio_baby_shower_1791875483703.jpg',
};

/**
 * Universal fallback handler for <img> tags.
 * If any image fails to load, replaces it with a beautiful themed gradient placeholder
 * so the site never shows broken image icons on any domain.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackCategory: string = 'printing'
) => {
  const target = e.currentTarget;
  // Prevent infinite loops if fallback fails
  target.onerror = null;

  // Try public root image path first if src started with /src/
  if (target.src.includes('/src/assets/images/')) {
    const filename = target.src.split('/').pop();
    if (filename) {
      target.src = `/images/${filename}`;
      return;
    }
  }

  // Graceful SVG placeholder with TrenDy EvenTy branding
  const categoryTitles: Record<string, string> = {
    printing: 'TrenDy EvenTy · Printing',
    candles: 'TrenDy EvenTy · Candles',
    resin: 'TrenDy EvenTy · Resin',
    decor: 'TrenDy EvenTy · Event Decor',
    corporate: 'TrenDy EvenTy · Corporate',
    giveaways: 'TrenDy EvenTy · Giveaways',
  };
  const title = categoryTitles[fallbackCategory] || 'TrenDy EvenTy Atelier';

  const svgPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b1559" />
          <stop offset="50%" stop-color="#542879" />
          <stop offset="100%" stop-color="#1e102d" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#bg)"/>
      <circle cx="300" cy="190" r="48" fill="#f59e0b" fill-opacity="0.2"/>
      <path d="M280 205 L300 170 L320 205 Z" fill="#fbbf24"/>
      <text x="300" y="270" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
        ${title}
      </text>
      <text x="300" y="300" font-family="sans-serif" font-size="14" fill="#d8b4fe" text-anchor="middle">
        Work until its done · 01031450254
      </text>
    </svg>
  `)}`;

  target.src = svgPlaceholder;
};
