import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from '../context/ThemeContext';

interface HeaderProps {
  onOpenConsultation: () => void;
  onOpenAssessment: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Header({
  onOpenConsultation,
  onOpenAssessment,
  activeSection,
  onNavigate
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Destinations', id: 'destinations' },
    { label: 'Visa Services', id: 'services' },
    { label: 'Why Us', id: 'why-us' },
    { label: 'Success Stories', id: 'success' },
    { label: 'FAQ', id: 'faq' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Main Header */}
      <header
        id="main-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#f5f5dc]/95 dark:bg-[#070c14]/95 backdrop-blur-md shadow-sm border-b border-[#2d2d2d]/10 dark:border-white/10 h-20'
            : 'bg-[#fffdd0]/80 dark:bg-[#070c14]/85 backdrop-blur-sm border-b border-[#2d2d2d]/5 dark:border-white/5 h-24'
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('hero')}
            className="text-left group flex items-center focus:outline-none"
          >
            <BrandLogo
              markSize={38}
              showText={true}
              showSubtitle={true}
              subtitleText="Visa & Consular Advisory"
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#2d2d2d]/80 dark:text-slate-200">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors py-1 relative hover:text-[#2d2d2d] dark:hover:text-white cursor-pointer ${
                    isActive
                      ? 'text-[#b8860b] dark:text-[#d4af37] font-semibold'
                      : 'hover:text-[#b8860b] dark:hover:text-[#d4af37]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b8860b] dark:bg-[#d4af37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Accessible Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <button
              id="header-start-journey-btn"
              onClick={onOpenAssessment}
              className="hidden sm:inline-block text-xs uppercase tracking-widest px-3 py-2.5 text-[#b8860b] dark:text-[#d4af37] hover:text-[#8a6508] dark:hover:text-[#fef08a] font-semibold transition-colors cursor-pointer"
            >
              Assess Eligibility
            </button>

            <button
              id="header-talk-expert-btn"
              onClick={onOpenConsultation}
              className="hidden sm:flex border border-[#2d2d2d]/30 dark:border-white/20 text-[#2d2d2d] dark:text-white hover:bg-[#2d2d2d]/5 dark:hover:bg-white/10 active:scale-95 transition-all text-xs uppercase tracking-widest font-semibold px-5 py-2.5 rounded-none items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#b8860b] dark:text-[#d4af37]" />
              <span>Talk to an Expert</span>
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2d2d2d] dark:text-white hover:text-[#b8860b] dark:hover:text-[#d4af37] transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div
            id="mobile-nav-drawer"
            className="w-80 max-w-[85vw] bg-[#f5f5dc] dark:bg-[#0b1320] h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#2d2d2d]/10 dark:border-white/10 animate-in slide-in-from-right duration-300"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#2d2d2d]/10 dark:border-white/10">
                <BrandLogo
                  markSize={34}
                  showText={true}
                  showSubtitle={true}
                  subtitleText="Visa Consultancy"
                />
                <button
                  id="mobile-nav-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#2d2d2d]/70 dark:text-slate-300 hover:text-[#2d2d2d] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1.5 mt-6">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      id={`mobile-nav-${link.id}`}
                      onClick={() => handleNavClick(link.id)}
                      className={`text-left px-4 py-3 text-sm uppercase tracking-wider font-medium rounded-sm transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#b8860b]/10 dark:bg-[#d4af37]/15 text-[#b8860b] dark:text-[#d4af37] font-semibold'
                          : 'text-[#2d2d2d]/80 dark:text-slate-300 hover:bg-[#2d2d2d]/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-[#2d2d2d]/10 dark:border-white/10">
              {/* Mobile Theme Toggle Row */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-sm bg-[#fffdd0] dark:bg-[#101a2b] border border-[#2d2d2d]/10 dark:border-white/10 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2d2d2d] dark:text-slate-200">
                  Theme Appearance
                </span>
                <ThemeToggle showLabel={true} />
              </div>

              <button
                id="mobile-drawer-start-journey"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssessment();
                }}
                className="w-full bg-[#b8860b] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#996f09] transition-colors shadow-md text-center cursor-pointer"
              >
                Start Your Visa Journey
              </button>
              <button
                id="mobile-drawer-talk-expert"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full border border-[#2d2d2d]/30 dark:border-white/20 text-[#2d2d2d] dark:text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#2d2d2d]/5 dark:hover:bg-white/10 transition-colors text-center cursor-pointer"
              >
                Talk to an Expert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
