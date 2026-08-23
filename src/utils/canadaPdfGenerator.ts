/**
 * Aspire Travels — Canada Visa Application Summary PDF Generator
 * Creates an elegant, high-contrast, professional Canada PDF summary document
 */

import { jsPDF } from 'jspdf';
import { CanadaPortalState } from '../types';

export interface GeneratedCanadaPdfResult {
  filename: string;
  base64: string;
}

export function generateCanadaVisaSummaryPDF(state: CanadaPortalState): GeneratedCanadaPdfResult {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const caseId = `ASP-CAN-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Color Palette: Canadian Crimson, Obsidian Slate, Warm Gold, Light Slate
  const darkSlate = [15, 23, 42]; // #0f172a
  const crimson = [196, 30, 58]; // #c41e3a (Canadian Maple Red)
  const gold = [184, 134, 11]; // #b8860b (Aspire Gold)
  const slateGray = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252]; // #f8fafc
  const cardBorder = [226, 232, 240]; // #e2e8f0

  // 1. Top Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Crimson accent stripe
  doc.setFillColor(crimson[0], crimson[1], crimson[2]);
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
  doc.text('CANADA VISA APPLICATION SUMMARY', 210 - 16, 16, { align: 'right' });

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
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('DESTINATION: CANADA (IRCC VISITOR VISA / TRV V-1 / B-1 ENTRY)', 22, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Category: ${state.visaService}  |  Purpose: ${state.travelPurpose}`, 22, y + 15);
  doc.text(`Biometrics: ${state.biometricsStatus}`, 22, y + 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(crimson[0], crimson[1], crimson[2]);
  doc.text(`Applicants: ${state.applicantsCount || 1} Person(s)`, 210 - 22, y + 15, { align: 'right' });

  y += 34;

  // 3. Section: Applicant & Contact Profile
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('1. APPLICANT & CONTACT PROFILE', 16, y);

  y += 5;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 44, 2.5, 2.5, 'FD');

  const col1X = 22;
  const col2X = 110;
  let rowY = y + 8;

  const renderField = (label: string, value: string, x: number, curY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(label, x, curY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(value || '—', x, curY + 5);
  };

  renderField('Full Name (as per Passport):', state.fullName || '—', col1X, rowY);
  renderField('Date of Birth:', state.dateOfBirth || 'Not provided', col2X, rowY);

  rowY += 12;
  renderField('Contact Number:', `${state.countryCode} ${state.mobileNumber || '—'}`, col1X, rowY);
  renderField('Email Address:', state.email || '—', col2X, rowY);

  rowY += 12;
  renderField('Residential Location:', `${state.city || '—'}, ${state.state || '—'} (${state.country})`, col1X, rowY);
  renderField('Applicants Count:', `${state.applicantsCount || 1} applicant(s)`, col2X, rowY);

  y += 52;

  // 4. Section: Canada Assessment & Eligibility Parameters
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('2. CANADA VISITOR VISA PROFILE & ELIGIBILITY', 16, y);

  y += 5;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 44, 2.5, 2.5, 'FD');

  let row2Y = y + 8;
  renderField('Visa Track:', 'Canada Business & Tourist Visa (TRV)', col1X, row2Y);
  renderField('Purpose of Visit:', state.travelPurpose, col2X, row2Y);

  row2Y += 12;
  renderField('Biometrics Status:', state.biometricsStatus, col1X, row2Y);
  renderField('CAN+ / Travel History:', state.travelHistory, col2X, row2Y);

  row2Y += 12;
  renderField('Employment / Ties:', state.employmentStatus, col1X, row2Y);
  renderField('Available Liquid Funds:', state.fundsAvailability, col2X, row2Y);

  y += 52;

  // 5. Section: IRCC Document Checklist
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('3. REQUIRED DOCUMENTS CHECKLIST (IRCC & VFS GLOBAL)', 16, y);

  y += 5;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cardBorder[0], cardBorder[1], cardBorder[2]);
  doc.roundedRect(16, y, 178, 48, 2.5, 2.5, 'FD');

  const docs = [
    'Original Passport with minimum 6 months validity & blank pages',
    'IRCC Portal Application Form (IMM 5257 & IMM 5645 Family Information)',
    'Proof of Financial Solvency (6 months stamped bank statements, ITR returns for 2-3 years)',
    'Proof of Employment / Business Registration & Approved Leave Certificate (NOC)',
    'Purpose Documentation (Hotel bookings, daily travel itinerary, or Business Invitation Letter)',
    'Proof of Strong Ties to India (Property deeds, family ties, permanent employment)'
  ];

  let docY = y + 7;
  docs.forEach((item) => {
    doc.setFillColor(crimson[0], crimson[1], crimson[2]);
    doc.circle(21, docY - 1.2, 1.2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(item, 26, docY);
    docY += 6.5;
  });

  y += 56;

  // 6. Section: Next Steps & Advisory
  doc.setFillColor(254, 242, 242); // very light crimson tint
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(16, y, 178, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(crimson[0], crimson[1], crimson[2]);
  doc.text('ASPIRE TRAVELS PRE-SCREENING & FILING GUARANTEE:', 22, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(
    'Our licensed IRCC advisors will review your documents, verify ties to home country, draft your SOP/Cover Letter, and schedule VFS biometrics.',
    22,
    y + 12
  );

  // Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Aspire Travels  |  support@aspiretravels.in  |  Phone / WhatsApp: +91 92893 37446', 105, 290, { align: 'center' });

  // Filename format: Aspire Travel Canada Visa Summary_<USER_NAME>.pdf
  const rawName = (state.fullName || 'Applicant').trim();
  const safeName = rawName.replace(/[\\/:*?"<>|]/g, '');
  const filename = `Aspire Travel Canada Visa Summary_${safeName || 'Applicant'}.pdf`;

  // Trigger browser download
  doc.save(filename);

  // Extract base64 representation of the exact same PDF for server dispatch
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;

  return {
    filename,
    base64,
  };
}
