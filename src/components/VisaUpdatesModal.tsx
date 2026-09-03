import { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Gavel,
  Ban
} from 'lucide-react';
import { VISA_NEWS_DATA, VisaNewsItem } from '../data/visaNewsData';

interface VisaUpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export function VisaUpdatesModal({
  isOpen,
  onClose,
  onOpenConsultation
}: VisaUpdatesModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(VISA_NEWS_DATA[0]?.id || null);

  const filteredNews = useMemo(() => {
    return VISA_NEWS_DATA.filter((item) => {
      const matchesCountry = selectedCountry === 'all' || item.countryCode === selectedCountry;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCountry && matchesSearch;
    });
  }, [selectedCountry, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visa-updates-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-[#0b192c]/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#fffdd0] text-[#2d2d2d] rounded-sm border border-[#b8860b]/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Luxury Header */}
        <div className="bg-[#0b192c] text-[#fffdd0] px-5 sm:px-8 py-5 border-b border-[#b8860b]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#b8860b]/20 border border-[#b8860b]/50 flex items-center justify-center text-[#b8860b] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                  Live Consular Feed
                </span>
                <span className="text-white/40 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-white/70 hidden sm:inline font-sans">
                  Updated Live for 2026
                </span>
              </div>
              <h2
                id="visa-updates-title"
                className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#fffdd0] mt-0.5"
              >
                Latest Visa &amp; Immigration Updates
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="close-visa-updates-modal-btn"
            onClick={onClose}
            aria-label="Close updates modal"
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#f5f5dc] border-b border-[#2d2d2d]/10 px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Country Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Updates', flag: '🌐' },
              { id: 'usa', label: 'USA & USCIS', flag: '🇺🇸' },
              { id: 'canada', label: 'Canada IRCC', flag: '🇨🇦' },
              { id: 'schengen', label: 'Europe Schengen', flag: '🇪🇺' },
              { id: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
              { id: 'australia', label: 'Australia', flag: '🇦🇺' }
            ].map((tab) => {
              const active = selectedCountry === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCountry(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#0b192c] text-[#fffdd0] shadow-sm font-semibold'
                      : 'bg-white/70 text-[#2d2d2d]/80 hover:bg-white hover:text-[#2d2d2d] border border-[#2d2d2d]/10'
                  }`}
                >
                  <span>{tab.flag}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#2d2d2d]/40" />
            <input
              type="text"
              placeholder="Search policies or rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#2d2d2d]/20 rounded-full text-xs text-[#2d2d2d] focus:outline-none focus:border-[#b8860b] transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Updates Feed List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-4">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-10 h-10 text-[#b8860b] mx-auto mb-3 opacity-60" />
              <p className="font-serif text-lg font-bold text-[#2d2d2d]">No Bulletins Found</p>
              <p className="text-xs text-[#2d2d2d]/70 mt-1">
                Try adjusting your search criteria or select another destination filter.
              </p>
            </div>
          ) : (
            filteredNews.map((item) => {
              const isExpanded = expandedNewsId === item.id;
              return (
                <article
                  key={item.id}
                  className={`border rounded-sm transition-all duration-200 ${
                    isExpanded
                      ? 'bg-white border-[#b8860b] shadow-md'
                      : 'bg-[#f5f5dc]/70 border-[#2d2d2d]/15 hover:border-[#b8860b]/60 hover:bg-white'
                  }`}
                >
                  {/* Card Header & Summary Trigger */}
                  <div
                    onClick={() => setExpandedNewsId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 cursor-pointer select-none"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.flag}</span>
                        <span className="text-xs font-bold text-[#0b192c] uppercase tracking-wider font-sans">
                          {item.country}
                        </span>
                        <span className="text-[#2d2d2d]/30">•</span>
                        <span className="text-[11px] font-semibold text-[#b8860b] bg-[#b8860b]/10 px-2 py-0.5 rounded-xs">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#2d2d2d]/60 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#b8860b]" />
                          {item.date}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase ${
                            item.badgeType === 'urgent'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : item.badgeType === 'live'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#2d2d2d] leading-snug hover:text-[#b8860b] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#2d2d2d]/80 mt-2 font-light leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#b8860b]">
                      <span className="flex items-center gap-1">
                        {isExpanded ? 'Collapse Full Advisory' : 'Read Full Advisory & Key Requirements'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Full Content Details */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-[#2d2d2d]/10 bg-white/90 animate-in fade-in duration-200">
                      {/* Overview */}
                      <div className="mb-4">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#0b192c] mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
                          Official Policy Context &amp; Background
                        </h4>
                        <p className="text-xs sm:text-sm text-[#2d2d2d]/85 leading-relaxed font-light">
                          {item.fullContent.overview}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div className="mb-4">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-[#0b192c] mb-2">
                          Key Operational Takeaways:
                        </h4>
                        <ul className="space-y-1.5 text-xs text-[#2d2d2d]/85">
                          {item.fullContent.keyPoints.map((pt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#b8860b] shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* What is Affected vs Not Affected Comparison (when available) */}
                      {item.fullContent.comparison ? (
                        <div className="mb-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* What is Affected (Red / Warning) */}
                            <div className="bg-red-50/80 border-2 border-red-200 rounded-sm p-3.5 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1 text-red-700 font-bold text-xs uppercase tracking-wider">
                                  <Ban className="w-4 h-4 text-red-600 shrink-0" />
                                  <span>{item.fullContent.comparison.affectedTitle}</span>
                                </div>
                                <h5 className="font-serif font-bold text-sm text-red-950 mb-2">
                                  {item.fullContent.comparison.affectedSubtitle}
                                </h5>
                                <ul className="space-y-1.5 mb-3 text-xs text-red-900/90">
                                  {item.fullContent.comparison.affectedItems.map((aff, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                                      <span>{aff}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-red-100/90 px-2.5 py-1.5 rounded-xs text-[11px] font-medium text-red-800 border border-red-200">
                                {item.fullContent.comparison.affectedNote}
                              </div>
                            </div>

                            {/* What is NOT Affected (Green / Continuing) */}
                            <div className="bg-emerald-50/80 border-2 border-emerald-200 rounded-sm p-3.5 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>{item.fullContent.comparison.notAffectedTitle}</span>
                                </div>
                                <h5 className="font-serif font-bold text-sm text-emerald-950 mb-2">
                                  {item.fullContent.comparison.notAffectedSubtitle}
                                </h5>
                                <ul className="space-y-1.5 mb-3 text-xs text-emerald-900/90">
                                  {item.fullContent.comparison.notAffectedItems.map((unaff, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                                      <span>{unaff}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-emerald-100/90 px-2.5 py-1.5 rounded-xs text-[11px] font-medium text-emerald-800 border border-emerald-200">
                                {item.fullContent.comparison.notAffectedNote}
                              </div>
                            </div>
                          </div>

                          {/* Recent Legal Context note if present */}
                          {item.fullContent.recentUpdateContext && (
                            <div className="bg-[#0b192c]/5 border border-[#0b192c]/20 p-3 rounded-xs flex items-start gap-2.5 text-xs text-[#2d2d2d]/90">
                              <Gavel className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-[11px] uppercase tracking-wider text-[#0b192c] block mb-0.5">
                                  Judicial Precedent &amp; Court Ruling Context:
                                </span>
                                <p className="text-xs text-[#2d2d2d]/80 leading-relaxed font-light">
                                  {item.fullContent.recentUpdateContext}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Standard Affected Visa Categories Pill List */
                        <div className="mb-4 bg-[#f5f5dc]/70 p-3 rounded-xs border border-[#2d2d2d]/10">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-[#2d2d2d] block mb-1">
                            Affected Visa Categories:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.fullContent.affectedApplicants.map((aff, i) => (
                              <span
                                key={i}
                                className="bg-white border border-[#2d2d2d]/15 text-[11px] text-[#2d2d2d] px-2 py-0.5 rounded-xs"
                              >
                                {aff}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aspire Travels Advisory & Action */}
                      <div className="bg-[#0b192c] text-[#fffdd0] p-3.5 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider block">
                            Aspire Travels Filing Advisory:
                          </span>
                          <p className="text-xs text-[#fffdd0]/90 mt-0.5 leading-relaxed">
                            {item.fullContent.recommendedAction}
                          </p>
                          <span className="text-[10px] text-white/50 block mt-1 font-mono">
                            Source: {item.officialSource}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenConsultation();
                          }}
                          className="bg-[#b8860b] hover:bg-[#9a7009] text-white text-xs font-semibold px-4 py-2 rounded-none whitespace-nowrap shadow-md flex items-center gap-1.5 uppercase tracking-wider cursor-pointer shrink-0 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Get Expert Advice</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-[#f5f5dc] border-t border-[#2d2d2d]/10 px-5 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#2d2d2d]/70 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#b8860b]" />
            <span>Verified against US Department of State, USCIS, IRCC, UKVI &amp; EU Official Portals</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-[#2d2d2d] hover:text-[#b8860b] transition-colors"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
}
