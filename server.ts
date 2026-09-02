import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// Support Render/Cloud Run/Docker dynamic PORT or fallback to 3000
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser supporting base64 PDF payload up to 25MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    resendConfigured: !!(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0),
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aspiretravels.in',
    fromEmail: process.env.FROM_EMAIL || 'support@aspiretravels.in',
  });
});

// Lazy Resend client instantiation
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey.trim());
}

/**
 * Common handler for sending USA Visa Summary PDF via Resend
 */
async function handleSendUsaVisaSummary(req: express.Request, res: express.Response) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const {
      applicantName,
      email,
      phone,
      city,
      state: applicantState,
      country,
      applicantsCount,
      intendedTravelPeriod,
      visaCategory,
      ds160Status,
      filename,
      pdfBase64,
    } = req.body || {};

    const cleanApplicantName = (applicantName || 'Applicant').trim();
    console.log(`[Server] Received USA Visa email request for applicant: "${cleanApplicantName}"`);

    if (!pdfBase64) {
      console.warn('[Server] Error: Missing PDF document content in request body.');
      return res.status(400).json({
        success: false,
        error: 'Missing PDF document content. Please generate the PDF first.',
      });
    }

    const cleanVisaCategory = (visaCategory || 'Tourist & Business Visa').trim();
    const cleanDs160Status = (ds160Status || 'Not specified').trim();
    const cleanEmail = (email || 'Not provided').trim();
    const cleanPhone = (phone || 'Not provided').trim();
    const cleanLocation = `${city || '—'}, ${applicantState || '—'}, ${country || 'India'}`;
    const cleanApplicantsCount = `${applicantsCount || 1} Person(s)`;
    const cleanTravelPeriod = (intendedTravelPeriod || 'Upcoming 3-6 Months').trim();

    // Sanitize user name for filename: Aspire_Travels_US_Visa_Summary_<USER_NAME>.pdf
    const safeUserName = cleanApplicantName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') || 'Applicant';
    const cleanFilename = filename || `Aspire_Travels_US_Visa_Summary_${safeUserName}.pdf`;

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[Server] RESEND_API_KEY environment variable is not configured on the server.'
      );
      return res.status(500).json({
        success: false,
        error: 'Email delivery service is not configured (RESEND_API_KEY is missing on server).',
      });
    }

    const recipient = process.env.SUPPORT_EMAIL || 'support@aspiretravels.in';
    const fromAddress = process.env.FROM_EMAIL || 'support@aspiretravels.in';

    const subject = `New USA Visa Summary - ${cleanApplicantName}`;
    const textContent = `A new USA Visa Summary has been generated through the Aspire Travels website.

Applicant Details:
------------------
• Applicant Name: ${cleanApplicantName}
• Visa Category: ${cleanVisaCategory}
• DS-160 Status: ${cleanDs160Status}
• Email Address: ${cleanEmail}
• Mobile / WhatsApp: ${cleanPhone}
• Location: ${cleanLocation}
• Number of Applicants: ${cleanApplicantsCount}
• Target Travel Period: ${cleanTravelPeriod}

The personalized visa summary PDF (${cleanFilename}) is attached to this email.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #b8860b;">
          <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #daa520; text-transform: uppercase;">USA Visa Consular Advisory Notification</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-top: 0; font-size: 15px; color: #334155;">
            A new USA Visa Summary has been generated through the Aspire Travels website.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td>
              <td style="padding: 10px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">DS-160 Status:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanDs160Status}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Email Address:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Phone / WhatsApp:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanPhone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Location:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanLocation}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Total Applicants:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanApplicantsCount}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Target Travel Window:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanTravelPeriod}</td>
            </tr>
          </table>
          
          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            The personalized visa summary PDF (<strong>${cleanFilename}</strong>) is attached to this email.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
          Aspire Travels &bull; ${recipient} &bull; +91 92893 37446
        </div>
      </div>
    `;

    // Extract base64 without data URI prefix if present
    const rawBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
    const pdfBuffer = Buffer.from(rawBase64, 'base64');

    console.log(
      `[Server] Dispatching USA Visa Summary email via Resend:
  - Applicant: ${cleanApplicantName}
  - Filename: ${cleanFilename} (${pdfBuffer.length} bytes)
  - To: ${recipient}
  - From: ${fromAddress}`
    );

    const sendResult = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      subject: subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: cleanFilename,
          content: pdfBuffer,
        },
      ],
    });

    if (sendResult.error) {
      console.error('[Server] Resend API returned error:', JSON.stringify(sendResult.error, null, 2));
      return res.status(500).json({
        success: false,
        error: sendResult.error.message || 'Resend service rejected the email dispatch.',
      });
    }

    console.log(
      `[Server] USA Visa Summary email successfully sent for "${cleanApplicantName}" to ${recipient} (Email Message ID: ${sendResult.data?.id})`
    );

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully to Aspire Travels.',
      messageId: sendResult.data?.id,
    });
  } catch (err: any) {
    console.error('[Server] Exception occurred while sending USA Visa email:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while dispatching email notification.',
    });
  }
}

/**
 * Common handler for sending Canada Visa Summary PDF via Resend
 */
async function handleSendCanadaVisaSummary(req: express.Request, res: express.Response) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const {
      applicantName,
      email,
      phone,
      city,
      state: applicantState,
      country,
      applicantsCount,
      intendedTravelPeriod,
      visaCategory,
      travelPurpose,
      biometricsStatus,
      travelHistory,
      employmentStatus,
      fundsReadiness,
      filename,
      pdfBase64,
    } = req.body || {};

    const cleanApplicantName = (applicantName || 'Applicant').trim();
    console.log(`[Server] Received Canada Visa email request for applicant: "${cleanApplicantName}"`);

    if (!pdfBase64) {
      console.warn('[Server] Error: Missing Canada PDF document content.');
      return res.status(400).json({ success: false, error: 'Missing PDF document content' });
    }

    const cleanVisaCategory = (visaCategory || 'Canada Business & Tourist Visa').trim();
    const cleanTravelPurpose = (travelPurpose || 'Tourism & Sightseeing').trim();
    const cleanBiometrics = (biometricsStatus || 'Not specified').trim();
    const cleanTravelHistory = (travelHistory || 'Standard').trim();
    const cleanEmployment = (employmentStatus || 'Salaried Employee').trim();
    const cleanFunds = (fundsReadiness || 'Ready in Liquid Bank Savings').trim();
    const cleanEmail = (email || 'Not provided').trim();
    const cleanPhone = (phone || 'Not provided').trim();
    const cleanLocation = `${city || '—'}, ${applicantState || '—'}, ${country || 'India'}`;
    const cleanApplicantsCount = `${applicantsCount || 1} Person(s)`;
    const cleanTravelPeriod = (intendedTravelPeriod || 'Next 3 to 6 Months').trim();

    const safeUserName = cleanApplicantName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') || 'Applicant';
    const cleanFilename = filename || `Aspire_Travels_Canada_Visa_Summary_${safeUserName}.pdf`;

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[Server] RESEND_API_KEY environment variable is not configured on the server.'
      );
      return res.status(500).json({
        success: false,
        error: 'Email delivery service is not configured (RESEND_API_KEY is missing on server).',
      });
    }

    const recipient = process.env.SUPPORT_EMAIL || 'support@aspiretravels.in';
    const fromAddress = process.env.FROM_EMAIL || 'support@aspiretravels.in';

    const subject = `New Canada Visa Summary - ${cleanApplicantName}`;
    const textContent = `A new Canada Visa Summary has been generated through the Aspire Travels website.

Applicant Details:
------------------
• Applicant Name: ${cleanApplicantName}
• Visa Category: ${cleanVisaCategory}
• Purpose of Visit: ${cleanTravelPurpose}
• Biometrics Status: ${cleanBiometrics}
• Travel History / CAN+: ${cleanTravelHistory}
• Employment: ${cleanEmployment}
• Funds Readiness: ${cleanFunds}
• Email Address: ${cleanEmail}
• Mobile / WhatsApp: ${cleanPhone}
• Location: ${cleanLocation}
• Total Applicants: ${cleanApplicantsCount}
• Target Travel Period: ${cleanTravelPeriod}

The personalized Canada visa summary PDF (${cleanFilename}) is attached to this email.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #c41e3a;">
          <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #fca5a5; text-transform: uppercase;">Canada Consular & IRCC Visitor Visa Advisory</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-top: 0; font-size: 15px; color: #334155;">A new Canada Visa Summary has been generated through the Aspire Travels website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td>
              <td style="padding: 10px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Purpose of Visit:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanTravelPurpose}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Biometrics:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanBiometrics}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">CAN+ / Travel History:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanTravelHistory}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Email Address:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Phone / WhatsApp:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanPhone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Location:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanLocation}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Total Applicants:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanApplicantsCount}</td>
            </tr>
          </table>
          
          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            The personalized Canada visa summary PDF (<strong>${cleanFilename}</strong>) is attached to this email.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
          Aspire Travels &bull; ${recipient} &bull; +91 92893 37446
        </div>
      </div>
    `;

    const rawBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
    const pdfBuffer = Buffer.from(rawBase64, 'base64');

    console.log(
      `[Server] Dispatching Canada Visa Summary email via Resend:
  - Applicant: ${cleanApplicantName}
  - Filename: ${cleanFilename} (${pdfBuffer.length} bytes)
  - To: ${recipient}
  - From: ${fromAddress}`
    );

    const sendResult = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      subject: subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: cleanFilename,
          content: pdfBuffer,
        },
      ],
    });

    if (sendResult.error) {
      console.error('[Server] Resend API error response:', JSON.stringify(sendResult.error, null, 2));
      return res.status(500).json({
        success: false,
        error: sendResult.error.message || 'Resend service rejected the email dispatch.',
      });
    }

    console.log(
      `[Server] Canada Visa Summary email successfully sent for "${cleanApplicantName}" to ${recipient} (Email ID: ${sendResult.data?.id})`
    );

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully to Aspire Travels.',
      messageId: sendResult.data?.id,
    });
  } catch (err: any) {
    console.error('[Server] Exception occurred while sending Canada email:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while dispatching email notification.',
    });
  }
}

/**
 * Common handler for sending Europe Schengen Visa Summary PDF via Resend
 */
async function handleSendSchengenVisaSummary(req: express.Request, res: express.Response) {
  res.setHeader('Content-Type', 'application/json');

  try {
    const {
      applicantName,
      email,
      phone,
      city,
      state: applicantState,
      country,
      applicantsCount,
      intendedTravelPeriod,
      visaCategory,
      primaryDestination,
      travelPurpose,
      biometricsStatus,
      travelHistory,
      employmentStatus,
      fundsAvailability,
      filename,
      pdfBase64,
    } = req.body || {};

    const cleanApplicantName = (applicantName || 'Applicant').trim();
    console.log(`[Server] Received Europe Schengen Visa email request for applicant: "${cleanApplicantName}"`);

    if (!pdfBase64) {
      console.warn('[Server] Error: Missing Schengen PDF document content.');
      return res.status(400).json({ success: false, error: 'Missing PDF document content' });
    }

    const cleanDestination = (primaryDestination || 'Europe Schengen Zone').trim();
    const cleanVisaCategory = (visaCategory || 'Schengen Business & Tourist Visa').trim();
    const cleanTravelPurpose = (travelPurpose || 'Tourism & Sightseeing').trim();
    const cleanBiometrics = (biometricsStatus || 'Not specified').trim();
    const cleanTravelHistory = (travelHistory || 'Standard').trim();
    const cleanEmployment = (employmentStatus || 'Salaried Professional').trim();
    const cleanFunds = (fundsAvailability || 'Standard Liquid Funds').trim();
    const cleanEmail = (email || 'Not provided').trim();
    const cleanPhone = (phone || 'Not provided').trim();
    const cleanLocation = `${city || '—'}, ${applicantState || '—'}, ${country || 'India'}`;
    const cleanApplicantsCount = `${applicantsCount || 1} Person(s)`;
    const cleanTravelPeriod = (intendedTravelPeriod || 'Next 3 to 6 Months').trim();

    const safeUserName = cleanApplicantName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') || 'Applicant';
    const cleanFilename = filename || `Aspire_Travels_Schengen_Visa_Summary_${safeUserName}.pdf`;

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[Server] RESEND_API_KEY environment variable is not configured on the server.'
      );
      return res.status(500).json({
        success: false,
        error: 'Email delivery service is not configured (RESEND_API_KEY is missing on server).',
      });
    }

    const recipient = process.env.SUPPORT_EMAIL || 'support@aspiretravels.in';
    const fromAddress = process.env.FROM_EMAIL || 'support@aspiretravels.in';

    const subject = `New Schengen Visa Summary - ${cleanApplicantName} (${cleanDestination})`;
    const textContent = `A new Schengen Visa Summary has been generated through the Aspire Travels website.

Applicant Details:
------------------
• Applicant Name: ${cleanApplicantName}
• Primary Destination: ${cleanDestination}
• Visa Category: ${cleanVisaCategory}
• Purpose of Visit: ${cleanTravelPurpose}
• Biometrics (VIS): ${cleanBiometrics}
• Travel History: ${cleanTravelHistory}
• Employment: ${cleanEmployment}
• Funds Availability: ${cleanFunds}
• Email Address: ${cleanEmail}
• Mobile / WhatsApp: ${cleanPhone}
• Location: ${cleanLocation}
• Total Applicants: ${cleanApplicantsCount}
• Target Travel Period: ${cleanTravelPeriod}

The personalized Schengen visa summary PDF (${cleanFilename}) is attached to this email.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #0284c7;">
          <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #38bdf8; text-transform: uppercase;">Europe Schengen Consular Advisory Notification</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-top: 0; font-size: 15px; color: #334155;">A new Europe Schengen Visa Summary has been generated through the Aspire Travels website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td>
              <td style="padding: 10px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Primary Country:</td>
              <td style="padding: 10px 16px; font-weight: bold; color: #0284c7; font-size: 14px;">${cleanDestination}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Purpose of Visit:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanTravelPurpose}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Biometrics (VIS):</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanBiometrics}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Email Address:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Phone / WhatsApp:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanPhone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Location:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanLocation}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Total Applicants:</td>
              <td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanApplicantsCount}</td>
            </tr>
          </table>
          
          <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
            The personalized Schengen visa summary PDF (<strong>${cleanFilename}</strong>) is attached to this email.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
          Aspire Travels &bull; ${recipient} &bull; +91 92893 37446
        </div>
      </div>
    `;

    const rawBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
    const pdfBuffer = Buffer.from(rawBase64, 'base64');

    console.log(
      `[Server] Dispatching Schengen Visa Summary email via Resend:
  - Applicant: ${cleanApplicantName}
  - Country: ${cleanDestination}
  - Filename: ${cleanFilename} (${pdfBuffer.length} bytes)
  - To: ${recipient}
  - From: ${fromAddress}`
    );

    const sendResult = await resend.emails.send({
      from: fromAddress,
      to: recipient,
      subject: subject,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: cleanFilename,
          content: pdfBuffer,
        },
      ],
    });

    if (sendResult.error) {
      console.error('[Server] Resend API error response:', JSON.stringify(sendResult.error, null, 2));
      return res.status(500).json({
        success: false,
        error: sendResult.error.message || 'Resend service rejected the email dispatch.',
      });
    }

    console.log(
      `[Server] Schengen Visa Summary email successfully sent for "${cleanApplicantName}" to ${recipient} (Email ID: ${sendResult.data?.id})`
    );

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully to Aspire Travels.',
      messageId: sendResult.data?.id,
    });
  } catch (err: any) {
    console.error('[Server] Exception occurred while sending Schengen email:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while dispatching email notification.',
    });
  }
}

// Register endpoints and aliases
app.post('/api/send-usa-visa-summary', handleSendUsaVisaSummary);
app.post('/api/send-summary', handleSendUsaVisaSummary);
app.post('/api/send-email', handleSendUsaVisaSummary);

app.post('/api/send-canada-visa-summary', handleSendCanadaVisaSummary);
app.post('/api/send-canada-summary', handleSendCanadaVisaSummary);

app.post('/api/send-schengen-visa-summary', handleSendSchengenVisaSummary);
app.post('/api/send-schengen-summary', handleSendSchengenVisaSummary);

const SITEMAP_XML_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aspiretravels.in/</loc>
    <lastmod>2026-09-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`.trim();

const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /

Sitemap: https://aspiretravels.in/sitemap.xml
`.trim();

// Explicit SEO routes for sitemap.xml and robots.txt (clean static file serving)
app.get('/sitemap.xml', (req, res) => {
  const distFile = path.join(process.cwd(), 'dist', 'sitemap.xml');
  const publicFile = path.join(process.cwd(), 'public', 'sitemap.xml');
  const targetFile = fs.existsSync(distFile) ? distFile : publicFile;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (fs.existsSync(targetFile)) {
    return res.sendFile(targetFile);
  }
  return res.status(200).type('application/xml').send(SITEMAP_XML_CONTENT);
});

app.get('/robots.txt', (req, res) => {
  const distFile = path.join(process.cwd(), 'dist', 'robots.txt');
  const publicFile = path.join(process.cwd(), 'public', 'robots.txt');
  const targetFile = fs.existsSync(distFile) ? distFile : publicFile;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (fs.existsSync(targetFile)) {
    return res.sendFile(targetFile);
  }
  return res.status(200).type('text/plain').send(ROBOTS_TXT_CONTENT);
});

// Explicit 404 handler for any unmatched /api/* requests so they ALWAYS return JSON
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Express error handling middleware ensuring all unhandled errors/413s return valid JSON
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Server Error Middleware Caught]:', err);
  if (!res.headersSent) {
    res.status(err.status || err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal server error occurred while processing request.',
    });
  }
});

// Setup dev Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const publicPath = path.join(process.cwd(), 'public');
    
    // Serve static files from dist and public before the SPA catch-all
    app.use(express.static(distPath));
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aspire Travels server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
