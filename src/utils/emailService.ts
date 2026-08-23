/**
 * Aspire Travels Email Dispatch Service
 * 
 * Routes generated visa summaries to the Cloudflare Worker micro-endpoint,
 * keeping the Render website 100% static while securely dispatching emails via Resend.
 */

export interface VisaSummaryEmailPayload {
  applicantName: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  applicantsCount?: number | string;
  intendedTravelPeriod?: string;
  visaCategory?: string;
  ds160Status?: string;
  travelPurpose?: string;
  biometricsStatus?: string;
  travelHistory?: string;
  employmentStatus?: string;
  fundsReadiness?: string;
  filename: string;
  pdfBase64: string;
  serviceType: 'usa' | 'canada';
}

export interface EmailDispatchResult {
  success: boolean;
  message?: string;
  error?: string;
  messageId?: string;
  isNotConfigured?: boolean;
}

/**
 * Returns the configured Cloudflare Worker URL.
 * Order of priority:
 * 1. window.__EMAIL_WORKER_URL__ (runtime global)
 * 2. localStorage.getItem('VITE_EMAIL_WORKER_URL') (client-side override for testing)
 * 3. import.meta.env.VITE_EMAIL_WORKER_URL (Vite build-time env var)
 * 4. Fallback relative route (/api/send-usa-visa-summary)
 */
export function getEmailWorkerUrl(): string {
  if (typeof window !== 'undefined') {
    const windowOverride = (window as any).__EMAIL_WORKER_URL__;
    if (windowOverride && typeof windowOverride === 'string' && windowOverride.trim().length > 0) {
      return windowOverride.trim();
    }

    try {
      const localOverride = localStorage.getItem('VITE_EMAIL_WORKER_URL') || localStorage.getItem('EMAIL_WORKER_URL');
      if (localOverride && localOverride.trim().length > 0) {
        return localOverride.trim();
      }
    } catch {
      // Ignore localStorage access issues
    }
  }

  const envUrl = (import.meta as any)?.env?.VITE_EMAIL_WORKER_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  // Default fallback if running in full-stack dev/proxy
  return '/api/send-usa-visa-summary';
}

/**
 * Dispatches the visa summary PDF to the Cloudflare Worker / Resend backend.
 */
export async function sendVisaSummaryEmail(
  payload: VisaSummaryEmailPayload
): Promise<EmailDispatchResult> {
  const workerUrl = getEmailWorkerUrl();

  // If worker URL is not configured and running as static site with relative fallback
  const isRelativeUrl = workerUrl.startsWith('/');
  const isViteLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  try {
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    let data: any = null;
    const isHtml = rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html') || rawText.includes('__vite_plugin_react_preamble_installed__');

    if (!isHtml && rawText) {
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn('[EmailService] Non-JSON payload returned:', rawText.slice(0, 120));
      }
    }

    if (response.ok && data?.success) {
      return {
        success: true,
        message: data.message || 'Email sent successfully to Aspire Travels.',
        messageId: data.messageId,
      };
    }

    // Specific descriptive message when Cloudflare Worker URL is not yet connected on Render Static
    if (isHtml || (response.status === 404 && isRelativeUrl)) {
      return {
        success: false,
        isNotConfigured: true,
        error: 'Cloudflare Worker URL is not configured yet. Please set VITE_EMAIL_WORKER_URL in your static site environment settings.',
      };
    }

    const errorMessage =
      data?.error ||
      (rawText && rawText.length < 250 && !isHtml ? rawText : `Delivery service returned HTTP ${response.status} (${response.statusText || 'Error'})`);

    return {
      success: false,
      error: errorMessage,
    };
  } catch (err: any) {
    const networkError = err?.message || 'Network error occurred while connecting to the email service.';
    console.error('[EmailService] Error dispatching email:', err);
    return {
      success: false,
      error: networkError,
    };
  }
}
