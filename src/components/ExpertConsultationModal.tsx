import { X, PhoneCall, MessageCircle, ShieldCheck } from 'lucide-react';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, WHATSAPP_URL } from '../config/contact';

interface ExpertConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpertConsultationModal({ isOpen, onClose }: ExpertConsultationModalProps) {
  if (!isOpen) return null;

  const handleWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdd0] border border-[#2d2d2d]/15 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm flex flex-col">
        {/* Header */}
        <div className="p-6 md:p-8 bg-[#f5f5dc] border-b border-[#2d2d2d]/10 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#b8860b] font-semibold block">
              1-on-1 Confidential Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2d2d2d] font-bold mt-1">
              Talk to an Immigration Expert
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#2d2d2d]/60 hover:text-[#2d2d2d] rounded-full hover:bg-[#2d2d2d]/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 flex-grow">
          <div className="space-y-6">
            <p className="text-sm sm:text-base text-[#4a3c31] font-light leading-relaxed">
              Speak directly with Aspire Travels for visa guidance, appointment support, and next steps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={CONTACT_PHONE_HREF}
                className="group flex min-h-36 flex-col justify-between rounded-sm border border-[#2d2d2d]/15 bg-white/70 p-5 transition-all hover:border-[#b8860b]/60 hover:bg-[#f5f5dc] hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b8860b]/10 text-[#b8860b] transition-colors group-hover:bg-[#b8860b] group-hover:text-white">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-serif text-xl font-semibold text-[#2d2d2d]">Call Expert</span>
                  <span className="mt-1 block text-sm text-[#4a3c31]">{CONTACT_PHONE_DISPLAY}</span>
                </span>
              </a>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="group flex min-h-36 flex-col justify-between rounded-sm border border-[#25D366]/35 bg-[#25D366] p-5 text-left text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5d] hover:shadow-xl"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/18 text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-serif text-xl font-semibold">Continue on WhatsApp</span>
                  <span className="mt-1 block text-sm text-white/85">{CONTACT_PHONE_DISPLAY}</span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#2d2d2d]/70 bg-[#f5f5dc] p-3 rounded-sm border border-[#2d2d2d]/10">
              <ShieldCheck className="w-4 h-4 text-[#b8860b] shrink-0" />
              <span>Choose the contact option that is easiest for you. WhatsApp opens only after you tap the button.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
