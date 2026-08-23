import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Sparkles,
  Plane,
  Shield,
  HelpCircle,
  ChevronDown,
  Info,
  Building2,
  Users,
  Award,
  ExternalLink,
  MapPin,
  HeartHandshake
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface SchengenDocumentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'tourist' | 'business' | 'invite' | 'selfemp' | 'minor';

export const SchengenDocumentChecklistModal: React.FC<SchengenDocumentChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTemplate, setActiveTemplate] = useState<'cover' | 'noc' | 'sponsor' | 'invite' | 'itinerary' | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, templateKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(templateKey);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const royalBlue = [30, 64, 175];
    const darkNavy = [15, 23, 42];
    const goldAccent = [234, 179, 8];

    // Header Background
    doc.setFillColor(royalBlue[0], royalBlue[1], royalBlue[2]);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Aspire Consultant', 16, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(238, 242, 255);
    doc.text('Fill, File, Fly... #VisasMadeEasy', 16, 23);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.text('Europe Schengen Visa Document Checklist', 210 - 16, 20, { align: 'right' });

    let yPos = 42;

    // Section 1 Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text('1. Europe Schengen Tourist Visa (Type C) Mandatory Checklist', 16, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Standard Dossier Requirements for 29 Schengen Member States (VFS Global / Consular Filing)', 16, yPos);
    yPos += 8;

    const touristDocs = [
      ['Current Passport', 'Valid for min 3 months beyond departure from Schengen, issued in last 10 yrs, 2 blank pages'],
      ['Previous Passports', 'All old passports + copies of previous Schengen/US/UK visas and entry/exit stamps'],
      ['Photographs (2)', '35mm x 45mm, 80% face coverage, white background, matte finish, < 6 months old'],
      ['Visa Application Form', 'Fully completed and signed at all designated signature boxes'],
      ['Personal Cover Letter', 'Comprehensive letter outlining trip purpose, travel dates, itinerary, and financial proof'],
      ['Day-to-Day Travel Itinerary', 'City-wise tour plan with intra-Schengen trains/flights and activity details'],
      ['Flight Reservation', 'Round-trip verifiable flight itinerary with PNR (Do not purchase non-refundable before visa)'],
      ['Proof of Accommodation', 'Confirmed hotel bookings/vouchers with applicant name for all nights across Schengen'],
      ['Travel Medical Insurance', 'Mandatory €30,000+ coverage across all 29 Schengen states including medical evacuation & repatriation'],
      ['Bank Statements', 'Last 6 months personal bank statements with official bank seal and signature'],
      ['Income Tax Returns (ITR)', 'ITR-V Acknowledgement receipts for the last 2 assessment years'],
      ['Employer Leave NOC', 'Original leave approval on company letterhead stating designation, salary, and approved leave'],
      ['Salary Slips', 'Original pay slips for the last 3 months with official stamp'],
      ['If Self-Employed', 'GST Registration, Certificate of Incorporation/Partnership deed + 6 months company bank statement'],
      ['If Sponsored', 'Affidavit of financial sponsorship + Sponsor 6-month bank statement + Sponsor ID/ITR'],
      ['If Visiting Family/Friends', 'Host Invitation letter + Host Resident Permit / Passport copy + Host Address & Tax proof'],
      ['If Student', 'Student ID card copy + Bonafide / Leave certificate from school or university'],
      ['If Minor (<18 yrs)', 'Notarized consent NOC signed by both parents + birth certificate + parent ID copies'],
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    touristDocs.forEach(([name, desc]) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${name}:`, 16, yPos);
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(desc, 130);
      doc.text(splitDesc, 65, yPos);
      yPos += Math.max(splitDesc.length * 4.5, 6);
    });

    yPos += 8;
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Section 2 Title (Business & Professional)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(royalBlue[0], royalBlue[1], royalBlue[2]);
    doc.text('2. Schengen Business & Conference Visa Checklist', 16, yPos);
    yPos += 7;

    const businessDocs = [
      ['Invitation Letter from EU Host', 'Official invitation on host company letterhead stating purpose, dates, and cost coverage'],
      ['Deputation / Cover Letter', 'Indian employer cover letter introducing applicant, role, and guaranteeing return'],
      ['Trade Fair / Expo Pass', 'Conference registration ticket / trade fair entry badge if applicable'],
      ['Company Financials', 'Company bank statements (last 6 months) + company ITR for 2 years (if company sponsoring)'],
    ];

    businessDocs.forEach(([name, desc]) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${name}:`, 16, yPos);
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(desc, 130);
      doc.text(splitDesc, 65, yPos);
      yPos += Math.max(splitDesc.length * 4.5, 6);
    });

    // Footer on all pages
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Aspire Consultant • Dedicated Europe Schengen Desk • Support: support@aspiretravels.in • Phone/WhatsApp: +91 92893 37446',
        105,
        290,
        { align: 'center' }
      );
    }

    doc.save('Aspire_Consultant_Schengen_Visa_Document_Checklist.pdf');
  };

  const templates = {
    cover: {
      title: 'Schengen Tourist Visa Cover Letter Template',
      code: `To,
The Visa Officer / Embassy of [Primary Schengen Country, e.g., Switzerland / France / Germany / Italy]
Consulate General of [Country Name]
[Embassy / Consulate Address, e.g., New Delhi / Mumbai, India]

Subject: Application for Schengen Short-Stay Visa (Type C - Tourist) - [Your Full Name], Passport No: [Your Passport Number]

Respected Visa Officer,

I, [Your Full Name], an Indian national holding Passport No: [Your Passport Number] (valid until [Passport Expiry Date]), am submitting my application for a Schengen Tourist Visa for a planned trip from [Intended Entry Date] to [Intended Exit Date] (Total duration: [Number of Days] days).

1. Primary Destination & Travel Plan:
The main purpose of my journey is leisure and tourism. My primary destination where I will spend the longest duration is [Main Country, e.g. Switzerland - 6 Days], along with visiting [Other Countries, e.g. France - 3 Days, Italy - 3 Days]. My port of entry into the Schengen Area will be [City/Country of Entry, e.g., Zurich Airport, Switzerland].

2. Day-to-Day Travel Itinerary:
• [Date 1 to Date 3]: Zurich & Lucerne (Staying at Hotel [Name]) - Sightseeing Mt. Titlis & Lake Lucerne
• [Date 4 to Date 6]: Interlaken & Jungfraujoch (Staying at Hotel [Name])
• [Date 7 to Date 9]: Paris, France (Travel by TGV train; Staying at Hotel [Name]) - Louvre & Eiffel Tower
• [Date 10 to Date 12]: Rome, Italy (Travel by flight; Staying at Hotel [Name]) - Colosseum & Vatican City
• [Exit Date]: Flight from Rome (FCO) back to New Delhi (DEL), India.

3. Professional & Financial Standing in India:
I am currently working as [Your Job Title] at [Company Name] in [City], earning an annual salary of INR [Your Salary]. My employer has sanctioned my annual leave from [Leave Start Date] to [Leave End Date] (Leave NOC enclosed).
All expenses including international airfare, internal European transport, hotels, food, sightseeing, and medical emergencies will be completely self-financed by me. My 6-month bank statement reflects a healthy closing balance of INR [Bank Balance], and my last 2 years' ITR-V forms are attached.

4. Travel Health Insurance:
I have secured a Schengen-compliant Travel Medical Insurance policy with [Insurance Company Name] (Policy No: [Policy Number]) providing emergency medical and repatriation coverage up to €[Coverage Amount, e.g., 50,000 / 100,000], valid across all 29 Schengen states with zero deductible.

5. Ties to India:
I have strong familial, economic, and professional ties in India. I reside with my family in [City], and I am committed to resuming my corporate responsibilities on [Date of Return to Work]. I assure the consulate that I will strictly follow Schengen immigration rules and depart Europe before the expiration of my visa.

Enclosed Documents:
1. Original Passport + Previous Passports & Visa copies
2. Completed & Signed Schengen Visa Application Form
3. 2 Recent Biometric Photographs (35x45mm, 80% face view)
4. Comprehensive Day-by-Day Travel Itinerary
5. Confirmed Round-Trip Flight Itinerary & Hotel Vouchers
6. €30,000+ Schengen Travel Medical Insurance Policy
7. Original 6-Month Bank Statements (stamped by bank) & 2 Years ITR-V
8. Employer Leave Approval Letter (NOC) & Recent 3 Months Salary Slips

Thank you for reviewing my application.

Sincerely,
[Your Full Name]
[Your Mobile Number & WhatsApp]
[Your Email Address]
[Your Full Residential Address]`,
    },
    noc: {
      title: 'Employer Leave Approval / NOC Template',
      code: `[ON OFFICIAL COMPANY LETTERHEAD]

Date: [DD/MM/YYYY]

To,
The Visa Officer
Embassy / Consulate General of [Schengen Country Name]
Visa Section, India

Subject: No Objection Certificate (NOC) & Sanctioned Annual Leave for [Employee Name]

This is to certify that [Employee Full Name] is employed with [Company Name] as a permanent, full-time employee holding the position of [Job Designation] in our [Department Name] team since [Date of Joining / Hire].

Employment Summary:
• Employee ID: [Employee ID]
• Date of Hire: [Date of Hire, e.g., 10th June 2021]
• Current Gross Monthly Salary: INR [Monthly Salary] (Annual CTC: INR [Annual CTC])
• Office Address: [Company Physical Headquarters Address]
• Company Contact: [HR Telephone & Official Email]

We confirm that [Employee Name] has been granted sanctioned annual leave from [Leave Start Date] to [Leave End Date] for personal vacation and tourism in Europe (Schengen Area).

We have No Objection to their travel to the Schengen Area during this period. We confirm that [Employee Name] will resume their regular duties with our organization upon return on [Date of Resuming Work].

Authorized Signatory:
[Signature]
Name: [Signatory Full Name]
Designation: [e.g., Head of Human Resources / Director]
Company Seal: [Official Stamp]
Email: hr@[company].com | Direct Phone: [Phone]`,
    },
    sponsor: {
      title: 'Schengen Sponsorship Declaration & Affidavit',
      code: `To,
The Visa Officer
Embassy / Consulate General of [Schengen Member State]

Subject: Affidavit of Financial Sponsorship for [Applicant Full Name] (Passport No: [Passport Number])

Respected Visa Officer,

I, [Sponsor Full Name], residing at [Sponsor Full Address], citizen/permanent resident of [Country], hereby declare that I am the [Relationship, e.g., Father / Mother / Brother / Spouse] of [Applicant Full Name], holder of Indian Passport No: [Applicant Passport Number].

I confirm that I am fully sponsoring all financial expenses for [Applicant Name]'s upcoming tourist trip to the Schengen Area from [Arrival Date] to [Departure Date].

Sponsorship Undertaking Covers:
1. International round-trip flight tickets
2. Accommodation, local transport (trains/buses), and daily living allowance
3. Schengen Travel Medical Insurance (€30,000+ coverage)
4. Any unforeseen medical or emergency evacuation costs

Financial Capacity Proof Enclosed:
• My certified bank statements for the last 6 months
• Proof of income / employment / Tax Returns (ITR / Form 16)
• Proof of relationship ([Birth Certificate / Marriage Certificate])
• Copy of my Passport / National ID

I guarantee that [Applicant Name] will maintain temporary visitor status and return to India prior to the expiration of their authorized Schengen stay.

Sincerely,
[Sponsor Full Name]
[Signature]
Date: [DD/MM/YYYY]
Contact Phone: [Phone] | Email: [Email]`,
    },
    invite: {
      title: 'Host Invitation & Accommodation Letter (Europe)',
      code: `To,
The Visa Officer
Embassy / Consulate General of [Schengen Country Name, e.g., Switzerland / Germany]

Subject: Letter of Invitation & Accommodation Guarantee for [Applicant Full Name]

Dear Visa Officer,

I, [Host Full Name], residing at [Full European Residential Address], contact number [European Phone Number], email [Host Email], hereby invite [Applicant Full Name] (Passport No: [Passport Number], DOB: [DD/MM/YYYY], residing in [City, India]) to visit me in [Country] from [Planned Arrival Date] to [Planned Departure Date].

Host Profile:
• Status in Country: [Citizen / Permanent Resident (PR) / Long-Term Work Visa Holder]
• Profession: [Host Job Title] at [Host Company Name]
• Residential Property: [Apartment / House with private guest room at above address]

Purpose of Visit & Accommodation:
[Applicant Name] is my [Relationship: e.g. Mother / Father / Brother / Friend]. During their stay in the Schengen Area, they will be staying with me at my residence at [Full Address]. I will ensure their comfortable lodging, meals, and local guidance throughout their stay.

Attached Host Documents:
1. Copy of my Passport & European Residence Permit (Aufenthaltstitel / Carte de Séjour / Swiss B/C Permit)
2. Proof of Residence (Tenancy Agreement / Title Deed / Recent Utility Bill)
3. Proof of Income (Salary Slips / Tax Assessment / Bank Statements)
4. Proof of relationship ([Birth / Marriage certificate])

[Applicant Name] has strong socio-economic ties to India and will depart the Schengen Area before their visa expires.

Sincerely,
[Host Full Name]
[Signature]
Date: [DD/MM/YYYY]`,
    },
    itinerary: {
      title: 'Day-to-Day Schengen Multi-City Itinerary Template',
      code: `SCHENGEN DAY-TO-DAY TOUR ITINERARY
Applicant: [Your Full Name] | Passport: [Your Passport Number] | Duration: [Total Days] Days

Day 01: [Date] - Arrival in Zurich, Switzerland
• Flight arrival at Zurich Airport (ZRH) from New Delhi (DEL)
• Transfer to Hotel [Name], check-in & relax. Evening walk around Lake Zurich & Old Town (Altstadt).

Day 02: [Date] - Zurich & Rhine Falls
• Morning excursion to Rhine Falls (Europe's largest waterfall) by train.
• Afternoon visit to Swiss National Museum & Bahnhofstrasse. Overnight in Zurich.

Day 03: [Date] - Lucerne & Mount Titlis
• Morning scenic train from Zurich to Lucerne (45 mins).
• Cable car excursion to Mount Titlis (Rotair revolving cable car & Cliff Walk).
• Evening visit to Chapel Bridge & Lion Monument. Overnight in Lucerne.

Day 04: [Date] - Interlaken & Jungfraujoch (Top of Europe)
• Scenic train to Interlaken. Check-in at Hotel [Name].
• Cogwheel train to Jungfraujoch (3,454m), Ice Palace, and Sphinx Observatory. Overnight in Interlaken.

Day 05: [Date] - Interlaken to Paris, France (Cross-Border)
• Morning TGV Lyria high-speed train from Basel/Interlaken to Paris Gare de Lyon.
• Check-in at Hotel [Name], Paris. Evening Seine River cruise & Eiffel Tower illumination.

Day 06: [Date] - Paris Cultural Tour
• Morning guided visit to Louvre Museum (Mona Lisa, Venus de Milo).
• Afternoon stroll along Champs-Élysées & Arc de Triomphe. Overnight in Paris.

Day 07: [Date] - Versailles & Montmartre
• Day trip to Palace of Versailles & Gardens.
• Evening visit to Sacré-Cœur Basilica in Montmartre. Overnight in Paris.

Day 08: [Date] - Paris to Rome, Italy (Cross-Border)
• Morning short-haul flight from Paris (CDG) to Rome (FCO).
• Check-in at Hotel [Name], Rome. Evening walk to Trevi Fountain & Spanish Steps.

Day 09: [Date] - Ancient Rome & Colosseum
• Morning tour of the Colosseum, Roman Forum, and Palatine Hill.
• Afternoon visit to Pantheon and Piazza Navona. Overnight in Rome.

Day 10: [Date] - Vatican City & Departure Preparation
• Morning tour of St. Peter's Basilica & Vatican Museums (Sistine Chapel).
• Afternoon souvenir shopping and packing. Overnight in Rome.

Day 11: [Date] - Departure to India
• Check-out from hotel, transfer to Rome Fiumicino Airport (FCO).
• Board return international flight to New Delhi (DEL), India.`,
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-[#ffffff] text-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        {/* ========================================================================= */}
        {/* HEADER: ASPIRE CONSULTANT - FILL, FILE, FLY... #VisasMadeEasy */}
        {/* ========================================================================= */}
        <div className="relative bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white p-6 sm:p-7 border-b border-blue-300/30 overflow-hidden shrink-0 print:bg-blue-700 print:p-4">
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-36 h-36 rounded-full bg-blue-300/20 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold">
                  <Plane className="w-4 h-4 -rotate-45" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 font-serif">
                  <span>Aspire Consultant</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-100 pl-10.5">
                <span className="tracking-wide">Fill, File, Fly...</span>
                <span className="text-blue-200/80">•</span>
                <span className="text-amber-300 font-bold tracking-wider">#VisasMadeEasy</span>
              </div>
              <p className="text-xs text-white/90 font-medium pl-10.5 pt-1">
                Europe Schengen Visa Document Checklist & Consular Filing Dossier (29 Member States)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 print:hidden self-start md:self-center">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all active:scale-95 shadow-sm"
                title="Print Checklist"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-blue-950 hover:bg-amber-300 border border-amber-300 text-xs font-bold shadow-md transition-all active:scale-95"
                title="Download as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="mt-5 pt-4 border-t border-white/20 flex items-center gap-2 overflow-x-auto no-scrollbar print:hidden">
            {[
              { id: 'all', label: 'All Schengen Requirements' },
              { id: 'tourist', label: '1. Tourist Visa (Type C)' },
              { id: 'business', label: '2. Business & Conference' },
              { id: 'invite', label: '3. Visiting Family / Host' },
              { id: 'selfemp', label: '4. Self-Employed / Business' },
              { id: 'minor', label: '5. Students & Minors' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#1e40af] shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY (SCROLLABLE DOCUMENT CHECKLIST TABLES) */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-8 flex-1 bg-[#fafaf9] print:p-2 print:overflow-visible">
          {/* Helpful applicant guidance note */}
          <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 flex items-start gap-3 print:hidden">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950 space-y-0.5 leading-relaxed">
              <span className="font-bold text-blue-900">Schengen Consular Filing Rule (Main Destination vs First Entry):</span>
              <p>
                Apply at the Embassy/VFS of the country where you will spend the **maximum number of nights** (Main Destination). If spending equal nights in multiple Schengen countries, apply at the country of **first point of entry**. Click any row checkbox to tick off your ready documents.
              </p>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 1: SCHENGEN TOURIST VISA DOCUMENT CHECKLIST */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'tourist') && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-blue-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Europe Schengen Tourist Visa Document Checklist</span>
                    <span className="text-xs font-sans font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      Short-Stay Type C
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Universal consular documentation requirements for Indian passport holders traveling across Switzerland and 28 other Schengen member states
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-3.5 w-10 text-center">Ready</th>
                        <th className="py-3 px-3.5 w-48 sm:w-56">Name of the Document</th>
                        <th className="py-3 px-3.5">Description & Consular Requirements</th>
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Format / Template</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      {/* 1. Passport */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_passport']}
                            onChange={() => toggleCheck('schengen_passport')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Original Passport</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Must be valid for at least 3 months beyond intended departure from Schengen, issued within the last 10 years, and contain at least 2 blank visa pages.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Original + Copies</td>
                      </tr>

                      {/* 2. Previous Passports & Visas */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_old_passports']}
                            onChange={() => toggleCheck('schengen_old_passports')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Old Passports & Stamps</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Original old passport(s) + photocopies of all previously issued Schengen visas, valid US/UK/Canada visas, and all international entry/exit stamps.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">All Past Visas</td>
                      </tr>

                      {/* 3. Photographs */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-amber-50/30">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_photos']}
                            onChange={() => toggleCheck('schengen_photos')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Passport Photographs (2)</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Size: 35mm x 45mm, matte or semi-matte finish</li>
                            <li>White background with 70–80% close-up face coverage</li>
                            <li>Neutral facial expression, no spectacles / tinted glasses, not older than 6 months</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-amber-800 font-bold text-[11px]">35x45mm ICAO Spec</td>
                      </tr>

                      {/* 4. Travel Medical Insurance */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-blue-50/40">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_insurance']}
                            onChange={() => toggleCheck('schengen_insurance')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-blue-900">
                          Travel Medical Insurance (€30,000)
                        </td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Mandatory minimum medical cover of €30,000 (or equivalent in USD/INR)</li>
                            <li>Valid across all 29 Schengen member states for entire duration of trip</li>
                            <li>Covers emergency medical treatment, hospitalisation, and repatriation</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-blue-700 font-bold text-[11px]">€30k+ Policy</td>
                      </tr>

                      {/* 5. Cover Letter */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_cover_letter']}
                            onChange={() => toggleCheck('schengen_cover_letter')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Personal Cover Letter</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Addressed to the Visa Officer / Embassy stating applicant details, complete itinerary, purpose of stay, expense sponsorship, and assurance of return to India.
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('cover')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Cover Letter Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 6. Day-to-Day Travel Itinerary */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_itinerary']}
                            onChange={() => toggleCheck('schengen_itinerary')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Day-to-Day Itinerary</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Detailed day-wise travel schedule showing dates, cities (e.g. Zurich, Interlaken, Paris, Rome), sightseeing plans, and internal European transport (TGV/Eurail/flights).
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('itinerary')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Itinerary Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 7. Flight Reservation */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_flights']}
                            onChange={() => toggleCheck('schengen_flights')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Flight Reservation</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Confirmed round-trip flight booking / flight itinerary showing arrival and departure from Schengen with verifiable PNR. (Do not purchase confirmed non-refundable tickets prior to visa approval).
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Flight Itinerary</td>
                      </tr>

                      {/* 8. Proof of Accommodation */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_hotel']}
                            onChange={() => toggleCheck('schengen_hotel')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Proof of Accommodation</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Confirmed hotel bookings / AirBnb vouchers covering all nights of the planned stay in the Schengen Area with the applicant's name clearly mentioned.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Hotel Vouchers</td>
                      </tr>

                      {/* 9. Bank Statement */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-blue-50/30">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_bank']}
                            onChange={() => toggleCheck('schengen_bank')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Bank Statements (6 Months)</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Personal original bank statement for the last 6 months with official bank seal and signature on every page</li>
                            <li>Recommended minimum balance: ₹4,00,000–₹8,00,000+ to demonstrate solvency (~€100/day + flights & hotels)</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-blue-700 font-bold text-[11px]">6 Months Sealed</td>
                      </tr>

                      {/* 10. Income Tax Returns */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_itr']}
                            onChange={() => toggleCheck('schengen_itr')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Income Tax Returns (ITR)</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          ITR-V (Income Tax Return Verification / Acknowledgement) receipts for the last 2 assessment years or Form 16.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">2 Years ITR-V</td>
                      </tr>

                      {/* 11. Employer Leave Approval / NOC */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_noc']}
                            onChange={() => toggleCheck('schengen_noc')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Employer NOC & Leave Letter</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Original signed & stamped letter on company letterhead mentioning employee designation, date of joining, current salary, and approved leave dates.
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('noc')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Employer NOC Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 12. Salary Slips */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['schengen_salary_slips']}
                            onChange={() => toggleCheck('schengen_salary_slips')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Salary Slips (Last 3 Months)</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Original pay slips for the past 3 consecutive months with company seal and signature.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Last 3 Months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 2: BUSINESS & CONFERENCE VISA CHECKLIST */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'business') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-indigo-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Schengen Business & Conference Visa Checklist</span>
                    <span className="text-xs font-sans font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      Trade / Meetings / Expo
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Additional documents required for corporate travelers attending meetings, conferences, or trade fairs in Europe
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-indigo-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-3.5 w-10 text-center">Ready</th>
                        <th className="py-3 px-3.5 w-48 sm:w-56">Name of the Document</th>
                        <th className="py-3 px-3.5">Description</th>
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['biz_invite']}
                            onChange={() => toggleCheck('biz_invite')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Invitation Letter from EU Host</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Official signed letter from the European partner company/organization on company letterhead stating purpose of meetings, dates, location, and expense undertaking.
                        </td>
                        <td className="py-3 px-3.5 text-right text-indigo-700 font-bold text-[11px]">Host Letterhead</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['biz_deputation']}
                            onChange={() => toggleCheck('biz_deputation')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Indian Employer Deputation Letter</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Company cover letter introducing the applicant, their corporate seniority, purpose of delegation, and confirming that the employer will cover all travel and lodging expenses.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Employer Letter</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['biz_trade_fair']}
                            onChange={() => toggleCheck('biz_trade_fair')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Trade Fair / Exhibition Pass</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Entry badge / exhibitor registration confirmation (if attending expos like Baselworld, Hannover Messe, Paris Air Show, etc.).
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Exhibition Pass</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 3: VISITING FAMILY & FRIENDS (HOST INVITEE) */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'invite') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-purple-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Visiting Family & Friends (Private Host Invitation)</span>
                    <span className="text-xs font-sans font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      Host Sponsorship
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For applicants staying with family members or friends residing in the Schengen Area
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-purple-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-3.5 w-10 text-center">Ready</th>
                        <th className="py-3 px-3.5 w-48 sm:w-56">Name of the Document</th>
                        <th className="py-3 px-3.5">Description</th>
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Template</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['inv_host_letter']}
                            onChange={() => toggleCheck('inv_host_letter')}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Host Invitation Letter</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Signed letter from host in Europe stating applicant passport details, relationship, exact residential address where applicant will stay, and duration of visit.
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('invite')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Host Invitation Template</span>
                          </button>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['inv_host_legal']}
                            onChange={() => toggleCheck('inv_host_legal')}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Host Legal Status & ID</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Copy of host's European passport / PR card / valid National Residence Permit (e.g. Swiss B/C Permit, German Aufenthaltstitel, French Carte de Séjour).
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['inv_host_residence']}
                            onChange={() => toggleCheck('inv_host_residence')}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Proof of Residence & Tax</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Host tenancy agreement or property ownership deed + latest utility bill + host pay slips / tax assessment if sponsoring expenses.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Tenancy / Tax Proof</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['inv_relation']}
                            onChange={() => toggleCheck('inv_relation')}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Proof of Relationship</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Birth Certificate, Marriage Certificate, or family book establishing direct connection to the European host.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Relationship Proof</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 4: SELF-EMPLOYED & BUSINESS OWNERS */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'selfemp') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-emerald-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Self-Employed, Freelancers & Business Owners</span>
                    <span className="text-xs font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Commercial Standing
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Corporate establishment documents required to verify business ownership in India
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-3.5 w-10 text-center">Ready</th>
                        <th className="py-3 px-3.5 w-48 sm:w-56">Name of the Document</th>
                        <th className="py-3 px-3.5">Description</th>
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['se_registration']}
                            onChange={() => toggleCheck('se_registration')}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Business Registration Proof</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          GST Registration Certificate, Certificate of Incorporation (CIN), MSME / Udyam Registration, or Partnership Deed.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Govt Certificate</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['se_company_bank']}
                            onChange={() => toggleCheck('se_company_bank')}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Company Bank Statement</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Current Account bank statement for the last 6 months with official bank seal and signature.
                        </td>
                        <td className="py-3 px-3.5 text-right text-emerald-700 font-bold text-[11px]">6 Months Current A/c</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['se_company_itr']}
                            onChange={() => toggleCheck('se_company_itr')}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Company Income Tax Returns</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          ITR-V Acknowledgement receipts for the last 2 assessment years for the business entity.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">2 Years ITR</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 5: STUDENTS & MINORS */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'minor') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-rose-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Students & Minor Applicants (&lt;18 Years)</span>
                    <span className="text-xs font-sans font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      Parental Consent & Bonafide
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Strict consular guidelines for minors and students traveling to the Schengen Area
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-rose-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-3.5 w-10 text-center">Ready</th>
                        <th className="py-3 px-3.5 w-48 sm:w-56">Name of the Document</th>
                        <th className="py-3 px-3.5">Description</th>
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Format</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['min_birth_cert']}
                            onChange={() => toggleCheck('min_birth_cert')}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Birth Certificate</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Official municipal Birth Certificate in English stating parents' names clearly.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['min_parent_noc']}
                            onChange={() => toggleCheck('min_parent_noc')}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Notarized Parental Consent NOC</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          If minor is traveling alone or with one parent, a notarized authority letter on stamp paper signed by both parents + copies of both parents' passports with signatures.
                        </td>
                        <td className="py-3 px-3.5 text-right text-rose-700 font-bold text-[11px]">Notarized Stamp NOC</td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['min_student_id']}
                            onChange={() => toggleCheck('min_student_id')}
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Student ID & Bonafide Letter</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          Copy of valid Student Identity Card + Bonafide / No Objection certificate from educational institution.
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">School Letter</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Quick letter template viewer popover/dialog if selected */}
          <AnimatePresence>
            {activeTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-blue-600 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                        {templates[activeTemplate].title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Official drafting template for Schengen consular submission
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(templates[activeTemplate].code, activeTemplate)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
                    >
                      {copiedTemplate === activeTemplate ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTemplate(null)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-[11px] sm:text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto border border-slate-800">
                    {templates[activeTemplate].code}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-100/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Aspire Consultant • Comprehensive Schengen Consular Document Pre-Screening</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Printable PDF Checklist</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
