# Cloudflare Worker Email Integration Guide for Aspire Travels

This architecture keeps your **Render Website 100% STATIC** while securely routing PDF attachments to Resend:

```
[Render Static Site] (Vite SPA)
        │
        ▼ (POST request with PDF base64)
[Cloudflare Worker] (Holds RESEND_API_KEY secret & handles CORS)
        │
        ▼ (Authenticated HTTPS API Call)
[Resend REST API] (api.resend.com)
        │
        ▼
[support@aspiretravels.in] (Receives email + PDF attachment)
```

---

## Step A: Create the Cloudflare Worker (Web Dashboard — 2 Minutes)

1. Log into your free **[Cloudflare Dashboard](https://dash.cloudflare.com/)**.
2. In the left navigation menu, click **Compute (Workers & Pages)** → **Workers**.
3. Click **Create Application** (or **Create Worker**).
4. Name your worker: `aspire-travels-email-worker` (or any name you prefer).
5. Click **Deploy**.

---

## Step B: Paste the Worker Code

1. On the Worker overview page, click **Edit code** (or **Quick Edit**).
2. Replace all the default code in `worker.js` with the code in `cloudflare-worker/worker.js`:

```javascript
/**
 * Cloudflare Worker for Aspire Travels Visa Summary Emails
 * Route: POST https://your-worker-url.workers.dev
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method === 'GET' && (url.pathname === '/health' || url.pathname === '/')) {
      return jsonResponse({
        status: 'ok',
        service: 'Aspire Travels Email Dispatcher',
        resendConfigured: !!(env.RESEND_API_KEY && env.RESEND_API_KEY.trim().length > 0),
        supportEmail: env.SUPPORT_EMAIL || 'support@aspiretravels.in',
        fromEmail: env.FROM_EMAIL || 'support@aspiretravels.in',
        timestamp: new Date().toISOString(),
      });
    }

    if (request.method === 'POST') {
      try {
        let payload;
        try {
          payload = await request.json();
        } catch (e) {
          return jsonResponse({ success: false, error: 'Invalid JSON request body.' }, 400);
        }

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
          travelPurpose,
          biometricsStatus,
          travelHistory,
          employmentStatus,
          fundsReadiness,
          filename,
          pdfBase64,
          serviceType,
        } = payload || {};

        const cleanApplicantName = (applicantName || 'Applicant').trim();
        if (!pdfBase64) {
          return jsonResponse({ success: false, error: 'Missing PDF document content in request body.' }, 400);
        }

        if (!env.RESEND_API_KEY || env.RESEND_API_KEY.trim().length === 0) {
          return jsonResponse({
            success: false,
            error: 'RESEND_API_KEY is not configured in Cloudflare Worker secrets.',
          }, 500);
        }

        const isCanada = serviceType === 'canada' || url.pathname.includes('canada');
        const cleanEmail = (email || 'Not provided').trim();
        const cleanPhone = (phone || 'Not provided').trim();
        const cleanLocation = `${city || '—'}, ${applicantState || '—'}, ${country || 'India'}`;
        const cleanApplicantsCount = `${applicantsCount || 1} Person(s)`;
        const cleanTravelPeriod = (intendedTravelPeriod || 'Upcoming 3-6 Months').trim();

        const safeUserName = cleanApplicantName.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_') || 'Applicant';
        const cleanFilename = filename || (isCanada
          ? `Aspire_Travels_Canada_Visa_Summary_${safeUserName}.pdf`
          : `Aspire_Travels_US_Visa_Summary_${safeUserName}.pdf`);

        const rawBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
        const fromAddress = env.FROM_EMAIL || 'support@aspiretravels.in';
        const recipient = env.SUPPORT_EMAIL || 'support@aspiretravels.in';
        const subject = isCanada
          ? `New Canada Visa Summary - ${cleanApplicantName}`
          : `New USA Visa Summary - ${cleanApplicantName}`;

        let textContent = '';
        let htmlContent = '';

        if (isCanada) {
          const cleanVisaCategory = (visaCategory || 'Canada Business & Tourist Visa').trim();
          const cleanTravelPurpose = (travelPurpose || 'Tourism & Sightseeing').trim();
          const cleanBiometrics = (biometricsStatus || 'Not specified').trim();
          const cleanHistory = (travelHistory || 'First-time Canada Visa Applicant').trim();
          const cleanEmployment = (employmentStatus || 'Salaried Employee').trim();
          const cleanFunds = (fundsReadiness || 'Ready in Liquid Bank Savings').trim();

          textContent = `A new Canada Visa Summary has been generated through the Aspire Travels website.

Applicant Details:
• Applicant Name: ${cleanApplicantName}
• Visa Category: ${cleanVisaCategory}
• Purpose of Visit: ${cleanTravelPurpose}
• Biometrics Status: ${cleanBiometrics}
• Travel History / CAN+: ${cleanHistory}
• Employment: ${cleanEmployment}
• Funds Readiness: ${cleanFunds}
• Email Address: ${cleanEmail}
• Mobile / WhatsApp: ${cleanPhone}
• Location: ${cleanLocation}
• Total Applicants: ${cleanApplicantsCount}
• Target Travel Period: ${cleanTravelPeriod}

The personalized Canada visa summary PDF (${cleanFilename}) is attached to this email.`;

          htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #c41e3a;">
                <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #fca5a5; text-transform: uppercase;">Canada Consular & IRCC Visitor Visa Advisory</p>
              </div>
              <div style="padding: 24px; background-color: #ffffff;">
                <p style="margin-top: 0; font-size: 15px; color: #334155;">A new Canada Visa Summary has been generated through the Aspire Travels website.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td><td style="padding: 10px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Purpose of Visit:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanTravelPurpose}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Biometrics:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanBiometrics}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">CAN+ / Travel History:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanHistory}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Email Address:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanEmail}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Phone / WhatsApp:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanPhone}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Location:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanLocation}</td></tr>
                  <tr><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Total Applicants:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanApplicantsCount}</td></tr>
                </table>
                <p style="font-size: 13px; color: #64748b;">The personalized visa roadmap PDF (<strong>${cleanFilename}</strong>) is attached to this email.</p>
              </div>
            </div>
          `;
        } else {
          const cleanVisaCategory = (visaCategory || 'Tourist & Business Visa').trim();
          const cleanDs160Status = (ds160Status || 'Not specified').trim();

          textContent = `A new USA Visa Summary has been generated through the Aspire Travels website.

Applicant Details:
• Applicant Name: ${cleanApplicantName}
• Visa Category: ${cleanVisaCategory}
• DS-160 Status: ${cleanDs160Status}
• Email Address: ${cleanEmail}
• Mobile / WhatsApp: ${cleanPhone}
• Location: ${cleanLocation}
• Number of Applicants: ${cleanApplicantsCount}
• Target Travel Period: ${cleanTravelPeriod}

The personalized visa summary PDF (${cleanFilename}) is attached to this email.`;

          htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0f172a; padding: 24px; color: #ffffff; border-bottom: 3px solid #b8860b;">
                <h1 style="margin: 0; font-size: 20px; color: #ffffff; letter-spacing: 1px;">ASPIRE TRAVELS</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #daa520; text-transform: uppercase;">USA Visa Consular Advisory Notification</p>
              </div>
              <div style="padding: 24px; background-color: #ffffff;">
                <p style="margin-top: 0; font-size: 15px; color: #334155;">A new USA Visa Summary has been generated through the Aspire Travels website.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; width: 38%; color: #475569; font-size: 13px;">Applicant Name:</td><td style="padding: 10px 16px; font-weight: bold; color: #0f172a; font-size: 14px;">${cleanApplicantName}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Visa Category:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanVisaCategory}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">DS-160 Status:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanDs160Status}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Email Address:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanEmail}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Phone / WhatsApp:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanPhone}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Location:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanLocation}</td></tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Total Applicants:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 14px;">${cleanApplicantsCount}</td></tr>
                  <tr><td style="padding: 10px 16px; font-weight: bold; color: #475569; font-size: 13px;">Target Travel Window:</td><td style="padding: 10px 16px; color: #0f172a; font-size: 13px;">${cleanTravelPeriod}</td></tr>
                </table>
                <p style="font-size: 13px; color: #64748b;">The personalized visa summary PDF (<strong>${cleanFilename}</strong>) is attached to this email.</p>
              </div>
            </div>
          `;
        }

        const resendPayload = {
          from: fromAddress,
          to: [recipient],
          subject: subject,
          text: textContent,
          html: htmlContent,
          attachments: [
            {
              filename: cleanFilename,
              content: rawBase64,
            },
          ],
        };

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resendPayload),
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          return jsonResponse({
            success: false,
            error: resendData.message || resendData.name || 'Resend service rejected the email dispatch.',
          }, resendResponse.status);
        }

        return jsonResponse({
          success: true,
          message: 'Email sent successfully to Aspire Travels.',
          messageId: resendData.id,
        }, 200);

      } catch (err) {
        return jsonResponse({
          success: false,
          error: err.message || 'Worker internal error while processing email dispatch.',
        }, 500);
      }
    }

    return jsonResponse({ success: false, error: `Method ${request.method} not supported.` }, 405);
  },
};
```
3. Click **Save and Deploy**.

---

## Step C: Add `RESEND_API_KEY` as a Worker Secret

1. In your Cloudflare Worker page, go to **Settings** → **Variables and Secrets** (or **Environment Variables**).
2. Under **Secrets**, click **Add** (or **Add variable**).
3. Set **Variable name**: `RESEND_API_KEY`
4. Set **Value**: `re_your_resend_api_key` (paste your Resend API Key).
5. Click **Encrypt** / **Save**.
6. *(Optional)* You can also add plain text variables:
   - `FROM_EMAIL`: `support@aspiretravels.in`
   - `SUPPORT_EMAIL`: `support@aspiretravels.in`

---

## Step D: Get Your Cloudflare Worker URL

1. In your Cloudflare Worker overview page, find the **routes / domain**.
2. It will look like:
   `https://aspire-travels-email-worker.<your-subdomain>.workers.dev`
3. Test it in your browser: visit `https://aspire-travels-email-worker.<your-subdomain>.workers.dev/health`
   You should see:
   ```json
   {
     "status": "ok",
     "service": "Aspire Travels Email Dispatcher",
     "resendConfigured": true,
     "supportEmail": "support@aspiretravels.in",
     "fromEmail": "support@aspiretravels.in"
   }
   ```

---

## Step E: Add the Worker URL to Your Render Static Site

1. In your **Render Dashboard**, go to your **Static Site**.
2. Click **Environment**.
3. Add a new environment variable:
   - **Key**: `VITE_EMAIL_WORKER_URL`
   - **Value**: `https://aspire-travels-email-worker.<your-subdomain>.workers.dev`
4. Click **Save Changes** and trigger a **Deploy Latest Commit**.

---

## Step F: Test the Complete Flow

1. Open your live website on Render (`aspiretravels.in`).
2. Open the **USA Visa Portal**.
3. Fill in the assessment steps and name (e.g. `Mitu`).
4. Click **"Generate My Visa Summary"**.
5. **Observed Results**:
   - The PDF (`Aspire_Travels_US_Visa_Summary_Mitu.pdf`) immediately downloads to your computer.
   - The frontend calls your Cloudflare Worker URL.
   - The Cloudflare Worker reads the secret `RESEND_API_KEY` and calls Resend.
   - The UI displays: **"Email sent successfully to Aspire Travels."**
   - In Resend (`resend.com/emails`), the email appears with Status **Delivered**.
   - Your inbox at `support@aspiretravels.in` receives the email with the attached PDF.
