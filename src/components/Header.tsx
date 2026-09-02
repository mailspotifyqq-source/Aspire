import { useState, useEffect } from 'react';
import { Menu, X, PhoneCall } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

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
            ? 'bg-[#f5f5dc]/95 backdrop-blur-md shadow-sm border-b border-[#2d2d2d]/10 h-20'
            : 'bg-[#fffdd0]/80 backdrop-blur-sm border-b border-[#2d2d2d]/5 h-24'
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
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-[#2d2d2d]/80">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`transition-colors py-1 relative hover:text-[#2d2d2d] ${
                    isActive ? 'text-[#b8860b] font-semibold' : 'hover:text-[#b8860b]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b8860b] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-start-journey-btn"
              onClick={onOpenAssessment}
              className="text-xs uppercase tracking-widest px-4 py-2.5 text-[#b8860b] hover:text-[#8a6508] font-semibold transition-colors"
            >
              Assess Eligibility
            </button>
            <button
              id="header-talk-expert-btn"
              onClick={onOpenConsultation}
              className="border border-[#2d2d2d]/30 text-[#2d2d2d] hover:bg-[#2d2d2d]/5 active:scale-95 transition-all text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-none flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#b8860b]" />
              Talk to an Expert
            </button>
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2d2d2d] hover:text-[#b8860b] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div
            id="mobile-nav-drawer"
            className="w-80 max-w-[85vw] bg-[#f5f5dc] h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#2d2d2d]/10 animate-in slide-in-from-right duration-300"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#2d2d2d]/10">
                <BrandLogo
                  markSize={34}
                  showText={true}
                  showSubtitle={true}
                  subtitleText="Visa Consultancy"
                />
                <button
                  id="mobile-nav-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#2d2d2d]/70 hover:text-[#2d2d2d]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      id={`mobile-nav-${link.id}`}
                      onClick={() => handleNavClick(link.id)}
                      className={`text-left px-4 py-3 text-sm uppercase tracking-wider font-medium rounded-sm transition-colors ${
                        isActive
                          ? 'bg-[#b8860b]/10 text-[#b8860b] font-semibold'
                          : 'text-[#2d2d2d]/80 hover:bg-[#2d2d2d]/5'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-[#2d2d2d]/10">
              <button
                id="mobile-drawer-start-journey"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssessment();
                }}
                className="w-full bg-[#b8860b] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#996f09] transition-colors shadow-md text-center"
              >
                Start Your Visa Journey
              </button>
              <button
                id="mobile-drawer-talk-expert"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full border border-[#2d2d2d]/30 text-[#2d2d2d] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#2d2d2d]/5 transition-colors text-center"
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
