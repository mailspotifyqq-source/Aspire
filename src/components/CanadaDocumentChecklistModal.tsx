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
  ExternalLink
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CanadaDocumentChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'tourist' | 'canplus' | 'additional';

export const CanadaDocumentChecklistModal: React.FC<CanadaDocumentChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTemplate, setActiveTemplate] = useState<'cover' | 'noc' | 'sponsor' | 'invite' | null>(null);
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

    const purpleHeader = [99, 102, 241];
    const darkNavy = [15, 23, 42];
    const crimson = [196, 30, 58];

    // Header Background
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Aspire Consultant', 16, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(238, 242, 255);
    doc.text('Fill, File, Fly... #VisasMadeEasy', 16, 23);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Canada Visa Document Checklist', 210 - 16, 20, { align: 'right' });

    let yPos = 42;

    // Section 1 Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text('1. Canada Tourist Visa Document Checklist', 16, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Standard Visitor Visa (TRV) Dossier Requirements', 16, yPos);
    yPos += 8;

    const touristDocs = [
      ['Passport', 'Scan copy of first and last page (min 6 months validity)'],
      ['Old passport copy', 'Scan copy of Old Passport if any'],
      ['Passport photocopied', 'Copy of entry and exit stamps of all countries visited'],
      ['Photograph', '35mm x 45mm, white background, 80% face view, < 3 months old'],
      ['National ID', 'Color copy of Aadhaar Card'],
      ['Cover Letter', 'Detailed letter indicating purpose of travel, duration, passport details'],
      ['Travel Itinerary', 'Day-to-day planned tour schedule'],
      ['Flight Tickets', 'Tentative onward and return flight itinerary'],
      ['Proof of Accommodation', 'Confirmed hotel booking/voucher for the duration of stay'],
      ['Bank Statement', 'Last 6 months bank statement with sufficient funds & bank seal'],
      ['IT Return', 'Income tax returns / Form 16 for the last 3 years'],
      ['Employment / NOC', 'Leave approval letter on company letterhead / Business ownership proof'],
      ['Salary Slips', 'Pay slips for the last 3 months'],
      ['If Sponsored', 'Sponsorship letter + sponsor 6-month bank statements'],
      ['If Invited', 'Canadian Invitation Letter + Host PR/Citizen Proof + Host Bank Statement'],
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
      doc.text(desc, 60, yPos);
      yPos += 6;
    });

    yPos += 6;
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    // Section 2 Title (CAN+ / US Visa Holder)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(crimson[0], crimson[1], crimson[2]);
    doc.text('2. Canada Visitor Visa Checklist (For USA Visa Holders / CAN+)', 16, yPos);
    yPos += 7;

    const canPlusDocs = [
      ['Passport', 'Scan copy of first and last page'],
      ['Old passport copy', 'Scan copy of Old Passport if any'],
      ['Passport photocopied', 'Copy of entry and exit stamps of all countries visited'],
      ['Photograph', '35mm x 45mm, white background, 80% face coverage'],
      ['USA Valid Visa Copy', 'Clear color copy of valid US Visa (CAN+ Fast-Track)'],
    ];

    canPlusDocs.forEach(([name, desc]) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${name}:`, 16, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(desc, 60, yPos);
      yPos += 6;
    });

    yPos += 6;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    // Section 3 Title (Additional Info)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text('3. Canada Additional Information Required', 16, yPos);
    yPos += 7;

    const addlInfo = [
      ['10-Year Employment History', 'Organization name, job title, exact dates (YYYY/MM) for past 10 years'],
      ['Current Marital Status', 'Spouse Family name, Given name, Date of Birth, Marriage Date'],
      ['Previous Marriages / Common Law', 'Ex-partner details, relationship type and start/end dates if applicable'],
      ['Post-Secondary Education', 'Field of study, institution name, city, from/to dates'],
      ['Language Proficiency Test', 'Designated agency test taken (IELTS/CELPIP/TEF): YES/NO'],
      ['Previous Visa Refusals', 'Details of any refusal, entry denial, or removal order worldwide'],
    ];

    addlInfo.forEach(([info, details]) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${info}:`, 16, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(details, 130);
      doc.text(splitText, 70, yPos);
      yPos += (splitText.length * 4.5) + 2;
    });

    // Footer on all pages
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Aspire Consultant • Support: support@aspiretravels.in • Phone/WhatsApp: +91 92893 37446',
        105,
        290,
        { align: 'center' }
      );
    }

    doc.save('Aspire_Consultant_Canada_Visa_Document_Checklist.pdf');
  };

  const templates = {
    cover: {
      title: 'Canada Visa Cover Letter Template',
      code: `The High Commission of Canada / IRCC Visa Section
Consulate General of Canada

Subject: Application for Canada Temporary Resident Visa (Visitor TRV) - [Your Full Name], Passport No: [Your Passport Number]

Respected Visa Officer,

I, [Your Full Name], an Indian citizen residing at [Your Residential Address], am submitting my application for a Temporary Resident Visa to visit Canada from [Intended Arrival Date] to [Intended Departure Date] (Total duration: [Number of Days] days).

Purpose of Visit:
The primary purpose of my travel is [Tourism / Sightseeing / Attending a Business Conference / Visiting my Family]. I plan to visit [Cities: e.g., Toronto, Niagara Falls, Banff, Vancouver].

Employment & Financial Status:
I am currently employed as [Your Designation] with [Company Name] in [City], earning an annual package of INR [Your Salary]. My employer has approved my leave of absence from [Start Date] to [End Date], and I will resume my professional duties immediately upon return.
All travel, accommodation, and living expenses during this trip will be fully borne by me. Enclosed are my 6-month bank statements showing a closing balance of INR [Amount] and Income Tax Returns (ITR-V) for the last 3 years.

Summary of Attached Documents:
1. Valid Indian Passport (Original and previous passport copies)
2. Day-to-Day Detailed Travel Itinerary
3. Confirmed Hotel Bookings and Round-trip Flight Itinerary
4. Bank Statements (Last 6 Months with Bank Seal) & Form 16 / ITRs
5. Employer Leave Approval Letter (NOC) and Recent 3 Months Salary Slips
6. Ties to India: Proof of property/assets and family commitments

I confirm that I will strictly abide by Canadian immigration laws and depart Canada before my authorized stay expires. Thank you for considering my application.

Sincerely,
[Your Full Name]
[Your Mobile Number]
[Your Email Address]`,
    },
    noc: {
      title: 'Employer Leave Approval / NOC Template',
      code: `[ON OFFICIAL COMPANY LETTERHEAD]

Date: [DD/MM/YYYY]

To,
The Visa Officer
Immigration, Refugees and Citizenship Canada (IRCC)
High Commission of Canada

Subject: No Objection Certificate (NOC) & Leave Approval for [Employee Name]

This is to certify that [Employee Full Name] is a permanent, full-time employee of [Company Name], currently holding the designation of [Job Title / Position] in our [Department Name] department.

Employment Record Details:
• Employee ID: [Employee ID]
• Date of Joining / Hire: [Date of Hire, e.g. 15/04/2021]
• Current Monthly Gross Salary: INR [Monthly Salary] (Annual CTC: INR [Annual CTC])
• Office Address: [Company Full Physical Address]
• Contact Telephone: [Company Phone Number]

We confirm that [Employee Full Name] has been granted sanctioned annual leave from [Leave Start Date] to [Leave End Date] for tourism and leisure travel to Canada.

We have no objection to their travel to Canada during this period. We confirm that [Employee Name] will resume their regular duties with our company upon return on [Date of Resuming Work].

Authorized Signatory:
[Signature]
Name: [Signatory Full Name]
Designation: [e.g., HR Manager / Director]
Company Seal: [Official Stamp]
Email: hr@[company].com | Phone: [Phone]`,
    },
    sponsor: {
      title: 'Sponsorship Letter Template',
      code: `To,
The Visa Officer
Immigration, Refugees and Citizenship Canada (IRCC)

Subject: Affidavit of Financial Sponsorship for [Applicant Full Name]

Respected Visa Officer,

I, [Sponsor Full Name], residing at [Sponsor Full Address], citizen/permanent resident of [Country], hereby declare that I am the [Relationship, e.g., Father / Mother / Brother / Spouse] of [Applicant Full Name], holder of Indian Passport No: [Applicant Passport Number].

I declare that I am fully sponsoring all financial expenses for [Applicant Name]'s upcoming trip to Canada from [Arrival Date] to [Departure Date]. This includes:
1. Round-trip international airfare
2. Accommodation, internal transportation, and daily living expenses
3. Comprehensive travel and medical insurance
4. Any unforeseen medical or personal contingencies

Financial Capacity Proof Enclosed:
• My bank statements for the last 6 months
• Proof of income / employment / Tax Returns
• Proof of relationship ([Birth Certificate / Marriage Certificate])

I guarantee that [Applicant Name] will maintain temporary resident status and return to India upon completion of their visit.

Sincerely,
[Sponsor Full Name]
[Sponsor Signature]
[Contact Phone & Email]`,
    },
    invite: {
      title: 'Canadian Invitee / Host Letter Template',
      code: `To,
The Visa Officer
Immigration, Refugees and Citizenship Canada (IRCC)

Subject: Letter of Invitation for [Applicant Name] to Visit Canada

Dear Visa Officer,

I, [Host Full Name], residing at [Full Canadian Residential Address], contact number [Canadian Phone Number], email [Host Email], am inviting [Applicant Full Name] (Passport No: [Passport Number], DOB: [DD/MM/YYYY], residing in [City, India]) to visit me in Canada from [Planned Arrival Date] to [Planned Departure Date].

Invitee (Host) Information:
• Status in Canada: [Canadian Citizen / Permanent Resident / Work Permit Holder]
• Employer: [Host Employer Name], Position: [Job Title]
• Household Size: [Number of people living in residence]

Relationship & Accommodation Details:
[Applicant Name] is my [Relationship: e.g. Mother / Father / Brother / Friend]. During their stay in Canada, they will reside at my home at [Full Address]. I will ensure their comfortable lodging, meals, and local guidance.

Enclosed Supporting Host Documents:
1. Copy of my Canadian Passport / PR Card / Study or Work Permit
2. Notice of Assessment (NOA) / T4 slip / Letter of Employment
3. Recent Canadian bank statements
4. Proof of relationship ([Birth certificate/Marriage certificate])

[Applicant Name] has strong family and economic ties in India and will return to India before their visitor status expires.

Sincerely,
[Host Full Name]
[Signature]
Date: [DD/MM/YYYY]`,
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
        <div className="relative bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#3b82f6] text-white p-6 sm:p-7 border-b border-indigo-300/30 overflow-hidden shrink-0 print:bg-indigo-600 print:p-4">
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-8 w-36 h-36 rounded-full bg-indigo-300/20 blur-xl pointer-events-none" />

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
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-100 pl-10.5">
                <span className="tracking-wide">Fill, File, Fly...</span>
                <span className="text-indigo-200/80">•</span>
                <span className="text-amber-300 font-bold tracking-wider">#VisasMadeEasy</span>
              </div>
              <p className="text-xs text-white/90 font-medium pl-10.5 pt-1">
                Canada Visa Document Checklist & Consular Filing Dossier
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#4f46e5] hover:bg-indigo-50 border border-white text-xs font-bold shadow-md transition-all active:scale-95"
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
              { id: 'all', label: 'All Requirements' },
              { id: 'tourist', label: '1. Tourist Visa (Standard TRV)' },
              { id: 'canplus', label: '2. US Visa Holder (CAN+ Fast-Track)' },
              { id: 'additional', label: '3. Additional Info (10-Yr Work/Ties)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#4f46e5] shadow-sm'
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
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3 print:hidden">
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 space-y-0.5 leading-relaxed">
              <span className="font-bold text-indigo-900">Applicant Self-Preparation Guide:</span>
              <p>
                Use this official Aspire Consultant checklist to verify and prepare every document before your IRCC portal upload. Click any row checkbox to tick off your ready documents.
              </p>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 1: CANADA TOURIST VISA DOCUMENT CHECKLIST */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'tourist') && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-indigo-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Canada Tourist Visa Document Checklist</span>
                    <span className="text-xs font-sans font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      Standard IRCC TRV
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For tourism, leisure, family visits, and general visitor applicants from India
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
                        <th className="py-3 px-3.5">Description</th>
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Format / Template</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      {/* 1. Passport */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_passport']}
                            onChange={() => toggleCheck('tourist_passport')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Passport</td>
                        <td className="py-3 px-3.5 text-slate-600">Scan copy of first and last page (minimum 6 months validity from departure)</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      {/* 2. Old passport copy */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_old_passport']}
                            onChange={() => toggleCheck('tourist_old_passport')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Old passport copy</td>
                        <td className="py-3 px-3.5 text-slate-600">Scan copy of Old Passport If any</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      {/* 3. Passport photocopied */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_passport_stamps']}
                            onChange={() => toggleCheck('tourist_passport_stamps')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Passport photocopied</td>
                        <td className="py-3 px-3.5 text-slate-600">Copy of entry and exit stamps of all countries visited</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">All Stamp Pages</td>
                      </tr>

                      {/* 4. Photograph */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-amber-50/30">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_photo']}
                            onChange={() => toggleCheck('tourist_photo')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Photograph</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>White background</li>
                            <li>Size 35mm x 45mm</li>
                            <li>80% face should be seen white background without specs and sunglasses</li>
                            <li>(Photographs should not be older than 3 months)</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-amber-700 font-bold text-[11px]">35mm x 45mm JPEG</td>
                      </tr>

                      {/* 5. National ID */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_national_id']}
                            onChange={() => toggleCheck('tourist_national_id')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">National ID</td>
                        <td className="py-3 px-3.5 text-slate-600">Color Copy of Aadhar card (Both Front & Back)</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      {/* 6. Cover letter */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_cover_letter']}
                            onChange={() => toggleCheck('tourist_cover_letter')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Cover letter</td>
                        <td className="py-3 px-3.5 text-slate-600">Detailed Cover letter indicating the purpose of travel, number of days, passport and travel details</td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('cover')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Cover Letter Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 7. Travel Itinerary */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_itinerary']}
                            onChange={() => toggleCheck('tourist_itinerary')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Travel Itinerary</td>
                        <td className="py-3 px-3.5 text-slate-600">Day To Day Itinerary (Cities, Sightseeing & Accommodation)</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Day-Wise Plan</td>
                      </tr>

                      {/* 8. Flight tickets */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_flight']}
                            onChange={() => toggleCheck('tourist_flight')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Flight tickets</td>
                        <td className="py-3 px-3.5 text-slate-600">Onward and return tentative flight reservation</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Flight Itinerary</td>
                      </tr>

                      {/* 9. Proof of Accommodation */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_hotel']}
                            onChange={() => toggleCheck('tourist_hotel')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Proof of Accommodation</td>
                        <td className="py-3 px-3.5 text-slate-600">Confirmed hotel accommodation booking/voucher for the duration of stay in Canada</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Hotel Voucher / AirBnb</td>
                      </tr>

                      {/* 10. Bank statement */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-blue-50/30">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_bank']}
                            onChange={() => toggleCheck('tourist_bank')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Bank statement</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Recommended at sufficient funds to cover cost of Trip (e.g. ₹5–10 Lakhs+)</li>
                            <li>Should be of the last 6 months with official bank seal and signature</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-blue-700 font-bold text-[11px]">6 Months Sealed</td>
                      </tr>

                      {/* 11. IT return */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_itr']}
                            onChange={() => toggleCheck('tourist_itr')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">IT return</td>
                        <td className="py-3 px-3.5 text-slate-600">Income tax returns (ITR-V Acknowledgements) / Form 16 for the last 3 years</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Last 3 Years ITR</td>
                      </tr>

                      {/* 12. If self-employed */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_self_emp']}
                            onChange={() => toggleCheck('tourist_self_emp')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If self-employed</td>
                        <td className="py-3 px-3.5 text-slate-600">Any proof of self employment / ownership of business (GST Certificate, Incorporation, MSME / Partnership Deed)</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Business Proof</td>
                      </tr>

                      {/* 13. Leave Approval Letter */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_noc']}
                            onChange={() => toggleCheck('tourist_noc')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Leave Approval Letter</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <p>A signed original letter on company letterhead from your employer granting leave of absence. This letter must include:</p>
                          <ul className="list-disc list-inside space-y-0.5 mt-1 text-slate-500">
                            <li>your name and position;</li>
                            <li>your current salary;</li>
                            <li>your date of hire;</li>
                            <li>your employer's name, address and telephone number.</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('noc')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Employer NOC Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 14. Salary Slip of Last 03 Month */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_salary_slips']}
                            onChange={() => toggleCheck('tourist_salary_slips')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Salary Slip of Last 03 Month</td>
                        <td className="py-3 px-3.5 text-slate-600">Pay slips for the last three months with company seal</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Last 3 Months</td>
                      </tr>

                      {/* 15. If retired */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_retired']}
                            onChange={() => toggleCheck('tourist_retired')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If retired</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Proof of Retirement (Pension order / Retirement letter)</li>
                            <li>Proof of regular income generated by ownership of property or business</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Pension / Proof</td>
                      </tr>

                      {/* 16. If sponsored */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_sponsor']}
                            onChange={() => toggleCheck('tourist_sponsor')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If sponsored</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>Sponsorship Letter from sponsor stating the amount, relationship and source of funds</li>
                            <li>In case your trip is sponsored by someone else, kindly upload your sponsor's last 6 month statements.</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('sponsor')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Sponsorship Letter Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 17. If invited */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-purple-50/30">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_invited']}
                            onChange={() => toggleCheck('tourist_invited')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If invited</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            <li>Invitation is must from Canada mentioning applicant passport details, purpose of visit, address where they will stay, invitee address and contact details.</li>
                            <li>Employment proof of invitee in Canada.</li>
                            <li>Valid Resident permit / Visa copy of invitee.</li>
                            <li>Invitee Passport 1st & last page.</li>
                            <li>Invitee Last six months bank statements.</li>
                            <li>Proof of relation with invitee (Birth certificate or Marriage certificate)</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setActiveTemplate('invite')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Invitation Letter Template</span>
                          </button>
                        </td>
                      </tr>

                      {/* 18. If Student */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_student']}
                            onChange={() => toggleCheck('tourist_student')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If Student</td>
                        <td className="py-3 px-3.5 text-slate-600">If the applicant is a student letter of bonafide certificate from the educational institution is required.</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Bonafide Letter</td>
                      </tr>

                      {/* 19. If Married */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_married']}
                            onChange={() => toggleCheck('tourist_married')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If Married</td>
                        <td className="py-3 px-3.5 text-slate-600">Marriage certificate (if spouse name is not endorsed on passport)</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Marriage Certificate</td>
                      </tr>

                      {/* 20. If Minor */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['tourist_minor']}
                            onChange={() => toggleCheck('tourist_minor')}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">If Minor</td>
                        <td className="py-3 px-3.5 text-slate-600">If Minor Travelling with Single parent: Notarized authority / consent letter from non-accompanying parent + parent ID proof</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Parent Consent NOC</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 2: CANADA VISITOR VISA CHECKLIST (FOR USA VISA HOLDER / CAN+) */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'canplus') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#c41e3a] pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Canada Visitor Visa Checklist (For USA visa holder)</span>
                    <span className="text-xs font-sans font-bold text-[#c41e3a] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                      CAN+ Fast-Track Program
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accelerated IRCC filing stream for Indian nationals holding a valid USA Visa (B1/B2/H1B/L1/F1)
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
                        <th className="py-3 px-3.5 w-36 sm:w-44 text-right">Format 2</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      {/* 1. Passport */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['can_passport']}
                            onChange={() => toggleCheck('can_passport')}
                            className="w-4 h-4 rounded text-[#c41e3a] focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Passport</td>
                        <td className="py-3 px-3.5 text-slate-600">Scan copy of first and last page</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      {/* 2. Old passport copy */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['can_old_passport']}
                            onChange={() => toggleCheck('can_old_passport')}
                            className="w-4 h-4 rounded text-[#c41e3a] focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Old passport copy</td>
                        <td className="py-3 px-3.5 text-slate-600">Scan copy of Old Passport If any</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">Color Scan PDF</td>
                      </tr>

                      {/* 3. Passport photocopied */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['can_passport_stamps']}
                            onChange={() => toggleCheck('can_passport_stamps')}
                            className="w-4 h-4 rounded text-[#c41e3a] focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Passport photocopied</td>
                        <td className="py-3 px-3.5 text-slate-600">Copy of entry and exit stamps of all country visited</td>
                        <td className="py-3 px-3.5 text-right text-slate-500 font-mono text-[11px]">All Stamp Pages</td>
                      </tr>

                      {/* 4. Photograph */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['can_photo']}
                            onChange={() => toggleCheck('can_photo')}
                            className="w-4 h-4 rounded text-[#c41e3a] focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">Photograph</td>
                        <td className="py-3 px-3.5 text-slate-600">
                          <ul className="list-disc list-inside space-y-0.5">
                            <li>White background against</li>
                            <li>Size 35mm x 45mm</li>
                            <li>80% face should be seen white background without specs and sunglasses</li>
                            <li>(Photographs should not be old for more than 3 months).</li>
                          </ul>
                        </td>
                        <td className="py-3 px-3.5 text-right text-[#c41e3a] font-bold text-[11px]">35mm x 45mm JPEG</td>
                      </tr>

                      {/* 5. USA Valid Visa Copy */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-rose-50/40">
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={!!checkedItems['can_us_visa']}
                            onChange={() => toggleCheck('can_us_visa')}
                            className="w-4 h-4 rounded text-[#c41e3a] focus:ring-rose-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3.5 font-bold text-[#0f172a]">USA Valid Visa Copy</td>
                        <td className="py-3 px-3.5 text-[#991b1b] font-semibold">
                          Clear USA Valid Visa Copy (Passport Foil Page with complete MRZ code clearly visible)
                        </td>
                        <td className="py-3 px-3.5 text-right text-[#c41e3a] font-bold text-[11px]">Clear Color Foil Copy</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 3: CANADA ADDITIONAL INFORMATION REQUIRED */}
          {/* ======================================================================= */}
          {(activeTab === 'all' || activeTab === 'additional') && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-emerald-600 pb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-[#0f172a] flex items-center gap-2">
                    <span>Canada Additional Information Required</span>
                    <span className="text-xs font-sans font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      IRCC Form IMM 5257 & IMM 5645
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required historical and background questions for IRCC consular processing
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 w-1/3 sm:w-2/5">Info</th>
                        <th className="py-3 px-4">Details Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      {/* 1. 10 years Employment */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0f172a] align-top">
                          Give details of your employment for the past 10 years, If retired, not working or studying, please indicate. If you are retired, please provide the 10 years before your retirement.
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 space-y-1.5">
                          <p>• <strong>If Student, mention:</strong> name of the Institution, Course of Study, From (YYYY/MM/DD) To (YYYY/MM/DD)</p>
                          <p>• <strong>If Employed, mention:</strong> Name of the employer/Organization, Job title, From (YYYY/MM/DD) To (YYYY/MM/DD)</p>
                          <p>• <strong>If Unemployed, mention:</strong> last job role and last date of working</p>
                          <p>• <strong>If Self Employed, mention:</strong> Name of Business, Job Title, From (YYYY/MM/DD) To (YYYY/MM/DD)</p>
                          <p>• <strong>If Retired, mention:</strong> Date of retirement</p>
                        </td>
                      </tr>

                      {/* 2. Marital Status */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0f172a] align-top">
                          Your current marital status
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <p className="font-semibold text-slate-800 mb-1">If Married, Mention below:</p>
                          <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600">
                            <li>Family Name</li>
                            <li>Given Name</li>
                            <li>Date of Birth</li>
                            <li>Marriage Date</li>
                          </ul>
                        </td>
                      </tr>

                      {/* 3. Previous marriages */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0f172a] align-top">
                          Have you previously been married or in a common law relationship? (other than your current marriage)
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <p className="font-semibold text-slate-800 mb-1">If Yes, mention:</p>
                          <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600">
                            <li>Family name:</li>
                            <li>Given name(s):</li>
                            <li>Date of Birth:</li>
                            <li>Type of Relationship:</li>
                            <li>From: (YYYY/MM/DD)</li>
                            <li>TO: (YYYY/MM/DD)</li>
                          </ul>
                        </td>
                      </tr>

                      {/* 4. Post Secondary Education */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0f172a] align-top">
                          Have you had any post secondary education (including university, college or apprenticeship training)?
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <p className="font-semibold text-slate-800 mb-1">If Yes, Mention:</p>
                          <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-600">
                            <li>Field Of Study</li>
                            <li>School/Facility Name</li>
                            <li>City</li>
                            <li>From</li>
                            <li>To</li>
                          </ul>
                        </td>
                      </tr>

                      {/* 5. Language Test */}
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0f172a] align-top">
                          Have you ever taken a test from a designated agency to assess your proficiency in English or French?
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          YES / NO (If yes, specify IELTS, CELPIP, TEF, or TCF scores)
                        </td>
                      </tr>

                      {/* 6. Visa Refusal */}
                      <tr className="hover:bg-slate-50/80 transition-colors bg-red-50/30">
                        <td className="py-3.5 px-4 font-bold text-red-950 align-top">
                          Have you ever been refused a visa or permit, denied entry or ordered to leave Canada or any other country or territory?
                        </td>
                        <td className="py-3.5 px-4 text-red-900 font-semibold">
                          If Yes, Provide Details (Country, Year, Visa Category, and official reason for refusal from consular letter)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Footer Counselor Support Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Need Help Organizing Your Canada Dossier?
              </span>
              <p className="text-xs text-slate-300">
                Aspire Consultant counselors review your documents for 100% IRCC Section 179(b) compliance.
              </p>
            </div>
            <a
              href="https://wa.me/919289337446?text=Hi%20Aspire%20Consultant,%20I%20need%20assistance%20reviewing%20my%20Canada%20visa%20document%20checklist."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
            >
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TEMPLATE VIEWER MODAL OVERLAY */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeTemplate && (
            <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="bg-[#0f172a] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {templates[activeTemplate].title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTemplate(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
                  <p className="text-xs text-slate-500 mb-3">
                    Copy and customize this template with your exact travel and applicant details:
                  </p>
                  <pre className="p-4 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
                    {templates[activeTemplate].code}
                  </pre>
                </div>

                <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveTemplate(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(templates[activeTemplate].code, activeTemplate)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    {copiedTemplate === activeTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Template</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
