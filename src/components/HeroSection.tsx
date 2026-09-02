import { ArrowRight, PhoneCall, ShieldCheck, Clock, Award } from 'lucide-react';
import { EarthCanvas } from './EarthCanvas';
import { Destination } from '../types';

interface HeroSectionProps {
  onStartJourney: () => void;
  onTalkToExpert: () => void;
  onSelectDestination?: (id: string) => void;
  onOpenAssessment?: (destinationId?: string) => void;
  onOpenDetailsModal?: (destination: Destination) => void;
  onOpenVisaUpdates?: () => void;
  selectedDestinationId?: string;
}

export function HeroSection({
  onStartJourney,
  onTalkToExpert,
  onSelectDestination,
  onOpenAssessment,
  onOpenDetailsModal,
  onOpenVisaUpdates,
  selectedDestinationId
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[92vh] flex items-center px-6 md:px-12 pt-28 pb-16 bg-[#fffdd0] overflow-hidden"
    >
      {/* 3D Earth Globe Canvas Background & Right Visual */}
      <div className="absolute inset-0 z-0 md:left-1/3 md:inset-y-0 opacity-95 pointer-events-auto">
        {/* Soft edge gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffdd0] via-[#fffdd0]/70 to-transparent z-10 pointer-events-none hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffdd0] via-transparent to-[#fffdd0] z-10 pointer-events-none md:hidden" />
        
        <EarthCanvas
          selectedDestinationId={selectedDestinationId}
          onSelectDestination={onSelectDestination}
          onOpenAssessment={onOpenAssessment}
          onOpenDetailsModal={onOpenDetailsModal}
          onOpenVisaUpdates={onOpenVisaUpdates}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-20 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center pointer-events-none">
        {/* Left Column: Typography and Call to Actions */}
        <div className="md:col-span-7 text-center md:text-left pt-6 md:pt-0 pointer-events-auto">
          {/* Subtle Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-[#f5f5dc] border border-[#b8860b]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#b8860b] uppercase tracking-widest mb-6 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Top Rated Global Visa & Immigration Partner</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#2d2d2d] mb-6 leading-[1.12] italic font-light">
            Your Visa Journey, <br />
            <span className="text-[#b8860b] not-italic font-semibold drop-shadow-xs">
              Simplified.
            </span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#4a3c31]/90 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-light">
            Expert visa guidance for your journey abroad. From choosing the right visa to preparing
            your application, Aspire Travels helps make the process clear, compliant, and stress-free.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full sm:w-auto">
            <button
              id="hero-start-journey-btn"
              onClick={onStartJourney}
              className="bg-[#b8860b] text-white font-sans px-8 py-4 shadow-lg hover:bg-[#9a7009] active:scale-98 transition-all flex items-center justify-center gap-3 uppercase tracking-widest font-semibold text-xs rounded-none cursor-pointer group"
            >
              <span>Start Your Visa Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-talk-expert-btn"
              onClick={onTalkToExpert}
              className="border border-[#2d2d2d]/30 text-[#2d2d2d] bg-transparent backdrop-blur-xs font-sans px-8 py-4 hover:bg-[#2d2d2d]/5 active:scale-98 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-semibold rounded-none cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#b8860b]" />
              <span>Talk to an Expert</span>
            </button>
          </div>

          {/* Value Micro-Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-[#2d2d2d]/10 max-w-lg mx-auto md:mx-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#b8860b] shrink-0" />
              <span className="text-[11px] uppercase tracking-wider text-[#2d2d2d]/70 font-medium">
                100% Pre-Screened
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#b8860b] shrink-0" />
              <span className="text-[11px] uppercase tracking-wider text-[#2d2d2d]/70 font-medium">
                Fast Turnaround
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#b8860b] shrink-0" />
              <span className="text-[11px] uppercase tracking-wider text-[#2d2d2d]/70 font-medium">
                98.8% Approval
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Spacer */}
        <div className="md:col-span-5 h-[280px] md:h-[450px] pointer-events-none" />
      </div>
    </section>
  );
}
