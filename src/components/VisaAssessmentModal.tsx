import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, FileCheck2, Download, PhoneCall, Sparkles, HelpCircle, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DESTINATIONS } from '../data/visaData';
import { AssessmentFormState } from '../types';

interface VisaAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestinationId?: string;
  initialCategory?: string;
  onBookExpert: () => void;
}

// Allowed USA Visa Categories
const USA_VISA_CATEGORIES = [
  {
    title: 'Tourist & Business Visa',
    category: 'Leisure & Commerce (B1/B2)',
    desc: 'Tourism, family visits, business meetings, and conference attendances.',
  },
  {
    title: 'Work Visa & Intra-Company Transfers',
    category: 'Employment & Specialty (H-1B, L-1, O-1)',
    desc: 'Approved petition holders, intra-company executive transfers, and skilled talent.',
  },
  {
    title: 'Student Visa & Higher Education',
    category: 'Academic & Exchange (F-1, M-1, J-1)',
    desc: 'University scholars, college degree students, and exchange visitors.',
  }
];

// Allowed Non-USA Visa Categories (Strictly Tourist & Business Visa only)
const OTHER_VISA_CATEGORIES = [
  {
    title: 'Tourist & Business Visa',
    category: 'Visitor & Standard Entry',
    desc: 'Short-stay tourism, family visits, holidays, and corporate business delegations.',
  }
];

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
    visaCategory: initialCategory || 'Tourist & Business Visa',
    hasDs160Confirmation: 'no',
    nationality: 'India',
    passportValidityMonths: 18,
    purpose: 'Tourism & Leisure',
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
  const [downloadedDs160, setDownloadedDs160] = useState(false);
  const [downloadedChecklist, setDownloadedChecklist] = useState(false);

  // Sync initial props if changed
  useEffect(() => {
    if (initialDestinationId) {
      const isUsa = initialDestinationId === 'usa';
      setForm((prev) => ({
        ...prev,
        destinationId: initialDestinationId,
        visaCategory: isUsa ? (initialCategory || 'Tourist & Business Visa') : 'Tourist & Business Visa'
      }));
    }
  }, [initialDestinationId, initialCategory]);

  if (!isOpen) return null;

  const isUSA = form.destinationId === 'usa';
  const isUSATourist = isUSA && form.visaCategory === 'Tourist & Business Visa';
  const currentDestination = DESTINATIONS.find((d) => d.id === form.destinationId) || DESTINATIONS[0];
  const availableCategories = isUSA ? USA_VISA_CATEGORIES : OTHER_VISA_CATEGORIES;

  // Handle destination selection
  const handleSelectDestination = (destId: string) => {
    const isNewDestUSA = destId === 'usa';
    setForm((prev) => ({
      ...prev,
      destinationId: destId,
      visaCategory: isNewDestUSA ? prev.visaCategory : 'Tourist & Business Visa'
    }));
  };

  const handleNext = () => {
    if (step === 3) {
      // Final submission to compute result
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
      }, 600);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Calculate realistic match score
  const calculateScore = () => {
    let score = 96;
    if (form.hasPreviousRefusal) score -= 9;
    if (form.passportValidityMonths < 6) score -= 14;
    if (form.fundsAvailability === 'Under $5,000') score -= 12;
    if (form.employmentStatus === 'Unemployed') score -= 10;
    if (isUSATourist && form.hasDs160Confirmation === 'no') {
      // Not having DS-160 ready is normal at pre-filing stage
      score -= 2;
    }
    return Math.max(70, score);
  };

  const eligibilityScore = calculateScore();

  // Trigger DS-160 Offline Preparation Excel / CSV Spreadsheet Download
  const handleDownloadDS160 = () => {
    const csvRows = [
      ['ASPIRE TRAVELS — DS-160 VISA APPLICATION PREPARATION WORKSHEET (EXCEL TEMPLATE)'],
      ['NOTICE: This is an offline preparatory worksheet to collect and organize information prior to official online filing on the CEAC website (ceac.state.gov).'],
      [''],
      ['Case Reference', caseReference || 'ASP-NEW-FILE', 'Target Destination', 'United States of America (USA)'],
      ['Applicant Name', form.fullName || 'Applicant', 'Visa Category', form.visaCategory],
      ['Date Generated', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 'Primary Nationality', form.nationality],
      [''],
      ['Section', 'Field Name', 'Description / Question', 'Example Format / Guidelines', 'Applicant Value / Response'],
      ['1. Personal Information', 'Surname / Last Name', 'Last name as printed in passport', 'Capital letters matching machine-readable zone', form.fullName ? form.fullName.split(' ').slice(-1)[0] : ''],
      ['1. Personal Information', 'Given Names / First Name', 'First and middle names as in passport', 'e.g. Johnathan Robert', form.fullName ? form.fullName.split(' ').slice(0, -1).join(' ') : ''],
      ['1. Personal Information', 'Full Name in Native Alphabet', 'Native script if applicable', 'e.g. Devanagari, Hanzi, Arabic, or N/A', 'N/A'],
      ['1. Personal Information', 'Other Names / Aliases', 'Maiden, religious, professional alias', 'Yes / No (Specify if Yes)', 'No'],
      ['1. Personal Information', 'Gender', 'Gender identification', 'Male / Female / Other', ''],
      ['1. Personal Information', 'Marital Status', 'Current legal civil status', 'Single / Married / Common-Law / Divorced / Widowed', ''],
      ['1. Personal Information', 'Date of Birth', 'Day, Month, Year of birth', 'DD/MM/YYYY', ''],
      ['1. Personal Information', 'City & Country of Birth', 'Place of birth as in passport', 'e.g. Mumbai, India', ''],
      ['1. Personal Information', 'Primary Nationality', 'Country of current citizenship', 'e.g. India', form.nationality],
      ['1. Personal Information', 'Other Nationalities Held', 'Dual citizenship or permanent residency', 'Yes / No (Specify countries if Yes)', 'No'],
      ['1. Personal Information', 'National ID Number', 'National citizen identifier', 'Enter ID number or N/A', ''],
      ['1. Personal Information', 'U.S. Social Security Number', 'Previously issued U.S. SSN', '9 digits or N/A', 'N/A'],
      ['1. Personal Information', 'U.S. Taxpayer ID Number', 'Previously issued ITIN', '9 digits or N/A', 'N/A'],
      ['2. Travel Information', 'Purpose of Trip to U.S.', 'Visa Classification category', 'Temporary Visitor for Tourism & Business (B1/B2)', 'B1/B2'],
      ['2. Travel Information', 'Specific Travel Plans', 'Whether exact dates & hotels are finalized', 'Yes / No', 'Yes'],
      ['2. Travel Information', 'Intended Date of Arrival', 'Estimated date of U.S. arrival', 'DD/MM/YYYY', form.travelDate],
      ['2. Travel Information', 'Intended Length of Stay', 'Duration in U.S.', 'e.g. 18 Days', ''],
      ['2. Travel Information', 'U.S. Accommodation Address', 'Hotel name or host address in U.S.', 'Street, City, State, ZIP', ''],
      ['2. Travel Information', 'Entity Paying for Trip', 'Payer of travel and stay expenses', 'Self-Funded / Company / Host Sponsor', 'Self-Funded'],
      ['3. Travel Companions', 'Traveling with Others?', 'Persons traveling in party', 'Yes / No (Specify names if Yes)', 'No'],
      ['4. Previous U.S. Travel', 'Previous U.S. Visits', 'Prior visits to the United States', 'Yes / No (Specify arrival dates & durations)', 'No'],
      ['4. Previous U.S. Travel', 'Previous U.S. Visa Issuance', 'Previously issued U.S. visa foils', 'Yes / No (Specify visa number if Yes)', 'No'],
      ['4. Previous U.S. Travel', 'Previous Visa Refusals', 'Prior visa refusals or denials', `Yes / No (Pre-screen: ${form.hasPreviousRefusal ? 'Yes' : 'No'})`, form.hasPreviousRefusal ? 'Yes' : 'No'],
      ['4. Previous U.S. Travel', 'Immigrant Petition Filed', 'Has anyone filed immigrant petition for you?', 'Yes / No', 'No'],
      ['5. U.S. Contact Point', 'Contact Person / Organization', 'U.S. hotel, company, or host person', 'e.g. Marriott Downtown / Host Name', ''],
      ['5. U.S. Contact Point', 'Relationship to Applicant', 'Relationship to U.S. contact', 'Hotel / Business Associate / Relative / Friend', 'Hotel'],
      ['5. U.S. Contact Point', 'U.S. Contact Phone & Email', 'Contact telephone and email address', 'e.g. +1 555-0199 / info@hotel.com', ''],
      ['6. Family Details', "Father's Full Name & DOB", "Father's legal name and birthdate", 'Surname, Given Name, DD/MM/YYYY', ''],
      ['6. Family Details', "Mother's Full Name & DOB", "Mother's legal name and birthdate", 'Surname, Given Name, DD/MM/YYYY', ''],
      ['6. Family Details', 'Immediate Relatives in U.S.', 'Spouse, fiancé, child, sibling in U.S.', 'Yes / No (Specify status if Yes)', 'No'],
      ['7. Employment & Work', 'Primary Employment Status', 'Current employment / professional role', 'Employed / Business Owner / Student', form.employmentStatus],
      ['7. Employment & Work', 'Present Employer / Company Name', 'Official employer / business name', 'e.g. Tata Consultancy Services', ''],
      ['7. Employment & Work', 'Employer Address & Phone', 'Official company headquarters / office', 'Street, City, State, Phone', ''],
      ['7. Employment & Work', 'Monthly Gross Income', 'Monthly income in local currency', 'e.g. INR 1,80,000 / USD 2,200', ''],
      ['7. Employment & Work', 'Primary Job Duties', 'Summary of day-to-day responsibilities', 'Brief 2-3 sentence overview', ''],
      ['7. Employment & Work', 'Previous Employer (Past 5 Yrs)', 'Prior company name, title, tenure', 'Employer Name, Designation, Dates', ''],
      ['7. Employment & Work', 'Higher Education Institutions', 'University/College degrees attended', 'Institution Name, Course, Graduation Year', ''],
      [''],
      ['MANDATORY PRE-FILING AUDIT CHECKLIST'],
      ['[ ] Valid Passport with minimum 6 months validity beyond travel'],
      ['[ ] 2x2 inch (51x51mm) digital passport photo compliant with U.S. Department of State specs'],
      ['[ ] 6 months bank statements with liquid balance certificate'],
      ['[ ] Employer Leave Sanction Letter & No-Objection Certificate (NOC)'],
      ['[ ] Income Tax Returns (ITR / Form 16) for last 2 financial years'],
      [''],
      ['CONFIDENTIALITY NOTICE: Created by Aspire Travels Advisory. Prepared for: ' + (form.fullName || 'Valued Client')]
    ];

    const csvContent = csvRows
      .map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DS160_Preparation_Template_${(form.fullName || 'Aspire').replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedDs160(true);
  };

  // Trigger Verified Embassy Document Checklist Download
  const handleDownloadChecklist = () => {
    const content = `================================================================================
ASPIRE TRAVELS — EMBASSY VISA DOCUMENTATION CHECKLIST
================================================================================
CASE FILE: ${caseReference || 'ASP-2025-001'}
DESTINATION: ${currentDestination.name}
VISA CATEGORY: ${form.visaCategory}
APPLICANT: ${form.fullName || 'Valued Client'}
ESTIMATED MATCH: ${eligibilityScore}%

PRIMARY MANDATORY DOCUMENTS:
--------------------------------------------------------------------------------
[ ] 1. Valid Passport with minimum 6 months validity & 2 blank pages
[ ] 2. Two (2) compliant biometric passport photographs
[ ] 3. Confirmed round-trip flight reservations & hotel itinerary
[ ] 4. Stamped bank statements for the past 6 months showing liquid funds (${form.fundsAvailability})
[ ] 5. Proof of income / Salary slips for past 3-6 months
[ ] 6. Income Tax Returns (ITR / Form 16) for last 2 financial years
[ ] 7. Official Employment Letter with approved leave dates and NOC
[ ] 8. Travel Insurance with emergency medical coverage

DESTINATION-SPECIFIC REQUIREMENTS (${currentDestination.name.toUpperCase()}):
--------------------------------------------------------------------------------
${currentDestination.keyRequirements.map((r, i) => `[ ] ${i + 1}. ${r}`).join('\n')}

NEXT STEPS WITH YOUR ASPIRE ADVISOR:
1. Compile the documents above in high-resolution PDF format.
2. Our case team will review and audit each file for discrepancies.
3. Consular appointment slot tracking and scheduling will proceed.

Contact Aspire Travels: +91 92893 37446
================================================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AspireTravels_${currentDestination.name}_Checklist.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadedChecklist(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col">
        {/* Modal Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] border-b border-[#2d2d2d]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b8860b] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {step} of 4 &bull; Visa Journey Assessment</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] font-bold mt-1">
              Start Your Visa Journey
            </h3>
          </div>
          <button
            id="close-visa-assessment-btn"
            onClick={onClose}
            className="p-2 text-[#2d2d2d]/60 hover:text-[#2d2d2d] rounded-full hover:bg-[#2d2d2d]/5 transition-colors cursor-pointer"
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
            2. Category
          </div>
          <div className={`py-2.5 ${step >= 3 ? 'bg-[#b8860b]/15 text-[#b8860b] border-b-2 border-[#b8860b]' : 'text-[#2d2d2d]/40'}`}>
            3. Profile & Contact
          </div>
          <div className={`py-2.5 ${step >= 4 ? 'bg-[#b8860b]/15 text-[#b8860b] border-b-2 border-[#b8860b]' : 'text-[#2d2d2d]/40'}`}>
            4. Outcome & Dossier
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 flex-grow">
          {/* STEP 1: Destination Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-3">
                  Step 1 &mdash; Select Your Target Destination:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {DESTINATIONS.map((dest) => (
                    <button
                      key={dest.id}
                      id={`journey-dest-select-${dest.id}`}
                      type="button"
                      onClick={() => handleSelectDestination(dest.id)}
                      className={`p-3.5 text-left border rounded-sm transition-all text-xs flex flex-col justify-between cursor-pointer ${
                        form.destinationId === dest.id
                          ? 'border-[#b8860b] bg-[#f5f5dc] text-[#b8860b] font-bold shadow-xs scale-[1.02]'
                          : 'border-[#2d2d2d]/15 bg-white/70 text-[#2d2d2d] hover:border-[#b8860b]/40 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{dest.flag}</span>
                        <span className="font-serif text-base text-[#2d2d2d] font-semibold">{dest.name}</span>
                      </div>
                      <span className="text-[10px] text-[#2d2d2d]/60 font-sans uppercase tracking-wider block">
                        {dest.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-4 rounded-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{currentDestination.flag}</span>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#2d2d2d]">
                      {currentDestination.name} Immigrations Hub
                    </h4>
                    <p className="text-xs text-[#4a3c31] font-light mt-0.5 leading-relaxed">
                      {currentDestination.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                  Anticipated Travel Departure Date:
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

          {/* STEP 2: Visa Category (USA has 3, other destinations have 1) + DS-160 flow for USA Tourist */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d]">
                    Step 2 &mdash; Select Visa Category for {currentDestination.name}:
                  </label>
                  <span className="text-[11px] text-[#b8860b] font-semibold uppercase">
                    {isUSA ? '3 Available Categories' : 'Standard Visitor Category'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {availableCategories.map((srv, idx) => {
                    const isSelected = form.visaCategory === srv.title;
                    return (
                      <button
                        key={idx}
                        id={`category-option-${idx}`}
                        type="button"
                        onClick={() => setForm({ ...form, visaCategory: srv.title })}
                        className={`p-4 text-left border rounded-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#b8860b] bg-[#f5f5dc] shadow-sm'
                            : 'border-[#2d2d2d]/15 bg-white/70 text-[#2d2d2d] hover:border-[#b8860b]/40 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#b8860b] tracking-wider block mb-1">
                              {srv.category}
                            </span>
                            <span className="font-serif text-lg text-[#2d2d2d] font-bold block">
                              {srv.title}
                            </span>
                            <span className="text-xs text-[#4a3c31]/80 font-light mt-1 block">
                              {srv.desc}
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 shrink-0 ${
                            isSelected ? 'border-[#b8860b] bg-[#b8860b] text-white' : 'border-[#2d2d2d]/20'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DS-160 Flow for USA Tourist & Business Visa */}
              {isUSATourist && (
                <div className="bg-[#fffdd0] border-2 border-[#b8860b]/30 p-5 rounded-sm space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#b8860b] font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>U.S. Consular Form DS-160 Status</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#2d2d2d] font-medium">
                    Do you already have your DS-160 confirmation?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label
                      id="ds160-yes-option"
                      className={`p-3 border rounded-sm flex items-start gap-2.5 text-xs cursor-pointer transition-all ${
                        form.hasDs160Confirmation === 'yes'
                          ? 'border-[#b8860b] bg-[#f5f5dc] font-semibold text-[#2d2d2d]'
                          : 'border-[#2d2d2d]/15 bg-white/70 text-[#2d2d2d]/80 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ds160-status"
                        checked={form.hasDs160Confirmation === 'yes'}
                        onChange={() => setForm({ ...form, hasDs160Confirmation: 'yes' })}
                        className="text-[#b8860b] focus:ring-[#b8860b] mt-0.5"
                      />
                      <div>
                        <span className="block font-serif text-sm font-bold text-[#2d2d2d]">Yes, I have it</span>
                        <span className="text-[11px] text-[#4a3c31]/80 block font-light mt-0.5">
                          I already submitted my DS-160 and have my CEAC confirmation barcode.
                        </span>
                      </div>
                    </label>

                    <label
                      id="ds160-no-option"
                      className={`p-3 border rounded-sm flex items-start gap-2.5 text-xs cursor-pointer transition-all ${
                        form.hasDs160Confirmation === 'no'
                          ? 'border-[#b8860b] bg-[#f5f5dc] font-semibold text-[#2d2d2d]'
                          : 'border-[#2d2d2d]/15 bg-white/70 text-[#2d2d2d]/80 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ds160-status"
                        checked={form.hasDs160Confirmation === 'no'}
                        onChange={() => setForm({ ...form, hasDs160Confirmation: 'no' })}
                        className="text-[#b8860b] focus:ring-[#b8860b] mt-0.5"
                      />
                      <div>
                        <span className="block font-serif text-sm font-bold text-[#2d2d2d]">No, not yet</span>
                        <span className="text-[11px] text-[#4a3c31]/80 block font-light mt-0.5">
                          I have not completed or submitted my DS-160 application yet.
                        </span>
                      </div>
                    </label>
                  </div>

                  {form.hasDs160Confirmation === 'no' && (
                    <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-3 rounded-xs flex items-start gap-2.5 text-xs text-[#4a3c31]">
                      <FileSpreadsheet className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#2d2d2d] block">Downloadable Offline Preparation Template Available</span>
                        <span className="text-[11px] font-light leading-relaxed">
                          You do not need to pause your assessment. Upon completing this flow, you will be able to download our offline DS-160 preparation template to organize all your details beforehand.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Profile & Solvency + Contact Information */}
          {step === 3 && (
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
                    placeholder="e.g. India, United States, Canada"
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
                    <option value="University Student">University Student / Scholar</option>
                    <option value="Retired / Independent Investor">Retired / Independent Investor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-[#2d2d2d] mb-2">
                    Estimated Available Funds (Liquid Balance):
                  </label>
                  <select
                    value={form.fundsAvailability}
                    onChange={(e) => setForm({ ...form, fundsAvailability: e.target.value })}
                    className="w-full bg-white border border-[#2d2d2d]/15 p-3 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                  >
                    <option value="₹10,00,000 – ₹25,00,000">₹10,00,000 – ₹25,00,000 (Recommended Standard)</option>
                    <option value="₹25,00,000 – ₹50,00,000">₹25,00,000 – ₹50,00,000 (High Solvency)</option>
                    <option value="₹50,00,000+">₹50,00,000+ (Executive / Investor Tier)</option>
                    <option value="₹5,00,000 – ₹10,00,000">₹5,00,000 – ₹10,00,000 (Standard Minimum)</option>
                    <option value="Under ₹5,00,000">Under ₹5,00,000 (Co-Sponsor Recommended)</option>
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
                <div className="flex gap-6">
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

              {/* Contact Info to Receive Case File */}
              <div className="pt-4 border-t border-[#2d2d2d]/10 space-y-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">
                    Applicant Contact Details
                  </h4>
                  <p className="text-xs text-[#4a3c31]/80 font-light">
                    Provide your contact details so our case team can register your file and dispatch your dossier.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2d2d2d] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Johnathan Doe"
                      className="w-full bg-white border border-[#2d2d2d]/15 p-2.5 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2d2d2d] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-white border border-[#2d2d2d]/15 p-2.5 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#2d2d2d] mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-[#2d2d2d]/15 p-2.5 text-xs text-[#2d2d2d] rounded-sm focus:border-[#b8860b] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Outcome & Actionable Next Steps */}
          {step === 4 && (
            <div className="py-2 space-y-6">
              {/* Header Box */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#b8860b]/15 text-[#b8860b] flex items-center justify-center mx-auto mb-2">
                  <FileCheck2 className="w-7 h-7" />
                </div>
                <span className="text-xs uppercase tracking-widest text-[#b8860b] font-bold block">
                  File Registered &bull; {caseReference}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] font-bold">
                  Your Visa Assessment is Complete!
                </h3>
                <p className="text-xs sm:text-sm text-[#4a3c31] max-w-xl mx-auto font-light leading-relaxed">
                  We have mapped your profile against current consular benchmarks for{' '}
                  <span className="font-semibold text-[#2d2d2d]">{currentDestination.name}</span> ({form.visaCategory}).
                </p>
              </div>

              {/* Assessment Score Card */}
              <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-5 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl">{currentDestination.flag}</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#b8860b] tracking-wider block">
                      Audited Pre-Filing Match
                    </span>
                    <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">
                      {currentDestination.name} &bull; {form.visaCategory}
                    </h4>
                    <span className="text-xs text-[#4a3c31]/80 block font-light">
                      Estimated Consular Turnaround: {currentDestination.averageProcessingTime}
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-white/70 px-4 py-2 rounded-sm border border-[#2d2d2d]/10 shrink-0">
                  <span className="text-3xl font-serif font-bold text-[#b8860b] block leading-none">
                    {eligibilityScore}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#2d2d2d]/60 block mt-0.5">
                    Eligibility Rating
                  </span>
                </div>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DS-160 Preparation Template Card (Only shown if USA Tourist & Business) */}
                {isUSATourist && (
                  <div className={`p-5 rounded-sm border transition-all flex flex-col justify-between ${
                    form.hasDs160Confirmation === 'no'
                      ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                      : 'bg-[#f5f5dc] border-[#2d2d2d]/10'
                  }`}>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b8860b] font-bold mb-1.5">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>DS-160 Offline Template</span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#2d2d2d] mb-1">
                        Download DS-160 Form / Excel Template
                      </h4>
                      <p className="text-xs text-[#4a3c31] font-light leading-relaxed mb-3">
                        Use this offline template to compile and review your personal, travel, family, and employment details before filing online.
                      </p>
                    </div>

                    <div>
                      <button
                        id="download-ds160-template-btn"
                        onClick={handleDownloadDS160}
                        className={`w-full py-2.5 px-4 text-xs uppercase tracking-widest font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs ${
                          downloadedDs160
                            ? 'bg-green-700 text-white'
                            : 'bg-[#b8860b] hover:bg-[#9a7009] text-white'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadedDs160 ? 'Template Downloaded ✓' : 'Download DS-160 Form / Excel Template'}</span>
                      </button>

                      <div className="flex items-center gap-1 text-[10px] text-[#2d2d2d]/60 mt-2">
                        <ShieldAlert className="w-3 h-3 text-[#b8860b] shrink-0" />
                        <span>Offline preparation worksheet &bull; Not an official government submission form.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verified Embassy Checklist Card */}
                <div className="bg-[#f5f5dc] border border-[#2d2d2d]/10 p-5 rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b8860b] font-bold mb-1.5">
                      <Download className="w-4 h-4" />
                      <span>Embassy Checklist</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#2d2d2d] mb-1">
                      {currentDestination.name} Document Checklist
                    </h4>
                    <p className="text-xs text-[#4a3c31] font-light leading-relaxed mb-3">
                      Complete list of mandatory bank proof, employment NOC, travel insurance, and consular requirements for your trip.
                    </p>
                  </div>

                  <button
                    id="download-embassy-checklist-btn"
                    onClick={handleDownloadChecklist}
                    className={`w-full py-2.5 px-4 text-xs uppercase tracking-widest font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
                      downloadedChecklist
                        ? 'bg-green-700 text-white border-green-700'
                        : 'border-[#2d2d2d]/30 hover:bg-[#2d2d2d]/5 text-[#2d2d2d]'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadedChecklist ? 'Checklist Downloaded ✓' : 'Download Document Checklist'}</span>
                  </button>
                </div>

                {/* Talk to an Expert / Consultation Card */}
                <div className={`p-5 rounded-sm border border-[#2d2d2d]/10 bg-[#f5f5dc] flex flex-col justify-between ${!isUSATourist ? 'sm:col-span-1' : 'sm:col-span-2'}`}>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#b8860b] font-bold mb-1.5">
                      <PhoneCall className="w-4 h-4" />
                      <span>Direct Advisory</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#2d2d2d] mb-1">
                      1-on-1 Visa Consultation & Appointment Booking
                    </h4>
                    <p className="text-xs text-[#4a3c31] font-light leading-relaxed mb-3">
                      Speak directly with our team for priority interview booking, document audit, and mock interview coaching.
                    </p>
                  </div>

                  <button
                    id="outcome-book-expert-btn"
                    onClick={() => {
                      onClose();
                      onBookExpert();
                    }}
                    className="w-full bg-[#131b2e] hover:bg-black text-white py-2.5 px-4 text-xs uppercase tracking-widest font-semibold rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Talk to an Expert Now</span>
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
              id="journey-modal-back-btn"
              onClick={handlePrev}
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#2d2d2d]/70 hover:text-[#2d2d2d] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              id="journey-modal-next-btn"
              onClick={handleNext}
              disabled={isSubmitting || (step === 3 && (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()))}
              className="bg-[#b8860b] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#9a7009] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>{step === 3 ? (isSubmitting ? 'Generating File...' : 'Generate Case Dossier') : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="journey-modal-close-btn"
              onClick={onClose}
              className="bg-[#2d2d2d] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Close Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
