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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] border-b border-[#2d2d2d]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b8860b] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.category} Consular Hub</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] font-bold mt-1">
              {destination.name} Consular Guidelines
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#2d2d2d]/60 hover:text-[#2d2d2d] rounded-full hover:bg-[#2d2d2d]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6 flex-grow">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 font-semibold mb-2">
              Country Overview
            </h4>
            <p className="text-sm sm:text-base text-[#4a3c31] leading-relaxed font-light">
              {destination.description}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#f5f5dc] p-4 rounded-sm border border-[#2d2d2d]/10">
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#b8860b]" /> Wait Time
              </span>
              <span className="font-serif text-base font-bold text-[#2d2d2d] block mt-0.5">
                {destination.averageProcessingTime}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#b8860b]" /> Historical Approval
              </span>
              <span className="font-serif text-base font-bold text-[#b8860b] block mt-0.5">
                {destination.successRate}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#2d2d2d]/60 flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-[#b8860b]" /> Proof of Funds
              </span>
              <span className="font-serif text-base font-bold text-[#2d2d2d] block mt-0.5">
                {destination.financialProof}
              </span>
            </div>
          </div>

          {/* Visa Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 font-semibold mb-3">
              Popular Visa Classes & Programs:
            </h4>
            <div className="flex flex-wrap gap-2">
              {destination.popularVisas.map((v, idx) => (
                <span
                  key={idx}
                  className="bg-[#f5f5dc] border border-[#2d2d2d]/15 text-xs text-[#2d2d2d] px-3.5 py-1.5 rounded-full font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Key Requirements */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 font-semibold mb-3">
              Essential Filing Requirements:
            </h4>
            <div className="space-y-2">
              {destination.keyRequirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#2d2d2d]">
                  <CheckCircle2 className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f5f5dc] border-t border-[#2d2d2d]/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-[#2d2d2d]/30 text-[#2d2d2d] py-2.5 px-5 text-xs uppercase tracking-widest font-semibold hover:bg-[#2d2d2d]/5 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onApply(destination.id);
            }}
            className="bg-[#b8860b] text-white py-2.5 px-6 text-xs uppercase tracking-widest font-semibold hover:bg-[#9a7009] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Apply for {destination.name} Visa</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
