/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import DonationModal from './components/DonationModal';
import AdminPanel from './components/AdminPanel';

// Sections
import HomeSection from './components/sections/HomeSection';
import AboutSection from './components/sections/AboutSection';
import ServicesSection from './components/sections/ServicesSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ProgramSections from './components/sections/ProgramSections';
import ActivitiesSection from './components/sections/ActivitiesSection';
import ContactSection from './components/sections/ContactSection';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentSubSection, setCurrentSubSection] = useState<string>('internships');
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);

  // Auto-calculate user submissions in real-time
  const calculateSubmissions = () => {
    const localDonations = localStorage.getItem('fundelibertad_donations');
    const localInternships = localStorage.getItem('fundelibertad_internships');
    const localReports = localStorage.getItem('fundelibertad_reports');
    const localConsultations = localStorage.getItem('fundelibertad_consultations');
    const localContacts = localStorage.getItem('fundelibertad_contacts');

    const d = localDonations ? JSON.parse(localDonations).length : 0;
    const i = localInternships ? JSON.parse(localInternships).length : 0;
    const r = localReports ? JSON.parse(localReports).length : 0;
    const c = localConsultations ? JSON.parse(localConsultations).length : 0;
    const co = localContacts ? JSON.parse(localContacts).length : 0;

    setSubmissionsCount(d + i + r + c + co);
  };

  useEffect(() => {
    calculateSubmissions();

    // Listen for storage updates
    const handleStorageChange = () => {
      calculateSubmissions();
    };

    window.addEventListener('storage_update', handleStorageChange);
    return () => {
      window.removeEventListener('storage_update', handleStorageChange);
    };
  }, []);

  const handlePageChange = (page: string, subSection?: string) => {
    setCurrentPage(page);
    if (subSection) {
      setCurrentSubSection(subSection);
    }
    // Scroll to top smoothly on page transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current selected section
  const renderSection = () => {
    switch (currentPage) {
      case 'home':
        return <HomeSection onPageChange={handlePageChange} onDonateClick={() => setIsDonationOpen(true)} />;
      case 'about':
        return <AboutSection />;
      case 'services':
        return <ServicesSection onPageChange={handlePageChange} />;
      case 'projects':
        return <ProjectsSection />;
      case 'programs':
        return <ProgramSections initialSubsection={currentSubSection} />;
      case 'activities':
        return <ActivitiesSection />;
      case 'contact':
        return <ContactSection />;
      case 'dashboard':
        return <AdminPanel />;
      default:
        return <HomeSection onPageChange={handlePageChange} onDonateClick={() => setIsDonationOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-lightbg flex flex-col justify-between" id="app-container">
      {/* 1. STICKY NAVIGATION HEADER */}
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onDonateClick={() => setIsDonationOpen(true)}
        submissionsCount={submissionsCount}
      />

      {/* 2. MAIN TRANSITIONAL CONTENT BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (currentPage === 'programs' ? currentSubSection : '')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            id="page-motion-wrapper"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. CORPORATE FOOTER */}
      <Footer
        onPageChange={handlePageChange}
        onDonateClick={() => setIsDonationOpen(true)}
      />

      {/* 4. FLOATING COMM CHANNELS */}
      <FloatingWhatsApp />

      {/* 5. INTERACTIVE PAYMENT GATEWAY MODAL */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </div>
  );
}
