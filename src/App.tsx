/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export default function App() {
  const [isDonationOpen, setIsDonationOpen] = useState<boolean>(false);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();

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
    if (page === 'home') navigate('/');
    else if (page === 'about') navigate('/nosotros');
    else if (page === 'services') navigate('/servicios');
    else if (page === 'projects') navigate('/proyectos');
    else if (page === 'activities') navigate('/actividades');
    else if (page === 'contact') navigate('/contacto');
    else if (page === 'dashboard') navigate('/panel-control');
    else if (page === 'programs') {
      if (subSection === 'reports') navigate('/programas/informes-denuncias-ddhh');
      else if (subSection === 'legal') navigate('/programas/asesoria-juridica-comunitaria');
      else navigate('/programas/practicas-pasantias');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-lightbg flex flex-col justify-between" id="app-container">
      <ScrollToTop />

      {/* 1. STICKY NAVIGATION HEADER */}
      <Header
        onPageChange={handlePageChange}
        onDonateClick={() => setIsDonationOpen(true)}
        submissionsCount={submissionsCount}
      />

      {/* 2. MAIN TRANSITIONAL CONTENT BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            id="page-motion-wrapper"
          >
            <Routes location={location}>
              <Route path="/" element={<HomeSection onPageChange={handlePageChange} onDonateClick={() => setIsDonationOpen(true)} />} />
              <Route path="/inicio" element={<Navigate to="/" replace />} />
              <Route path="/nosotros" element={<AboutSection />} />
              <Route path="/servicios" element={<ServicesSection onPageChange={handlePageChange} />} />
              <Route path="/proyectos" element={<ProjectsSection />} />
              <Route path="/programas" element={<ProgramSections />} />
              <Route path="/programas/:subsection" element={<ProgramSections />} />
              <Route path="/practicas-pasantias" element={<ProgramSections initialSubsection="internships" />} />
              <Route path="/informes-denuncias-ddhh" element={<ProgramSections initialSubsection="reports" />} />
              <Route path="/asesoria-juridica-comunitaria" element={<ProgramSections initialSubsection="legal" />} />
              <Route path="/actividades" element={<ActivitiesSection />} />
              <Route path="/contacto" element={<ContactSection />} />
              <Route path="/panel-control" element={<AdminPanel />} />
              <Route path="/admin" element={<Navigate to="/panel-control" replace />} />
              <Route path="/dashboard" element={<Navigate to="/panel-control" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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
