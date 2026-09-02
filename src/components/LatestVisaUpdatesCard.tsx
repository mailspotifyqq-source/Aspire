import { useState, useEffect, MouseEvent } from 'react';
import { Sparkles, ArrowRight, ChevronRight, ChevronLeft, Bell } from 'lucide-react';
import { VISA_NEWS_DATA } from '../data/visaNewsData';

interface LatestVisaUpdatesCardProps {
  onOpenUpdates: () => void;
  className?: string;
}

export function LatestVisaUpdatesCard({
  onOpenUpdates,
  className = ''
}: LatestVisaUpdatesCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const topNews = VISA_NEWS_DATA.slice(0, 5);
  const currentItem = topNews[currentIndex] || topNews[0];

  // Auto rotate updates every 6 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topNews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, topNews.length]);

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % topNews.length);
  };

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + topNews.length) % topNews.length);
  };

  return (
    <div
      aria-label="Latest Visa & Immigration Updates"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`max-w-[315px] sm:max-w-[330px] w-full bg-[#fffdd0]/95 backdrop-blur-md border border-[#b8860b]/35 p-3.5 sm:p-4 rounded-sm shadow-xl transition-all duration-300 pointer-events-auto hover:border-[#b8860b] hover:shadow-2xl ${className}`}
    >
      {/* Top Header with Live Indicator */}
      <div className="flex items-center justify-between gap-2 border-b border-[#2d2d2d]/10 pb-2.5 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#2d2d2d] flex items-center gap-1">
            <span>Latest Visa Updates</span>
          </h3>
          <span className="px-1.5 py-0.2 rounded-xs bg-[#22c55e]/15 text-[#15803d] text-[9px] font-bold uppercase tracking-widest border border-[#22c55e]/30">
            Live
          </span>
        </div>

        {/* Carousel indicator & micro buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#2d2d2d]/50 font-mono">
            {currentIndex + 1}/{topNews.length}
          </span>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous update"
            className="p-0.5 text-[#2d2d2d]/50 hover:text-[#b8860b] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next update"
            className="p-0.5 text-[#2d2d2d]/50 hover:text-[#b8860b] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured News Preview */}
      <div
        onClick={onOpenUpdates}
        className="cursor-pointer group select-none block"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{currentItem.flag}</span>
            <span className="text-[10px] font-bold text-[#b8860b] uppercase tracking-wider">
              {currentItem.country} • {currentItem.category}
            </span>
          </div>
          <span className="text-[9px] text-[#2d2d2d]/50 font-mono">
            {currentItem.date}
          </span>
        </div>

        <h4 className="font-serif font-bold text-xs sm:text-[13px] text-[#2d2d2d] leading-snug group-hover:text-[#b8860b] transition-colors line-clamp-2 mb-1.5">
          {currentItem.title}
        </h4>

        <p className="text-[11px] text-[#4a3c31]/80 leading-relaxed line-clamp-2 mb-3 font-light">
          {currentItem.summary}
        </p>
      </div>

      {/* Explore Button */}
      <button
        id="explore-latest-visa-updates-btn"
        type="button"
        onClick={onOpenUpdates}
        className="w-full bg-[#b8860b] hover:bg-[#9a7009] active:scale-[0.99] text-white text-[11px] font-semibold py-2 px-3 rounded-none shadow-xs flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer transition-all duration-200 group"
      >
        <span>Explore Latest Updates</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
