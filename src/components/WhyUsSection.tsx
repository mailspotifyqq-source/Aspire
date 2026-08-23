import { ShieldCheck, Cpu, FileCheck, CheckCircle2, Users } from 'lucide-react';

export function WhyUsSection() {
  const pillars = [
    {
      icon: FileCheck,
      title: 'Tri-Tier Document Audit',
      desc: 'Every application undergoes our rigorous three-step quality audit: financial verification, socio-economic ties validation, and consular interview risk scoring before submission.'
    },
    {
      icon: Cpu,
      title: 'AI-Enhanced Eligibility Benchmarking',
      desc: 'We map applicant profiles against thousands of historical consular approvals to identify potential scrutiny areas and proactively remediate evidential gaps.'
    },
    {
      icon: Users,
      title: 'Dedicated Case Director',
      desc: 'You receive a single point of contact who coordinates your entire timeline—from translation and notarization to biometric appointment scheduling and mock interviews.'
    }
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 px-6 md:px-12 bg-[#f5f5dc] border-t border-[#2d2d2d]/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b8860b] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Aspire Standard</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2d2d2d] mb-4 italic font-light">
            Why Aspire Travels
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#4a3c31]/80 font-light max-w-2xl mx-auto">
            Where institutional precision meets personalized high-touch client advisory.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#fffdd0] border border-[#2d2d2d]/10 p-8 rounded-sm hover:border-[#b8860b]/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#b8860b]/10 text-[#b8860b] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2d2d2d] mb-3">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4a3c31]/90 leading-relaxed font-light">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2d2d2d]/10 flex items-center gap-1.5 text-[11px] text-[#b8860b] font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Guaranteed Precision</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight Banner */}
        <div className="bg-[#131b2e] text-[#f5f5dc] p-8 md:p-12 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <span className="text-[#c2a05d] text-xs font-semibold uppercase tracking-widest block mb-2">
              Zero Tolerance For Discrepancies
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold mb-3">
              We Guarantee 100% Pre-Filing Compliance
            </h3>
            <p className="text-xs sm:text-sm text-[#d4c4a8] leading-relaxed font-light max-w-2xl">
              An incomplete itinerary or ambiguous employer certificate can lead to needless delays or formal refusals. Our compliance auditors scrutinize every line of your submission package to ensure airtight conformity with consular requirements.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center">
            <div className="text-center md:text-right">
              <span className="text-4xl sm:text-5xl font-serif text-[#c2a05d] font-bold block">
                98.8%
              </span>
              <span className="text-xs uppercase tracking-widest text-[#d4c4a8] block mt-1">
                Audited Approval Rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
