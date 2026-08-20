import React from 'react';
import { X, CheckCircle2, Clock, DollarSign, FileCheck, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { VisaService } from '../types';

interface ServiceDetailModalProps {
  service: VisaService | null;
  onClose: () => void;
  onApply: (categoryTitle: string) => void;
}

export function ServiceDetailModal({ service, onClose, onApply }: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] border-b border-[#2d2d2d]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#b8860b] font-bold block">
              {service.category} Visa Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] font-bold mt-1">
              {service.title}
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
              Overview & Scope
            </h4>
            <p className="text-sm sm:text-base text-[#4a3c31] leading-relaxed font-light">
              {service.fullDesc}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f5f5dc] p-4 rounded-sm border border-[#2d2d2d]/10">
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#b8860b]" /> Typical Duration
              </span>
              <span className="font-serif text-base font-bold text-[#2d2d2d] block mt-0.5">
                {service.processingTime}
              </span>
            </div>
            {service.estimatedFee && (
              <div>
                <span className="text-[11px] text-[#2d2d2d]/60 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-[#b8860b]" /> Price
                </span>
                <span className="font-serif text-base font-bold text-[#2d2d2d] block mt-0.5">
                  {service.estimatedFee}
                </span>
              </div>
            )}
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#b8860b]" /> Validity Window
              </span>
              <span className="font-serif text-base font-bold text-[#b8860b] block mt-0.5">
                {service.validity}
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 font-semibold mb-3 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#b8860b]" /> Primary Required Documents Checklist:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.requiredDocuments.map((req, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#f5f5dc] p-3 rounded-xs text-xs text-[#2d2d2d]">
                  <CheckCircle2 className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 font-semibold mb-2">
              Key Eligibility Benchmarks:
            </h4>
            <div className="space-y-1.5">
              {service.eligibilityPoints.map((pt, i) => (
                <div key={i} className="text-xs text-[#4a3c31] font-light flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
                  <span>{pt}</span>
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
              onApply(service.title);
            }}
            className="bg-[#b8860b] text-white py-2.5 px-6 text-xs uppercase tracking-widest font-semibold hover:bg-[#9a7009] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Start Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
