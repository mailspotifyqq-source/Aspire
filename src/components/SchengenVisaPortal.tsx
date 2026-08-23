import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
  Award,
  Globe,
  Landmark,
  Euro,
  Info
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

type Step = 'strategy' | 'profile' | 'solvency' | 'documents' | 'completed';

// Iconic Europe / Schengen landmarks for live rotating background
export const SCHENGEN_LANDMARKS = [
  {
    name: 'Matterhorn & Zermatt, Switzerland',
    country: 'Switzerland 🇨🇭',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Jungfraujoch & Lauterbrunnen Valley, Switzerland',
    country: 'Switzerland 🇨🇭',
    url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Eiffel Tower & Paris Skyline, France',
    country: 'France 🇫🇷',
    url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Colosseum & Ancient Rome, Italy',
    country: 'Italy 🇮🇹',
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Neuschwanstein Castle & Bavarian Alps, Germany',
    country: 'Germany 🇩🇪',
    url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Hallstatt Alpine Village & Dachstein, Austria',
    country: 'Austria 🇦🇹',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Sagrada Familia & Barcelona, Spain',
    country: 'Spain 🇪🇸',
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Amsterdam Grand Canals & Heritage Houses, Netherlands',
    country: 'Netherlands 🇳🇱',
    url: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=2000&q=85'
  },
  {
    name: 'Santorini & Oia Cliffs, Greece',
    country: 'Greece 🇬🇷',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85'
  }
];

export const SCHENGEN_COUNTRIES = [
  { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', popular: true, hub: 'Zurich / Geneva (ZRH/GVA)' },
  { id: 'france', name: 'France', flag: '🇫🇷', popular: true, hub: 'Paris Charles de Gaulle (CDG)' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', popular: true, hub: 'Frankfurt / Munich (FRA/MUC)' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', popular: true, hub: 'Rome / Milan (FCO/MXP)' },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', popular: true, hub: 'Madrid / Barcelona (MAD/BCN)' },
  { id: 'austria', name: 'Austria', flag: '🇦🇹', popular: true, hub: 'Vienna (VIE)' },
  { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', popular: true, hub: 'Amsterdam Schiphol (AMS)' },
  { id: 'greece', name: 'Greece', flag: '🇬🇷', popular: true, hub: 'Athens (ATH)' },
  { id: 'portugal', name: 'Portugal', flag: '🇵🇹', popular: false, hub: 'Lisbon (LIS)' },
  { id: 'iceland', name: 'Iceland', flag: '🇮🇸', popular: false, hub: 'Reykjavik (KEF)' },
  { id: 'norway', name: 'Norway', flag: '🇳🇴', popular: false, hub: 'Oslo (OSL)' },
  { id: 'sweden', name: 'Sweden', flag: '🇸🇪', popular: false, hub: 'Stockholm (ARN)' },
  { id: 'finland', name: 'Finland', flag: '🇫🇮', popular: false, hub: 'Helsinki (HEL)' },
  { id: 'denmark', name: 'Denmark', flag: '🇩🇰', popular: false, hub: 'Copenhagen (CPH)' },
  { id: 'belgium', name: 'Belgium', flag: '🇧🇪', popular: false, hub: 'Brussels (BRU)' },
  { id: 'czechia', name: 'Czech Republic', flag: '🇨🇿', popular: false, hub: 'Prague (PRG)' },
  { id: 'hungary', name: 'Hungary', flag: '🇭🇺', popular: false, hub: 'Budapest (BUD)' },
  { id: 'poland', name: 'Poland', flag: '🇵🇱', popular: false, hub: 'Warsaw (WAW)' },
  { id: 'croatia', name: 'Croatia', flag: '🇭🇷', popular: false, hub: 'Zagreb / Dubrovnik (ZAG)' }
];

const VFS_CENTRES_INDIA = [
  'New Delhi (VFS Shivaji Stadium Metro)',
  'Mumbai (VFS BKC / Mahalaxmi)',
  'Bengaluru (VFS Gopalan Innovation Mall)',
  'Chennai (VFS Express Avenue)',
  'Hyderabad (VFS Banjara Hills)',
  'Kolkata (VFS Acropolis Mall)',
  'Ahmedabad (VFS Gujarat College Road)',
  'Kochi (VFS S&T Arcade)',
  'Chandigarh (VFS Elante Mall)',
  'Pune (VFS Koregaon Park)',
  'Jalandhar (VFS Aman Millennium)',
  'Goa (VFS Panaji)',
  'Jaipur (VFS Gaurav Tower)'
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

// Consular Schengen Q&A
const SCHENGEN_FAQ_ITEMS = [
  {
    id: 1,
    category: 'rules',
    question: 'Which Schengen Embassy or Consulate must I apply to (Main Destination vs First Entry)?',
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
    category: 'processing',
    question: 'How many days before travel should I apply for a Schengen Visa?',
    answer: `• Earliest Application: You can submit your application up to 6 months prior to your intended date of travel.
• Recommended Timeline: Apply at least 4 to 8 weeks in advance, especially for high-demand seasons (April-September for Swiss Alps/Paris and December for Swiss ski season).
• Standard Processing: The standard consular processing timeline is 15 calendar days from the date your passport reaches the Embassy.`
  },
  {
    id: 5,
    category: 'rule90',
    question: 'What is the 90/180 Days Schengen Rule and how does it work?',
    answer: `A standard Schengen Short-Stay Visa (Type C) allows you to stay in the Schengen Area for a maximum of 90 days within any 180-day rolling window.
• Rolling Calculation: On each day of your stay in Europe, you look back 180 days to count the cumulative total days spent.
• Multiple Entry: If granted a 1-year, 2-year, or 5-year multiple-entry visa, each individual stay must never exceed 90 continuous days within any 180-day period.`
  }
];

export function SchengenVisaPortal({
  isOpen,
  onClose,
  onOpenConsultation
}: SchengenVisaPortalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('strategy');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<SchengenPortalState>({
    primaryDestination: 'Switzerland',
    entryCountry: 'Switzerland (Zurich / Geneva)',
    visaType: 'Tourist (Type C)',
    entryType: 'Single Entry',
    travelDurationDays: 10,
    intendedTravelDate: '',
    biometricVisStatus: 'Biometrics given within last 59 months (Waiver eligible)',
    hasPreviousSchengen: 'No previous Schengen',
    validOtherVisas: [],
    employmentStatus: 'Salaried Professional',
    monthlyIncome: '₹1,25,000 – ₹2,50,000 / month',
    bankBalance: '₹6,00,000 – ₹10,00,000',
    hasItr: 'Yes, last 2-3 years ITR-V filed',
    hasSponsor: 'Self-funded',
    hasTravelInsurance: 'Yes, €30,000+ compliant',
    fullName: '',
    passportNumber: '',
    dateOfBirth: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    city: '',
    state: 'Delhi NCR',
    preferredVfsCity: 'New Delhi (VFS Shivaji Stadium Metro)',
    adultsCount: 1,
    childrenCount: 0,
    infantsCount: 0,
    notes: ''
  });

  // Checklist status for step 4
  const [checklistCompleted, setChecklistCompleted] = useState<Record<string, boolean>>({
    passport: true,
    photos: true,
    insurance: true,
    bank: true,
    itr: true,
    noc: true,
    itinerary: true,
    hotel: true,
    flights: true
  });

  // Final submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfResult, setPdfResult] = useState<GeneratedSchengenPdfResult | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  // Rotate Background landmark image smoothly
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % SCHENGEN_LANDMARKS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Fee calculation (Official Euro Consular Rates)
  const adultFeeEur = formData.adultsCount * 80;
  const childFeeEur = formData.childrenCount * 40;
  const totalEur = adultFeeEur + childFeeEur;
  const totalInrApprox = totalEur * 90; // approx exchange rate

  const stepsOrder: Step[] = ['strategy', 'profile', 'solvency', 'documents', 'completed'];
  const currentStepIndex = stepsOrder.indexOf(currentStep);

  const handleNext = () => {
    if (currentStepIndex < stepsOrder.length - 1) {
      setCurrentStep(stepsOrder[currentStepIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepsOrder[currentStepIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleVisaBadge = (visaName: string) => {
    setFormData((prev) => {
      const exists = prev.validOtherVisas.includes(visaName);
      if (exists) {
        return { ...prev, validOtherVisas: prev.validOtherVisas.filter((v) => v !== visaName) };
      } else {
        return { ...prev, validOtherVisas: [...prev.validOtherVisas, visaName] };
      }
    });
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    setEmailStatus('sending');

    try {
      // 1. Generate Schengen PDF
      const generated = generateSchengenVisaSummaryPDF(formData);
      setPdfResult(generated);

      // Trigger celebratory confetti
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#1e40af', '#eab308', '#ffffff', '#3b82f6']
      });

      // 2. Dispatch Email
      const emailRes = await sendVisaSummaryEmail({
        applicantName: formData.fullName || 'Europe Schengen Applicant',
        destination: `Europe Schengen (${formData.primaryDestination})`,
        visaCategory: formData.visaType,
        totalApplicants: formData.adultsCount + formData.childrenCount + formData.infantsCount,
        contactEmail: formData.email,
        contactPhone: `${formData.countryCode} ${formData.mobileNumber}`,
        pdfBase64: generated.base64,
        pdfFilename: generated.filename
      });

      if (emailRes.success) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('failed');
        setEmailError(emailRes.error || 'Failed to dispatch email');
      }
    } catch (err: any) {
      setEmailStatus('failed');
      setEmailError(err?.message || 'Error compiling summary');
    } finally {
      setIsSubmitting(false);
      setCurrentStep('completed');
    }
  };

  const getWhatsAppMessage = () => {
    const text = `Hello Aspire Consultant Team! I have prepared my Europe Schengen (${formData.primaryDestination}) visa application on your portal.
Applicant: ${formData.fullName || 'Applicant'}
Destination: ${formData.primaryDestination} (29 Schengen States)
Visa Type: ${formData.visaType}
Biometrics: ${formData.biometricVisStatus}
VFS City: ${formData.preferredVfsCity}
Applicants: ${formData.adultsCount} Adult(s), ${formData.childrenCount} Child(ren)
Please help me verify my dossier and book my VFS appointment.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const activeLandmark = SCHENGEN_LANDMARKS[currentBgIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090d16] text-[#f8fafc] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Animated Background Landscape */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLandmark.url}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.28, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeLandmark.url})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/85 to-[#090d16]/90" />
      </div>

      {/* ========================================================================= */}
      {/* LUXURY TOP HEADER: ASPIRE CONSULTANT - FILL, FILE, FLY... #VisasMadeEasy */}
      {/* ========================================================================= */}
      <header className="relative z-10 border-b border-blue-900/40 bg-[#0c1322]/85 backdrop-blur-xl shrink-0 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title="Back to Main Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 border border-blue-400/30 flex items-center justify-center text-white shadow-md shadow-blue-900/50">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-serif tracking-tight text-white">
                  Aspire Consultant
                </span>
                <span className="text-[11px] font-sans font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Schengen 29 Nations
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-blue-200">
                <span className="font-semibold text-slate-300">Fill, File, Fly...</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">#VisasMadeEasy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsChecklistModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden sm:inline">Official Document Checklist</span>
            <span className="sm:hidden">Checklist</span>
          </button>

          <a
            href={getWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Advisor Desk</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Landmark Location Tag Pill */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Europe Consular Hub: <strong className="text-white font-medium">{activeLandmark.name}</strong></span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            Universal Schengen Visa Code • VFS Global / Consular Support
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-[#111827]/90 border border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-xl">
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'strategy', label: '1. Destination', desc: 'Schengen & Dates' },
              { id: 'profile', label: '2. Profile', desc: 'Biometrics & VIS' },
              { id: 'solvency', label: '3. Solvency', desc: 'Funds & ITR' },
              { id: 'documents', label: '4. Documents', desc: 'Checklist Review' },
              { id: 'completed', label: '5. Summary', desc: 'Dossier & VFS' }
            ].map((st, idx) => {
              const isActive = currentStep === st.id;
              const isPast = stepsOrder.indexOf(currentStep) > idx;

              return (
                <div
                  key={st.id}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50'
                      : isPast
                      ? 'bg-blue-950/40 text-blue-300 border border-blue-900/40'
                      : 'text-slate-400 bg-white/5'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold">{st.label}</span>
                  <span className="text-[10px] hidden sm:inline opacity-80">{st.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* STEP 1: DESTINATION & TRAVEL STRATEGY */}
        {/* ======================================================================= */}
        {currentStep === 'strategy' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Step 1 of 5 • Destination Strategy</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Where in Europe are you traveling?
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Select your primary Schengen country where you will spend the maximum duration of stay.
                </p>
              </div>

              {/* Country Selection Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Primary Schengen Destination (29 Member States)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {SCHENGEN_COUNTRIES.map((country) => {
                    const isSelected = formData.primaryDestination === country.name;
                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            primaryDestination: country.name,
                            entryCountry: `${country.name} (${country.hub.split(' ')[0]})`
                          });
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-md ring-2 ring-blue-500/30'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{country.flag}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="mt-2">
                          <div className="text-sm font-bold text-white">{country.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{country.hub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visa Purpose & Entry Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Travel Purpose
                  </label>
                  <select
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Tourist (Type C)">Tourist & Leisure (Type C Short-Stay)</option>
                    <option value="Business & Trade Fair">Business Meetings & Trade Fairs</option>
                    <option value="Visiting Family / Friends">Visiting Family / Relatives / Friends (Invitee)</option>
                    <option value="Cultural / Sports Event">Cultural, Academic or Sports Event</option>
                    <option value="Airport Transit">Airport Transit Visa (Type A)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Number of Entries Requested
                  </label>
                  <select
                    value={formData.entryType}
                    onChange={(e) => setFormData({ ...formData, entryType: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Single Entry">Single Entry (Standard for first trip)</option>
                    <option value="Double Entry">Double Entry (Visiting non-Schengen like UK/Egypt & returning)</option>
                    <option value="Multiple Entry">Multiple Entry (1 to 5 Years Multi-Entry)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Intended Travel Duration (Days in Schengen)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={formData.travelDurationDays}
                      onChange={(e) =>
                        setFormData({ ...formData, travelDurationDays: parseInt(e.target.value) || 1 })
                      }
                      className="w-28 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none font-bold text-center"
                    />
                    <span className="text-xs text-slate-400">
                      Days (Maximum allowed is 90 days per 180-day period)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Planned Date of Travel (Approx)
                  </label>
                  <input
                    type="date"
                    value={formData.intendedTravelDate}
                    onChange={(e) => setFormData({ ...formData, intendedTravelDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Number of Applicants & Live Euro Fee Estimate */}
              <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Number of Applicants</span>
                  </span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    Official Consular Fee: €{totalEur} (~₹{totalInrApprox.toLocaleString('en-IN')})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Adults (12+ Yrs)</div>
                      <div className="text-[11px] text-slate-400">€80 fee / applicant</div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.adultsCount}
                      onChange={(e) =>
                        setFormData({ ...formData, adultsCount: Math.max(1, parseInt(e.target.value) || 1) })
                      }
                      className="w-16 px-2 py-1.5 rounded-lg bg-slate-800 text-center font-bold text-white text-sm"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Children (6-12 Yrs)</div>
                      <div className="text-[11px] text-slate-400">€40 fee (50% off)</div>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formData.childrenCount}
                      onChange={(e) =>
                        setFormData({ ...formData, childrenCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-16 px-2 py-1.5 rounded-lg bg-slate-800 text-center font-bold text-white text-sm"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Infants (&lt;6 Yrs)</div>
                      <div className="text-[11px] text-emerald-400 font-semibold">FREE (€0 Fee)</div>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={formData.infantsCount}
                      onChange={(e) =>
                        setFormData({ ...formData, infantsCount: Math.max(0, parseInt(e.target.value) || 0) })
                      }
                      className="w-16 px-2 py-1.5 rounded-lg bg-slate-800 text-center font-bold text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all active:scale-95"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: APPLICANT PROFILE & BIOMETRIC VIS STATUS */}
        {/* ======================================================================= */}
        {currentStep === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Step 2 of 5 • Applicant & Biometrics</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Applicant Profile & Biometric Status
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Provide applicant information and preferred VFS Global Application Centre in India.
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Full Name (As printed on Passport) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Passport Number (Optional at this stage)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Z1234567"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Mobile / WhatsApp Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-28 px-2 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Residential City & State
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g. New Delhi)"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-44 px-3 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Preferred VFS Global Visa Centre
                  </label>
                  <select
                    value={formData.preferredVfsCity}
                    onChange={(e) => setFormData({ ...formData, preferredVfsCity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {VFS_CENTRES_INDIA.map((vfs) => (
                      <option key={vfs} value={vfs}>
                        {vfs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Biometrics VIS Exemption Check */}
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-bold text-white">
                    Schengen VIS Biometrics Status (59-Month Rule)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    'Biometrics given within last 59 months (Waiver eligible)',
                    'Need new VFS biometrics appointment',
                    'First-time Schengen applicant'
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, biometricVisStatus: status as any })}
                      className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                        formData.biometricVisStatus === status
                          ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Valid Visas Badges (Strengthens Profile) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Other Valid International Visas Held (Click all that apply)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {['Valid US Visa (B1/B2/F1/H1B)', 'Valid UK Visa', 'Valid Canada Visa', 'Valid Australia Visa', 'Valid Japan Visa', 'Valid UAE Visa'].map(
                    (visa) => {
                      const isSelected = formData.validOtherVisas.includes(visa);
                      return (
                        <button
                          key={visa}
                          type="button"
                          onClick={() => toggleVisaBadge(visa)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{visa}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all active:scale-95"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: FINANCIAL SOLVENCY & TIES TO INDIA */}
        {/* ======================================================================= */}
        {currentStep === 'solvency' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Step 3 of 5 • Financial Solvency & Ties</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Employment, Funds & Income Proof
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Schengen consulates require proof of sufficient daily funds (~€100/day) and strong socio-economic ties to India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Current Occupation / Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Salaried Professional">Salaried Corporate Professional (Private / Govt)</option>
                    <option value="Self-Employed / Business Owner">Self-Employed / Business Owner / Director</option>
                    <option value="Freelancer / Consultant">Freelancer / Independent Consultant</option>
                    <option value="Student">Student / Research Scholar</option>
                    <option value="Retired">Retired Professional</option>
                    <option value="Homemaker">Homemaker / Non-working</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Monthly In-Hand Income
                  </label>
                  <select
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="₹50,000 – ₹1,00,000 / month">₹50,000 – ₹1,00,000 / month</option>
                    <option value="₹1,00,000 – ₹2,00,000 / month">₹1,00,000 – ₹2,00,000 / month</option>
                    <option value="₹2,00,000 – ₹4,00,000 / month">₹2,00,000 – ₹4,00,000 / month</option>
                    <option value="₹4,00,000+ / month">₹4,00,000+ / month</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Liquid Bank Balance in Savings Account
                  </label>
                  <select
                    value={formData.bankBalance}
                    onChange={(e) => setFormData({ ...formData, bankBalance: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="₹3,00,000 – ₹5,00,000">₹3,00,000 – ₹5,00,000 (Adequate for short trip)</option>
                    <option value="₹5,00,000 – ₹10,00,000">₹5,00,000 – ₹10,00,000 (Recommended standard)</option>
                    <option value="₹10,00,000 – ₹20,00,000">₹10,00,000 – ₹20,00,000 (Strong profile)</option>
                    <option value="₹20,00,000+">₹20,00,000+ (High Net Worth)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Income Tax Returns (ITR-V) Status
                  </label>
                  <select
                    value={formData.hasItr}
                    onChange={(e) => setFormData({ ...formData, hasItr: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Yes, last 2-3 years ITR-V filed">Yes, last 2-3 years ITR-V filed</option>
                    <option value="Form 16 / Salaried">Form 16 available / Salaried</option>
                    <option value="Not filed / Tax exempt">Not filed / Tax exempt (Will need Sponsor)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Trip Funding / Sponsorship
                  </label>
                  <select
                    value={formData.hasSponsor}
                    onChange={(e) => setFormData({ ...formData, hasSponsor: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Self-funded">100% Self-Funded</option>
                    <option value="Fully Sponsored by Employer">Fully Sponsored by Employer (Business Trip)</option>
                    <option value="Sponsored by Family / Host in Europe">Sponsored by Family / Host in Europe</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    €30,000 Travel Medical Insurance
                  </label>
                  <select
                    value={formData.hasTravelInsurance}
                    onChange={(e) => setFormData({ ...formData, hasTravelInsurance: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Yes, €30,000+ compliant">I have €30,000+ compliant Schengen insurance</option>
                    <option value="Need Aspire assistance with insurance">Need Aspire Consultant assistance to issue policy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all active:scale-95"
              >
                <span>Continue to Step 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* STEP 4: MANDATORY DOCUMENT REVIEW & DOSSIER READINESS */}
        {/* ======================================================================= */}
        {currentStep === 'documents' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Step 4 of 5 • Document Readiness</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Schengen Consular Dossier Verification
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Review and verify your mandatory documents before final summary compile.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChecklistModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Full Official Checklist Modal</span>
                </button>
              </div>

              {/* Checklist verification interactive cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  { id: 'passport', name: 'Original Passport (6+ Mos Validity)', desc: 'Valid for min 3 months post departure, with 2 blank pages' },
                  { id: 'photos', name: '2 Biometric Photos (35x45mm)', desc: '80% face coverage on plain white background, without glare' },
                  { id: 'insurance', name: '€30,000 Travel Medical Insurance', desc: 'Valid across all 29 Schengen states with zero deductible' },
                  { id: 'bank', name: '6-Month Bank Statements', desc: 'Original personal statements with official bank seal and signature' },
                  { id: 'itr', name: '2 Years ITR-V Acknowledgements', desc: 'Income Tax Return receipts for previous 2 assessment years' },
                  { id: 'noc', name: 'Employer Leave Approval NOC', desc: 'Original stamped letter with salary, designation, and approved dates' },
                  { id: 'itinerary', name: 'Day-to-Day Travel Itinerary', desc: 'Day-wise tour plan with intra-Europe transport details' },
                  { id: 'hotel', name: 'Confirmed Hotel Vouchers', desc: 'Covering all nights across Schengen with applicant name' },
                  { id: 'flights', name: 'Round-Trip Flight Itinerary', desc: 'Verifiable flight reservation with PNR (Hold booking)' }
                ].map((item) => {
                  const isChecked = !!checklistCompleted[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setChecklistCompleted((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-blue-950/30 border-blue-600/60 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notice Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Aspire Consultant Quality Assurance:</strong> Our dedicated Schengen consular specialists review every page of your bank statement, hotel vouchers, and employer NOC to eliminate errors that trigger common Schengen Article 8 refusals.
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-900/50 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compiling Schengen Dossier...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Consular Summary & PDF</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* STEP 5: COMPLETED - DOSSIER SUMMARY & VFS APPOINTMENT READINESS */}
        {/* ======================================================================= */}
        {currentStep === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-[#111827]/95 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-900/40">
                <BadgeCheck className="w-9 h-9 text-blue-400" />
              </div>

              <div className="max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                  Europe Schengen Dossier Ready!
                </h2>
                <p className="text-sm text-slate-300">
                  Congratulations <strong className="text-white">{formData.fullName || 'Applicant'}</strong>. Your consular dossier for <strong>{formData.primaryDestination}</strong> has been structured and recorded under case reference.
                </p>
              </div>

              {/* Summary Stats Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Destination</div>
                  <div className="text-sm font-bold text-white truncate">{formData.primaryDestination}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">VFS Centre</div>
                  <div className="text-sm font-bold text-white truncate">{formData.preferredVfsCity.split(' ')[0]}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Consular Fee</div>
                  <div className="text-sm font-bold text-amber-400">€{totalEur} (~₹{totalInrApprox.toLocaleString('en-IN')})</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Biometrics</div>
                  <div className="text-sm font-bold text-blue-400 truncate">{formData.biometricVisStatus.split(' ')[0]}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 max-w-md mx-auto space-y-3">
                {pdfResult && (
                  <a
                    href={pdfResult.base64}
                    download={pdfResult.filename}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Schengen PDF Summary</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setIsChecklistModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <FileText className="w-4 h-4 text-blue-200" />
                  <span>View Official Schengen Document Checklist</span>
                </button>

                <a
                  href={getWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect with Schengen Advisor on WhatsApp</span>
                </a>

                {onOpenConsultation && (
                  <button
                    type="button"
                    onClick={onOpenConsultation}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all border border-white/10"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Book 1-on-1 Visa Attorney Strategy Session</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================================= */}
        {/* COMPREHENSIVE SCHENGEN CONSULAR FAQ SECTION */}
        {/* ======================================================================= */}
        <section className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg sm:text-xl font-serif font-bold">
              Europe Schengen Consular & VFS FAQ
            </h3>
          </div>

          <div className="space-y-2.5">
            {SCHENGEN_FAQ_ITEMS.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-blue-300 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-300 whitespace-pre-line leading-relaxed border-t border-slate-800/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 bg-[#090d16]/90 p-4 text-center text-xs text-slate-400">
        <p>
          Aspire Consultant is a premier consular advisory service assisting applicants with Schengen visa filings, document pre-screening, and VFS Global appointment booking.
        </p>
      </footer>

      {/* DEDICATED OFFICIAL SCHENGEN DOCUMENT CHECKLIST MODAL */}
      <SchengenDocumentChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />
    </div>
  );
}
