import { X, CheckCircle2, Clock, ShieldCheck, IndianRupee, ArrowRight, MapPin, Globe } from 'lucide-react';
import { Destination } from '../types';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onApply: (destinationId: string) => void;
}

export function DestinationDetailModal({
  destination,
  onClose,
  onApply
}: DestinationDetailModalProps) {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] dark:bg-[#0b1320] border border-[#2d2d2d]/15 dark:border-white/15 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col text-[#2d2d2d] dark:text-[#f8fafc] transition-colors">
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] dark:bg-[#070c14] border-b border-[#2d2d2d]/10 dark:border-white/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b8860b] dark:text-[#d4af37] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.category} Consular Hub</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] dark:text-[#f8fafc] font-bold mt-1">
              {destination.name} Consular Guidelines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#2d2d2d]/60 dark:text-slate-400 hover:text-[#2d2d2d] dark:hover:text-white rounded-full hover:bg-[#2d2d2d]/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 flex-grow">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 dark:text-slate-400 font-semibold mb-2">
              Country Overview
            </h4>
            <p className="text-sm sm:text-base text-[#4a3c31] dark:text-slate-300 leading-relaxed font-light">
              {destination.description}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#f5f5dc] dark:bg-[#101b2d] p-4 rounded-sm border border-[#2d2d2d]/10 dark:border-white/10">
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#b8860b] dark:text-[#d4af37]" /> Wait Time
              </span>
              <span className="font-serif text-base font-bold text-[#2d2d2d] dark:text-white block mt-0.5">
                {destination.averageProcessingTime}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#b8860b] dark:text-[#d4af37]" /> Historical Approval
              </span>
              <span className="font-serif text-base font-bold text-[#b8860b] dark:text-[#d4af37] block mt-0.5">
                {destination.successRate}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#2d2d2d]/60 dark:text-slate-400 flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-[#b8860b] dark:text-[#d4af37]" /> Proof of Funds
              </span>
              <span className="font-serif text-base font-bold text-[#2d2d2d] dark:text-white block mt-0.5">
                {destination.financialProof}
              </span>
            </div>
          </div>

          {/* Visa Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 dark:text-slate-400 font-semibold mb-3">
              Popular Visa Classes & Programs:
            </h4>
            <div className="flex flex-wrap gap-2">
              {destination.popularVisas.map((v, idx) => (
                <span
                  key={idx}
                  className="bg-[#f5f5dc] dark:bg-[#101b2d] border border-[#2d2d2d]/15 dark:border-white/15 text-xs text-[#2d2d2d] dark:text-slate-200 px-3.5 py-1.5 rounded-full font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Key Requirements */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 dark:text-slate-400 font-semibold mb-3">
              Essential Filing Requirements:
            </h4>
            <div className="space-y-2">
              {destination.keyRequirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#2d2d2d] dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f5f5dc] dark:bg-[#070c14] border-t border-[#2d2d2d]/10 dark:border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-[#2d2d2d]/30 dark:border-white/20 text-[#2d2d2d] dark:text-slate-200 py-2.5 px-5 text-xs uppercase tracking-widest font-semibold hover:bg-[#2d2d2d]/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onApply(destination.id);
            }}
            className="bg-[#b8860b] dark:bg-[#d4af37] text-white dark:text-[#070c14] py-2.5 px-6 text-xs uppercase tracking-widest font-bold hover:bg-[#9a7009] dark:hover:bg-[#c39b2e] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply for {destination.name} Visa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
