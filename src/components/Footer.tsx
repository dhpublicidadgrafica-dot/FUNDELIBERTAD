/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight, CheckCircle2, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';

interface FooterProps {
  onPageChange?: (page: string, subSection?: string) => void;
  onDonateClick: () => void;
}

export default function Footer({ onDonateClick }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800" id="main-footer">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About segment */}
        <div className="space-y-4">
          <div className="flex items-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1UP_DO2dLXoxqlMWA22JDSSIId4ctprhD"
              alt="FUNDELIBERTAD Logo"
              className="h-8 sm:h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
              id="footer-logo-image"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fundación de Derechos Humanos por la Libertad y la Vida. Más de 15 años promoviendo la paz, brindando asesoría jurídica gratuita y apoyando el desarrollo de familias y jóvenes vulnerables en la Comuna 15 Guayabal, Medellín.
          </p>
          
          {/* Social media badges */}
          <div className="flex items-center gap-3 pt-2" id="footer-social-links">
            <a
              id="social-instagram-link"
              href="https://www.instagram.com/fundelibertad/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-brand-red text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              id="social-facebook-link"
              href="https://www.facebook.com/people/Fundelibertad/100064768600575/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              id="social-youtube-link"
              href="https://www.youtube.com/channel/UCb08vm88UXtzkje2RsoCp-g/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              id="social-x-link"
              href="https://x.com/fundelibertad"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="X (Twitter)"
            >
              {/* Custom micro SVG for X */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="space-y-4">
          <h5 className="font-display font-bold text-sm text-white uppercase tracking-wider border-l-2 border-brand-green pl-2.5">
            Enlaces Rápidos
          </h5>
          <ul className="space-y-2.5 text-xs text-slate-400" id="footer-links-quick">
            <li>
              <Link to="/" className="hover:text-white hover:underline transition-all cursor-pointer">
                Inicio / Impacto
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:text-white hover:underline transition-all cursor-pointer">
                Nuestra Historia y Valores
              </Link>
            </li>
            <li>
              <Link to="/servicios" className="hover:text-white hover:underline transition-all cursor-pointer">
                Asesorías Gratuitas (19 áreas)
              </Link>
            </li>
            <li>
              <Link to="/proyectos" className="hover:text-white hover:underline transition-all cursor-pointer">
                Proyectos Sociales en Comuna 15
              </Link>
            </li>
            <li>
              <Link to="/actividades" className="hover:text-white hover:underline transition-all cursor-pointer">
                Noticias y Actividades Recientes
              </Link>
            </li>
          </ul>
        </div>

        {/* Programs Quick Links */}
        <div className="space-y-4">
          <h5 className="font-display font-bold text-sm text-white uppercase tracking-wider border-l-2 border-brand-green pl-2.5">
            Canales de Atención
          </h5>
          <ul className="space-y-2.5 text-xs text-slate-400" id="footer-links-programs">
            <li>
              <Link to="/programas/practicas-pasantias" className="hover:text-white hover:underline transition-all cursor-pointer">
                Postulación a Prácticas y Pasantías
              </Link>
            </li>
            <li>
              <Link to="/programas/informes-denuncias-ddhh" className="hover:text-white hover:underline transition-all cursor-pointer">
                Reportar Vulneración de DDHH (Confidencial)
              </Link>
            </li>
            <li>
              <Link to="/programas/asesoria-juridica-comunitaria" className="hover:text-white hover:underline transition-all cursor-pointer">
                Solicitud de Asesoría Legal Gratuita
              </Link>
            </li>
            <li>
              <Link to="/panel-control" className="hover:text-white hover:underline transition-all cursor-pointer font-semibold text-sky-400">
                Portal de Seguimiento Ciudadano
              </Link>
            </li>
          </ul>
        </div>

        {/* Physical Contact info */}
        <div className="space-y-4">
          <h5 className="font-display font-bold text-sm text-white uppercase tracking-wider border-l-2 border-brand-green pl-2.5">
            Contacto Institucional
          </h5>
          <ul className="space-y-3.5 text-xs text-slate-400" id="footer-contact-info">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
              <span>
                Calle 1A #55-39<br />
                Barrio El Rodeo, Comuna 15<br />
                Medellín, Colombia
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href="https://wa.me/573002167822" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                +57 300 216 7822 (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <a href="mailto:info@fundelibertad.org" className="hover:text-white transition-colors">
                info@fundelibertad.org
              </a>
            </li>
            <li className="pt-2">
              <button
                id="footer-donate-btn"
                onClick={onDonateClick}
                className="w-full py-2 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-950/50"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                Donar a la Fundación
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Notificaciones Judiciales Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="judicial-notifications-container">
        <div className="bg-sky-600 text-white rounded-2xl p-6 shadow-md border border-sky-500/30">
          <div className="space-y-2">
            <h6 className="font-sans font-extrabold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Notificaciones Judiciales
            </h6>
            <p className="text-xs text-sky-50 leading-relaxed max-w-5xl">
              <strong>FUNDELIBERTAD</strong>, en cumplimiento de la Ley 1712 de 2014 y en atención a su calidad de entidad sin ánimo de lucro de conformación mixta, dispuso la cuenta de correo electrónico: <a href="mailto:info@fundelibertad.org" className="underline font-bold hover:text-white transition-colors">info@fundelibertad.org</a> para la atención exclusiva de todas las notificaciones judiciales.
            </p>
          </div>
        </div>
      </div>

      {/* Copy and legal footer */}
      <div className="border-t border-slate-800 bg-slate-950/60 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} FUNDELIBERTAD. Todos los derechos reservados.</p>
            <p className="text-[10px] mt-0.5 text-slate-600">Fundación de Derechos Humanos por la Libertad y la Vida • Nit: 900.541.211-5</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px]">Medellín, Colombia</span>
            <span className="text-slate-700">|</span>
            <span className="text-[10px] text-sky-500/80 font-bold">Paz • Vida • Dignidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
