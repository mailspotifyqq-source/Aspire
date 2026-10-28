import { useState, type FormEvent } from 'react';
import { Check, Mail, Phone, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_RAW,
  CONTACT_PHONE_HREF,
  CONTACT_ADDRESS
} from '../config/contact';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
  onOpenAssessment: (category?: string) => void;
}

export function Footer({ onNavigate, onOpenConsultation, onOpenAssessment }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#f5f5dc] dark:bg-[#05080f] w-full pt-16 pb-12 px-6 md:px-12 text-[#4a3c31] dark:text-slate-400 font-sans text-sm border-t border-[#2d2d2d]/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Column 1: Brand & Contact Info */}
          <div className="pr-4">
            <div className="mb-4">
              <BrandLogo
                markSize={36}
                showText={true}
                showSubtitle={true}
                subtitleText="Visa Consultancy & Guidance"
                onClick={() => onNavigate('hero')}
              />
            </div>
            <p className="text-[#2d2d2d]/70 dark:text-slate-400 mb-6 leading-relaxed font-light text-xs sm:text-sm">
              Your trusted partner in navigating global immigration compliance with precision and elegance.
            </p>
            <div className="space-y-2 text-xs text-[#2d2d2d]/80 dark:text-slate-300 font-light">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37] shrink-0" />
                <a
                  href={CONTACT_EMAIL_HREF}
                  className="font-mono text-[#2d2d2d] dark:text-white hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37] shrink-0" />
                <a
                  href={CONTACT_PHONE_HREF}
                  className="font-mono text-[#2d2d2d] dark:text-white hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors"
                >
                  {CONTACT_PHONE_RAW}
                </a>
              </p>
              <p className="flex items-start gap-1.5 mt-3">
                <MapPin className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37] shrink-0 mt-0.5" />
                <span>{CONTACT_ADDRESS}</span>
              </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[#2d2d2d] dark:text-[#f8fafc] font-bold">
              Services
            </h4>
            <ul className="flex flex-col gap-3 font-light text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenAssessment('Tourist & Business Visas')}
                  className="text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  Tourist & Business Visas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAssessment('Student Visa & Higher Education')}
                  className="text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  Student Visa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAssessment('Work Visa & Intra-Company Transfers')}
                  className="text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  Work Visa
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[#2d2d2d] dark:text-[#f8fafc] font-bold">
              Company
            </h4>
            <ul className="flex flex-col gap-3 font-light text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  Contact & Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('success')}
                  className="text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors text-left cursor-pointer"
                >
                  Success Stories
                </button>
              </li>
              <li>
                <span className="text-[#2d2d2d]/50 dark:text-slate-500 cursor-default">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-[#2d2d2d]/50 dark:text-slate-500 cursor-default">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6 text-[#2d2d2d] dark:text-[#f8fafc] font-bold">
              Newsletter
            </h4>
            <p className="text-[#2d2d2d]/70 dark:text-slate-400 mb-4 font-light text-xs sm:text-sm">
              Subscribe for the latest embassy alerts, quota releases, and policy updates.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex border border-[#2d2d2d]/20 dark:border-white/15 bg-[#fffdd0] dark:bg-[#0b1320] rounded-sm overflow-hidden focus-within:border-[#b8860b] dark:focus-within:border-[#d4af37] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="bg-transparent border-none text-[#2d2d2d] dark:text-white placeholder-[#2d2d2d]/40 dark:placeholder-slate-400 focus:outline-none w-full text-xs font-light px-3.5 py-2.5"
                />
                <button
                  type="submit"
                  className="bg-[#2d2d2d]/5 dark:bg-white/5 hover:bg-[#b8860b] dark:hover:bg-[#d4af37] hover:text-white dark:hover:text-[#070c14] text-[#2d2d2d] dark:text-white px-5 py-2.5 border-l border-[#2d2d2d]/20 dark:border-white/15 font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : 'Join'}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#b8860b] dark:text-[#d4af37] font-medium animate-in fade-in">
                  Thank you! You are now on our priority dispatch list.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[#2d2d2d]/10 dark:border-white/10 pt-8 text-center md:text-left text-[#2d2d2d]/50 dark:text-slate-500 text-xs tracking-wider flex flex-col md:flex-row justify-between items-center font-light gap-4">
          <span>&copy; {new Date().getFullYear()} Aspire Travels Visa Consultancy. All rights reserved.</span>
          <div className="text-[11px] font-medium text-[#2d2d2d]/60 dark:text-slate-400">
            <span>Official Visa & Consular Documentation Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
