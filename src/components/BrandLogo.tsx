import React from 'react';

export const ASPIRE_LOGO_IMAGE = '/assets/aistudio/Screenshot_2026-10-28_233354_405b2b1c.png';

interface BrandLogoProps {
  className?: string;
  markSize?: number | string;
  showText?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  isDarkTheme?: boolean;
  onClick?: () => void;
}

/**
 * Circular Brand Logo Mark
 * Features the official Aspire Travels logo image inside an elegant circular medallion.
 */
export function BrandLogoMark({
  size = 38,
  className = ''
}: {
  size?: number | string;
  className?: string;
}) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative shrink-0 rounded-full overflow-hidden border-2 border-[#d4af37] bg-[#0b192c] shadow-sm flex items-center justify-center transition-transform duration-300 group-hover/logo-mark:scale-105 ${className}`}
      aria-label="Aspire Travels Logo Mark"
    >
      <img
        src={ASPIRE_LOGO_IMAGE}
        alt="Aspire Travels Logo Mark"
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 rounded-full border border-[#fef08a]/30 pointer-events-none" />
    </div>
  );
}

/**
 * Main Brand Logo Component with Circular Mark & Typography
 */
export function BrandLogo({
  className = '',
  markSize = 38,
  showText = true,
  showSubtitle = true,
  subtitleText = 'Visa & Immigration Consultancy',
  isDarkTheme = false,
  onClick
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Brand Icon Emblem */}
      <div className="relative group/logo-mark shrink-0">
        <BrandLogoMark size={markSize} />
        <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-sm opacity-0 group-hover/logo-mark:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
              isDarkTheme
                ? 'text-white group-hover:text-[#d4af37]'
                : 'text-[#2d2d2d] dark:text-[#f8fafc] group-hover:text-[#b8860b] dark:group-hover:text-[#d4af37]'
            }`}
          >
            Aspire <span className="text-[#b8860b] dark:text-[#d4af37]">Travels</span>
          </span>
          {showSubtitle && (
            <span
              className={`text-[9.5px] uppercase tracking-[0.24em] font-sans font-medium transition-colors ${
                isDarkTheme ? 'text-white/60' : 'text-[#2d2d2d]/60 dark:text-slate-400'
              }`}
            >
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left group flex items-center focus:outline-none"
      >
        {content}
      </button>
    );
  }

  return content;
}
