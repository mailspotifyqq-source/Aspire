import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { WHATSAPP_URL } from '../config/contact';

const POPUP_DISMISSED_KEY = 'aspire-whatsapp-popup-dismissed';

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(POPUP_DISMISSED_KEY) === 'true') {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleClose = () => {
    sessionStorage.setItem(POPUP_DISMISSED_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <div className="fixed right-4 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-sm border border-[#2d2d2d]/15 bg-[#fffdd0] shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-300">
          <div className="bg-[#2d2d2d] px-4 py-3 text-[#fffdd0]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#b8860b]/50 bg-[#fffdd0] text-[#2d2d2d]">
                  <span className="font-serif text-sm font-bold">AT</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-base font-semibold leading-tight">Aspire Travels</h4>
                  <p className="mt-0.5 text-[11px] text-[#fffdd0]/75">Typically replies within minutes</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close WhatsApp chat"
                onClick={handleClose}
                className="rounded-full p-1 text-[#fffdd0]/70 transition-colors hover:bg-white/10 hover:text-[#fffdd0]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4">
            <div className="ml-1 max-w-[92%] rounded-sm border border-[#2d2d2d]/10 bg-[#f5f5dc] px-3 py-2.5 shadow-sm">
              <p className="text-sm leading-relaxed text-[#2d2d2d]">
                {'\u{1F44B}'} Hi! Planning your visa journey?
              </p>
            </div>
            <div className="ml-1 max-w-[92%] rounded-sm border border-[#2d2d2d]/10 bg-[#f5f5dc] px-3 py-2.5 shadow-sm">
              <p className="text-sm leading-relaxed text-[#2d2d2d]">
                Need help choosing the right visa or getting started? We're happy to help.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:bg-[#1ebe5d] hover:shadow-xl active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Continue on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      <button
        id="whatsapp-floating-btn"
        type="button"
        aria-label="Open WhatsApp enquiry"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-13 w-13 items-center justify-center rounded-full border border-white/70 bg-[#25D366] text-white shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:bg-[#1ebe5d] active:scale-95 sm:h-14 sm:w-14"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </button>
    </div>
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
