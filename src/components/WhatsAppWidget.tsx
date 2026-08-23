import { useState } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';
import {
  WHATSAPP_URL,
  CONTACT_PHONE_HREF,
  CONTACT_PHONE_DISPLAY,
} from '../config/contact';

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppRedirect = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Contact and Support Options"
      className="fixed right-4 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[9999] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3"
    >
      {/* Interactive Contact Popover (Only shows when user explicitly clicks open) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Connect Desk"
          className="mb-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-[#2d2d2d]/20 bg-[#fffdd0] shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="bg-[#2d2d2d] px-4 py-3 text-[#fffdd0]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b8860b]/50 bg-[#fffdd0] text-[#2d2d2d]">
                  <span className="font-serif text-xs font-bold text-[#b8860b]">AT</span>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold leading-tight text-[#fffdd0]">
                    Aspire Travels Desk
                  </h4>
                  <p className="text-[11px] text-[#fffdd0]/70">Direct Visa Consultation</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close contact window"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-[#fffdd0]/70 transition-colors hover:bg-white/10 hover:text-[#fffdd0]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick contact actions */}
          <div className="space-y-2.5 p-4">
            <div className="rounded border border-[#2d2d2d]/10 bg-[#f5f5dc] p-3 text-xs leading-relaxed text-[#2d2d2d]">
              <p className="font-medium text-[#2d2d2d]">
                Have visa questions or need application guidance?
              </p>
              <p className="mt-1 text-[#2d2d2d]/75">
                Reach out directly via WhatsApp or phone call for immediate assistance.
              </p>
            </div>

            {/* WhatsApp option */}
            <button
              type="button"
              id="whatsapp-popover-btn"
              onClick={handleWhatsAppRedirect}
              className="flex w-full items-center justify-between rounded bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5d] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="h-5 w-5 fill-current shrink-0" />
                <span>Chat on WhatsApp</span>
              </div>
              <span className="text-[11px] font-normal opacity-90">Instant Reply</span>
            </button>

            {/* Phone Call option */}
            <a
              id="call-popover-btn"
              href={CONTACT_PHONE_HREF}
              className="flex w-full items-center justify-between rounded border border-[#2d2d2d]/20 bg-[#2d2d2d] px-4 py-3 text-sm font-semibold text-[#fffdd0] shadow-md transition-all hover:bg-[#1f1f1f] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#b8860b] shrink-0" />
                <span>Call Visa Expert</span>
              </div>
              <span className="text-xs font-mono text-[#b8860b]">{CONTACT_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Buttons at Corner */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Direct Call Button */}
        <a
          id="floating-call-btn"
          href={CONTACT_PHONE_HREF}
          aria-label={`Call Aspire Travels at ${CONTACT_PHONE_DISPLAY}`}
          title={`Call Us: ${CONTACT_PHONE_DISPLAY}`}
          className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-[#b8860b]/60 bg-[#2d2d2d] text-[#fffdd0] shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#1f1f1f] hover:border-[#b8860b] active:scale-95 cursor-pointer"
        >
          <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#b8860b] transition-transform group-hover:scale-110" />
          
          {/* Desktop Hover Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#fffdd0] whitespace-nowrap opacity-0 shadow-xl transition-opacity group-hover:opacity-100 md:inline-block border border-white/10">
            Call: {CONTACT_PHONE_DISPLAY}
          </span>
        </a>

        {/* WhatsApp Direct Redirect / Action Button */}
        <button
          id="floating-whatsapp-btn"
          type="button"
          aria-label="Chat on WhatsApp"
          title="Open WhatsApp Chat"
          onClick={handleWhatsAppRedirect}
          className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-white bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 hover:bg-[#1ebe5d] active:scale-95 cursor-pointer"
        >
          <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:scale-110" />

          {/* Desktop Hover Tooltip */}
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#fffdd0] whitespace-nowrap opacity-0 shadow-xl transition-opacity group-hover:opacity-100 md:inline-block border border-white/10">
            Chat on WhatsApp
          </span>
        </button>

        {/* Quick Help Menu Button */}
        <button
          id="floating-contact-menu-toggle"
          type="button"
          aria-label={isOpen ? "Close contact options" : "More contact options"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#2d2d2d]/20 bg-[#fffdd0] text-[#2d2d2d] shadow-md transition-all duration-200 hover:bg-[#f5f5dc] hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen ? "rotate-45" : ""
          }`}
          title="Contact options menu"
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <MessageCircle className="h-4 w-4 text-[#b8860b]" />
          )}
        </button>
      </div>
    </aside>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

