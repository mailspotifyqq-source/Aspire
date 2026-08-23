/**
 * Aspire Consultant — Europe Schengen Visa Application Summary PDF Generator
 * Creates an elegant, high-contrast, professional Schengen Consular PDF summary document
 */

import { jsPDF } from 'jspdf';
import { SchengenPortalState } from '../types';

export interface GeneratedSchengenPdfResult {
  filename: string;
  base64: string;
}

export function generateSchengenVisaSummaryPDF(state: SchengenPortalState): GeneratedSchengenPdfResult {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const caseId = `ASP-SCH-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Color Palette: European Blue, Royal Navy, Aspire Gold, Light Slate
  const royalNavy = [15, 23, 42]; // #0f172a
  const euroBlue = [30, 64, 175]; // #1e40af (EU / Schengen Blue)
  const euroGold = [234, 179, 8]; // #eab308 (EU Star Gold)
  const slateGray = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc
  const cardBorder = [226, 232, 240]; // #e2e8f0

  // 1. Top Header Banner
  doc.setFillColor(royalNavy[0], royalNavy[1], royalNavy[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Euro Blue accent stripe
  doc.setFillColor(euroBlue[0], euroBlue[1], euroBlue[2]);
  doc.rect(0, 38, 210, 2.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('ASPIRE CONSULTANT', 16, 16);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(euroGold[0], euroGold[1], euroGold[2]);
  doc.text('Fill, File, Fly... #VisasMadeEasy • EUROPE SCHENGEN CONSULAR FILING', 16, 23);

  // Document Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('SCHENGEN VISA DOSSIER SUMMARY', 210 - 16, 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Ref: ${caseId}  |  ${dateStr}`, 210 - 16, 23, { align: 'right' });

  let y = 50;

  // 2. Overview Banner Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
  doc.text(`Primary Destination: ${state.primaryDestination || 'Europe (Schengen Area)'}`, 22, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(
    `Visa Category: ${state.visaService || 'Business & Tourist Visa'}  |  Trip Purpose: ${state.travelPurpose || 'Tourism & Sightseeing'}`,
    22,
    y + 14
  );
  doc.text(
    `Intended Travel Period: ${state.intendedTravelPeriod || 'Upcoming travel'}  |  Total Applicants: ${state.applicantsCount || 1}`,
    22,
    y + 19
  );

  y += 32;

  // Helper function for 2-column section boxes
  const drawSection = (
    title: string,
    items: [string, string][],
    startY: number,
    accentColor: number[] = euroBlue
  ): number => {
    const boxHeight = 12 + items.length * 6.5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
    doc.roundedRect(16, startY, 178, boxHeight, 2, 2, 'FD');

    // Section header tab
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(16, startY, 3, boxHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
    doc.text(title, 23, startY + 7);

    let itemY = startY + 14;
    items.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
      doc.text(label, 23, itemY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
      const splitVal = doc.splitTextToSize(value, 95);
      doc.text(splitVal, 82, itemY);

      itemY += Math.max(splitVal.length * 4.5, 6.5);
    });

    return startY + boxHeight + 6;
  };

  // 3. Section: Applicant Information
  y = drawSection(
    '1. APPLICANT INFORMATION & CONTACT DETAILS',
    [
      ['Full Name (As on Passport):', state.fullName || 'Not provided'],
      ['Date of Birth:', state.dateOfBirth || 'Not provided'],
      ['Email Address:', state.email || 'Not provided'],
      ['Mobile / WhatsApp:', `${state.countryCode || '+91'} ${state.mobileNumber || ''}`.trim() || 'Not provided'],
      ['Residential City & State:', `${state.city || ''}, ${state.state || ''} (${state.country || 'India'})`],
      ['Total Applicants:', `${state.applicantsCount || 1} Applicant(s)`],
      ['Intended Travel Period:', state.intendedTravelPeriod || 'Next 3 to 6 Months'],
    ],
    y
  );

  // 4. Section: Consular Eligibility & Biometric Status
  y = drawSection(
    '2. SCHENGEN CONSULAR PROFILE & BIOMETRIC VIS STATUS',
    [
      ['Primary Schengen State:', state.primaryDestination || 'Europe (Schengen 29 States)'],
      ['Visa Category:', state.visaService || 'Business & Tourist Visa'],
      ['Travel Purpose:', state.travelPurpose || 'Tourism & Sightseeing'],
      ['Biometrics (VIS 59 Months):', state.biometricsStatus || 'Standard VFS Appointment'],
      ['Prior Travel History:', state.travelHistory || 'Fresh Passport / First International Trip'],
    ],
    y
  );

  // 5. Section: Employment & Financial Solvency
  y = drawSection(
    '3. EMPLOYMENT, FINANCIAL SOLVENCY & TIES',
    [
      ['Current Employment Status:', state.employmentStatus || 'Salaried Professional'],
      ['Funds Availability:', state.fundsAvailability || '₹7,00,000 – ₹15,00,000'],
      ['Travel Medical Insurance (€30k):', 'Mandatory €30,000 cover across 29 Schengen States (Aspire Assistance Available)'],
      ['Income Tax Returns (ITR-V):', '2 to 3 years ITR acknowledgement + 6-month original stamped bank statements'],
    ],
    y
  );

  // 6. Next Steps & Filing Checklist Box
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(16, y, 178, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
  doc.text('PRE-SUBMISSION CONSULAR GUIDELINES (SCHENGEN DOSSIER):', 22, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81);
  const checklistLines = [
    '• Valid Passport: Minimum 3 months validity beyond intended departure from Schengen, with 2 blank pages.',
    '• Photographs: 2 recent (35x45mm), 80% face coverage on white background, without spectacles/glare.',
    '• Travel Insurance: Mandatory €30,000 coverage across all 29 Schengen states including medical evacuation.',
    '• Cover Letter & Itinerary: Detailed day-by-day tour plan with inter-city transport & accommodation vouchers.',
    '• Financials & ITR: Original 6-month bank statement with bank seal & signature + last 2 years ITR-V forms.',
  ];

  let lineY = y + 14;
  checklistLines.forEach((line) => {
    doc.text(line, 22, lineY);
    lineY += 4.5;
  });

  // Footer on All Pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(16, 282, 194, 282);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Aspire Consultant • Dedicated Europe Schengen Desk • Support: support@aspiretravels.in • WhatsApp: +91 92893 37446',
      105,
      287,
      { align: 'center' }
    );
    doc.text(`Page ${i} of ${totalPages}`, 194, 287, { align: 'right' });
  }

  const filename = `Aspire_Consultant_Schengen_Visa_Summary_${(state.fullName || 'Applicant').replace(/\s+/g, '_')}.pdf`;
  const base64 = doc.output('datauristring');

  return { filename, base64 };
}
