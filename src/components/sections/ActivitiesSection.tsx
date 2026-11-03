/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, PlayCircle, Eye, Image as ImageIcon, X, FolderKanban, Users, BookOpen, AlertTriangle } from 'lucide-react';
import { LATEST_ACTIVITIES } from '../../data';
import { Activity } from '../../types';
import familyHumanizationImg from '../../assets/images/family_humanization_project_1782495984213.jpg';
import AdaptiveImage from '../AdaptiveImage';

export default function ActivitiesSection() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = LATEST_ACTIVITIES;

  // Simulated Photo Gallery Assets for general overview
  const generalGallery = [
    { src: 'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?auto=format&fit=crop&q=80&w=400', title: 'Prevención Comuna 15' },
    { src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400', title: 'Mesa de Mediación' },
    { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400', title: 'Cátedra de Derechos' },
    { src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400', title: 'Huerta Familiar' },
    { src: familyHumanizationImg, title: 'Terapia Familiar' },
    { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400', title: 'Jornada de Tutelas' }
  ];

  // Simulated Videos representing the YouTube Channel
  const youtubeVideos = [
    { 
      id: 'v1', 
      title: 'Informe de Gestión de Derechos Humanos en Medellín 2025', 
      duration: '14:20', 
      views: '1.2K vistas',
      thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      id: 'v2', 
      title: 'Testimonio de víctimas y reconciliación en Guayabal', 
      duration: '08:45', 
      views: '840 vistas',
      thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400' 
    },
    { 
      id: 'v3', 
      title: 'Taller de Mediación Comunitaria y Prácticas Escolares', 
      duration: '11:15', 
      views: '620 vistas',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400' 
    }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans text-left animate-fade-in" id="activities-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-4">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Novedades</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
          Memoria Institucional y Actividades Recientes
        </h1>
        <div className="w-16 h-1 bg-brand-green rounded-full" />
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Sigue el pulso diario de nuestra fundación. Conoce los detalles de los foros, asambleas, conversatorios y congresos presentados ante comisiones internacionales y las campañas activas para proteger la vida en Guayabal.
        </p>
      </div>

      {/* Grid of articles */}
      <div className="space-y-6">
        {/* Dynamic activities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="activities-list-grid">
          {filteredActivities.map((act) => (
            <div
              id={`activity-full-${act.id}`}
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 group"
            >
              <div>
                <AdaptiveImage
                  src={act.image}
                  alt={act.title}
                  containerClassName="h-52 bg-white border-b border-slate-100 overflow-hidden relative flex items-center justify-center"
                >
                  <span className="absolute top-3 left-3 bg-white/95 text-slate-800 border border-slate-200/80 shadow-xs px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider z-20">
                    {act.category}
                  </span>
                </AdaptiveImage>
                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-sm text-slate-900 leading-snug group-hover:text-sky-800 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {act.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="activity-backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-100 flex flex-col max-h-[85vh]"
              id="activity-modal-content"
            >
              {/* Cover Image */}
              <AdaptiveImage
                src={selectedActivity.image}
                alt={selectedActivity.title}
                containerClassName="h-64 sm:h-72 relative bg-white border-b border-slate-100 shrink-0 flex items-center justify-center overflow-hidden"
              >
                <button
                  id="close-activity-btn"
                  onClick={() => setSelectedActivity(null)}
                  className="absolute right-4 top-4 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full transition-all z-20 cursor-pointer shadow-md border border-slate-200/80"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="text-[10px] bg-sky-600 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {selectedActivity.category}
                  </span>
                </div>
              </AdaptiveImage>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-display font-black text-lg md:text-xl text-slate-900 leading-snug">
                    {selectedActivity.title}
                  </h3>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-4 pt-4 border-t border-slate-100">
                  <p>{selectedActivity.content || selectedActivity.description}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-right shrink-0">
                <button
                  id="activity-modal-close-btn"
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cerrar Artículo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
