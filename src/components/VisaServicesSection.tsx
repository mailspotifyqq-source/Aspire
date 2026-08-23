import { ArrowRight, Sparkles, FileText, CheckCircle2, Clock } from 'lucide-react';
import { VISA_SERVICES } from '../data/visaData';
import { VisaService } from '../types';

interface VisaServicesSectionProps {
  onSelectService: (service: VisaService) => void;
  onOpenAssessment: (prefillCategory?: string) => void;
}

export function VisaServicesSection({
  onSelectService,
  onOpenAssessment
}: VisaServicesSectionProps) {
  return (
    <section id="services" className="py-20 md:py-28 px-6 md:px-12 bg-[#fffdd0] border-t border-[#2d2d2d]/10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b8860b] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consular Solutions & Expedited Appointments</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2d2d2d] mb-4 italic font-light">
            USA Visa Services
          </h2>
          <p className="font-sans text-base text-[#4a3c31]/80 font-light max-w-xl mx-auto">
            Comprehensive guidance, documentation audit, and priority appointment scheduling for your US consular journey.
          </p>
        </div>

        {/* Compact List Layout (Exact match to design screenshot) */}
        <div className="flex flex-col divide-y divide-[#2d2d2d]/10 border-t border-b border-[#2d2d2d]/10 bg-[#fffdd0]">
          {VISA_SERVICES.map((service) => (
            <div
              key={service.id}
              id={`service-row-${service.id}`}
              onClick={() => onSelectService(service)}
              className="group py-7 sm:py-8 flex items-center justify-between hover:bg-[#fafad2]/80 transition-all px-4 sm:px-6 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12">
                <span className="text-[#b8860b] text-xs font-bold uppercase tracking-widest w-28 shrink-0">
                  {service.category}
                </span>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] group-hover:text-[#b8860b] transition-colors font-medium">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#2d2d2d]/60 mt-1 sm:hidden font-light">
                    {service.shortDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline-block text-xs uppercase tracking-widest text-[#2d2d2d]/50 group-hover:text-[#b8860b] font-medium transition-colors">
                  View Checklist
                </span>
                <div className="w-9 h-9 rounded-full border border-[#2d2d2d]/15 flex items-center justify-center group-hover:border-[#b8860b] group-hover:bg-[#b8860b] text-[#2d2d2d]/60 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1.5 shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Banner */}
        <div className="mt-12 p-6 bg-[#f5f5dc] border border-[#2d2d2d]/10 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-full bg-[#b8860b]/15 text-[#b8860b] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">Not sure which visa applies?</h4>
              <p className="text-xs text-[#2d2d2d]/70 font-light">
                Take our 2-minute personalized visa eligibility assessment.
              </p>
            </div>
          </div>

          <button
            id="services-evaluate-cta-btn"
            onClick={() => onOpenAssessment()}
            className="bg-[#b8860b] hover:bg-[#9a7009] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold shrink-0 transition-colors shadow-sm"
          >
            Start Free Assessment
          </button>
        </div>
      </div>
    </section>
  );
}
