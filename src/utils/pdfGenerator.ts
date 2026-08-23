/**
 * Aspire Travels — USA Visa Application Summary PDF Generator
 * Creates an elegant, high-contrast, professional PDF summary document
 */

import { jsPDF } from 'jspdf';
import { UsaPortalState } from '../types';

export function generateUsaVisaSummaryPDF(state: UsaPortalState): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const caseId = `ASP-USA-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Colors
  const darkNavy = [15, 23, 42]; // #0f172a
  const gold = [184, 134, 11]; // #b8860b
  const slateGray = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc
  const cardBorder = [226, 232, 240]; // #e2e8f0

  // 1. Top Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Gold accent stripe
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 38, 210, 2.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('ASPIRE TRAVELS', 16, 16);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(218, 165, 32);
  doc.text('PREMIER CONSULAR ADVISORY & GLOBAL VISA PROCESSING', 16, 23);

  // Document Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('USA VISA APPLICATION SUMMARY', 210 - 16, 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Ref: ${caseId}  |  ${dateStr}`, 210 - 16, 23, { align: 'right' });

  let y = 50;

  // 2. Overview Banner Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('TARGET DESTINATION: UNITED STATES OF AMERICA (USA)', 22, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Selected Service: ${state.visaService}`, 22, y + 15);
  doc.text(`Application Track: Indian Applicant Consular Advisory`, 22, y + 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text(`Applicants: ${state.applicantsCount || 1} Person(s)`, 210 - 22, y + 15, { align: 'right' });

  y += 34;

  // 3. Section: Applicant & Contact Profile
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('1. APPLICANT & CONTACT PROFILE', 16, y);

  y += 5;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 48, 2.5, 2.5, 'FD');

  const profileRows = [
    ['Full Name (As in Passport):', state.fullName || 'Not provided', 'Date of Birth:', state.dateOfBirth || 'DD/MM/YYYY'],
    ['Mobile Phone:', `${state.countryCode || '+91'} ${state.mobileNumber || ''}`, 'Email Address:', state.email || 'Not provided'],
    ['Location / City:', `${state.city || '—'}, ${state.state || '—'}`, 'Country of Residence:', state.country || 'India'],
    ['Number of Applicants:', `${state.applicantsCount || 1}`, 'Target Travel Period:', state.intendedTravelPeriod || 'Upcoming 3-6 Months']
  ];

  let rowY = y + 8;
  doc.setFontSize(9);
  profileRows.forEach(([label1, val1, label2, val2]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(label1, 22, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(val1, 72, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(label2, 116, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(val2, 156, rowY);

    rowY += 10;
  });

  y += 56;

  // 4. Section: Visa Service & DS-160 Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('2. VISA CATEGORY & DS-160 STATUS', 16, y);

  y += 5;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 38, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Visa Classification:', 22, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.text(state.visaService, 60, y + 8);

  let ds160Label = 'N/A for selected track';
  if (state.visaService === 'Tourist & Business Visa') {
    ds160Label = state.hasDs160Confirmation === 'yes'
      ? 'YES — Client has DS-160 Confirmation'
      : 'NO — Assistance Required (Information Sheet Downloaded)';
  } else if (state.visaService === 'Work Visa Appointments') {
    ds160Label = 'Work Petition (I-797) / Consular Track';
  } else if (state.visaService === 'Student Visa Appointments') {
    ds160Label = 'SEVIS / Form I-20 Academic Consular Track';
  }

  doc.setFont('helvetica', 'bold');
  doc.text('DS-160 Status:', 22, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(state.hasDs160Confirmation === 'no' ? 184 : 15, state.hasDs160Confirmation === 'no' ? 134 : 23, state.hasDs160Confirmation === 'no' ? 11 : 42);
  doc.text(ds160Label, 60, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Consular Hubs Covered:', 22, y + 26);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('New Delhi Embassy, Mumbai, Chennai, Hyderabad, Kolkata Consulates', 60, y + 26);

  y += 46;

  // 5. Section: Next Action Plan & Document Checklist
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('3. NEXT STEPS & CONSULTATION ROADMAP', 16, y);

  y += 5;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 48, 2.5, 2.5, 'FD');

  const steps = [
    'Step 1: Document audit (Passport validity, 2x2 in photo, 6-mo bank statements, employment letters).',
    'Step 2: DS-160 pre-check verification & submission on the official CEAC portal.',
    'Step 3: MRV fee payment & priority VAC biometrics + Consular interview slot scheduling.',
    'Step 4: Personalized 1-on-1 consular mock interview coaching with former visa advisors.'
  ];

  let stepY = y + 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  steps.forEach((st) => {
    doc.text(`•  ${st}`, 22, stepY);
    stepY += 9.5;
  });

  y += 56;

  // 6. Explicit Disclaimer & Legal Notice
  doc.setFillColor(254, 242, 242); // Light red/neutral
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(16, y, 178, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text('IMPORTANT LEGAL DISCLAIMER & NOTICE:', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(127, 29, 29);
  const disclaimer = 'This summary is prepared by Aspire Travels for consultation/application assistance. It is not a U.S. government document. Aspire Travels is a private visa consultancy and is not affiliated with the U.S. Embassy, USCIS, or the U.S. Department of State. Official submissions are conducted solely through authorized government channels.';
  const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
  doc.text(splitDisclaimer, 20, y + 11);

  // 7. Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Aspire Travels Pvt Ltd  |  support@aspiretravels.com  |  WhatsApp: +91 98765 43210', 105, 290, { align: 'center' });

  // Save PDF
  const filename = `Aspire_Travels_USA_Visa_Summary_${(state.fullName || 'Applicant').replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
}
