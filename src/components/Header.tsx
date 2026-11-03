/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Heart, Scale, FileWarning, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
  onPageChange?: (page: string, subSection?: string) => void;
  onDonateClick: () => void;
  submissionsCount?: number;
}

export default function Header({ onDonateClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Inicio', path: '/', id: 'home' },
    { label: 'Nosotros', path: '/nosotros', id: 'about' },
    { label: 'Servicios', path: '/servicios', id: 'services' },
    { label: 'Proyectos', path: '/proyectos', id: 'projects' },
  ];

  const programSubsections = [
    { label: 'Prácticas y Pasantías', path: '/programas/practicas-pasantias', id: 'internships', icon: GraduationCap, color: 'text-blue-600' },
    { label: 'Informes y Denuncias de DDHH', path: '/programas/informes-denuncias-ddhh', id: 'reports', icon: FileWarning, color: 'text-amber-600' },
    { label: 'Asesoría Jurídica Comunitaria', path: '/programas/asesoria-juridica-comunitaria', id: 'legal', icon: Scale, color: 'text-emerald-600' },
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/inicio';
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isProgramsActive = location.pathname.startsWith('/programas') ||
    location.pathname === '/practicas-pasantias' ||
    location.pathname === '/informes-denuncias-ddhh' ||
    location.pathname === '/asesoria-juridica-comunitaria';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-sky-100" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Brand */}
          <Link 
            to="/"
            id="brand-logo-container"
            className="cursor-pointer select-none group flex items-center"
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1nD4GYM2rbdNHtX0xdR3yI0XlC7MQfzps"
              alt="FUNDELIBERTAD Logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
              id="header-logo-image"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5" id="desktop-nav">
            {menuItems.map((item) => (
              <Link
                id={`nav-${item.id}-btn`}
                key={item.id}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isCurrentPath(item.path)
                    ? 'bg-sky-50 text-brand-primary font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Programs Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              id="programs-dropdown-trigger"
            >
              <button
                id="nav-programs-btn"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isProgramsActive
                    ? 'bg-sky-50 text-brand-primary font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Programas
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-1 w-72 rounded-xl bg-white shadow-xl border border-sky-100 p-2 text-slate-800"
                    id="programs-dropdown-menu"
                  >
                    {programSubsections.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          id={`nav-sub-${sub.id}-btn`}
                          key={sub.id}
                          to={sub.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-sky-50/50 text-left transition-colors cursor-pointer group"
                        >
                          <div className={`p-1.5 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-xs transition-colors shrink-0 ${sub.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-normal">{sub.label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Formularios de postulación y registro</p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              id="nav-activities-btn"
              to="/actividades"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isCurrentPath('/actividades')
                  ? 'bg-sky-50 text-brand-primary font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Actividades
            </Link>

            <Link
              id="nav-contact-btn"
              to="/contacto"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isCurrentPath('/contacto')
                  ? 'bg-sky-50 text-brand-primary font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Contacto
            </Link>

          </nav>

          {/* Action buttons (Donation) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              id="header-donate-btn"
              onClick={onDonateClick}
              className="px-5 py-2.5 bg-brand-red text-white text-sm font-bold rounded-xl shadow-md hover:bg-red-700 hover:shadow-red-200 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              Donar Ahora
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              id="hamburger-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-sky-100 overflow-hidden"
            id="mobile-nav-drawer"
          >
            <div className="px-4 pt-2 pb-6 space-y-1.5 text-slate-800">
              {menuItems.map((item) => (
                <Link
                  id={`mobile-nav-${item.id}-btn`}
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isCurrentPath(item.path)
                      ? 'bg-sky-50 text-brand-primary font-bold'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Programs list for mobile */}
              <div className="border-t border-slate-100 pt-2 mt-2">
                <span className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Programas e Incidentes
                </span>
                {programSubsections.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <Link
                      id={`mobile-sub-nav-${sub.id}-btn`}
                      key={sub.id}
                      to={sub.path}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-left text-sm"
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${sub.color}`} />
                      <span className="font-medium text-slate-700">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                <Link
                  id="mobile-nav-activities-btn"
                  to="/actividades"
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isCurrentPath('/actividades') ? 'bg-sky-50 text-brand-primary font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Actividades
                </Link>
                <Link
                  id="mobile-nav-contact-btn"
                  to="/contacto"
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isCurrentPath('/contacto') ? 'bg-sky-50 text-brand-primary font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  Contacto
                </Link>
              </div>

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  id="mobile-header-donate-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onDonateClick();
                  }}
                  className="w-full py-3 bg-brand-red text-white text-center font-bold rounded-xl shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white text-white" />
                  Donar Ahora
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
