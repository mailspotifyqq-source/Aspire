import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  Shield,
  FileCheck2,
  Calendar,
  Phone,
  Mail,
  User,
  Users,
  MapPin,
  CheckCircle2,
  Download,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plane,
  Briefcase,
  Search,
  Building2,
  Compass,
  FileText,
  BadgeCheck,
  CreditCard,
  History,
  Fingerprint,
  Loader2
} from 'lucide-react';
import { CanadaPortalState } from '../types';
import { generateCanadaVisaSummaryPDF, GeneratedCanadaPdfResult } from '../utils/canadaPdfGenerator';
import { WHATSAPP_NUMBER, CONTACT_PHONE_RAW } from '../config/contact';

interface CanadaVisaPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

type PortalStep = 'purpose' | 'eligibility' | 'profile' | 'documents' | 'completed';

export function CanadaVisaPortal({
  isOpen,
  onClose,
  onOpenConsultation
}: CanadaVisaPortalProps) {
  const [currentStep, setCurrentStep] = useState<PortalStep>('purpose');

  // Form State
  const [formState, setFormState] = useState<CanadaPortalState>({
    visaService: 'Business & Tourist Visa',
    travelPurpose: 'Tourism & Sightseeing',
    biometricsStatus: 'Need New VFS Biometrics Appointment',
    travelHistory: 'Valid US Visa or Travel to US/UK/Schengen (CAN+ Eligible)',
    employmentStatus: 'Salaried Professional',
    fundsAvailability: '₹7,00,000 – ₹15,00,000',
    fullName: '',
    dateOfBirth: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    city: '',
    state: '',
    country: 'India',
    applicantsCount: 1,
    intendedTravelPeriod: 'Next 3 to 6 Months',
    notes: '',
  });

  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'canplus' | 'biometrics' | 'financials' | 'documents'>('all');

  const [generatedPdf, setGeneratedPdf] = useState(false);
  const [emailSendingStatus, setEmailSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [pdfResult, setPdfResult] = useState<GeneratedCanadaPdfResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Validation
  const validateStep = (step: PortalStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'profile') {
      if (!formState.fullName.trim()) newErrors.fullName = 'Full name as per passport is required';
      if (!formState.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formState.mobileNumber.replace(/\D/g, ''))) {
        newErrors.mobileNumber = 'Please enter a valid 10-digit number';
      }
      if (!formState.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
        newErrors.email = 'Enter a valid email address';
      }
      if (!formState.city.trim()) newErrors.city = 'City is required';
      if (!formState.state.trim()) newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 'purpose') setCurrentStep('eligibility');
    else if (currentStep === 'eligibility') setCurrentStep('profile');
    else if (currentStep === 'profile') {
      if (validateStep('profile')) {
        setCurrentStep('documents');
      }
    } else if (currentStep === 'documents') {
      handleGenerateSummary();
    }
  };

  const handleBack = () => {
    if (currentStep === 'eligibility') setCurrentStep('purpose');
    else if (currentStep === 'profile') setCurrentStep('eligibility');
    else if (currentStep === 'documents') setCurrentStep('profile');
  };

  // Background email dispatch to support@aspiretravels.in via Resend
  const dispatchSummaryEmail = async (pdfData: GeneratedCanadaPdfResult) => {
    setEmailSendingStatus('sending');
    try {
      const response = await fetch('/api/send-canada-visa-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantName: formState.fullName || 'Applicant',
          visaCategory: formState.visaService,
          travelPurpose: formState.travelPurpose,
          biometricsStatus: formState.biometricsStatus,
          travelHistory: formState.travelHistory,
          filename: pdfData.filename,
          pdfBase64: pdfData.base64,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setEmailSendingStatus('sent');
      } else {
        console.warn('[Canada Portal] Background email dispatch status:', data?.error || 'Failed');
        setEmailSendingStatus('failed');
      }
    } catch (err) {
      console.error('[Canada Portal] Error dispatching Canada summary email in background:', err);
      setEmailSendingStatus('failed');
    }
  };

  // Generate PDF & Finalize
  const handleGenerateSummary = () => {
    try {
      const result = generateCanadaVisaSummaryPDF(formState);
      setPdfResult(result);
      setGeneratedPdf(true);
      setCurrentStep('completed');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c41e3a', '#0f172a', '#b8860b', '#ffffff']
      });

      // Automatically dispatch email copy in background
      dispatchSummaryEmail(result);
    } catch (e) {
      console.error('Error generating Canada PDF summary', e);
      setCurrentStep('completed');
    }
  };

  const getWhatsAppMessage = () => {
    const text = `Hello Aspire Consultant Team, I am inquiring about Canada Business & Tourist Visa (Visitor TRV):
- Purpose of Visit: ${formState.travelPurpose}
- Biometrics Status: ${formState.biometricsStatus}
- CAN+ / History: ${formState.travelHistory}
- Applicant: ${formState.fullName || 'Applicant'}
- Contact: ${formState.countryCode} ${formState.mobileNumber || 'Not provided'}
- Location: ${formState.city ? `${formState.city}, ${formState.state}` : 'India'}
- Applicants: ${formState.applicantsCount}

Please assist me with IRCC documentation review and VFS biometrics appointment scheduling.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const getQaWhatsAppUrl = () => {
    const text = formState.fullName
      ? `Hi Aspire Travels, my name is ${formState.fullName}. I have a question regarding Canada Visitor / Business Visa filing, IRCC processing & VFS biometrics.`
      : `Hi Aspire Travels, I have a question regarding Canada Visitor / Business Visa filing & VFS biometrics. Please assist me.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  // Progress Steps list
  const steps: { id: PortalStep; title: string; subtitle: string }[] = [
    { id: 'purpose', title: '1. Travel Purpose', subtitle: 'Trip classification' },
    { id: 'eligibility', title: '2. IRCC & CAN+', subtitle: 'Biometrics & profile' },
    { id: 'profile', title: '3. Applicant Dossier', subtitle: 'Contact & location' },
    { id: 'documents', title: '4. Checklist Review', subtitle: 'Filing readiness' },
    { id: 'completed', title: '5. Summary Ready', subtitle: 'PDF generated' },
  ];

  // Canadian Consular FAQ data
  const faqList = [
    {
      id: 1,
      category: 'canplus',
      question: 'What is the CAN+ Fast-Track Program for Indian Citizens?',
      answer:
        'CAN+ is an expedited processing program by IRCC (Immigration, Refugees and Citizenship Canada) for Indian nationals who have held a Canadian visa in the past 10 years or currently hold a valid US Non-Immigrant Visa. Under CAN+, applicants are exempt from submitting extensive financial paperwork (like IT returns and bank balance statements), and their applications are fast-tracked within days.'
    },
    {
      id: 2,
      category: 'biometrics',
      question: 'Where and how do I give Biometrics for a Canada Visitor Visa in India?',
      answer:
        'Biometrics (digital fingerprints and facial photograph) are collected at authorized VFS Global Canada Visa Application Centres (CVAC) across India, including New Delhi, Mumbai, Chandigarh, Bangalore, Jalandhar, Ahmedabad, Chennai, Hyderabad, Kolkata, and Pune. Once we submit your IRCC application, you receive a Biometric Instruction Letter (BIL), and we book your preferred VFS appointment slot.'
    },
    {
      id: 3,
      category: 'biometrics',
      question: 'How long are Canadian Biometrics valid once completed?',
      answer:
        'Canadian biometrics are valid for 10 full years from the date of enrollment. If you have previously given biometrics for a Canadian Visitor Visa, Study Permit, or Work Permit within the last 10 years, you do not need to repeat the biometric appointment or pay the CAD $85 biometric fee.'
    },
    {
      id: 4,
      category: 'financials',
      question: 'How much minimum bank balance is recommended for a Canada Tourist Visa?',
      answer:
        'IRCC expects proof of sufficient liquid funds to cover your flight tickets, accommodation, living expenses, and emergencies in Canada. For a single traveler on a 2-3 week trip, a maintainable bank balance of ₹4,00,000 to ₹7,00,000 with 6 months of active bank statements and 2-3 years of ITRs is strongly advised.'
    },
    {
      id: 5,
      category: 'documents',
      question: 'What is the validity and duration of stay for a Canada Visitor Visa (TRV)?',
      answer:
        'Canada Temporary Resident Visas (TRV / V-1 / B-1 Entry) are typically issued as Multiple Entry visas valid up to 10 years, or up to the expiry date of your passport, whichever comes first. Each standard entry allows a continuous stay of up to 6 months in Canada.'
    },
    {
      id: 6,
      category: 'documents',
      question: 'Do I need an Invitation Letter from Canada for a Business or Family Visit?',
      answer:
        'Yes. For business trips, an official Invitation Letter from the Canadian host company along with their business registration details and conference agenda is required. For visiting family/relatives, an invitation letter detailing your relationship, host’s Canadian citizenship/PR card, and proof of address in Canada must be included.'
    },
    {
      id: 7,
      category: 'documents',
      question: 'How does Aspire Travels prevent Canada visa refusals under Section 179(b)?',
      answer:
        'The most common reason for Canada visa refusals under Section 179(b) of the IRPR is "doubt that the applicant will leave Canada at the end of their stay". Aspire Travels conducts a meticulous pre-screening of your socio-economic ties to India (property deeds, active employment with approved leave NOC, business assets, and family commitments), along with crafting an airtight Statement of Purpose (SOP).'
    }
  ];

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = activeFaqCategory === 'all' || item.category === activeFaqCategory;
    const matchesSearch =
      faqSearch.trim() === '' ||
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b1320]/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#fffdfa] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e5e0d8] overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col"
        >
          {/* Canadian Luxury Consular Header */}
          <div className="relative bg-gradient-to-r from-[#0b1320] via-[#141e33] to-[#2b0f15] text-white px-5 sm:px-8 py-5 sm:py-6 border-b-2 border-[#c41e3a] shrink-0 overflow-hidden">
            {/* Ambient Maple Glow & Pattern */}
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#c41e3a]/25 via-transparent to-transparent pointer-events-none" />
            <div className="absolute left-1/3 top-0 w-48 h-48 bg-[#b8860b]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c41e3a]/20 border border-[#c41e3a]/40 text-[#fca5a5] text-xs font-semibold uppercase tracking-wider mb-2">
                  <span className="text-base leading-none">🇨🇦</span>
                  <span>Canada Consular Gateway &bull; IRCC Visitor Visa (V-1 / B-1)</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Canada Business & Tourist Visa Portal</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-light">
                  Tailored IRCC application pre-screening, CAN+ fast-track verification, VFS Biometrics scheduling, and verified documentation dossiers.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0 ml-3"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Bar */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-5 gap-1.5 sm:gap-3 text-left">
              {steps.map((st, idx) => {
                const isCurrent = currentStep === st.id;
                const isPast =
                  (currentStep === 'eligibility' && idx === 0) ||
                  (currentStep === 'profile' && idx <= 1) ||
                  (currentStep === 'documents' && idx <= 2) ||
                  (currentStep === 'completed' && idx <= 3);

                return (
                  <div
                    key={st.id}
                    className={`relative pb-1.5 transition-all ${
                      isCurrent
                        ? 'border-b-2 border-[#c41e3a] text-white'
                        : isPast
                        ? 'border-b-2 border-[#b8860b] text-slate-300'
                        : 'border-b-2 border-white/10 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] sm:text-xs font-semibold truncate flex items-center gap-1">
                      {isPast && <CheckCircle2 className="w-3 h-3 text-[#b8860b] shrink-0 inline" />}
                      <span>{st.title}</span>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 hidden md:block truncate">
                      {st.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-gradient-to-b from-[#fffdfa] to-[#fbf8f2]">
            {/* STEP 1: TRAVEL PURPOSE */}
            {currentStep === 'purpose' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                    Step 1 of 4: Trip Classification
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] pt-1">
                    Select Your Travel Purpose for Canada
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Canada exclusively processes Visitor Visas (Temporary Resident Visas - TRV) for tourism, business visits, and family meetings.
                  </p>
                </div>

                {/* Purpose Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {[
                    {
                      id: 'Tourism & Sightseeing',
                      title: 'Tourism & Sightseeing',
                      icon: Compass,
                      badge: 'Most Popular',
                      desc: 'Exploring Banff, Toronto, Vancouver, Niagara Falls, Rocky Mountains, or holiday leisure.',
                      docs: 'Hotel bookings + Travel itinerary + 6M Bank statement'
                    },
                    {
                      id: 'Business Meetings & Conferences',
                      title: 'Business & Conferences',
                      icon: Briefcase,
                      badge: 'Corporate Track',
                      desc: 'Attending business meetings, client visits, trade expos, academic conferences, or corporate negotiations.',
                      docs: 'Canadian Invitation Letter + Company Leave NOC'
                    },
                    {
                      id: 'Visiting Family & Relatives',
                      title: 'Visiting Family & Friends',
                      icon: Users,
                      badge: 'Family Stream',
                      desc: 'Visiting children, parents, siblings, or close friends residing in Canada as PRs or citizens.',
                      docs: 'Host Invitation Letter + Host PR/Citizen Proof'
                    },
                    {
                      id: 'Solo Exploration & Leisure',
                      title: 'Solo & Cultural Travel',
                      icon: Plane,
                      badge: 'Flexible TRV',
                      desc: 'Self-guided photography, nature tours, cultural events, or short-term recreational visits.',
                      docs: 'Proof of ties to India + Strong financial solvency'
                    },
                  ].map((option) => {
                    const isSelected = formState.travelPurpose === option.id;
                    const Icon = option.icon;

                    return (
                      <div
                        key={option.id}
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            travelPurpose: option.id as any,
                          }))
                        }
                        className={`relative p-4 sm:p-5 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#fff5f5] border-[#c41e3a] shadow-md ring-2 ring-[#c41e3a]/25'
                            : 'bg-white border-[#e8e2d8] hover:border-[#c41e3a]/50 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isSelected
                                  ? 'bg-[#c41e3a] text-white shadow-sm'
                                  : 'bg-[#f1f5f9] text-[#0f172a]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#c41e3a] text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {option.badge}
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-base text-[#0f172a]">
                            {option.title}
                          </h3>
                          <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                            {option.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#e2e8f0]/60 flex items-center justify-between text-[11px]">
                          <span className="text-[#64748b] truncate">{option.docs}</span>
                          {isSelected && (
                            <span className="text-[#c41e3a] font-bold flex items-center gap-1 shrink-0 ml-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Travel Group & Timeline Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#0f172a] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#c41e3a]" />
                    <span>Travel Group & Intended Departure Window</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Number of Applicants Traveling Together
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormState((p) => ({ ...p, applicantsCount: num }))}
                            className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                              formState.applicantsCount === num
                                ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                                : 'bg-slate-50 text-[#475569] border-[#cbd5e1] hover:bg-slate-100'
                            }`}
                          >
                            {num === 4 ? '4+ Persons' : `${num} ${num === 1 ? 'Applicant' : 'Applicants'}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                        Intended Travel Period
                      </label>
                      <select
                        value={formState.intendedTravelPeriod}
                        onChange={(e) =>
                          setFormState((p) => ({ ...p, intendedTravelPeriod: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5e1] bg-slate-50 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
                      >
                        <option value="Next 1 to 2 Months (Priority Processing)">Next 1 to 2 Months (Priority Filing)</option>
                        <option value="Next 3 to 6 Months">Next 3 to 6 Months (Recommended)</option>
                        <option value="6 to 12 Months Ahead">6 to 12 Months Ahead</option>
                        <option value="Flexible / Dates Not Fixed Yet">Flexible / Dates Not Fixed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ELIGIBILITY & CAN+ & BIOMETRICS */}
            {currentStep === 'eligibility' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                    Step 2 of 4: Consular Eligibility & Biometrics
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] pt-1">
                    Biometrics & CAN+ Fast-Track Pre-Screening
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Canada offers expedited filing for US visa holders and individuals with prior biometric enrollment.
                  </p>
                </div>

                {/* CAN+ Highlight Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fef2f2] via-[#fff1f2] to-[#fffbeb] border border-[#fecdd3] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#c41e3a] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#991b1b] uppercase tracking-wide">
                      CAN+ Fast-Track Eligibility Check
                    </div>
                    <p className="text-xs text-[#4c0519] leading-relaxed">
                      If you hold a valid <strong>USA Visa</strong> or traveled to the US/UK/Schengen in the last 10 years, IRCC fast-tracks your application with simplified financial requirements!
                    </p>
                  </div>
                </div>

                {/* 1. Travel History / CAN+ Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                    1. Travel History & Prior Visas
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'Valid US Visa or Travel to US/UK/Schengen (CAN+ Eligible)',
                        title: 'CAN+ Fast-Track',
                        badge: 'Accelerated',
                        desc: 'Hold valid US Visa OR visited US/UK/Schengen in last 10 yrs.',
                      },
                      {
                        id: 'Other International Travel',
                        title: 'Other Countries',
                        badge: 'Standard',
                        desc: 'Visited Dubai, Singapore, Thailand, Malaysia, etc.',
                      },
                      {
                        id: 'Fresh Passport / First International Trip',
                        title: 'First International Trip',
                        badge: 'Strong SOP Needed',
                        desc: 'Fresh Indian passport with no prior international stamps.',
                      },
                    ].map((opt) => {
                      const isSel = formState.travelHistory === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            setFormState((p) => ({ ...p, travelHistory: opt.id as any }))
                          }
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSel
                              ? 'bg-[#fff5f5] border-[#c41e3a] shadow-xs ring-2 ring-[#c41e3a]/20'
                              : 'bg-white border-[#e2e8f0] hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-[#0f172a]">{opt.title}</span>
                              <span
                                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                                  isSel ? 'bg-[#c41e3a] text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#64748b] leading-relaxed">{opt.desc}</p>
                          </div>
                          {isSel && (
                            <div className="mt-3 text-[10px] font-bold text-[#c41e3a] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Biometrics Status */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                    2. Canada Biometrics Status (VFS Global)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'Valid (Given in last 10 years)',
                        title: 'Already Given',
                        badge: 'Valid 10 Yrs',
                        desc: 'Biometrics enrolled for Canada within the past 10 years (Fee exempt).',
                      },
                      {
                        id: 'Need New VFS Biometrics Appointment',
                        title: 'Need Appointment',
                        badge: 'VFS Booking',
                        desc: 'Will attend VFS Global centre in India after IRCC submission.',
                      },
                      {
                        id: 'Unsure / First Time Applicant',
                        title: 'Unsure / First Time',
                        badge: 'Advisory Check',
                        desc: 'Aspire team will check IRCC biometric validity database for you.',
                      },
                    ].map((opt) => {
                      const isSel = formState.biometricsStatus === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            setFormState((p) => ({ ...p, biometricsStatus: opt.id as any }))
                          }
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSel
                              ? 'bg-[#fff5f5] border-[#c41e3a] shadow-xs ring-2 ring-[#c41e3a]/20'
                              : 'bg-white border-[#e2e8f0] hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-[#0f172a]">{opt.title}</span>
                              <span
                                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                                  isSel ? 'bg-[#c41e3a] text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#64748b] leading-relaxed">{opt.desc}</p>
                          </div>
                          {isSel && (
                            <div className="mt-3 text-[10px] font-bold text-[#c41e3a] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Employment & Ties + Funds */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-[#e8e2d8] space-y-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#c41e3a]" />
                      <span>Employment / Occupation in India</span>
                    </label>
                    <select
                      value={formState.employmentStatus}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, employmentStatus: e.target.value as any }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-slate-50 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
                    >
                      <option value="Salaried Professional">Salaried Professional (MNC / Corporate / Govt)</option>
                      <option value="Business Owner / Self-Employed">Business Owner / Proprietor / Director</option>
                      <option value="Student / Freelancer">Student / Freelance Professional</option>
                      <option value="Retired">Retired / Homemaker / Dependent</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#e8e2d8] space-y-2">
                    <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#c41e3a]" />
                      <span>Estimated Available Liquid Funds</span>
                    </label>
                    <select
                      value={formState.fundsAvailability}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, fundsAvailability: e.target.value as any }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-slate-50 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
                    >
                      <option value="₹4,00,000 – ₹7,00,000">₹4,00,000 – ₹7,00,000 (Adequate for 2-3 Wks)</option>
                      <option value="₹7,00,000 – ₹15,00,000">₹7,00,000 – ₹15,00,000 (Recommended)</option>
                      <option value="₹15,00,000+">₹15,00,000+ (High Net-Worth / Family Group)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: APPLICANT DOSSIER & CONTACT */}
            {currentStep === 'profile' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                    Step 3 of 4: Applicant Dossier & Contact Profile
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] pt-1">
                    Primary Applicant Information
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Enter your details exactly as shown on your Indian passport for official consular dossier generation.
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
                  {/* Full Name & DOB */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        Full Name (As printed on Passport) <span className="text-[#c41e3a]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Rajesh Kumar Sharma"
                          value={formState.fullName}
                          onChange={(e) =>
                            setFormState((p) => ({ ...p, fullName: e.target.value }))
                          }
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
                            errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-[#cbd5e1]'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          value={formState.dateOfBirth}
                          onChange={(e) =>
                            setFormState((p) => ({ ...p, dateOfBirth: e.target.value }))
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        Mobile Number (WhatsApp Enabled) <span className="text-[#c41e3a]">*</span>
                      </label>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-3 rounded-xl border border-[#cbd5e1] bg-slate-50 text-xs font-bold text-slate-600 shrink-0">
                          {formState.countryCode}
                        </span>
                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            placeholder="9876543210"
                            value={formState.mobileNumber}
                            onChange={(e) =>
                              setFormState((p) => ({
                                ...p,
                                mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                              }))
                            }
                            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
                              errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-[#cbd5e1]'
                            }`}
                          />
                        </div>
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.mobileNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        Email Address <span className="text-[#c41e3a]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="rajesh.sharma@example.com"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState((p) => ({ ...p, email: e.target.value }))
                          }
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
                            errors.email ? 'border-red-500 bg-red-50/50' : 'border-[#cbd5e1]'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        City of Residence (India) <span className="text-[#c41e3a]">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. New Delhi / Mumbai / Chandigarh"
                          value={formState.city}
                          onChange={(e) =>
                            setFormState((p) => ({ ...p, city: e.target.value }))
                          }
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
                            errors.city ? 'border-red-500 bg-red-50/50' : 'border-[#cbd5e1]'
                          }`}
                        />
                      </div>
                      {errors.city && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        State <span className="text-[#c41e3a]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi NCR / Maharashtra / Punjab"
                        value={formState.state}
                        onChange={(e) =>
                          setFormState((p) => ({ ...p, state: e.target.value }))
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
                          errors.state ? 'border-red-500 bg-red-50/50' : 'border-[#cbd5e1]'
                        }`}
                      />
                      {errors.state && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Specific Inquiries or Group Details (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Traveling with spouse & child; need Canadian conference invitation verification..."
                      value={formState.notes || ''}
                      onChange={(e) => setFormState((p) => ({ ...p, notes: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#cbd5e1] text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: DOCUMENT CHECKLIST REVIEW */}
            {currentStep === 'documents' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                    Step 4 of 4: IRCC Checklist & Verification
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] pt-1">
                    Canada Visitor Visa Document Checklist
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Review the mandatory document requirements prepared for your profile before generating your summary.
                  </p>
                </div>

                {/* Live Checklist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      title: 'Original Passport',
                      desc: 'Valid for minimum 6 months beyond travel dates with at least 2 blank visa pages.',
                      status: 'Mandatory',
                    },
                    {
                      title: 'IRCC Application Forms',
                      desc: 'IMM 5257 (Application for TRV) & IMM 5645 (Family Information Form).',
                      status: 'Aspire Prepares',
                    },
                    {
                      title: 'Proof of Financial Solvency',
                      desc: '6 months bank statements with bank seal & 2-3 years Income Tax Returns (ITR-V).',
                      status: 'Mandatory',
                    },
                    {
                      title: 'Employment & Leave NOC',
                      desc: 'Official company letterhead approving leave dates, or Business Registration / GST certificate.',
                      status: 'Mandatory',
                    },
                    {
                      title: 'Purpose & Accommodation',
                      desc: 'Day-wise travel itinerary with confirmed hotel bookings OR Business Invitation Letter from Canada.',
                      status: 'Provided by Applicant/Host',
                    },
                    {
                      title: 'Proof of Ties to India',
                      desc: 'Property ownership documents, family ties, and continuous employment records to satisfy Section 179(b).',
                      status: 'Critical Pre-Screening',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#c41e3a]/10 text-[#c41e3a] flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs text-[#0f172a]">{item.title}</h4>
                          <span className="text-[9px] font-semibold text-[#c41e3a] bg-[#c41e3a]/10 px-2 py-0.5 rounded">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748b] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Snapshot Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-[#cbd5e1] space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-[#c41e3a]" />
                    <span>Dossier Overview Summary</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[#64748b] block text-[11px]">Applicant:</span>
                      <strong className="text-[#0f172a] truncate block">{formState.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748b] block text-[11px]">Travel Purpose:</span>
                      <strong className="text-[#0f172a] truncate block">{formState.travelPurpose}</strong>
                    </div>
                    <div>
                      <span className="text-[#64748b] block text-[11px]">CAN+ Track:</span>
                      <strong className="text-[#0f172a] truncate block">
                        {formState.travelHistory.includes('CAN+') ? 'Eligible' : 'Standard'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#64748b] block text-[11px]">Biometrics:</span>
                      <strong className="text-[#0f172a] truncate block">{formState.biometricsStatus}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: COMPLETED & SUMMARY READY */}
            {currentStep === 'completed' && (
              <div className="space-y-6 max-w-2xl mx-auto text-center py-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#c41e3a] to-[#ef4444] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#c41e3a]/25">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                    Dossier Assessment Ready
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                    Your Canada Visa Summary is Ready
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto">
                    Your personalized Canada Business & Tourist Visa summary has been compiled and downloaded to your device.
                  </p>
                </div>

                {/* PDF Re-download card */}
                <div className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] max-w-lg mx-auto text-left flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#c41e3a]/15 text-[#c41e3a] flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0f172a] truncate">
                        {pdfResult?.filename ||
                          `Aspire Travel Canada Visa Summary_${(formState.fullName || 'Applicant')
                            .trim()
                            .replace(/[\\/:*?"<>|]/g, '') || 'Applicant'}.pdf`}
                      </div>
                      <div className="text-[11px] text-[#64748b]">
                        PDF Document &bull; Official Aspire Travels Canada Summary
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const res = generateCanadaVisaSummaryPDF(formState);
                      setPdfResult(res);
                    }}
                    className="p-2.5 rounded-xl bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#0f172a] transition-all shadow-xs shrink-0"
                    title="Download PDF Again"
                  >
                    <Download className="w-4 h-4 text-[#c41e3a]" />
                  </button>
                </div>

                {/* Background Email Dispatch Status Badge */}
                <div className="max-w-lg mx-auto">
                  {emailSendingStatus === 'sending' && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748b] bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200 w-fit mx-auto">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c41e3a]" />
                      <span>Sending automated summary to support@aspiretravels.in...</span>
                    </div>
                  )}

                  {emailSendingStatus === 'sent' && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#15803d] bg-green-50/80 py-1.5 px-3 rounded-lg border border-green-200 w-fit mx-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Summary copy dispatched to support@aspiretravels.in</span>
                    </div>
                  )}

                  {emailSendingStatus === 'failed' && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748b] bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-200 w-fit mx-auto">
                      <Mail className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span>PDF saved to your device for reference.</span>
                    </div>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 max-w-md mx-auto space-y-3">
                  <a
                    href={getWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Connect with Canada Visa Specialist on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#475569] hover:bg-slate-100 transition-colors"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            )}

            {/* SEPARATE QUESTIONS & ANSWERS (FAQ) SECTION */}
            <div className="mt-12 pt-8 border-t border-[#e2e8f0] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c41e3a] mb-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>Canada Consular Questions & Answers</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a]">
                    Frequently Asked Questions (IRCC Visitor & Business Visas)
                  </h3>
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'All FAQs' },
                    { id: 'canplus', label: 'CAN+ Program' },
                    { id: 'biometrics', label: 'Biometrics' },
                    { id: 'financials', label: 'Funds & Solvency' },
                    { id: 'documents', label: 'Validity & Rules' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveFaqCategory(cat.id as any)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                        activeFaqCategory === cat.id
                          ? 'bg-[#0f172a] text-white border-[#0f172a]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Canada visa questions..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
                />
              </div>

              {/* FAQ Accordion List */}
              <div className="space-y-2.5">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-[#e2e8f0] bg-white overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full px-4 sm:px-5 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-xs sm:text-sm text-[#0f172a]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#c41e3a]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-[#475569] leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp Option Below Questions & Answers */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#fca5a5] uppercase tracking-wider">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Have specific questions about your Canada profile?</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Connect directly with our senior Canada visa documentation counselors on WhatsApp for instant guidance.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                  <a
                    href={getQaWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp: +91 92893 37446</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          {currentStep !== 'completed' && (
            <div className="px-5 sm:px-8 py-4 bg-[#fbf8f2] border-t border-[#e8e2d8] flex items-center justify-between shrink-0">
              {currentStep !== 'purpose' ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-xs font-semibold text-[#475569] hover:bg-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div className="text-[11px] text-[#64748b]">
                  Assistance: <strong className="text-[#0f172a]">{CONTACT_PHONE_RAW}</strong>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#c41e3a] hover:bg-[#991b1b] text-white text-xs font-bold shadow-md shadow-[#c41e3a]/25 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <span>
                    {currentStep === 'documents'
                      ? 'Generate Canada Visa Summary & PDF'
                      : 'Continue'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
