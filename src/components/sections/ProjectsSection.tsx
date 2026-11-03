/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Sparkles, BookOpen, Handshake, Sprout, Eye, Home, UserCheck, Sun } from 'lucide-react';
import { PROJECTS_LIST } from '../../data';
import { Project } from '../../types';
import AdaptiveImage from '../AdaptiveImage';

export default function ProjectsSection() {
  // Map project icon name to Lucide React component
  const getProjectIcon = (name: string) => {
    const props = { className: "w-5 h-5 shrink-0" };
    switch (name) {
      case 'Shield': return <Shield {...props} className={`${props.className} text-sky-600`} />;
      case 'Handshake': return <Handshake {...props} className={`${props.className} text-indigo-600`} />;
      case 'BookOpen': return <BookOpen {...props} className={`${props.className} text-brand-primary`} />;
      case 'Sprout': return <Sprout {...props} className={`${props.className} text-emerald-600`} />;
      case 'Eye': return <Eye {...props} className={`${props.className} text-slate-700`} />;
      case 'Home': return <Home {...props} className={`${props.className} text-purple-600`} />;
      case 'UserCheck': return <UserCheck {...props} className={`${props.className} text-teal-600`} />;
      case 'Sun': return <Sun {...props} className={`${props.className} text-brand-red`} />;
      default: return <Sparkles {...props} className={`${props.className} text-slate-600`} />;
    }
  };

  return (
    <div className="space-y-16 pb-16 font-sans text-left" id="projects-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-4">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nuestra Labor</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
          Proyectos e Iniciativas Comunitarias de Paz
        </h1>
        <div className="w-16 h-1 bg-brand-green rounded-full" />
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          En FUNDELIBERTAD materializamos la defensa de derechos mediante programas directos en el territorio. Conoce nuestras grandes iniciativas orientadas a desmantelar la violencia urbana, promover la educación solidaria, fortalecer la economía comunitaria y proteger la vida de niños y jóvenes vulnerables en la Comuna 15 de Medellín.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="projects-grid">
        {PROJECTS_LIST.map((proj) => {
          return (
            <motion.div
              id={`project-card-${proj.id}`}
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="flex flex-col h-full">
                {/* Photo Header with automatic adaptive sizing */}
                <AdaptiveImage
                  src={proj.image}
                  alt={proj.title}
                  containerClassName="h-56 relative overflow-hidden bg-white border-b border-slate-100 flex items-center justify-center group"
                >
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs border border-slate-200/80">
                      {getProjectIcon(proj.iconName)}
                    </div>
                    <span className="text-slate-800 text-xs font-bold tracking-tight bg-white/95 px-2.5 py-1 rounded-md shadow-xs border border-slate-200/80">
                      Proyecto Activo
                    </span>
                  </div>
                </AdaptiveImage>

                {/* Content Segment */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                      {proj.title}
                    </h3>
                    
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {proj.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
