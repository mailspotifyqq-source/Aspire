import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, FileCheck2, Download, PhoneCall, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DESTINATIONS, VISA_SERVICES } from '../data/visaData';
import { AssessmentFormState } from '../types';

interface VisaAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestinationId?: string;
  initialCategory?: string;
  onBookExpert: () => void;
}

export function VisaAssessmentModal({
  isOpen,
  onClose,
  initialDestinationId,
  initialCategory,
  onBookExpert
}: VisaAssessmentModalProps) {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<AssessmentFormState>({
    destinationId: initialDestinationId || 'usa',
    visaCategory: initialCategory || 'Tourist & Business Visas',
    nationality: 'United States',
    passportValidityMonths: 18,
    purpose: 'Leisure & Tourism',
    employmentStatus: 'Full-time Employed',
    hasPreviousRefusal: false,
    fundsAvailability: '$10,000 – $25,000',
    travelDate: 'Within next 3 months',
    fullName: '',
    email: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseReference, setCaseReference] = useState<string>('');

  if (!isOpen) return null;

  const currentDestination = DESTINATIONS.find((d) => d.id === form.destinationId) || DESTINATIONS[0];

  const handleNext = () => {
    if (step === 3) {
      // Final step submit
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const ref = `ASP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setCaseReference(ref);
        setStep(4);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#b8860b', '#d4c4a8', '#131b2e', '#f5f5dc']
          });
        } catch {
          // fallback
        }
      }, 700);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Compute an eligibility score based on applicant inputs
  const calculateScore = () => {
    let score = 95;
    if (form.hasPreviousRefusal) score -= 8;
    if (form.passportValidityMonths < 6) score -= 15;
    if (form.fundsAvailability === 'Under $5,000') score -= 12;
    if (form.employmentStatus === 'Unemployed') score -= 10;
    return Math.max(68, score);
  };

  const eligibilityScore = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col">
        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] border-b border-[#2d2d2d]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b8860b] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {step} of 4 &bull; Visa Pathway Assessment</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] font-bold mt-1">
              Start Your Visa Journey
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#2d2d2d]/60 hover:text-[#2d2d2d] rounded-full hover:bg-[#2d2d2d]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-4 border-b border-[#2d2d2d]/10 text-center text-xs font-semibold uppercase tracking-wider">
          <div className={`py-2.5 ${step >= 1 ? 'bg-[#b8860b]/15 text-[#b8860b] border-b-2 border-[#b8860b]' : 'text-[#2d2d2d]/40'}`}>
            1. Destination
          </div>
          <div className={`py-2.5 ${step >= 2 ? 'bg-[#b8860b]/15 text-[#b8860b] border-b-2 border-[#b8860b]' : 'text-[#2d2d2d]/40'}`}>
            2. Profile
          </div>
          <div className={`py-2.5 ${step >= 3 ? 'bg-[#b8860b]/15 text-[#b8860b] border-b-2 border-[#b8860b]' : 'text-[#2d2d2d]/40'}`}>
            3. Review
          </div>
          <div className={`py-2.5 ${step >= 4 ? 'bg-[#b8860b]/15 text-[#b8860b] border-b-2 border-[#b8860b]' : 'text-[#2d2d2d]/40'}`}>
            4. Outcome
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 flex-grow">
          {/* STEP 1: Destination & Visa Category */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                  Target Destination Country:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {DESTINATIONS.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setForm({ ...form, destinationId: dest.id })}
                      className={`p-3 text-left border rounded-sm transition-all text-xs flex flex-col justify-between ${
                        form.destinationId === dest.id
                          ? 'border-[#b8860b] bg-[#f5f5dc] text-[#b8860b] font-bold shadow-xs'
                          : 'border-[#2d2d2d]/15 bg-white/60 text-[#2d2d2d] hover:border-[#b8860b]/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-lg">{dest.flag}</span>
                        <span className="font-serif text-base">{dest.name}</span>
                      </div>
                      <span className="text-[10px] text-[#2d2d2d]/60 font-sans uppercase">
                        {dest.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                  Visa Category & Purpose of Travel:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VISA_SERVICES.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setForm({ ...form, visaCategory: srv.title })}
                      className={`p-3.5 text-left border rounded-sm transition-all text-xs ${
                        form.visaCategory === srv.title
                          ? 'border-[#b8860b] bg-[#f5f5dc] font-bold shadow-xs'
                          : 'border-[#2d2d2d]/15 bg-white/60 text-[#2d2d2d] hover:border-[#b8860b]/40'
                      }`}
                    >
                      <span className="text-[10px] uppercase text-[#b8860b] block tracking-wider">
                        {srv.category}
                      </span>
                      <span className="font-serif text-base block text-[#2d2d2d]">{srv.title}</span>
                      <span className="text-[11px] text-[#2d2d2d]/60 font-sans font-light mt-0.5 block line-clamp-1">
                        {srv.shortDesc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                  Anticipated Travel Departure:
                </label>
                <select
                  value={form.travelDate}
                  onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                  className="w-full bg-white border border-[#2d2d2d]/15 p-3 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                >
                  <option value="Urgent (Within 30 Days)">Urgent (Within 30 Days)</option>
                  <option value="Within next 3 months">Within next 3 months</option>
                  <option value="3 to 6 months">3 to 6 months</option>
                  <option value="Flexible / Planning for next year">Flexible / Planning for next year</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Profile & Background */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                    Current Nationality / Passport:
                  </label>
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    placeholder="e.g. India, United States, Canada, Philippines"
                    className="w-full bg-white border border-[#2d2d2d]/15 p-3 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                    Employment / Professional Status:
                  </label>
                  <select
                    value={form.employmentStatus}
                    onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
                    className="w-full bg-white border border-[#2d2d2d]/15 p-3 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                  >
                    <option value="Full-time Employed">Full-time Employed (Corporate / Govt)</option>
                    <option value="Business Owner / Founder">Business Owner / Company Director</option>
                    <option value="Self-Employed / Consultant">Self-Employed / Consultant</option>
                    <option value="University Student">University Student / Graduate</option>
                    <option value="Retired / Independent Investor">Retired / Independent Investor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                    Estimated Available Funds (Liquid Bank Balance):
                  </label>
                  <select
                    value={form.fundsAvailability}
                    onChange={(e) => setForm({ ...form, fundsAvailability: e.target.value })}
                    className="w-full bg-white border border-[#2d2d2d]/15 p-3 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                  >
                    <option value="$10,000 – $25,000">$10,000 – $25,000 (Recommended Standard)</option>
                    <option value="$25,000 – $75,000">$25,000 – $75,000 (High Solvency)</option>
                    <option value="$75,000+">$75,000+ (Executive / Investor Tier)</option>
                    <option value="$5,000 – $10,000">$5,000 – $10,000 (Short Stay Minimum)</option>
                    <option value="Under $5,000">Under $5,000 (May need Co-Sponsor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                    Passport Validity Remaining:
                  </label>
                  <select
                    value={form.passportValidityMonths}
                    onChange={(e) => setForm({ ...form, passportValidityMonths: Number(e.target.value) })}
                    className="w-full bg-white border border-[#2d2d2d]/15 p-3 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                  >
                    <option value={24}>2+ Years remaining (Optimal)</option>
                    <option value={12}>1 Year remaining</option>
                    <option value={6}>6 Months remaining (Borderline)</option>
                    <option value={3}>Less than 6 months (Renewal recommended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                  Have you had any previous visa refusals for any country?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#2d2d2d] cursor-pointer">
                    <input
                      type="radio"
                      name="refusal"
                      checked={!form.hasPreviousRefusal}
                      onChange={() => setForm({ ...form, hasPreviousRefusal: false })}
                      className="text-[#b8860b] focus:ring-[#b8860b]"
                    />
                    <span>No prior refusals (Clean record)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#2d2d2d] cursor-pointer">
                    <input
                      type="radio"
                      name="refusal"
                      checked={form.hasPreviousRefusal}
                      onChange={() => setForm({ ...form, hasPreviousRefusal: true })}
                      className="text-[#b8860b] focus:ring-[#b8860b]"
                    />
                    <span>Yes, I have had a previous refusal</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Algorithmic Review & Contact Submission */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Algorithmic Assessment Card */}
              <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-6 rounded-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#b8860b] font-bold">
                      Automated Pre-Screen Assessment
                    </span>
                    <h4 className="font-serif text-2xl text-[#2d2d2d] font-bold">
                      {currentDestination.name} &bull; {form.visaCategory}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-serif text-[#b8860b] font-bold">
                      {eligibilityScore}%
                    </span>
                    <span className="text-[10px] text-[#2d2d2d]/60 block uppercase font-medium">
                      Estimated Approval Match
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#2d2d2d]/80 pt-3 border-t border-[#2d2d2d]/10">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Valid destination pathway with established precedent and legal framework.</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Average consular turnaround: {currentDestination.averageProcessingTime}</span>
                  </div>
                  {form.hasPreviousRefusal && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Note: Previous refusal requires a bespoke Legal Addendum Brief.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information to receive docket */}
              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">
                  Where should we dispatch your official Case Dossier & Checklist?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2d2d2d] mb-1">
                      Full Legal Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Johnathan Smith"
                      className="w-full bg-white border border-[#2d2d2d]/15 p-2.5 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2d2d2d] mb-1">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-white border border-[#2d2d2d]/15 p-2.5 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2d2d2d] mb-1">
                      Phone / WhatsApp:
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-[#2d2d2d]/15 p-2.5 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Actionable Next Steps */}
          {step === 4 && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#b8860b]/15 text-[#b8860b] flex items-center justify-center mx-auto">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#b8860b] font-bold block mb-1">
                  Application File Registered &bull; {caseReference}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#2d2d2d] font-bold mb-3">
                  Your Visa Assessment Is Ready!
                </h3>
                <p className="text-xs sm:text-sm text-[#4a3c31] max-w-lg mx-auto font-light leading-relaxed">
                  We have mapped your profile against the latest consular benchmarks for{' '}
                  <span className="font-semibold text-[#2d2d2d]">{currentDestination.name}</span>. An immigration advisor has been assigned to your case file.
                </p>
              </div>

              {/* Summary Action Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-5 rounded-sm">
                  <h4 className="font-serif text-base font-bold text-[#2d2d2d] mb-2 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-[#b8860b]" /> Document Checklist
                  </h4>
                  <p className="text-xs text-[#4a3c31] font-light mb-3">
                    Download our verified embassy document checklist customized for your travel date.
                  </p>
                  <button
                    onClick={() => {
                      alert(`Case ${caseReference} Document Checklist Downloaded!`);
                    }}
                    className="text-xs text-[#b8860b] font-semibold uppercase tracking-wider hover:underline"
                  >
                    Download PDF Package &rarr;
                  </button>
                </div>

                <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-5 rounded-sm">
                  <h4 className="font-serif text-base font-bold text-[#2d2d2d] mb-2 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-[#b8860b]" /> 1-on-1 Strategy Call
                  </h4>
                  <p className="text-xs text-[#4a3c31] font-light mb-3">
                    Speak directly with an accredited attorney to review your proof of funds and cover letter.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onBookExpert();
                    }}
                    className="text-xs text-[#b8860b] font-semibold uppercase tracking-wider hover:underline"
                  >
                    Book Legal Session &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-[#f5f5dc] border-t border-[#2d2d2d]/10 flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#2d2d2d]/70 hover:text-[#2d2d2d]"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting || (step === 3 && (!form.fullName || !form.email))}
              className="bg-[#b8860b] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#9a7009] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <span>{step === 3 ? (isSubmitting ? 'Generating File...' : 'Generate Case Dossier') : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="bg-[#2d2d2d] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors"
            >
              Close Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
