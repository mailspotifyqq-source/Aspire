/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StatsStrip } from './components/StatsStrip';
import { DestinationsSection } from './components/DestinationsSection';
import { VisaServicesSection } from './components/VisaServicesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AirplaneFlyby } from './components/AirplaneFlyby';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { DestinationSelectorModal } from './components/DestinationSelectorModal';
import { UsaVisaPortal } from './components/UsaVisaPortal';
import { CanadaVisaPortal } from './components/CanadaVisaPortal';
import { SchengenVisaPortal } from './components/SchengenVisaPortal';
import { VisaAssessmentModal } from './components/VisaAssessmentModal';
import { ExpertConsultationModal } from './components/ExpertConsultationModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { VisaUpdatesModal } from './components/VisaUpdatesModal';
import { VisaService, Destination } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('usa');

  // Modals state
  const [destinationSelectorOpen, setDestinationSelectorOpen] = useState(false);
  const [visaUpdatesModalOpen, setVisaUpdatesModalOpen] = useState(false);
  const [usaPortalOpen, setUsaPortalOpen] = useState(false);
  const [usaPortalInitialService, setUsaPortalInitialService] = useState<string | undefined>();

  const [canadaPortalOpen, setCanadaPortalOpen] = useState(false);
  const [schengenPortalOpen, setSchengenPortalOpen] = useState(false);

  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const [assessmentPrefillDestination, setAssessmentPrefillDestination] = useState<string | undefined>();
  const [assessmentPrefillCategory, setAssessmentPrefillCategory] = useState<string | undefined>();

  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<VisaService | null>(null);
  const [selectedDestinationForDetail, setSelectedDestinationForDetail] = useState<Destination | null>(null);

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'destinations', 'services', 'why-us', 'success', 'faq'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Main entry point for "Start Your Visa Journey" and assessment triggers
  const handleStartAssessment = (destinationId?: string, category?: string) => {
    if (destinationId === 'usa') {
      setUsaPortalInitialService(category);
      setUsaPortalOpen(true);
    } else if (destinationId === 'canada') {
      setCanadaPortalOpen(true);
    } else if (destinationId === 'europe' || destinationId === 'schengen' || destinationId === 'switzerland') {
      setSchengenPortalOpen(true);
    } else if (destinationId) {
      setAssessmentPrefillDestination(destinationId);
      setAssessmentPrefillCategory(category || 'Tourist & Business Visa');
      setAssessmentModalOpen(true);
    } else {
      // Step 1: Open Destination Selector first
      setDestinationSelectorOpen(true);
    }
  };

  const handleDestinationSelected = (destId: string) => {
    setDestinationSelectorOpen(false);
    if (destId === 'usa') {
      setUsaPortalInitialService(undefined);
      setUsaPortalOpen(true);
    } else if (destId === 'canada') {
      setCanadaPortalOpen(true);
    } else if (destId === 'europe' || destId === 'schengen' || destId === 'switzerland') {
      setSchengenPortalOpen(true);
    } else {
      setAssessmentPrefillDestination(destId);
      setAssessmentPrefillCategory('Tourist & Business Visa');
      setAssessmentModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdd0] text-[#2d2d2d] selection:bg-[#b8860b]/20 selection:text-[#2d2d2d] relative font-sans">
      {/* Luxury Header Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationModalOpen(true)}
        onOpenAssessment={() => handleStartAssessment()}
      />

      {/* Main Content Sections */}
      <main className="w-full overflow-hidden">
        {/* Hero Section with Interactive 3D Earth Globe */}
        <HeroSection
          selectedDestinationId={selectedDestinationId}
          onSelectDestination={(id) => setSelectedDestinationId(id)}
          onStartJourney={() => handleStartAssessment()}
          onTalkToExpert={() => setConsultationModalOpen(true)}
          onOpenAssessment={(destId) => handleStartAssessment(destId)}
          onOpenDetailsModal={(dest) => setSelectedDestinationForDetail(dest)}
          onOpenVisaUpdates={() => setVisaUpdatesModalOpen(true)}
        />

        {/* Global Statistics Ribbon */}
        <StatsStrip />

        {/* Global Destinations Collage & Country Dossiers */}
        <DestinationsSection
          onSelectDestination={(id) => setSelectedDestinationId(id)}
          onOpenAssessment={(destId) => handleStartAssessment(destId)}
          onOpenDetailsModal={(dest) => setSelectedDestinationForDetail(dest)}
        />

        {/* Visa Services with Document Checklists */}
        <VisaServicesSection
          onSelectService={(srv) => setSelectedServiceForDetail(srv)}
          onOpenAssessment={(cat) => handleStartAssessment('usa', cat)}
        />

        {/* Why Us / Legal Accreditation & Pre-Screen Guarantee */}
        <WhyUsSection />

        {/* Verified Client Success Stories */}
        <SuccessStoriesSection />

        {/* Interactive FAQ Accordion */}
        <FAQSection />
      </main>

      {/* Comprehensive Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={() => setConsultationModalOpen(true)}
        onOpenAssessment={(cat) => handleStartAssessment(undefined, cat)}
      />

      {/* Animated Airplane Flyby Transition */}
      <AirplaneFlyby />

      {/* WhatsApp Chat Floating Desk */}
      <WhatsAppWidget />

      {/* Step 1: Destination Selector Modal */}
      <DestinationSelectorModal
        isOpen={destinationSelectorOpen}
        onClose={() => setDestinationSelectorOpen(false)}
        onSelectDestination={handleDestinationSelected}
      />

      {/* Dedicated Full-Screen USA Visa Portal */}
      <UsaVisaPortal
        isOpen={usaPortalOpen}
        onClose={() => setUsaPortalOpen(false)}
        onBookExpert={() => {
          setUsaPortalOpen(false);
          setConsultationModalOpen(true);
        }}
        initialService={usaPortalInitialService}
      />

      {/* Dedicated Full-Screen Canada Visa Portal */}
      <CanadaVisaPortal
        isOpen={canadaPortalOpen}
        onClose={() => setCanadaPortalOpen(false)}
        onOpenConsultation={() => {
          setCanadaPortalOpen(false);
          setConsultationModalOpen(true);
        }}
      />

      {/* Dedicated Full-Screen Europe Schengen Visa Portal */}
      <SchengenVisaPortal
        isOpen={schengenPortalOpen}
        onClose={() => setSchengenPortalOpen(false)}
        onOpenConsultation={() => {
          setSchengenPortalOpen(false);
          setConsultationModalOpen(true);
        }}
      />

      {/* Other Destinations 4-Step Interactive Visa Assessment Journey */}
      <VisaAssessmentModal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        initialDestinationId={assessmentPrefillDestination}
        initialCategory={assessmentPrefillCategory}
        onBookExpert={() => {
          setAssessmentModalOpen(false);
          setConsultationModalOpen(true);
        }}
      />

      {/* 1-on-1 Attorney Consultation Booking Modal */}
      <ExpertConsultationModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
      />

      {/* Deep-Dive Visa Service Detail & Checklist Modal */}
      <ServiceDetailModal
        service={selectedServiceForDetail}
        onClose={() => setSelectedServiceForDetail(null)}
        onApply={(category) => {
          setSelectedServiceForDetail(null);
          handleStartAssessment('usa', category);
        }}
      />

      {/* Deep-Dive Country Consular Dossier Modal */}
      <DestinationDetailModal
        destination={selectedDestinationForDetail}
        onClose={() => setSelectedDestinationForDetail(null)}
        onApply={(destId) => {
          setSelectedDestinationForDetail(null);
          handleStartAssessment(destId);
        }}
      />

      {/* Latest Visa & Immigration Updates Modal */}
      <VisaUpdatesModal
        isOpen={visaUpdatesModalOpen}
        onClose={() => setVisaUpdatesModalOpen(false)}
        onOpenConsultation={() => {
          setVisaUpdatesModalOpen(false);
          setConsultationModalOpen(true);
        }}
      />
    </div>
  );
}
