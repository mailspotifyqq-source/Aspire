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
  FileText,
  BadgeCheck,
  Award
} from 'lucide-react';
import { SchengenPortalState } from '../types';
import { generateSchengenVisaSummaryPDF, GeneratedSchengenPdfResult } from '../utils/schengenPdfGenerator';
import { sendVisaSummaryEmail } from '../utils/emailService';
import { WHATSAPP_NUMBER, CONTACT_PHONE_RAW } from '../config/contact';
import { SchengenDocumentChecklistModal } from './SchengenDocumentChecklistModal';

interface SchengenVisaPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

type Step = 'purpose' | 'eligibility' | 'profile' | 'documents' | 'completed';

// Curated iconic European landmarks for full-page live rotating background
export const SCHENGEN_LANDMARKS = [
  {
    name: 'Matterhorn & Zermatt, Switzerland',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Eiffel Tower & Paris Skyline, France',
    url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Colosseum & Roman Forum, Italy',
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Neuschwanstein Castle, Bavaria, Germany',
    url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Amsterdam Canals & Bridges, Netherlands',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Sagrada Familia & Barcelona, Spain',
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Santorini & Aegean Sea, Greece',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85'
  }
];

export const SCHENGEN_COUNTRIES = [
  'Switzerland',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Austria',
  'Netherlands',
  'Greece',
  'Portugal',
  'Belgium',
  'Czech Republic',
  'Hungary',
  'Sweden',
  'Norway',
  'Finland',
  'Denmark',
  'Poland',
  'Other Schengen Nation (29 Member States)'
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
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' }
];

// Europe Schengen Consular Q&A Database
const SCHENGEN_FAQ_ITEMS = [
  {
    id: 1,
    category: 'rules',
    question: 'Which Schengen Embassy or Consulate must I apply to (Main Destination Rule)?',
    answer: `Under the official Schengen Visa Code (EU Regulation):
• Maximum Nights Rule: You MUST apply to the Embassy/VFS of the Schengen country where you will spend the greatest number of nights (Main Destination).
• Equal Nights Rule: If you spend an equal number of nights in two or more Schengen countries (e.g. 5 days Switzerland + 5 days France), you MUST apply to the country of FIRST point of entry.
• Port of Entry: You are completely free to enter or transit through any Schengen airport once your visa is issued by your primary destination country.`
  },
  {
    id: 2,
    category: 'biometrics',
    question: 'Do I need to visit VFS in person if I have previous Schengen biometrics (VIS)?',
    answer: `• Biometric Exemption (VIS 59 Months): If you have given digital fingerprints at a VFS Schengen centre within the last 59 months (approx. 5 years) and your visa has the remark "VIS", you may be eligible for a personal appearance waiver.
• Fresh Biometrics: If you are applying for the first time or if your biometrics are older than 59 months, you must visit the VFS Global centre for a quick 10-minute digital fingerprint & photo enrollment.
• Children under 12: Children under 12 years of age are completely exempt from fingerprinting.`
  },
  {
    id: 3,
    category: 'insurance',
    question: 'What are the mandatory requirements for Schengen Travel Medical Insurance?',
    answer: `Your travel insurance policy must strictly meet all four EU consular conditions:
1. Minimum Medical Cover: €30,000 (or equivalent $50,000 / ₹27,00,000+).
2. Geographic Validity: Valid across ALL 29 Schengen member states.
3. Coverage Scope: Emergency medical expenses, emergency hospital admission, and medical repatriation of remains.
4. Zero Deductible: Consulates strictly prefer zero or negligible deductible policies.`
  },
  {
    id: 4,
    category: 'financials',
    question: 'How much bank balance is recommended for a Schengen Tourist Visa?',
    answer: `Consulates evaluate financial sufficiency based on your planned length of stay:
• Single Traveler (10–15 days): ₹4,00,000 to ₹7,00,000 in maintainable liquid savings.
• Family / Couple: ₹8,00,000 to ₹15,00,000+ depending on the number of dependents.
• Required Evidence: 6 months of original stamped & signed bank statements, fixed deposit certificates, and 2-3 years of ITR-V forms.`
  },
  {
    id: 5,
    category: 'processing',
    question: 'How many days before travel should I apply for a Schengen Visa?',
    answer: `• Earliest Application: You can submit your application up to 6 months prior to your intended date of travel.
• Recommended Timeline: Apply at least 4 to 8 weeks in advance, especially for high-demand seasons (April-September for Swiss Alps/Paris and December for Swiss ski season).
• Standard Processing: The standard consular processing timeline is 15 calendar days from the date your passport reaches the Embassy.`
  }
];

export function SchengenVisaPortal({
  isOpen,
  onClose,
  onOpenConsultation
}: SchengenVisaPortalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('purpose');
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState<number[]>([1, 2]);
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'rules' | 'biometrics' | 'insurance' | 'financials' | 'processing'>('all');

  // Slideshow automatic crossfade timer every 6.5 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentLandmarkIndex((prev) => (prev + 1) % SCHENGEN_LANDMARKS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Form state
  const [formState, setFormState] = useState<SchengenPortalState>({
    visaService: 'Business & Tourist Visa',
    travelPurpose: 'Tourism & Sightseeing',
    primaryDestination: 'Switzerland',
    biometricsStatus: 'Valid VIS Biometrics (Given in last 59 months)',
    travelHistory: 'Previous Schengen or US/UK/Canada Visa',
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

  const [emailSendingStatus, setEmailSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [pdfResult, setPdfResult] = useState<GeneratedSchengenPdfResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

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

  // Background email dispatch to support@aspiretravels.in
  const dispatchSummaryEmail = async (pdfData: GeneratedSchengenPdfResult) => {
    setEmailSendingStatus('sending');
    setEmailErrorMessage('');
    try {
      const result = await sendVisaSummaryEmail({
        applicantName: formState.fullName || 'Applicant',
        destination: `Europe Schengen (${formState.primaryDestination})`,
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
        fundsReadiness: formState.fundsAvailability,
        filename: pdfData.filename,
        pdfBase64: pdfData.base64,
        serviceType: 'schengen',
      });

      if (result.success) {
        setEmailSendingStatus('sent');
        setEmailErrorMessage('');
      } else {
        const errorMsg = result.error || 'Email dispatch failed. Please try again.';
        console.warn('[Schengen Portal] Email dispatch failed:', errorMsg);
        setEmailSendingStatus('failed');
        setEmailErrorMessage(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Network error occurred while connecting to the email server.';
      console.error('[Schengen Portal] Error dispatching Schengen summary email:', err);
      setEmailSendingStatus('failed');
      setEmailErrorMessage(errorMsg);
    }
  };

  const handleNext = () => {
    if (currentStep === 'purpose') {
      setCurrentStep('eligibility');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'eligibility') {
      setCurrentStep('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'profile') {
      if (!validateProfile()) return;
      setCurrentStep('documents');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'documents') {
      handleGenerateSummary();
    }
  };

  const handleBack = () => {
    if (currentStep === 'eligibility') setCurrentStep('purpose');
    else if (currentStep === 'profile') setCurrentStep('eligibility');
    else if (currentStep === 'documents') setCurrentStep('profile');
    else if (currentStep === 'completed') setCurrentStep('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateSummary = () => {
    try {
      const result = generateSchengenVisaSummaryPDF(formState);
      setPdfResult(result);
      setCurrentStep('completed');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1e40af', '#eab308', '#ffffff', '#3b82f6']
      });

      dispatchSummaryEmail(result);
    } catch (err) {
      console.error('Failed to generate Schengen summary PDF:', err);
      setCurrentStep('completed');
    }
  };

  const scrollToQaSection = () => {
    const el = document.getElementById('schengen-qa-section');
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
    const text = `Hello Aspire Consultant Team, I am inquiring about Europe Schengen Visa (${formState.primaryDestination}):
- Destination: ${formState.primaryDestination} (29 Schengen States)
- Purpose of Visit: ${formState.travelPurpose}
- VIS Biometrics: ${formState.biometricsStatus}
- Travel History: ${formState.travelHistory}
- Applicant: ${formState.fullName || 'Applicant'}
- Contact: ${formState.countryCode} ${formState.mobileNumber || 'Not provided'}
- Location: ${formState.city ? `${formState.city}, ${formState.state}` : 'India'}
- Applicants: ${formState.applicantsCount}

Please assist me with Schengen documentation review and VFS appointment scheduling.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const stepsList = [
    { id: 'purpose', label: 'Travel Purpose' },
    { id: 'eligibility', label: 'VIS & Eligibility' },
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

  const filteredFaqs = SCHENGEN_FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeFaqCategory === 'all' || item.category === activeFaqCategory;
    const matchesSearch =
      faqSearch.trim() === '' ||
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#091122] text-[#1e293b] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* FULL-PAGE LIVE ROTATING EUROPE SCHENGEN LANDMARK BACKGROUND */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {SCHENGEN_LANDMARKS.map((landmark, idx) => (
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

        {/* European Royal Navy Sky Atmospheric Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091122]/70 via-[#101e38]/50 to-[#091122]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-900/30 to-[#060c18]/60" />

        {/* Subtle Landmark Name & Slideshow Progress Indicator */}
        <div className="absolute bottom-5 left-5 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 text-xs text-white font-medium shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          <span className="font-semibold text-blue-200">{SCHENGEN_LANDMARKS[currentLandmarkIndex].name}</span>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-1">
            {SCHENGEN_LANDMARKS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentLandmarkIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentLandmarkIndex ? 'w-4 bg-[#38bdf8]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`View ${SCHENGEN_LANDMARKS[i].name}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP PORTAL NAVBAR WITH EXIT PORTAL & CHECKLIST BUTTONS */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#091122]/92 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white shadow-xl">
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
            <span className="text-2xl drop-shadow-sm">🇪🇺</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-white">
                  ASPIRE CONSULTANT
                </span>
                <span className="bg-blue-600/30 text-blue-200 border border-blue-400/40 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                  Schengen 29 States
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden md:block font-light">
                Fill, File, Fly... #VisasMadeEasy • Consular Advisory & VFS Biometrics Guidance
              </p>
            </div>
          </div>
        </div>

        {/* Right Header: Document Checklist + Questions & Answers shortcut + Close Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setIsChecklistModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-400/50 text-white text-xs font-semibold transition-all active:scale-95 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden xs:inline">Checklist</span>
            <span className="xs:hidden">Docs</span>
          </button>

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
        {/* EUROPE SCHENGEN HERO SECTION */}
        <section className="w-full text-white pt-10 pb-8 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>India ➔ Europe Schengen Consular Advisory (Type C Short-Stay)</span>
            </motion.div>

            {/* Title & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md"
              >
                Europe Schengen Visa Services
              </motion.h1>

              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 }}
                  onClick={() => setIsChecklistModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 border border-blue-400 text-white text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95 group"
                >
                  <FileText className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                  <span>Document Checklist</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  onClick={scrollToQaSection}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-blue-600 hover:border-blue-500 border border-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg transition-all active:scale-95 group"
                >
                  <HelpCircle className="w-4 h-4 text-[#fbbf24] group-hover:text-white transition-colors" />
                  <span>Questions & Answers</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:translate-y-0.5 transition-transform" />
                </motion.button>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-light drop-shadow-sm"
            >
              Expert guidance for <strong>Switzerland, France, Germany, Italy, Spain & 29 Schengen Nations</strong>. VIS Biometrics verification, cover letter assistance, and comprehensive document checklists.
            </motion.p>
          </div>
        </section>

        {/* STEPPER PROGRESS INDICATOR */}
        <div className="w-full max-w-4xl px-4 sm:px-6 mb-6">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/15 w-full -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-amber-500 transition-all duration-500 -z-0"
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
                          ? 'bg-blue-600 text-white ring-4 ring-blue-600/30 scale-110'
                          : isCompleted
                          ? 'bg-[#b8860b] text-white'
                          : 'bg-[#1e293b] text-slate-400 border border-white/20'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-1.5 font-medium hidden xs:block truncate max-w-[80px] sm:max-w-[120px] text-center ${
                        isCurrent ? 'text-blue-200 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-400'
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
            <div className="bg-gradient-to-r from-[#0b1728] via-[#10243e] to-[#1e3a8a] text-white px-6 sm:px-8 py-5 border-b-2 border-blue-500 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200 bg-blue-600/25 px-2.5 py-0.5 rounded-full">
                  Step {getActiveStepIndex()} of 5: {stepsList[getActiveStepIndex() - 1].label}
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
                  {currentStep === 'purpose' && 'Select Your Travel Purpose for Europe Schengen'}
                  {currentStep === 'eligibility' && 'Schengen VIS Biometrics & Travel History'}
                  {currentStep === 'profile' && 'Primary Applicant Dossier & Contact Details'}
                  {currentStep === 'documents' && 'Europe Schengen Document Checklist Review'}
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-[#64748b]">
                      Select your primary European destination country and purpose of travel:
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0f172a] whitespace-nowrap">Primary Country:</span>
                      <select
                        value={formState.primaryDestination}
                        onChange={(e) => setFormState({ ...formState, primaryDestination: e.target.value })}
                        className="bg-white border border-[#cbd5e1] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                      >
                        {SCHENGEN_COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'Tourism & Sightseeing',
                        title: 'Tourism & Sightseeing',
                        icon: Compass,
                        badge: 'Most Popular',
                        desc: `Exploring Swiss Alps, Paris, Rome, Bavaria, Amsterdam canals, or leisure holidays.`,
                        docs: 'Hotel vouchers + Daily tour itinerary + 6M Bank statements'
                      },
                      {
                        id: 'Business Meetings & Conferences',
                        title: 'Business & Conferences',
                        icon: Briefcase,
                        badge: 'Corporate Track',
                        desc: 'Attending business meetings, client visits, European trade expos, or corporate negotiations.',
                        docs: 'Host Invitation Letter + Company Leave NOC'
                      },
                      {
                        id: 'Visiting Family & Relatives',
                        title: 'Visiting Family & Friends',
                        icon: Users,
                        badge: 'Family Stream',
                        desc: 'Visiting relatives, children, or close friends residing in the Schengen area.',
                        docs: 'Official Host Invitation / Declaration of Sponsorship'
                      },
                      {
                        id: 'Solo Exploration & Leisure',
                        title: 'Solo & Cultural Travel',
                        icon: Plane,
                        badge: 'Flexible Type C',
                        desc: 'Self-guided photography, historical tours, cultural events, or multi-country travel.',
                        docs: 'Proof of ties to India + Strong financial solvency'
                      },
                    ].map((option) => {
                      const isSelected = formState.travelPurpose === option.id;
                      const Icon = option.icon;

                      return (
                        <div
                          key={option.id}
                          onClick={() => setFormState({ ...formState, travelPurpose: option.id as any })}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between relative ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600/20'
                              : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {option.badge}
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-[#0f172a] mb-1">{option.title}</h3>
                            <p className="text-xs text-[#64748b] leading-relaxed mb-3">{option.desc}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 text-[11px] text-[#475569]">
                            <strong className="text-[#0f172a]">Core docs:</strong> {option.docs}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: ELIGIBILITY & VIS BIOMETRICS */}
              {currentStep === 'eligibility' && (
                <div className="space-y-6">
                  {/* Section A: VIS Biometrics */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                      1. Previous Schengen Biometrics (VIS Status)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'Valid VIS Biometrics (Given in last 59 months)',
                          title: 'VIS Biometrics Done (< 59 Months)',
                          desc: 'Given digital fingerprints at VFS Schengen within last 5 years (Waiver eligible)'
                        },
                        {
                          id: 'Need New VFS Biometrics Appointment',
                          title: 'Need New VFS Biometrics',
                          desc: 'Never given or last biometrics older than 59 months'
                        },
                        {
                          id: 'Unsure / First Time Applicant',
                          title: 'First-Time Schengen Applicant',
                          desc: 'First international trip to Europe (VFS appointment required)'
                        }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormState({ ...formState, biometricsStatus: item.id as any })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formState.biometricsStatus === item.id
                              ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                              : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                          }`}
                        >
                          <div className="font-bold text-xs text-[#0f172a] mb-1">{item.title}</div>
                          <div className="text-[11px] text-[#64748b] leading-relaxed">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section B: Travel History */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                      2. Travel History & Prior Visas
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'Previous Schengen or US/UK/Canada Visa',
                          title: 'Schengen / US / UK / Canada Visa',
                          desc: 'Holds active or expired visa for Schengen, US, UK, Canada, Australia'
                        },
                        {
                          id: 'Other International Travel',
                          title: 'Other International Travel',
                          desc: 'Traveled to Dubai, Singapore, Thailand, Malaysia, etc.'
                        },
                        {
                          id: 'Fresh Passport / First International Trip',
                          title: 'Fresh Passport',
                          desc: 'First international passport filing'
                        }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setFormState({ ...formState, travelHistory: item.id as any })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formState.travelHistory === item.id
                              ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                              : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                          }`}
                        >
                          <div className="font-bold text-xs text-[#0f172a] mb-1">{item.title}</div>
                          <div className="text-[11px] text-[#64748b] leading-relaxed">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section C: Employment Status & Funds */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                        3. Current Employment Status
                      </label>
                      <select
                        value={formState.employmentStatus}
                        onChange={(e) => setFormState({ ...formState, employmentStatus: e.target.value as any })}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Salaried Professional">Salaried Professional (MNC / Corporate / Govt)</option>
                        <option value="Business Owner / Self-Employed">Business Owner / Self-Employed / Partner</option>
                        <option value="Retired">Retired Professional</option>
                        <option value="Student / Freelancer">Student / Freelancer / Consultant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
                        4. Liquid Funds & Solvency (Bank Balance)
                      </label>
                      <select
                        value={formState.fundsAvailability}
                        onChange={(e) => setFormState({ ...formState, fundsAvailability: e.target.value as any })}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="₹4,00,000 – ₹7,00,000">₹4,00,000 – ₹7,00,000 (Standard Single Traveler)</option>
                        <option value="₹7,00,000 – ₹15,00,000">₹7,00,000 – ₹15,00,000 (Recommended Family / Couple)</option>
                        <option value="₹15,00,000+">₹15,00,000+ (High Net Worth / Multi-Country)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: APPLICANT PROFILE */}
              {currentStep === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Full Name (As printed on passport) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        placeholder="e.g. RAHUL TAYAL"
                        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600 ${
                          errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5e1]'
                        }`}
                      />
                      {errors.fullName && <p className="text-[10px] text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">Date of Birth (DD/MM/YYYY)</label>
                      <input
                        type="text"
                        value={formState.dateOfBirth}
                        onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })}
                        placeholder="e.g. 15/08/1988"
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="name@example.com"
                        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600 ${
                          errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5e1]'
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={formState.countryCode}
                          onChange={(e) => setFormState({ ...formState, countryCode: e.target.value })}
                          className="bg-white border border-[#cbd5e1] rounded-xl px-2.5 py-2.5 text-xs font-semibold text-[#0f172a]"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={formState.mobileNumber}
                          onChange={(e) => setFormState({ ...formState, mobileNumber: e.target.value })}
                          placeholder="9876543210"
                          className={`flex-1 bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600 ${
                            errors.mobileNumber ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5e1]'
                          }`}
                        />
                      </div>
                      {errors.mobileNumber && <p className="text-[10px] text-red-600 mt-1">{errors.mobileNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">
                        Residential City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.city}
                        onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                        placeholder="e.g. New Delhi"
                        className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600 ${
                          errors.city ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5e1]'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">State</label>
                      <select
                        value={formState.state}
                        onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-1">Total Applicants</label>
                      <select
                        value={formState.applicantsCount}
                        onChange={(e) => setFormState({ ...formState, applicantsCount: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Applicant (Solo)' : 'Applicants (Family/Group)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1">Intended Travel Period</label>
                    <select
                      value={formState.intendedTravelPeriod}
                      onChange={(e) => setFormState({ ...formState, intendedTravelPeriod: e.target.value })}
                      className="w-full bg-white border border-[#cbd5e1] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Next 30 Days (Urgent Filing)">Next 30 Days (Urgent Filing)</option>
                      <option value="Next 1 to 3 Months">Next 1 to 3 Months</option>
                      <option value="Next 3 to 6 Months">Next 3 to 6 Months (Recommended)</option>
                      <option value="Next 6 to 12 Months">Next 6 to 12 Months</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: DOCUMENT CHECKLIST REVIEW */}
              {currentStep === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-[#64748b]">
                      Consular checklist requirements for your <strong>{formState.primaryDestination}</strong> Schengen visa filing:
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsChecklistModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 shrink-0 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Checklist</span>
                    </button>
                  </div>

                  {/* Checklist Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: '1. Original Passport',
                        status: 'Mandatory',
                        desc: 'Valid for min 3 months beyond departure date from Schengen Area with 2 blank pages.'
                      },
                      {
                        title: '2. Schengen Travel Medical Insurance',
                        status: 'Mandatory',
                        desc: 'Minimum €30,000 ($50,000) emergency hospitalization & repatriation cover across all 29 states.'
                      },
                      {
                        title: '3. 6-Month Bank Statements',
                        status: 'Mandatory',
                        desc: 'Original bank statements with bank branch stamp and authorized signature on all pages.'
                      },
                      {
                        title: '4. 2-3 Years ITR-V Forms',
                        status: 'Mandatory',
                        desc: 'Income Tax Return Acknowledgement receipts and Form 16 / corporate tax documents.'
                      },
                      {
                        title: '5. Flight & Hotel Itinerary',
                        status: 'Mandatory',
                        desc: 'Confirmed round-trip flight reservations and hotel booking vouchers for each night in Europe.'
                      },
                      {
                        title: '6. Cover Letter & Employment NOC',
                        status: 'Mandatory',
                        desc: 'Detailed day-by-day travel plan and company leave sanction letter with seal & signature.'
                      }
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-xs text-[#0f172a]">{item.title}</h4>
                            <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748b] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Official Aspire Consultant Document Checklist Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white">
                            Official Europe Schengen Document Checklist (Aspire Consultant)
                          </span>
                          <span className="text-[9px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                            Interactive
                          </span>
                        </div>
                        <p className="text-xs text-blue-200 leading-relaxed">
                          Open the complete checklist covering Tourist, Business, Family Sponsored visits, sample Cover Letters, Leave Sanction (NOC), and Sponsorship templates.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsChecklistModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span>Open Complete Checklist</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Summary Snapshot Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-[#cbd5e1] space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                      <span>Dossier Overview Summary</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[#64748b] block text-[11px]">Applicant:</span>
                        <strong className="text-[#0f172a] truncate block">{formState.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[11px]">Primary Destination:</span>
                        <strong className="text-[#0f172a] truncate block">{formState.primaryDestination}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[11px]">Travel Purpose:</span>
                        <strong className="text-[#0f172a] truncate block">{formState.travelPurpose}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748b] block text-[11px]">VIS Biometrics:</span>
                        <strong className="text-[#0f172a] truncate block">{formState.biometricsStatus}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: COMPLETED & SUMMARY READY */}
              {currentStep === 'completed' && (
                <div className="space-y-6 max-w-2xl mx-auto text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/25">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                      Dossier Assessment Ready
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                      Your Schengen Visa Summary is Ready
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto">
                      Your personalized Europe Schengen ({formState.primaryDestination}) visa summary has been compiled and downloaded to your device.
                    </p>
                  </div>

                  {/* PDF Re-download Card */}
                  <div className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] max-w-lg mx-auto text-left flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-600 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0f172a] truncate">
                          {pdfResult?.filename ||
                            `Aspire_Consultant_Schengen_Visa_Summary_${(formState.fullName || 'Applicant')
                              .trim()
                              .replace(/[\\/:*?"<>|]/g, '') || 'Applicant'}.pdf`}
                        </div>
                        <div className="text-[11px] text-[#64748b]">
                          PDF Document &bull; Official Aspire Consultant Schengen Summary
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const res = generateSchengenVisaSummaryPDF(formState);
                        setPdfResult(res);
                      }}
                      className="p-2.5 rounded-xl bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#0f172a] transition-all shadow-xs shrink-0"
                      title="Download PDF Again"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>

                  {/* Background Email Dispatch Status Badge */}
                  <div className="max-w-lg mx-auto">
                    {emailSendingStatus === 'sending' && (
                      <div className="flex items-center justify-center gap-2 text-xs text-[#475569] bg-[#f8fafc] py-2 px-4 rounded-xl border border-[#e2e8f0] w-fit mx-auto shadow-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Sending summary copy to Aspire Consultant (support@aspiretravels.in)...</span>
                      </div>
                    )}

                    {emailSendingStatus === 'sent' && (
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#15803d] bg-[#f0fdf4] py-2 px-4 rounded-xl border border-[#bbf7d0] w-fit mx-auto shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
                        <span>Email sent successfully to Aspire Consultant.</span>
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
                    <button
                      type="button"
                      onClick={() => setIsChecklistModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
                    >
                      <FileText className="w-4 h-4 text-blue-200" />
                      <span>View & Download Official Document Checklist</span>
                    </button>

                    <a
                      href={getWhatsAppMessage()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Connect with Schengen Visa Specialist on WhatsApp</span>
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
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <span>{currentStep === 'documents' ? 'Generate Dossier Summary' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE SCHENGEN Q&A SECTION */}
        {/* ========================================================================= */}
        <section id="schengen-qa-section" className="w-full max-w-4xl px-4 sm:px-6 mt-12 text-left">
          <div className="bg-[#fffdfa] rounded-3xl shadow-xl border border-[#e5e0d8] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Consular Guidance
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mt-1">
                  Europe Schengen Visa Questions & Answers
                </h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Frequently asked questions regarding Schengen 29 states, VIS biometrics, insurance, and VFS appointments.
                </p>
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search rules or FAQs..."
                  className="w-full pl-8 pr-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-xs text-[#0f172a] focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All FAQs' },
                { id: 'rules', label: 'Main Destination Rule' },
                { id: 'biometrics', label: 'VIS Biometrics' },
                { id: 'insurance', label: '€30,000 Insurance' },
                { id: 'financials', label: 'Bank Balance' },
                { id: 'processing', label: 'Processing Time' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFaqCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeFaqCategory === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Accordion list */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpenFaq = openFaqIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="border border-[#e2e8f0] rounded-2xl overflow-hidden bg-white shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#f8fafc] transition-colors"
                    >
                      <span className="font-bold text-xs sm:text-sm text-[#0f172a]">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#64748b] transition-transform duration-200 shrink-0 ${
                          isOpenFaq ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpenFaq && (
                      <div className="p-4 pt-0 text-xs text-[#475569] leading-relaxed border-t border-slate-50 bg-[#fafafa] whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official Consular Links & Help */}
            <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748b]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-[#0f172a]">Official Links:</span>
                <a
                  href="https://visa.vfsglobal.com/ind/en/che"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  VFS Switzerland <ExternalLink className="w-3 h-3" />
                </a>
                <span>&bull;</span>
                <a
                  href="https://visa.vfsglobal.com/ind/en/fra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  VFS France <ExternalLink className="w-3 h-3" />
                </a>
                <span>&bull;</span>
                <a
                  href="https://visa.vfsglobal.com/ind/en/deu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  VFS Germany <ExternalLink className="w-3 h-3" />
                </a>
                <span>&bull;</span>
                <a
                  href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  EU Commission Visa Policy <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => setIsChecklistModalOpen(true)}
                className="font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Schengen Checklist</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* SEPARATE COMPLETE SCHENGEN DOCUMENT CHECKLIST MODAL */}
      {/* ========================================================================= */}
      <SchengenDocumentChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />
    </div>
  );
}
