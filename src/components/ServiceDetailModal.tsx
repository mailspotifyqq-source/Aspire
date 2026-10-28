import React from 'react';
import { X, CheckCircle2, Clock, IndianRupee, FileCheck, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { VisaService } from '../types';

interface ServiceDetailModalProps {
  service: VisaService | null;
  onClose: () => void;
  onApply: (categoryTitle: string) => void;
}

export function ServiceDetailModal({ service, onClose, onApply }: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] dark:bg-[#0b1320] border border-[#2d2d2d]/15 dark:border-white/15 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col text-[#2d2d2d] dark:text-[#f8fafc] transition-colors">
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] dark:bg-[#070c14] border-b border-[#2d2d2d]/10 dark:border-white/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#b8860b] dark:text-[#d4af37] font-bold block">
              {service.category} Visa Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] dark:text-[#f8fafc] font-bold mt-1">
              {service.title}
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
              Overview & Scope
            </h4>
            <p className="text-sm sm:text-base text-[#4a3c31] dark:text-slate-300 leading-relaxed font-light">
              {service.fullDesc}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f5f5dc] dark:bg-[#101b2d] p-4 rounded-sm border border-[#2d2d2d]/10 dark:border-white/10">
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#b8860b] dark:text-[#d4af37]" /> Typical Duration
              </span>
              <span className="font-serif text-base font-bold text-[#2d2d2d] dark:text-white block mt-0.5">
                {service.processingTime}
              </span>
            </div>
            {service.estimatedFee && (
              <div>
                <span className="text-[11px] text-[#2d2d2d]/60 dark:text-slate-400 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-[#b8860b] dark:text-[#d4af37]" /> Price
                </span>
                <span className="font-serif text-base font-bold text-[#2d2d2d] dark:text-white block mt-0.5">
                  {service.estimatedFee}
                </span>
              </div>
            )}
            <div>
              <span className="text-[11px] text-[#2d2d2d]/60 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#b8860b] dark:text-[#d4af37]" /> Validity Window
              </span>
              <span className="font-serif text-base font-bold text-[#b8860b] dark:text-[#d4af37] block mt-0.5">
                {service.validity}
              </span>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 dark:text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37]" /> Primary Required Documents Checklist:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.requiredDocuments.map((req, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#f5f5dc] dark:bg-[#101b2d] p-3 rounded-xs text-xs text-[#2d2d2d] dark:text-slate-200 border border-transparent dark:border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#b8860b] dark:text-[#d4af37] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#2d2d2d]/70 dark:text-slate-400 font-semibold mb-2">
              Key Eligibility Benchmarks:
            </h4>
            <div className="space-y-1.5">
              {service.eligibilityPoints.map((pt, i) => (
                <div key={i} className="text-xs text-[#4a3c31] dark:text-slate-300 font-light flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b] dark:bg-[#d4af37]" />
                  <span>{pt}</span>
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
              onApply(service.title);
            }}
            className="bg-[#b8860b] dark:bg-[#d4af37] text-white dark:text-[#070c14] py-2.5 px-6 text-xs uppercase tracking-widest font-bold hover:bg-[#9a7009] dark:hover:bg-[#c39b2e] transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
