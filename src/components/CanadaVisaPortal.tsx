import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  HelpCircle,
  Phone,
  Plane,
  Shield,
  Sparkles,
  Users,
  Calendar,
  Building2,
  Mail,
  MapPin,
  FileCheck2,
  Briefcase,
  Compass,
  MessageCircle,
  ChevronDown,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  RotateCcw,
  Search,
  CreditCard,
  Fingerprint,
  FileText,
  BadgeCheck,
  Award
} from 'lucide-react';
import { CanadaPortalState } from '../types';
import { generateCanadaVisaSummaryPDF, GeneratedCanadaPdfResult } from '../utils/canadaPdfGenerator';
import { sendVisaSummaryEmail } from '../utils/emailService';
import { WHATSAPP_NUMBER, CONTACT_PHONE_RAW } from '../config/contact';

interface CanadaVisaPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

type Step = 'purpose' | 'eligibility' | 'profile' | 'documents' | 'completed';

// Curated iconic Canada landmarks for full-page live rotating background
export const CANADA_LANDMARKS = [
  {
    name: 'Niagara Falls & Horseshoe Falls, Ontario',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Banff National Park & Lake Louise, Alberta',
    url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'CN Tower & Downtown Toronto, Ontario',
    url: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Parliament Hill & Peace Tower, Ottawa',
    url: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Château Frontenac & Old Quebec City, Quebec',
    url: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Vancouver Harbor & Coast Mountains, British Columbia',
    url: 'https://images.unsplash.com/photo-1559511260-66a65e09b2ee?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Moraine Lake & Canadian Rockies, Alberta',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85'
  }
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other'
];

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'USA/Canada', flag: '🇨🇦' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' }
];

// Canada Consular Q&A Database (Exclusively IRCC & VFS, NO DS-160)
const CANADA_FAQ_ITEMS = [
  {
    id: 1,
    category: 'canplus',
    question: 'What is the CAN+ Fast-Track Program for Indian Citizens?',
    answer: `CAN+ is an expedited visa processing program by IRCC (Immigration, Refugees and Citizenship Canada) for Indian nationals.

• Eligibility: You qualify if you currently hold a valid US Non-Immigrant Visa OR have held an approved Canadian visa in the past 10 years.
• Benefits: Applicants are exempt from submitting heavy financial documents (like 3 years ITRs and property valuations).
• Speed: Applications are processed significantly faster by the High Commission of Canada in New Delhi.`
  },
  {
    id: 2,
    category: 'biometrics',
    question: 'Where and how do I give Biometrics for a Canada Visitor Visa in India?',
    answer: `Biometrics (digital fingerprints & photo) are enrolled at authorized VFS Global Canada Visa Application Centres (CVAC) across India:

• Locations: New Delhi, Mumbai, Chandigarh, Bangalore, Jalandhar, Ahmedabad, Chennai, Hyderabad, Kolkata, and Pune.
• Procedure: Once Aspire Travels lodges your IRCC online application, you receive an official Biometric Instruction Letter (BIL).
• Slot Booking: We secure your convenient VFS appointment slot to complete your 15-minute biometric enrollment.`
  },
  {
    id: 3,
    category: 'biometrics',
    question: 'How long are Canadian Biometrics valid once completed?',
    answer: `Canadian biometrics remain valid for 10 full years from the enrollment date.

• If you have enrolled biometrics for a Canada Tourist Visa, Study Permit, or Work Permit in the last 10 years, you are exempt from repeating the appointment.
• You also save the CAD $85 biometric government fee on your current filing.`
  },
  {
    id: 4,
    category: 'financials',
    question: 'How much bank balance is recommended for a Canada Tourist Visa?',
    answer: `IRCC requires verifiable liquid funds to cover your flights, lodging, meals, and emergencies in Canada:

• Single Traveler (2–3 weeks): ₹4,00,000 to ₹7,00,000 in maintainable liquid savings.
• Family / Group: ₹8,00,000 to ₹15,00,000+ depending on the number of dependents.
• Required Evidence: 6 months of original stamped bank statements, fixed deposit certificates, and 2-3 years of ITR-V forms.`
  },
  {
    id: 5,
    category: 'documents',
    question: 'What is the validity and stay duration of a Canada Visitor Visa (TRV)?',
    answer: `Canada Temporary Resident Visas (Visitor TRV / V-1 / B-1 Category) are typically granted as:

• Validity: Multiple Entry valid up to 10 years (or until passport expiry).
• Duration of Stay: Up to 6 months per entry.
• Border Control: The Canada Border Services Agency (CBSA) stamps your entry upon arrival at Toronto, Vancouver, Montreal, or Calgary.`
  },
  {
    id: 6,
    category: 'documents',
    question: 'Do I need an Invitation Letter from Canada for Business or Family Visits?',
    answer: `An Invitation Letter is required depending on your travel stream:

• Business Visits: An official invitation on the Canadian company letterhead stating the meeting agenda, corporate registration, and who is bearing expenses.
• Family Visits: A signed invitation letter from your host in Canada, accompanied by proof of their Canadian status (PR Card / Passport) and Canadian Notice of Assessment (NOA).
• Pure Sightseeing / Tourism: Hotel vouchers and a detailed day-wise itinerary are submitted in place of an invitation letter.`
  },
  {
    id: 7,
    category: 'documents',
    question: 'How does Aspire Travels prevent Canada visa refusals under Section 179(b)?',
    answer: `Section 179(b) of the Immigration and Refugee Protection Regulations (IRPR) is the most common reason for refusals ("doubt that the applicant will depart Canada").

• Aspire Travels conducts an exhaustive audit of your ties to India: employment seniority, approved leave NOC, property records, business GST, and dependents.
• We draft a tailored, legally structured Statement of Purpose (SOP) that clearly articulates the temporary nature and purpose of your visit.`
  },
  {
    id: 8,
    category: 'general',
    question: 'Can I request a call back from a Senior Canada Counselor?',
    answer: `Yes! Our senior Canada consular team is available to assist you.

• WhatsApp Support: Instant messaging on +91 92893 37446.
• Direct Phone: +91 92893 37446 (Monday to Saturday, 10:00 AM – 7:00 PM IST).
• Office: Aspire Travels, P1004 Jaipuria Sunrise Greens, Indrapuram Ahinsa Khand One 201014.`
  }
];

export function CanadaVisaPortal({
  isOpen,
  onClose,
  onOpenConsultation
}: CanadaVisaPortalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('purpose');
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState<number[]>([1, 2]);
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'canplus' | 'biometrics' | 'financials' | 'documents'>('all');

  // Slideshow automatic crossfade timer every 6.5 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentLandmarkIndex((prev) => (prev + 1) % CANADA_LANDMARKS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Form state
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
    state: 'Delhi NCR',
    country: 'India',
    applicantsCount: 1,
    intendedTravelPeriod: 'Next 3 to 6 Months',
    notes: ''
  });

  const [generatedPdf, setGeneratedPdf] = useState(false);
  const [emailSendingStatus, setEmailSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [pdfResult, setPdfResult] = useState<GeneratedCanadaPdfResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Validation for Step 3 (Profile)
  const validateProfile = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formState.fullName.trim()) errs.fullName = 'Please enter your full name as printed on your passport';
    if (!formState.email.trim() || !formState.email.includes('@')) errs.email = 'Please enter a valid email address';
    if (!formState.mobileNumber.trim() || formState.mobileNumber.length < 8) errs.mobileNumber = 'Please enter a valid mobile number';
    if (!formState.city.trim()) errs.city = 'Please enter your city';
    if (!formState.state.trim()) errs.state = 'Please enter your state';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Background email dispatch to support@aspiretravels.in via Cloudflare Worker -> Resend
  const dispatchSummaryEmail = async (pdfData: GeneratedCanadaPdfResult) => {
    setEmailSendingStatus('sending');
    setEmailErrorMessage('');
    try {
      const result = await sendVisaSummaryEmail({
        applicantName: formState.fullName || 'Applicant',
        email: formState.email || '',
        phone: `${formState.countryCode || '+91'} ${formState.mobileNumber || ''}`.trim(),
        city: formState.city || '',
        state: formState.state || '',
        country: formState.country || 'India',
        applicantsCount: formState.applicantsCount || 1,
        intendedTravelPeriod: formState.intendedTravelPeriod || 'Next 3 to 6 Months',
        visaCategory: formState.visaService,
        travelPurpose: formState.travelPurpose,
        biometricsStatus: formState.biometricsStatus,
        travelHistory: formState.travelHistory,
        employmentStatus: formState.employmentStatus,
        fundsReadiness: formState.fundsReadiness,
        filename: pdfData.filename,
        pdfBase64: pdfData.base64,
        serviceType: 'canada',
      });

      if (result.success) {
        setEmailSendingStatus('sent');
        setEmailErrorMessage('');
      } else {
        const errorMsg = result.error || 'Email dispatch failed. Please try again.';
        console.warn('[Canada Portal] Email dispatch failed:', errorMsg);
        setEmailSendingStatus('failed');
        setEmailErrorMessage(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Network error occurred while connecting to the email server.';
      console.error('[Canada Portal] Error dispatching Canada summary email:', err);
      setEmailSendingStatus('failed');
      setEmailErrorMessage(errorMsg);
    }
  };

  // Generate Summary PDF & Complete Step
  const handleGenerateSummary = () => {
    try {
      const result = generateCanadaVisaSummaryPDF(formState);
      setPdfResult(result);
      setGeneratedPdf(true);
      setCurrentStep('completed');

      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c41e3a', '#b8860b', '#0f172a', '#ffffff']
      });

      // Automatically dispatch email copy in background
      dispatchSummaryEmail(result);
    } catch (e) {
      console.error('Error generating Canada PDF summary', e);
      setCurrentStep('completed');
    }
  };

  const handleNext = () => {
    if (currentStep === 'purpose') {
      setCurrentStep('eligibility');
    } else if (currentStep === 'eligibility') {
      setCurrentStep('profile');
    } else if (currentStep === 'profile') {
      if (validateProfile()) {
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

  const scrollToQaSection = () => {
    const el = document.getElementById('canada-qa-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (id: number) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

  const stepsList = [
    { id: 'purpose', label: 'Travel Purpose' },
    { id: 'eligibility', label: 'IRCC & CAN+' },
    { id: 'profile', label: 'Profile Dossier' },
    { id: 'documents', label: 'Checklist Review' },
    { id: 'completed', label: 'Summary Ready' }
  ];

  const getActiveStepIndex = () => {
    if (currentStep === 'purpose') return 1;
    if (currentStep === 'eligibility') return 2;
    if (currentStep === 'profile') return 3;
    if (currentStep === 'documents') return 4;
    return 5;
  };

  const filteredFaqs = CANADA_FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeFaqCategory === 'all' || item.category === activeFaqCategory;
    const matchesSearch =
      faqSearch.trim() === '' ||
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b1b2b] text-[#1e293b] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* FULL-PAGE LIVE ROTATING CANADA LANDMARK BACKGROUND */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {CANADA_LANDMARKS.map((landmark, idx) => (
          <div
            key={landmark.name}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentLandmarkIndex ? 'opacity-85' : 'opacity-0'
            }`}
          >
            <img
              src={landmark.url}
              alt={landmark.name}
              className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-[10000ms]"
              style={{
                transform: idx === currentLandmarkIndex ? 'scale(1.06)' : 'scale(1.0)'
              }}
            />
          </div>
        ))}

        {/* Canadian Crimson & Navy Sky Atmospheric Overlays for High Landmark Visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1b2b]/65 via-[#182a3e]/45 to-[#0b1b2b]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/20 via-slate-900/30 to-[#071326]/60" />

        {/* Subtle Landmark Name & Slideshow Progress Indicator in Bottom Left */}
        <div className="absolute bottom-5 left-5 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 text-xs text-white font-medium shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#f43f5e] animate-pulse" />
          <span className="font-semibold text-rose-200">{CANADA_LANDMARKS[currentLandmarkIndex].name}</span>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-1">
            {CANADA_LANDMARKS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentLandmarkIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentLandmarkIndex ? 'w-4 bg-[#f43f5e]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`View ${CANADA_LANDMARKS[i].name}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP PORTAL NAVBAR WITH EXIT PORTAL BUTTON */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0b1728]/92 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Back to main site"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Portal</span>
          </button>

          <div className="h-5 w-[1px] bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <span className="text-2xl drop-shadow-sm">🇨🇦</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-white">
                  ASPIRE TRAVELS
                </span>
                <span className="bg-[#c41e3a]/30 text-[#fecdd3] border border-[#c41e3a]/50 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                  Canada Visa Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden md:block font-light">
                IRCC Consular Advisory, CAN+ Fast-Track & VFS Biometrics Guidance
              </p>
            </div>
          </div>
        </div>

        {/* Right Header: Questions & Answers shortcut + Close Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={scrollToQaSection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-all active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span className="hidden xs:inline">Questions & Answers</span>
            <span className="xs:hidden">Q&A</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
            aria-label="Close portal"
          >
            ✕
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT BODY (CONTINUOUS FLOW WITH ROTATING LANDMARKS BENEATH) */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pb-20 w-full">
        {/* CANADA HERO SECTION */}
        <section className="w-full text-white pt-10 pb-8 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#fecdd3] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>India ➔ Canada IRCC Consular Advisory (V-1 / B-1 TRV)</span>
            </motion.div>

            {/* Title & Q&A button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md"
              >
                Canada Visa Services
              </motion.h1>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                onClick={scrollToQaSection}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-[#c41e3a] hover:border-[#c41e3a] border border-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg transition-all active:scale-95 group"
              >
                <HelpCircle className="w-4 h-4 text-[#fbbf24] group-hover:text-white transition-colors" />
                <span>Questions & Answers</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:translate-y-0.5 transition-transform" />
              </motion.button>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-light drop-shadow-sm"
            >
              Tailored pre-screening for <strong>Canada Business & Tourist Visas</strong>, CAN+ fast-track eligibility, VFS Global Biometrics scheduling, and Section 179(b) compliant filing dossiers.
            </motion.p>
          </div>
        </section>

        {/* STEPPER PROGRESS INDICATOR */}
        <div className="w-full max-w-4xl px-4 sm:px-6 mb-6">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/15 w-full -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#c41e3a] to-[#b8860b] transition-all duration-500 -z-0"
                style={{
                  width: `${((getActiveStepIndex() - 1) / (stepsList.length - 1)) * 100}%`
                }}
              />

              {stepsList.map((step, idx) => {
                const stepNum = idx + 1;
                const activeIndex = getActiveStepIndex();
                const isCompleted = stepNum < activeIndex;
                const isCurrent = stepNum === activeIndex;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                        isCurrent
                          ? 'bg-[#c41e3a] text-white ring-4 ring-[#c41e3a]/30 scale-110'
                          : isCompleted
                          ? 'bg-[#b8860b] text-white'
                          : 'bg-[#1e293b] text-slate-400 border border-white/20'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1.5 font-medium hidden xs:block truncate max-w-[80px] sm:max-w-[120px] text-center ${
                        isCurrent ? 'text-[#fecdd3] font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN INTERACTIVE CARD CONTAINER */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl px-4 sm:px-6">
          <div className="bg-[#fffdfa] rounded-3xl shadow-2xl border border-[#e5e0d8] overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#0b1728] via-[#16253b] to-[#2e1017] text-white px-6 sm:px-8 py-5 border-b-2 border-[#c41e3a] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#fecdd3] bg-[#c41e3a]/25 px-2.5 py-0.5 rounded-full">
                  Step {getActiveStepIndex()} of 5: {stepsList[getActiveStepIndex() - 1].label}
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                  {currentStep === 'purpose' && 'Select Your Travel Purpose for Canada'}
                  {currentStep === 'eligibility' && 'IRCC, CAN+ Fast-Track & Biometrics Pre-Screening'}
                  {currentStep === 'profile' && 'Primary Applicant Dossier & Contact Details'}
                  {currentStep === 'documents' && 'Canada Visitor Visa Document Checklist Review'}
                  {currentStep === 'completed' && 'Dossier Assessment Ready & Download Summary'}
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-light">
                <Shield className="w-4 h-4 text-[#fbbf24]" />
                <span>100% Confidential Dossier</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-[#fffdfa] to-[#fbf8f2]">
              {/* STEP 1: TRAVEL PURPOSE */}
              {currentStep === 'purpose' && (
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Canada processes Visitor Visas (Temporary Resident Visas - TRV) for tourism, business visits, and family meetings. Select your trip category below:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className={`relative p-5 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
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

                  {/* Applicants Count & Intended Timeline */}
                  <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
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
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd5e1] bg-slate-50 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
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
                <div className="space-y-6">
                  {/* CAN+ Highlight Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fef2f2] via-[#fff1f2] to-[#fffbeb] border border-[#fecdd3] flex items-start gap-3.5">
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

                  {/* 3. Employment & Funds */}
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

              {/* STEP 3: APPLICANT DOSSIER */}
              {currentStep === 'profile' && (
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Enter your details exactly as shown on your Indian passport for official consular dossier generation:
                  </p>

                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
                    {/* Full Name & DOB */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1">
                          Full Name (As printed on Passport) <span className="text-[#c41e3a]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="e.g. Rajesh Kumar Sharma"
                            value={formState.fullName}
                            onChange={(e) =>
                              setFormState((p) => ({ ...p, fullName: e.target.value }))
                            }
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
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
                          <select
                            value={formState.countryCode}
                            onChange={(e) => setFormState((p) => ({ ...p, countryCode: e.target.value }))}
                            className="px-2.5 rounded-xl border border-[#cbd5e1] bg-slate-50 text-xs font-bold text-slate-700 shrink-0 outline-hidden"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
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
                        <select
                          value={formState.state}
                          onChange={(e) => setFormState((p) => ({ ...p, state: e.target.value }))}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden ${
                            errors.state ? 'border-red-500 bg-red-50/50' : 'border-[#cbd5e1]'
                          }`}
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
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
                        placeholder="e.g. Traveling with family; need Canadian conference invitation review..."
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
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-[#64748b]">
                    Review the mandatory document requirements prepared for your profile before generating your summary:
                  </p>

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
                <div className="space-y-6 max-w-2xl mx-auto text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#c41e3a] to-[#ef4444] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#c41e3a]/25">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c41e3a] bg-[#c41e3a]/10 px-3 py-1 rounded-full">
                      Dossier Assessment Ready
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                      Your Canada Visa Summary is Ready
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto">
                      Your personalized Canada Business & Tourist Visa summary has been compiled and downloaded to your device.
                    </p>
                  </div>

                  {/* PDF Re-download Card */}
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
                      <div className="flex items-center justify-center gap-2 text-xs text-[#475569] bg-[#f8fafc] py-2 px-4 rounded-xl border border-[#e2e8f0] w-fit mx-auto shadow-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-[#c41e3a]" />
                        <span>Sending summary copy to Aspire Travels (support@aspiretravels.in)...</span>
                      </div>
                    )}

                    {emailSendingStatus === 'sent' && (
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#15803d] bg-[#f0fdf4] py-2 px-4 rounded-xl border border-[#bbf7d0] w-fit mx-auto shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
                        <span>Email sent successfully to Aspire Travels.</span>
                      </div>
                    )}

                    {emailSendingStatus === 'failed' && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-left space-y-2 max-w-md mx-auto shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>PDF generated, but email delivery failed. Please try again.</span>
                        </div>
                        
                        {emailErrorMessage && (
                          <p className="text-[11px] text-amber-800/80 pl-6 leading-relaxed">
                            Note: {emailErrorMessage}
                          </p>
                        )}

                        <div className="pl-6 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (pdfResult) {
                                dispatchSummaryEmail(pdfResult);
                              } else {
                                handleGenerateSummary();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold transition-all active:scale-[0.98]"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#fbbf24]" />
                            <span>Retry Sending Email</span>
                          </button>
                        </div>
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
                      Exit Portal & Return to Main Site
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Controls */}
            {currentStep !== 'completed' && (
              <div className="px-6 sm:px-8 py-4 bg-[#fbf8f2] border-t border-[#e8e2d8] flex items-center justify-between">
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
                    Direct Support: <strong className="text-[#0f172a]">{CONTACT_PHONE_RAW}</strong>
                  </div>
                )}

                <div className="flex items-center gap-3">
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
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED CANADA CONSULAR QUESTIONS & ANSWERS (FAQ) SECTION */}
        {/* ========================================================================= */}
        <section
          id="canada-qa-section"
          className="w-full max-w-4xl px-4 sm:px-6 mt-12 scroll-mt-20"
        >
          <div className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e5e0d8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2e8f0] pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c41e3a] mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Canada Consular Questions & Answers</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a]">
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
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-[#c41e3a]/30 focus:border-[#c41e3a] outline-hidden"
              />
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
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
                      <div className="px-5 pb-4 pt-1 text-xs text-[#475569] leading-relaxed border-t border-slate-100 bg-slate-50/50 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* WhatsApp Counselor Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0b1728] via-[#16253b] to-[#2e1017] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-white/10">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#fecdd3] uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Have specific questions regarding your Canada profile?</span>
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp: +91 92893 37446</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES FOOTER */}
        <section className="w-full max-w-4xl px-4 sm:px-6 mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { title: '100% Pre-Screened', desc: 'Section 179(b) compliance audit' },
              { title: 'CAN+ Fast-Track', desc: 'Accelerated US visa holder track' },
              { title: 'VFS Biometrics', desc: 'Full appointment scheduling' },
              { title: 'IRCC Dossier Prep', desc: 'IMM 5257 & IMM 5645 precision' },
            ].map((b, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#0f172a]/70 backdrop-blur-md border border-white/10 text-white shadow-md"
              >
                <div className="text-xs font-bold text-slate-100">{b.title}</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-[#070f1a]/95 border-t border-white/10 py-6 px-4 text-center text-xs text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} Aspire Travels &bull; Canada Consular Advisory & Visa Facilitation Services.
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Aspire Travels is an independent visa documentation consultancy assisting applicants with IRCC online filings and VFS appointments.
        </p>
      </footer>
    </div>
  );
}
