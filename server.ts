import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser supporting base64 PDF payload
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
 * POST /api/send-usa-visa-summary
 * Secure server-side endpoint that dispatches the USA Visa Summary PDF to support@aspiretravels.in via Resend
 */
app.post('/api/send-usa-visa-summary', async (req, res) => {
  try {
    const { applicantName, visaCategory, ds160Status, filename, pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ success: false, error: 'Missing PDF document content' });
    }

    const cleanApplicantName = (applicantName || 'Applicant').trim();
    const cleanVisaCategory = (visaCategory || 'Tourist & Business Visa').trim();
    const cleanDs160Status = (ds160Status || 'Not specified').trim();
    const cleanFilename =
      filename || `Aspire Travel US Visa Summary_${cleanApplicantName.replace(/\s+/g, '_')}.pdf`;

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[Server] RESEND_API_KEY environment variable is not configured. Email dispatch skipped.'
      );
      return res.status(500).json({
        success: false,
        error: 'Email delivery service is not configured on the server.',
      });
    }

    const recipient = process.env.SUPPORT_EMAIL || 'support@aspiretravels.in';
    const fromAddress = process.env.FROM_EMAIL || 'support@aspiretravels.in';

    const subject = `New USA Visa Summary - ${cleanApplicantName}`;
    const textContent = `A new USA Visa Summary has been generated through the Aspire Travels website.

Applicant Name: ${cleanApplicantName}
Visa Category: ${cleanVisaCategory}
DS-160 Status: ${cleanDs160Status}

The personalized visa summary PDF is attached to this email.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #b8860b;">
          <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #daa520; text-transform: uppercase;">USA Visa Consular Advisory</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-top: 0; font-size: 15px; color: #334155;">A new USA Visa Summary has been generated through the Aspire Travels website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td>
              <td style="padding: 12px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #475569; font-size: 13px;">DS-160 Status:</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px;">${cleanDs160Status}</td>
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

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

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
      console.error('[Server] Resend error response:', sendResult.error);
      return res.status(500).json({
        success: false,
        error: sendResult.error.message || 'Resend error',
      });
    }

    console.log(
      `[Server] USA Visa Summary email successfully sent for "${cleanApplicantName}" to ${recipient} (Email ID: ${sendResult.data?.id})`
    );

    return res.json({
      success: true,
      messageId: sendResult.data?.id,
    });
  } catch (err: any) {
    console.error('[Server] Exception occurred while sending email:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to dispatch email notification.',
    });
  }
});

/**
 * POST /api/send-canada-visa-summary
 * Secure server-side endpoint that dispatches the Canada Visa Summary PDF to support@aspiretravels.in via Resend
 */
app.post('/api/send-canada-visa-summary', async (req, res) => {
  try {
    const {
      applicantName,
      visaCategory,
      travelPurpose,
      biometricsStatus,
      travelHistory,
      filename,
      pdfBase64,
    } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ success: false, error: 'Missing PDF document content' });
    }

    const cleanApplicantName = (applicantName || 'Applicant').trim();
    const cleanVisaCategory = (visaCategory || 'Canada Business & Tourist Visa').trim();
    const cleanTravelPurpose = (travelPurpose || 'Tourism & Sightseeing').trim();
    const cleanBiometrics = (biometricsStatus || 'Not specified').trim();
    const cleanTravelHistory = (travelHistory || 'Standard').trim();
    const cleanFilename =
      filename || `Aspire Travel Canada Visa Summary_${cleanApplicantName.replace(/\s+/g, '_')}.pdf`;

    const resend = getResendClient();
    if (!resend) {
      console.warn(
        '[Server] RESEND_API_KEY environment variable is not configured. Email dispatch skipped.'
      );
      return res.status(500).json({
        success: false,
        error: 'Email delivery service is not configured on the server.',
      });
    }

    const recipient = process.env.SUPPORT_EMAIL || 'support@aspiretravels.in';
    const fromAddress = process.env.FROM_EMAIL || 'support@aspiretravels.in';

    const subject = `New Canada Visa Summary - ${cleanApplicantName}`;
    const textContent = `A new Canada Visa Summary has been generated through the Aspire Travels website.

Applicant Name: ${cleanApplicantName}
Visa Category: ${cleanVisaCategory}
Purpose of Visit: ${cleanTravelPurpose}
Biometrics Status: ${cleanBiometrics}
Travel History / CAN+: ${cleanTravelHistory}

The personalized Canada visa summary PDF is attached to this email.`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #c41e3a;">
          <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #fca5a5; text-transform: uppercase;">Canada Consular & IRCC Visitor Visa Advisory</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-top: 0; font-size: 15px; color: #334155;">A new Canada Visa Summary has been generated through the Aspire Travels website.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td>
              <td style="padding: 12px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; font-weight: bold; color: #475569; font-size: 13px;">Purpose of Visit:</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px;">${cleanTravelPurpose}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 16px; font-weight: bold; color: #475569; font-size: 13px;">Biometrics:</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px;">${cleanBiometrics}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #475569; font-size: 13px;">CAN+ / Travel History:</td>
              <td style="padding: 12px 16px; color: #0f172a; font-size: 14px;">${cleanTravelHistory}</td>
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

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

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
      console.error('[Server] Resend error response:', sendResult.error);
      return res.status(500).json({
        success: false,
        error: sendResult.error.message || 'Resend error',
      });
    }

    console.log(
      `[Server] Canada Visa Summary email successfully sent for "${cleanApplicantName}" to ${recipient} (Email ID: ${sendResult.data?.id})`
    );

    return res.json({
      success: true,
      messageId: sendResult.data?.id,
    });
  } catch (err: any) {
    console.error('[Server] Exception occurred while sending Canada email:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to dispatch email notification.',
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aspire Travels server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
