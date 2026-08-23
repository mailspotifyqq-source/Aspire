import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../data/visaData';

interface DestinationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (destinationId: string) => void;
}

export function DestinationSelectorModal({
  isOpen,
  onClose,
  onSelectDestination,
}: DestinationSelectorModalProps) {
  // Only the 7 primary destinations, ordered and curated
  const validDestinationIds = ['usa', 'canada', 'europe', 'uk', 'singapore', 'australia', 'asia'];
  const destinations = DESTINATIONS.filter((d) => validDestinationIds.includes(d.id));

  const [selectedId, setSelectedId] = useState<string>('usa');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedId) {
      onSelectDestination(selectedId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-[#fffdfa] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e5e0d8] overflow-hidden z-10 my-6"
        >
          {/* Header */}
          <div className="px-5 sm:px-8 pt-6 pb-4 sm:pt-7 sm:pb-5 border-b border-[#f0ece4] flex items-start justify-between bg-gradient-to-b from-[#fbf8f2] to-[#fffdfa]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b8860b]/10 text-[#8b6508] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Your Visa Journey</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1e293b]">
                Where are you planning to go?
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
                Select your destination to access tailored consular procedures and visa filing assistance.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:text-[#1e293b] hover:bg-[#f1ebe1] rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Destination Cards Grid (Compact & Premium) */}
          <div className="p-5 sm:p-8 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
              {destinations.map((dest) => {
                const isSelected = selectedId === dest.id;
                const isUsa = dest.id === 'usa';

                return (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedId(dest.id)}
                    className={`group relative p-3 sm:p-3.5 rounded-xl sm:rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'bg-[#fefaf0] border-[#b8860b] shadow-md ring-2 ring-[#b8860b]/30'
                        : 'bg-white border-[#e8e2d8] hover:border-[#b8860b]/60 hover:shadow-sm'
                    }`}
                  >
                    {/* Landmark Image Header */}
                    <div className="relative w-full h-24 sm:h-26 rounded-lg sm:rounded-xl overflow-hidden mb-3 bg-[#e2e8f0]">
                      <img
                        src={dest.landmarkImage}
                        alt={dest.landmarkName || dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                      {/* Flag & Name badge over image */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold drop-shadow flex items-center gap-1.5">
                          <span className="text-base leading-none">{dest.flag}</span>
                          <span className="font-serif tracking-wide">{dest.name}</span>
                        </span>
                        {dest.landmarkName && (
                          <span className="text-[10px] text-white/80 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded font-mono truncate max-w-[110px]">
                            {dest.landmarkName}
                          </span>
                        )}
                      </div>

                      {/* Selected checkmark badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#b8860b] text-white rounded-full p-1 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* USA Portal Badge */}
                      {isUsa && (
                        <div className="absolute top-2 left-2 bg-[#1e293b]/85 backdrop-blur-xs text-[#fbbf24] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                          Dedicated Portal
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                      <span className="truncate pr-1">{dest.category}</span>
                      <span className="font-medium text-[#1e293b] shrink-0">{dest.successRate} success</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sub-note */}
            <div className="mt-5 p-3 rounded-xl bg-[#f8f5ee] border border-[#ebe5d8] flex items-center gap-2.5 text-xs text-[#64748b]">
              <Shield className="w-4 h-4 text-[#b8860b] shrink-0" />
              <span>
                {selectedId === 'usa'
                  ? 'Selecting USA opens the dedicated USA Visa Portal with customized DS-160 advisory and appointment guidance.'
                  : 'Tailored consular advisory, documentation checklists, and profile assessment for your selected country.'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-[#f0ece4] bg-[#fbf8f2] flex items-center justify-between">
            <div className="text-xs text-[#64748b] hidden sm:block">
              Selected destination:{' '}
              <strong className="text-[#1e293b]">
                {destinations.find((d) => d.id === selectedId)?.name || 'USA'}
              </strong>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#d6cfc4] text-xs font-semibold text-[#475569] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#b8860b] hover:bg-[#996f09] text-white text-xs font-bold shadow-md shadow-[#b8860b]/20 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>Continue to {selectedId === 'usa' ? 'USA Visa Portal' : 'Application'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
