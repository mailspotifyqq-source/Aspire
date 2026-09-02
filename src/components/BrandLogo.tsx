import React from 'react';

interface BrandLogoProps {
  className?: string;
  markSize?: number | string;
  showText?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
  isDarkTheme?: boolean;
  onClick?: () => void;
}

export function BrandLogoMark({
  size = 36,
  className = ''
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Aspire Travels Logo Mark"
    >
      <defs>
        <linearGradient id="blBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b192c" />
          <stop offset="50%" stopColor="#0f2744" />
          <stop offset="100%" stopColor="#06101e" />
        </linearGradient>

        <linearGradient id="blGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#996515" />
          <stop offset="35%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>

        <linearGradient id="blGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        <linearGradient id="blBlueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="blRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.7" />
        </linearGradient>

        <filter id="blShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Circular Badge */}
      <circle cx="256" cy="256" r="248" fill="url(#blBgGrad)" />
      <circle cx="256" cy="256" r="242" fill="none" stroke="url(#blRimGrad)" strokeWidth="4" />

      {/* Subtle Globe Grid Lines */}
      <g opacity="0.22" stroke="#38bdf8" strokeWidth="2.5" fill="none">
        <circle cx="256" cy="256" r="150" />
        <ellipse cx="256" cy="256" rx="150" ry="52" />
        <ellipse cx="256" cy="256" rx="150" ry="105" />
        <ellipse cx="256" cy="256" rx="55" ry="150" />
        <ellipse cx="256" cy="256" rx="105" ry="150" />
        <line x1="106" y1="256" x2="406" y2="256" />
        <line x1="256" y1="106" x2="256" y2="406" />
      </g>

      {/* Flight Orbit Dashed Trajectory */}
      <path
        d="M 115 316 C 120 186, 240 116, 395 141"
        fill="none"
        stroke="url(#blBlueGlow)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="8 6"
        opacity="0.8"
      />

      {/* Main Brand Spire "A" */}
      <g filter="url(#blShadow)">
        {/* Left Wing (Blue Glow) */}
        <path
          d="M 256 92 L 140 372 C 165 368, 195 361, 222 351 L 256 261 L 278 331 C 298 324, 318 318, 338 312 Z"
          fill="url(#blBlueGlow)"
          opacity="0.95"
        />

        {/* Right Wing (Gold Luminous) */}
        <path
          d="M 256 92 L 256 261 L 290 346 C 315 354, 345 364, 372 372 L 256 92 Z"
          fill="url(#blGoldGrad)"
        />

        {/* Central Flight Tip */}
        <path
          d="M 256 71 L 272 131 L 256 118 L 240 131 Z"
          fill="url(#blGoldAccent)"
        />

        {/* Golden Horizon Arc */}
        <path
          d="M 180 296 Q 256 246 332 296 Q 256 266 180 296 Z"
          fill="url(#blGoldGrad)"
        />

        {/* Compass Star at Target Destination */}
        <g transform="translate(375, 126)">
          <circle cx="0" cy="0" r="7" fill="#ffffff" />
          <path
            d="M 0 -28 Q 2 -8 22 0 Q 2 8 0 28 Q -2 8 -22 0 Q -2 -8 0 -28 Z"
            fill="url(#blGoldGrad)"
          />
          <path
            d="M 0 -16 Q 1.5 -5 14 0 Q 1.5 5 0 16 Q -1.5 5 -14 0 Q -1.5 -5 0 -16 Z"
            fill="#ffffff"
          />
        </g>

        {/* Apex Spark */}
        <circle cx="256" cy="92" r="5" fill="#ffffff" />
      </g>
    </svg>
  );
}

export function BrandLogo({
  className = '',
  markSize = 36,
  showText = true,
  showSubtitle = true,
  subtitleText = 'Visa & Immigration Consultancy',
  isDarkTheme = false,
  onClick
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Icon Emblem */}
      <div className="relative group/logo-mark">
        <BrandLogoMark size={markSize} className="transition-transform duration-300 group-hover/logo-mark:scale-105" />
        <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-sm opacity-0 group-hover/logo-mark:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
              isDarkTheme
                ? 'text-white group-hover:text-[#d4af37]'
                : 'text-[#2d2d2d] group-hover:text-[#b8860b]'
            }`}
          >
            Aspire <span className="text-[#b8860b]">Travels</span>
          </span>
          {showSubtitle && (
            <span
              className={`text-[9.5px] uppercase tracking-[0.24em] font-sans font-medium transition-colors ${
                isDarkTheme ? 'text-white/60' : 'text-[#2d2d2d]/60'
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
