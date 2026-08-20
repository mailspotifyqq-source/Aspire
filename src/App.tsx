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
import { VisaAssessmentModal } from './components/VisaAssessmentModal';
import { ExpertConsultationModal } from './components/ExpertConsultationModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { VisaService, Destination } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('usa');

  // Modals state
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

  const handleStartAssessment = (destinationId?: string, category?: string) => {
    setAssessmentPrefillDestination(destinationId);
    setAssessmentPrefillCategory(category);
    setAssessmentModalOpen(true);
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
          onOpenAssessment={(cat) => handleStartAssessment(undefined, cat)}
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

      {/* 4-Step Interactive Visa Assessment Journey */}
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
          handleStartAssessment(undefined, category);
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
    </div>
  );
}
