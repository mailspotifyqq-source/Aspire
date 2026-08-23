import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Globe2,
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
  GraduationCap,
  Compass,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Check,
  ExternalLink
} from 'lucide-react';
import { UsaPortalState } from '../types';
import { downloadDS160InformationSheet } from '../utils/ds160Template';
import { generateUsaVisaSummaryPDF } from '../utils/pdfGenerator';

interface UsaVisaPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
  onBookExpert?: () => void;
  initialService?: string;
}

type Step = 'service' | 'ds160' | 'profile' | 'review' | 'completed';

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
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' }
];

// Curated iconic USA landmarks & high-grade NYC street visuals for full-page live rotating background
const USA_LANDMARKS = [
  {
    name: 'NYC Fifth Avenue & Midtown Street',
    url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Statue of Liberty, New York Harbor',
    url: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'New York City Manhattan Skyline',
    url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Golden Gate Bridge, San Francisco',
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'U.S. Capitol & Washington Monument',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Grand Canyon National Park, Arizona',
    url: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Times Square & Broadway Avenue, NYC',
    url: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=2000&q=85'
  }
];

// Preset Questions & Answers for Aspire Consultant
const USA_FAQ_ITEMS = [
  {
    id: 1,
    question: 'How soon can I get an urgent appointment?',
    answer: `For urgent B1/B2 appointments, timelines depend mainly on how flexible you are with the city:

• Pan-India (any city): Our target is within ~30-60 days. On some days we secure slots in 24–72 hours; on slower weeks it can take up to 4 weeks. To stay transparent, we commit to a 30-60 day timeline so you have a realistic plan.
• Specific city only: Expect ~45–60 days. City-restricted searches reduce the number of eligible releases we can book from.

✅ What helps us move faster:
• Allowing us to search Pan-India
• Having DS-160 ready and accurate
• Having your Consular fee completed (if you’re choosing Option 3)

🌍 Reference:
You can also check the official Global Visa Wait Times published by the U.S. Department of State for general timelines. Please note that these are indicative wait times and not reflective of urgent slot availability.`
  },
  {
    id: 2,
    question: 'What does DS-160 guidance include?',
    answer: `Our DS-160 guidance ensures your form is filled correctly and aligns with your visa interview preparation:

• Profile creation: We create or review your profile on the CGI Federal portal.
• DS-160 review: We carefully review your DS-160 to minimize errors and mismatches.
• Guidance: We guide you in answering tricky sections to align with your case and improve your chances of success.
• Interview alignment: The answers in your DS-160 must flow consistently into your interview conversation. We help make sure of that.`
  },
  {
    id: 3,
    question: 'Why don’t you show the latest appointment date?',
    answer: `Appointment availability changes minute by minute. Any date shown publicly is unreliable.

Instead, we commit to timelines we know we can deliver:
• Pan-India: Within ~30-60 days
• Specific city: Within ~30–60 days

⏳ We work behind the scenes with continuous monitoring to secure your slot within these timelines, rather than showing misleading dates.`
  },
  {
    id: 4,
    question: 'Where are you located?',
    answer: `Our office is based at P1004 Jaipuria Sunrise Greens, Indrapuram Ahinsa Khand One 201014.

📍 We serve customers all over India and book appointments for all US consular locations nationwide.`
  },
  {
    id: 5,
    question: 'Do I need to give physical documents?',
    answer: `No. Everything is handled digitally:

• We collect your details online and prepare your DS-160 digitally.
• You only need to carry your physical documents (passport, DS-160 confirmation, Consular receipt, etc.) on the day of your appointment.`
  },
  {
    id: 6,
    question: 'How many applications do you process?',
    answer: `We process 100+ clients every week across India.

Our team has years of daily experience handling urgent and regular appointments — you can trust us with the process.`
  },
  {
    id: 7,
    question: 'Can I request a call back? I don’t trust online websites.',
    answer: `We understand trust is important.

• You can read our verified reviews on Google: Google Reviews
• We manage hundreds of bookings daily and are a trusted travel tech company.`
  },
  {
    id: 8,
    question: 'I am a foreign national located outside India and want an appointment at my consulate location.',
    answer: `🌍 Yes, we serve all international locations — not just India. You can check the supported visa categories for which we secure an early appointment in the last question.

For pricing and details of the process:
• Please reach out via the WhatsApp button on our website.
• Our team will provide the steps specific to your consular location.`
  },
  {
    id: 9,
    question: 'What documents do you need from me to begin?',
    answer: `There are no documents required upfront. Once you checkout, we send you a secure form to capture your details, which we then use to prepare your DS-160.

✅ What you provide:
• Passport photo (front & back) after checkout

✅ What we do:
• Fill your DS-160 on your behalf
• Book your early appointment within ~30-60 days

📅 On your appointment date, you only need to carry the documents listed in the official consulate checklist.`
  },
  {
    id: 10,
    question: 'I have a rejected/refusal case, help me understand how to proceed',
    answer: `If your application was refused (e.g., administrative refusal or interview refusal), you must book another appointment with the correct DS-160 number.

If your application was rejected (e.g., incorrect documentation or major issue), you will need to reapply when circumstances change. This usually means starting the process again:
✅ Fill a new DS-160 form
✅ Pay the consular fee again
✅ Book a fresh appointment slot

⚠️ Please note: At Aspire Consultant, we only assist with the DS-160 process for B1/B2 applications.
For all other categories (see the last preset question in this list), we only help with securing the appointment slot.`
  },
  {
    id: 11,
    question: 'Do you use bots to find appointments? Will my account face any issues if I share my details with Aspire Consultant?',
    answer: `The entire process we deploy is 100% bot-less.

We do not use any bots, scripts, or automation tools that can lock your account or create issues.
✅ Your account remains completely safe
✅ All actions are handled manually by our experienced team
✅ You can be rest assured that your profile will not face risks from automation`
  },
  {
    id: 12,
    question: 'Other than B1/B2 which categories do you help in getting an early slot?',
    answer: `Other than B1/B2, we also help with below categories:
• Work Visas (H-1B, L-1, O-1, P, R, etc.)
• Student Visas (F-1 / F-2, M-1)
• Exchange Visitors & Dependents (J-1 / J-2)
• Visitor & Transit Extensions

Please note we only help in securing early appointments and not full end-to-end consulting for non-B1/B2 categories.`
  }
];

export function UsaVisaPortal({
  isOpen,
  onClose,
  onOpenConsultation,
  onBookExpert,
  initialService
}: UsaVisaPortalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [currentLandmarkIndex, setCurrentLandmarkIndex] = useState(0);
  const [openFaqIds, setOpenFaqIds] = useState<number[]>([1]);

  // Slideshow automatic crossfade timer every 6.5 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentLandmarkIndex((prev) => (prev + 1) % USA_LANDMARKS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const getInitialService = (): UsaPortalState['visaService'] => {
    if (initialService === 'Work Visa & Intra-Company Transfers' || initialService === 'Work Visa Appointments') {
      return 'Work Visa Appointments';
    }
    if (initialService === 'Student Visa & Higher Education' || initialService === 'Student Visa Appointments') {
      return 'Student Visa Appointments';
    }
    if (initialService === 'J1 / J2 Visa Appointments' || initialService === 'J-1 / J-2 Exchange') {
      return 'J1 / J2 Visa Appointments';
    }
    return 'Tourist & Business Visa';
  };

  const [formState, setFormState] = useState<UsaPortalState>({
    visaService: getInitialService(),
    hasDs160Confirmation: null,
    fullName: '',
    dateOfBirth: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    city: '',
    state: 'Maharashtra',
    country: 'India',
    applicantsCount: 1,
    intendedTravelPeriod: 'Upcoming 3-6 Months',
    notes: ''
  });

  const [downloadedDs160, setDownloadedDs160] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Step 1: Select Service handler
  const handleSelectService = (service: UsaPortalState['visaService']) => {
    setFormState((prev) => ({ ...prev, visaService: service }));
  };

  const handleContinueFromService = () => {
    if (formState.visaService === 'Tourist & Business Visa') {
      setCurrentStep('ds160');
    } else {
      // Work, Student, or J1/J2 Visa bypasses DS-160 inquiry and proceeds directly to Profile
      setCurrentStep('profile');
    }
  };

  // Step 2: DS-160 handler
  const handleSelectDs160 = (status: 'yes' | 'no') => {
    setFormState((prev) => ({ ...prev, hasDs160Confirmation: status }));
  };

  const handleDownloadSheet = () => {
    downloadDS160InformationSheet(formState);
    setDownloadedDs160(true);
  };

  const handleContinueFromDs160 = () => {
    if (formState.hasDs160Confirmation === null) {
      setErrors({ ds160: 'Please select whether you already have your DS-160 confirmation.' });
      return;
    }
    setErrors({});
    setCurrentStep('profile');
  };

  // Validation for Profile Form
  const validateProfile = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formState.fullName.trim()) errs.fullName = 'Please enter your full name as per passport';
    if (!formState.email.trim() || !formState.email.includes('@')) errs.email = 'Please enter a valid email address';
    if (!formState.mobileNumber.trim() || formState.mobileNumber.length < 8) errs.mobileNumber = 'Please enter a valid mobile number';
    if (!formState.city.trim()) errs.city = 'Please enter your city';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinueFromProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateProfile()) {
      setCurrentStep('review');
    }
  };

  // Generate PDF & Finalize
  const handleGenerateSummary = () => {
    try {
      generateUsaVisaSummaryPDF(formState);
      setGeneratedPdf(true);
      setCurrentStep('completed');

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b8860b', '#0f172a', '#d4af37', '#ffffff']
      });
    } catch (e) {
      console.error('Error generating PDF summary', e);
      setCurrentStep('completed');
    }
  };

  // WhatsApp Pre-fill
  const getWhatsAppMessage = () => {
    const text = `Hello Aspire Consultant Team, I am inquiring about USA Visa Assistance:
- Visa Track: ${formState.visaService}
- DS-160 Status: ${formState.hasDs160Confirmation === 'yes' ? 'Confirmation Ready' : 'Assistance Needed'}
- Applicant: ${formState.fullName}
- Contact: ${formState.countryCode} ${formState.mobileNumber}
- Location: ${formState.city}, ${formState.state}
- Applicants: ${formState.applicantsCount}

Please assist me with consular appointment scheduling and documentation.`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
  };

  // Progress Steps list
  const stepsList = [
    { id: 'dest', label: 'Destination' },
    { id: 'service', label: 'Visa Service' },
    ...(formState.visaService === 'Tourist & Business Visa' ? [{ id: 'ds160', label: 'DS-160 Status' }] : []),
    { id: 'profile', label: 'Profile' },
    { id: 'review', label: 'Review' }
  ];

  const getActiveStepIndex = () => {
    if (currentStep === 'service') return 1;
    if (currentStep === 'ds160') return 2;
    if (currentStep === 'profile') return formState.visaService === 'Tourist & Business Visa' ? 3 : 2;
    if (currentStep === 'review' || currentStep === 'completed') return formState.visaService === 'Tourist & Business Visa' ? 4 : 3;
    return 1;
  };

  const scrollToQaSection = () => {
    const el = document.getElementById('usa-qa-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (id: number) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0c1e3d] text-[#1e293b] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* FULL-PAGE LIVE ROTATING USA LANDMARK BACKGROUND (LIGHT BLUE & HIGH VISIBILITY) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {USA_LANDMARKS.map((landmark, idx) => (
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

        {/* Crisp Light-Blue & Sapphire Sky Atmospheric Overlays for High Monument Visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b2545]/60 via-[#134074]/40 to-[#0b2545]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/25 via-blue-900/20 to-[#071326]/50" />

        {/* Subtle Landmark Name & Slideshow Progress Indicator in Bottom Left */}
        <div className="absolute bottom-5 left-5 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-xs text-white font-medium shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
          <span className="font-semibold text-sky-200">{USA_LANDMARKS[currentLandmarkIndex].name}</span>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-1">
            {USA_LANDMARKS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentLandmarkIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentLandmarkIndex ? 'w-4 bg-[#38bdf8]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`View ${USA_LANDMARKS[i].name}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP PORTAL NAVBAR (NO TOP WHATSAPP DESK, CLEAN & ELEGANT) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white shadow-xl">
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
            <span className="text-2xl drop-shadow-sm">🇺🇸</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-white">
                  ASPIRE TRAVELS
                </span>
                <span className="bg-[#b8860b]/30 text-[#fbbf24] border border-[#b8860b]/50 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                  USA Visa Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden md:block font-light">
                Consular Advisory & Priority Appointment Guidance for Indian Applicants
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Navigation: Questions & Answers shortcut + Close Button */}
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
      {/* MAIN CONTENT BODY (CONTINUOUS BACKGROUND FLOWING BENEATH ALL SECTIONS) */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pb-20 w-full">
        {/* USA HERO SECTION */}
        <section className="w-full text-white pt-10 pb-8 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#fbbf24] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>India ➔ United States Consular Advisory</span>
            </motion.div>

            {/* Title & Questions & Answers Button side-by-side on desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight drop-shadow-md"
              >
                USA Visa Services
              </motion.h1>

              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                onClick={scrollToQaSection}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-[#b8860b] hover:border-[#b8860b] border border-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg transition-all active:scale-95 group"
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
              Professional assistance for your U.S. visa journey from India.
            </motion.p>

            {/* Compact Step Progress Indicator */}
            <div className="mt-8 pt-6 border-t border-white/15 max-w-2xl mx-auto">
              <div className="flex items-center justify-between relative">
                {/* Progress Bar Track */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-white/20 -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#d4af37] transition-all duration-300 -z-0"
                  style={{
                    width: `${(getActiveStepIndex() / (stepsList.length - 1)) * 100}%`
                  }}
                />

                {stepsList.map((step, idx) => {
                  const activeIdx = getActiveStepIndex();
                  const isCompleted = idx < activeIdx;
                  const isCurrent = idx === activeIdx;

                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                          isCompleted
                            ? 'bg-[#b8860b] text-white ring-2 ring-[#d4af37]'
                            : isCurrent
                            ? 'bg-white text-[#0f172a] ring-4 ring-[#b8860b]/40 font-extrabold'
                            : 'bg-[#1e293b] text-slate-400 border border-white/20'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap drop-shadow-sm ${
                          isCurrent ? 'text-[#fbbf24] font-semibold' : isCompleted ? 'text-slate-200' : 'text-slate-400'
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
        </section>

        {/* ========================================================================= */}
        {/* DYNAMIC STEP WIZARD PANELS (ELEGANT GLASS / BLURRED CARDS) */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl px-4 sm:px-6 z-20">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 p-5 sm:p-8 md:p-10 text-[#1e293b] ring-1 ring-black/5">
            {/* STEP 1: SELECT YOUR VISA SERVICE (EXACTLY 4 OPTIONS) */}
            {currentStep === 'service' && (
              <motion.div
                key="step-service"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center sm:text-left border-b border-[#f1ebe1] pb-4">
                  <span className="text-xs font-bold text-[#b8860b] tracking-wider uppercase">
                    Step 1 of 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mt-1">
                    Select Your Visa Service
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                    Choose the specific U.S. visa classification matching your travel or petition purpose.
                  </p>
                </div>

                {/* EXACTLY 4 USA VISA OPTIONS (BALANCED 2x2 GRID ON DESKTOP, VERTICAL STACK ON MOBILE) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Tourist & Business Visa */}
                  <div
                    onClick={() => handleSelectService('Tourist & Business Visa')}
                    className={`group p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                      formState.visaService === 'Tourist & Business Visa'
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/20'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/50 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        formState.visaService === 'Tourist & Business Visa'
                          ? 'bg-[#b8860b] text-white shadow-sm'
                          : 'bg-[#f1ebe1] text-[#b8860b] group-hover:bg-[#b8860b] group-hover:text-white'
                      }`}
                    >
                      <Plane className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-serif font-bold text-base text-[#0f172a] truncate">
                          Tourist & Business Visa
                        </h3>
                        <span className="text-[10px] font-bold bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 rounded-sm shrink-0">
                          B1/B2 Visa
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                        For holidays, sightseeing, visiting family/friends in the U.S., attending conferences, client meetings, or medical visits.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2.5 text-[11px] text-[#64748b]">
                        <span>• 10-Year Multi-Entry</span>
                        <span>• VAC & Consular Slots</span>
                        <span>• DS-160 Guidance</span>
                      </div>
                    </div>

                    <div className="self-center shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formState.visaService === 'Tourist & Business Visa'
                            ? 'border-[#b8860b] bg-[#b8860b] text-white'
                            : 'border-[#cbd5e1]'
                        }`}
                      >
                        {formState.visaService === 'Tourist & Business Visa' && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Work Visa Appointments */}
                  <div
                    onClick={() => handleSelectService('Work Visa Appointments')}
                    className={`group p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                      formState.visaService === 'Work Visa Appointments'
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/20'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/50 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        formState.visaService === 'Work Visa Appointments'
                          ? 'bg-[#b8860b] text-white shadow-sm'
                          : 'bg-[#f1ebe1] text-[#b8860b] group-hover:bg-[#b8860b] group-hover:text-white'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-serif font-bold text-base text-[#0f172a] truncate">
                          Work Visa Appointments
                        </h3>
                        <span className="text-[10px] font-bold bg-[#f0fdf4] text-[#15803d] px-2 py-0.5 rounded-sm shrink-0">
                          H-1B, L-1, O-1
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                        For approved petition holders (Form I-797), specialty occupation professionals, intracompany transfers, and dependents.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2.5 text-[11px] text-[#64748b]">
                        <span>• Priority Interview Slots</span>
                        <span>• Dropbox & In-Person</span>
                        <span>• 221(g) Audit</span>
                      </div>
                    </div>

                    <div className="self-center shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formState.visaService === 'Work Visa Appointments'
                            ? 'border-[#b8860b] bg-[#b8860b] text-white'
                            : 'border-[#cbd5e1]'
                        }`}
                      >
                        {formState.visaService === 'Work Visa Appointments' && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Student Visa Appointments */}
                  <div
                    onClick={() => handleSelectService('Student Visa Appointments')}
                    className={`group p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                      formState.visaService === 'Student Visa Appointments'
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/20'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/50 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        formState.visaService === 'Student Visa Appointments'
                          ? 'bg-[#b8860b] text-white shadow-sm'
                          : 'bg-[#f1ebe1] text-[#b8860b] group-hover:bg-[#b8860b] group-hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-serif font-bold text-base text-[#0f172a] truncate">
                          Student Visa Appointments
                        </h3>
                        <span className="text-[10px] font-bold bg-[#faf5ff] text-[#7e22ce] px-2 py-0.5 rounded-sm shrink-0">
                          F-1 / F-2 & Higher Ed
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                        For undergraduate, master’s, and PhD scholars with valid Form I-20 and SEVIS, exchange students, and accompanying family.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2.5 text-[11px] text-[#64748b]">
                        <span>• Emergency Slot Assistance</span>
                        <span>• I-20 & SEVIS Verification</span>
                        <span>• Financial Solvency</span>
                      </div>
                    </div>

                    <div className="self-center shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formState.visaService === 'Student Visa Appointments'
                            ? 'border-[#b8860b] bg-[#b8860b] text-white'
                            : 'border-[#cbd5e1]'
                        }`}
                      >
                        {formState.visaService === 'Student Visa Appointments' && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 4: J1 / J2 Visa Appointments */}
                  <div
                    onClick={() => handleSelectService('J1 / J2 Visa Appointments')}
                    className={`group p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                      formState.visaService === 'J1 / J2 Visa Appointments'
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/20'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/50 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        formState.visaService === 'J1 / J2 Visa Appointments'
                          ? 'bg-[#b8860b] text-white shadow-sm'
                          : 'bg-[#f1ebe1] text-[#b8860b] group-hover:bg-[#b8860b] group-hover:text-white'
                      }`}
                    >
                      <Compass className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-serif font-bold text-base text-[#0f172a] truncate">
                          J1 / J2 Visa Appointments
                        </h3>
                        <span className="text-[10px] font-bold bg-[#fff7ed] text-[#c2410c] px-2 py-0.5 rounded-sm shrink-0">
                          J-1 / J-2 Exchange
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                        For exchange visitors, research scholars, short-term scholars, professors, interns, trainees, au pairs, and exchange dependents (J-2).
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2.5 text-[11px] text-[#64748b]">
                        <span>• DS-2019 / SEVIS Validation</span>
                        <span>• Consular Slot Expedited Booking</span>
                        <span>• J-2 Dependent Filing</span>
                      </div>
                    </div>

                    <div className="self-center shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formState.visaService === 'J1 / J2 Visa Appointments'
                            ? 'border-[#b8860b] bg-[#b8860b] text-white'
                            : 'border-[#cbd5e1]'
                        }`}
                      >
                        {formState.visaService === 'J1 / J2 Visa Appointments' && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <div className="pt-4 flex items-center justify-between border-t border-[#f1ebe1]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-[#d6cfc4] text-xs font-semibold text-[#475569] hover:bg-[#f8f5ee]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleContinueFromService}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#b8860b] hover:bg-[#996f09] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#b8860b]/25 hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DS-160 QUESTION (TOURIST & BUSINESS VISA ONLY) */}
            {currentStep === 'ds160' && (
              <motion.div
                key="step-ds160"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-[#f1ebe1] pb-4">
                  <button
                    onClick={() => setCurrentStep('service')}
                    className="inline-flex items-center gap-1 text-xs text-[#b8860b] hover:underline font-semibold mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Visa Category</span>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a]">
                    Do you already have your DS-160 confirmation?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                    Form DS-160 is the mandatory online nonimmigrant visa application submitted on the CEAC portal.
                  </p>
                </div>

                {/* EXACTLY TWO VISUALLY SELECTABLE OPTIONS: YES / NO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: YES — I have it */}
                  <div
                    onClick={() => handleSelectDs160('yes')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      formState.hasDs160Confirmation === 'yes'
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/20'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/40 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#15803d] bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                          Confirmation Ready
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formState.hasDs160Confirmation === 'yes'
                              ? 'border-[#b8860b] bg-[#b8860b] text-white'
                              : 'border-[#cbd5e1]'
                          }`}
                        >
                          {formState.hasDs160Confirmation === 'yes' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#0f172a] mt-1">
                        YES — I have it
                      </h3>
                      <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                        I have completed the online DS-160 and have my 10-digit alphanumeric confirmation barcode ready.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f1ebe1] text-[11px] text-[#475569] font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Proceeds straight to profile & appointment booking</span>
                    </div>
                  </div>

                  {/* Option 2: NO — I need assistance */}
                  <div
                    onClick={() => handleSelectDs160('no')}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      formState.hasDs160Confirmation === 'no'
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/20'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/40 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#b8860b] bg-[#fef3c7] px-2.5 py-0.5 rounded-full">
                          Assistance Required
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formState.hasDs160Confirmation === 'no'
                              ? 'border-[#b8860b] bg-[#b8860b] text-white'
                              : 'border-[#cbd5e1]'
                          }`}
                        >
                          {formState.hasDs160Confirmation === 'no' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#0f172a] mt-1">
                        NO — I need assistance
                      </h3>
                      <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                        I need Aspire Travels to review my background details, audit my documentation, and assist with filing.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f1ebe1] text-[11px] text-[#b8860b] font-medium flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>Provides offline preparation information sheet</span>
                    </div>
                  </div>
                </div>

                {/* HELPFUL INFORMATION PANEL IF USER SELECTS NO */}
                {formState.hasDs160Confirmation === 'no' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 sm:p-6 rounded-2xl bg-[#fcfaf4] border-2 border-[#d4af37]/40 shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#b8860b]/15 text-[#8b6508] flex items-center justify-center shrink-0 mt-0.5">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#0f172a]">
                          Need help with your DS-160?
                        </h4>
                        <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                          Download our information sheet, fill in the required details, and share it with our team. We’ll assist you with the next step.
                        </p>

                        {/* Prominent Download Button (Original untouched template) */}
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={handleDownloadSheet}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
                          >
                            <Download className="w-4 h-4 text-[#fbbf24]" />
                            <span>
                              {downloadedDs160
                                ? 'DS-160 Information Sheet Downloaded ✓'
                                : 'Download DS-160 Information Sheet'}
                            </span>
                          </button>

                          <span className="text-[11px] text-[#64748b]">
                            (Excel / CSV Format • Pre-formatted offline template)
                          </span>
                        </div>

                        {/* Clear Legal Disclaimer */}
                        <div className="mt-3.5 pt-3 border-t border-[#e8e2d8] flex items-center gap-2 text-[11px] text-[#64748b]">
                          <Shield className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                          <span>
                            Aspire Travels preparatory information sheet for offline data organization. Not an official U.S. government form.
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {errors.ds160 && (
                  <p className="text-xs text-red-600 font-medium">{errors.ds160}</p>
                )}

                {/* Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-[#f1ebe1]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('service')}
                    className="px-4 py-2.5 rounded-xl border border-[#d6cfc4] text-xs font-semibold text-[#475569] hover:bg-[#f8f5ee]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleContinueFromDs160}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#b8860b] hover:bg-[#996f09] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#b8860b]/25 hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <span>Continue to Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: YOUR PROFILE & CONTACT DETAILS (INDIA-SPECIFIC) */}
            {currentStep === 'profile' && (
              <motion.div
                key="step-profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-[#f1ebe1] pb-4">
                  <button
                    onClick={() => {
                      if (formState.visaService === 'Tourist & Business Visa') {
                        setCurrentStep('ds160');
                      } else {
                        setCurrentStep('service');
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#b8860b] hover:underline font-semibold mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a]">
                    Your Profile & Contact Details
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                    Designed specifically for Indian applicants applying for U.S. visas.
                  </p>
                </div>

                <form onSubmit={handleContinueFromProfile} className="space-y-4 sm:space-y-5">
                  {/* Full Name & DOB */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Full Name (as per Passport) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                          errors.fullName
                            ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                            : 'border-[#d6cfc4] focus:ring-[#b8860b] bg-white'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <input
                        type="text"
                        placeholder="DD / MM / YYYY"
                        value={formState.dateOfBirth}
                        onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6cfc4] text-sm focus:ring-[#b8860b] focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  {/* Email & Mobile Number (Dedicated Indian Country Code Separator) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="rahul.sharma@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                            errors.email
                              ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                              : 'border-[#d6cfc4] focus:ring-[#b8860b] bg-white'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        {/* Country code selector defaulting to +91 */}
                        <div className="relative w-32 shrink-0">
                          <select
                            value={formState.countryCode}
                            onChange={(e) => setFormState({ ...formState, countryCode: e.target.value })}
                            aria-label="Country Code"
                            className="w-full px-2.5 py-2.5 rounded-xl border border-[#d6cfc4] bg-[#f8f5ee] text-xs font-semibold text-[#0f172a] focus:ring-[#b8860b] focus:outline-hidden cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Separate phone input field */}
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            placeholder="98765 43210"
                            value={formState.mobileNumber}
                            onChange={(e) =>
                              setFormState({ ...formState, mobileNumber: e.target.value.replace(/[^\d\s-]/g, '') })
                            }
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                              errors.mobileNumber
                                ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                                : 'border-[#d6cfc4] focus:ring-[#b8860b] bg-white'
                            }`}
                          />
                        </div>
                      </div>
                      {errors.mobileNumber && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.mobileNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* City, State & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        City in India <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai / Bengaluru"
                        value={formState.city}
                        onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                          errors.city
                            ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                            : 'border-[#d6cfc4] focus:ring-[#b8860b] bg-white'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        State
                      </label>
                      <select
                        value={formState.state}
                        onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                        aria-label="State"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#d6cfc4] text-sm focus:ring-[#b8860b] focus:outline-hidden bg-white cursor-pointer"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value="India"
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-sm font-semibold text-[#64748b] cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Applicants Count & Intended Travel Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Number of Applicants
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFormState({ ...formState, applicantsCount: num })}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              formState.applicantsCount === num
                                ? 'bg-[#0f172a] text-white border-[#0f172a]'
                                : 'bg-white text-[#475569] border-[#d6cfc4] hover:bg-[#f8f5ee]'
                            }`}
                          >
                            {num === 5 ? '5+' : num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-1.5">
                        Target Travel / Slot Window
                      </label>
                      <select
                        value={formState.intendedTravelPeriod}
                        onChange={(e) =>
                          setFormState({ ...formState, intendedTravelPeriod: e.target.value })
                        }
                        aria-label="Target Travel Period"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#d6cfc4] text-sm focus:ring-[#b8860b] focus:outline-hidden bg-white cursor-pointer"
                      >
                        <option value="Immediate / Emergency (Next 30 Days)">Immediate / Emergency (Next 30 Days)</option>
                        <option value="Upcoming 1-3 Months">Upcoming 1-3 Months</option>
                        <option value="Upcoming 3-6 Months">Upcoming 3-6 Months</option>
                        <option value="Fall Semester / Academic Intake">Fall Semester / Academic Intake</option>
                        <option value="Flexible / Exploration">Flexible / Exploration</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit / Proceed */}
                  <div className="pt-5 flex items-center justify-between border-t border-[#f1ebe1]">
                    <button
                      type="button"
                      onClick={() => {
                        if (formState.visaService === 'Tourist & Business Visa') {
                          setCurrentStep('ds160');
                        } else {
                          setCurrentStep('service');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-[#d6cfc4] text-xs font-semibold text-[#475569] hover:bg-[#f8f5ee]"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#b8860b] hover:bg-[#996f09] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#b8860b]/25 hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: REVIEW YOUR VISA JOURNEY */}
            {currentStep === 'review' && (
              <motion.div
                key="step-review"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="border-b border-[#f1ebe1] pb-4">
                  <span className="text-xs font-bold text-[#b8860b] tracking-wider uppercase">
                    Step 4 of 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0f172a] mt-1">
                    Review Your Visa Journey
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                    Please review your selections before generating your personalized application dossier.
                  </p>
                </div>

                {/* Summary Details Card */}
                <div className="bg-[#fcfaf6] rounded-2xl border border-[#e8e2d8] p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#e8e2d8]">
                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Destination
                      </span>
                      <div className="flex items-center gap-1.5 text-base font-bold text-[#0f172a] mt-0.5">
                        <span>🇺🇸</span>
                        <span>United States of America (USA)</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Selected Visa Service
                      </span>
                      <div className="text-base font-bold text-[#b8860b] mt-0.5">
                        {formState.visaService}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#e8e2d8]">
                    {formState.visaService === 'Tourist & Business Visa' && (
                      <div>
                        <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                          DS-160 Status
                        </span>
                        <div className="text-sm font-semibold text-[#0f172a] mt-0.5 flex items-center gap-1.5">
                          {formState.hasDs160Confirmation === 'yes' ? (
                            <span className="text-[#15803d]">✓ Yes — Confirmation Available</span>
                          ) : (
                            <span className="text-[#b8860b]">ℹ No — Assistance Required</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Applicant Name
                      </span>
                      <div className="text-sm font-bold text-[#0f172a] mt-0.5">
                        {formState.fullName}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Email Address
                      </span>
                      <div className="text-sm text-[#0f172a] mt-0.5 font-medium">
                        {formState.email}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Mobile Phone
                      </span>
                      <div className="text-sm text-[#0f172a] mt-0.5 font-medium font-mono">
                        {formState.countryCode} {formState.mobileNumber}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Location
                      </span>
                      <div className="text-sm text-[#0f172a] mt-0.5 font-medium">
                        {formState.city}, {formState.state}, {formState.country}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                        Total Applicants
                      </span>
                      <div className="text-sm font-semibold text-[#0f172a] mt-0.5">
                        {formState.applicantsCount} Person(s)
                      </div>
                    </div>
                  </div>

                  {/* Consular Advisory Features */}
                  <div className="pt-1">
                    <div className="text-xs font-semibold text-[#0f172a] mb-2">
                      Included Aspire Consular Advisory Coverage:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>USCIS & Consular Document Pre-Screening</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>VAC Biometrics & Interview Scheduling</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>1-on-1 Mock Consular Interview Drills</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Financial Proof & Sponsorship Structuring</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explicit Disclaimer Notice */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Notice:</strong> This summary is prepared by Aspire Travels for consultation and application assistance. It is not an official U.S. government document.
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#f1ebe1]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('profile')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#d6cfc4] text-xs font-semibold text-[#475569] hover:bg-[#f8f5ee]"
                  >
                    Edit Information
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#b8860b] hover:bg-[#996f09] text-white text-sm font-bold shadow-lg shadow-[#b8860b]/30 hover:shadow-xl transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Generate My Visa Summary</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: COMPLETED / DOWNLOAD SUCCESS SCREEN */}
            {currentStep === 'completed' && (
              <motion.div
                key="step-completed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#f0fdf4] border-2 border-[#86efac] text-[#15803d] flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b8860b] bg-[#fef3c7] px-3 py-1 rounded-full">
                    Dossier Generated Successfully
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a] mt-2">
                    Your USA Visa Summary is Ready
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto mt-1">
                    Your customized application dossier has been downloaded as a PDF for your records and consultation.
                  </p>
                </div>

                {/* PDF Re-download card */}
                <div className="p-5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] max-w-lg mx-auto text-left flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#b8860b]/15 text-[#b8860b] flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a]">
                        Aspire_Travels_USA_Visa_Summary_{formState.fullName.replace(/\s+/g, '_')}.pdf
                      </div>
                      <div className="text-[11px] text-[#64748b]">
                        PDF Document • Official Aspire Travels Consular Summary
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateSummary}
                    className="p-2.5 rounded-xl bg-white border border-[#cbd5e1] text-[#0f172a] hover:bg-[#f1f5f9] text-xs font-semibold shrink-0"
                    title="Download Again"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Immediate Consultation Actions */}
                <div className="pt-2 max-w-md mx-auto space-y-3">
                  <a
                    href={getWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md shadow-[#25D366]/25 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Connect with Consular Expert on WhatsApp</span>
                  </a>

                  {(onOpenConsultation || onBookExpert) && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onBookExpert) onBookExpert();
                        else if (onOpenConsultation) onOpenConsultation();
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#b8860b] text-[#8b6508] hover:bg-[#b8860b]/10 text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Book 1-on-1 Consular Audio Call</span>
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-[#f1ebe1] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('service');
                      setFormState({
                        visaService: 'Tourist & Business Visa',
                        hasDs160Confirmation: null,
                        fullName: '',
                        dateOfBirth: '',
                        email: '',
                        countryCode: '+91',
                        mobileNumber: '',
                        city: '',
                        state: 'Maharashtra',
                        country: 'India',
                        applicantsCount: 1,
                        intendedTravelPeriod: 'Upcoming 3-6 Months',
                        notes: ''
                      });
                      onClose();
                    }}
                    className="text-xs text-[#64748b] hover:text-[#0f172a] font-medium underline"
                  >
                    Close Portal and Return to Main Site
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* QUESTIONS & ANSWERS SECTION (DEDICATED FAQ ACCORDION OVER FULL BACKGROUND) */}
        {/* ========================================================================= */}
        <section id="usa-qa-section" className="w-full max-w-4xl px-4 sm:px-6 mt-16 z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-10 text-[#1e293b]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f1ebe1] pb-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8860b]/10 text-[#8b6508] text-xs font-bold uppercase tracking-wider mb-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Aspire Consultant Advisory Desk</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                  Questions & Answers
                </h2>
                <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                  Frequently asked questions regarding urgent appointments, DS-160 filing, timelines, and consular policies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (openFaqIds.length === USA_FAQ_ITEMS.length) {
                      setOpenFaqIds([]);
                    } else {
                      setOpenFaqIds(USA_FAQ_ITEMS.map((item) => item.id));
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-[#d6cfc4] hover:bg-[#f8f5ee] text-xs font-semibold text-[#475569] transition-colors"
                >
                  {openFaqIds.length === USA_FAQ_ITEMS.length ? 'Collapse All' : 'Expand All'}
                </button>
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-3.5">
              {USA_FAQ_ITEMS.map((faq) => {
                const isOpenFaq = openFaqIds.includes(faq.id);

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpenFaq
                        ? 'bg-[#fcfaf6] border-[#b8860b]/40 shadow-sm'
                        : 'bg-white border-[#e2e8f0] hover:border-[#b8860b]/30 hover:bg-[#faf8f4]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpenFaq}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#b8860b]/10 text-[#8b6508] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          Q{faq.id}
                        </span>
                        <span className="font-serif font-bold text-sm sm:text-base text-[#0f172a] leading-snug">
                          {faq.question}
                        </span>
                      </div>

                      <div className="shrink-0 text-[#b8860b] mt-0.5">
                        {isOpenFaq ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5 opacity-60" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpenFaq && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 border-t border-[#f1ebe1]/80">
                            <div className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line pl-9">
                              {faq.answer}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Bottom Q&A Action Strip */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#0f172a] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                  Still have specific consular questions?
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 font-light">
                  Our Aspire Consultant senior advisors are available for personalized profile evaluations.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
