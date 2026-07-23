/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Search, ClipboardList, GraduationCap, Heart, Scale, 
  CheckCircle, Clock, AlertTriangle, ChevronRight, User, RefreshCw, Eye 
} from 'lucide-react';
import { Donation, InternshipApplication, HumanRightsReport, LegalConsultation, ContactMessage } from '../types';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'consultations' | 'reports' | 'internships' | 'donations' | 'contacts'>('consultations');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // States
  const [donations, setDonations] = useState<Donation[]>([]);
  const [internships, setInternships] = useState<InternshipApplication[]>([]);
  const [reports, setReports] = useState<HumanRightsReport[]>([]);
  const [consultations, setConsultations] = useState<LegalConsultation[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Load from local storage
  const loadData = () => {
    const localDonations = localStorage.getItem('fundelibertad_donations');
    const localInternships = localStorage.getItem('fundelibertad_internships');
    const localReports = localStorage.getItem('fundelibertad_reports');
    const localConsultations = localStorage.getItem('fundelibertad_consultations');
    const localContacts = localStorage.getItem('fundelibertad_contacts');

    setDonations(localDonations ? JSON.parse(localDonations) : []);
    setInternships(localInternships ? JSON.parse(localInternships) : []);
    setReports(localReports ? JSON.parse(localReports) : []);
    setConsultations(localConsultations ? JSON.parse(localConsultations) : []);
    setContacts(localContacts ? JSON.parse(localContacts) : []);
  };

  useEffect(() => {
    loadData();
    
    // Listen for custom storage events from other components
    const handleStorageUpdate = () => {
      loadData();
    };

    window.addEventListener('storage_update', handleStorageUpdate);
    return () => window.removeEventListener('storage_update', handleStorageUpdate);
  }, [refreshTrigger]);

  const handleStatusChange = (type: string, id: string, newStatus: string) => {
    let key = '';
    let updatedList: any[] = [];

    if (type === 'consultations') {
      key = 'fundelibertad_consultations';
      updatedList = consultations.map(item => item.id === id ? { ...item, status: newStatus } : item);
    } else if (type === 'reports') {
      key = 'fundelibertad_reports';
      updatedList = reports.map(item => item.id === id ? { ...item, status: newStatus } : item);
    } else if (type === 'internships') {
      key = 'fundelibertad_internships';
      updatedList = internships.map(item => item.id === id ? { ...item, status: newStatus } : item);
    }

    if (key) {
      localStorage.setItem(key, JSON.stringify(updatedList));
      loadData();
      window.dispatchEvent(new Event('storage_update'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'resolved':
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            Resuelto
          </span>
        );
      case 'investigating':
      case 'scheduled':
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            En Proceso
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
    }
  };

  // Filters
  const filteredDonations = donations.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInternships = internships.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.career.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reports.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConsultations = consultations.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(co => 
    co.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    co.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    co.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDonationsAmount = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8" id="citizen-portal-container">
      {/* Banner info */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 opacity-10 translate-x-10 translate-y-[-10px] select-none pointer-events-none">
          <Scale className="w-80 h-80" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green text-white text-xs font-semibold tracking-wider uppercase">
            <span>🟢 Portal de Transparencia Ciudadana</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight max-w-2xl">
            Seguimiento de Radicados y Solicitudes
          </h1>
          <p className="text-sm text-sky-200/90 max-w-2xl leading-relaxed">
            Bienvenido al panel integrado de FUNDELIBERTAD. Aquí los ciudadanos y voluntarios pueden verificar en tiempo real el estado de las asesorías solicitadas, denuncias confidenciales radicadas, postulaciones a prácticas y donaciones.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="refresh-portal-btn"
              onClick={() => {
                setRefreshTrigger(p => p + 1);
                loadData();
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sincronizar Datos
            </button>
            <span className="text-xs text-sky-300 font-mono">
              Registros cargados localmente en este navegador.
            </span>
          </div>
        </div>
      </div>

      {/* Grid of basic summary counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Donado</span>
            <Heart className="w-4 h-4 text-brand-red fill-brand-red" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">${totalDonationsAmount} USD</p>
          <p className="text-[10px] text-slate-500">{donations.length} transacciones</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Asesorías</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">{consultations.length}</p>
          <p className="text-[10px] text-slate-500">Casos radicados</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Denuncias</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">{reports.length}</p>
          <p className="text-[10px] text-slate-500">Reportes de DDHH</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Pasantías</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">{internships.length}</p>
          <p className="text-[10px] text-slate-500">Postulados activos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs col-span-2 lg:col-span-1 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase">Mensajes</span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">{contacts.length}</p>
          <p className="text-[10px] text-slate-500">Contactos recibidos</p>
        </div>
      </div>

      {/* Interactive Tabs and Filter layout */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50 p-2 gap-1" id="portal-tabs-list">
          <button
            id="tab-consultations-btn"
            onClick={() => { setActiveTab('consultations'); setSearchTerm(''); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'consultations' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            Asesorías de Ley ({consultations.length})
          </button>
          
          <button
            id="tab-reports-btn"
            onClick={() => { setActiveTab('reports'); setSearchTerm(''); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reports' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Denuncias DDHH ({reports.length})
          </button>

          <button
            id="tab-internships-btn"
            onClick={() => { setActiveTab('internships'); setSearchTerm(''); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'internships' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Pasantías ({internships.length})
          </button>

          <button
            id="tab-donations-btn"
            onClick={() => { setActiveTab('donations'); setSearchTerm(''); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'donations' ? 'bg-white text-red-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red" />
            Aportes ({donations.length})
          </button>

          <button
            id="tab-contacts-btn"
            onClick={() => { setActiveTab('contacts'); setSearchTerm(''); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contacts' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Mensajes ({contacts.length})
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="portal-search-input"
              type="text"
              placeholder="Buscar por código de radicado, correo o palabras clave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all placeholder-slate-400"
            />
          </div>
        </div>

        {/* Content list representation */}
        <div className="p-6 bg-white min-h-[300px]" id="portal-items-list">
          {/* TAB: Consultations */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {filteredConsultations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Scale className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No hay solicitudes de asesoría registradas</p>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed">Puedes radicar una consulta en la sección de Programas → Asesorías Legales.</p>
                </div>
              ) : (
                filteredConsultations.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-100 hover:border-sky-100 bg-slate-50/40 hover:bg-white transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded-md">{item.id}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.clientName}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        {/* Simulation action */}
                        {item.status !== 'resolved' && (
                          <button
                            id={`solve-consultation-${item.id}`}
                            onClick={() => handleStatusChange('consultations', item.id, 'resolved')}
                            className="text-[10px] bg-slate-950 hover:bg-slate-800 text-white font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Simular Respuesta
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><span className="font-semibold text-slate-600">Área:</span> {item.category}</div>
                      <div><span className="font-semibold text-slate-600">Contacto:</span> {item.email} | {item.phone}</div>
                      <div className="md:col-span-2 mt-1 bg-white p-3 rounded-xl border border-slate-100 text-slate-700">
                        <span className="font-semibold text-slate-500 block mb-1">Descripción de la consulta:</span>
                        {item.description}
                      </div>
                      <div className="text-[10px] text-slate-400">Radicado el: {item.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Reports */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <AlertTriangle className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No hay denuncias de DDHH registradas</p>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed">Puedes radicar una denuncia confidencial en la sección de Programas → Informes y Denuncias.</p>
                </div>
              ) : (
                filteredReports.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-100 hover:border-amber-100 bg-slate-50/40 hover:bg-white transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-md">{item.id}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.subject}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        {item.status !== 'processed' && (
                          <button
                            id={`solve-report-${item.id}`}
                            onClick={() => handleStatusChange('reports', item.id, 'processed')}
                            className="text-[10px] bg-slate-950 hover:bg-slate-800 text-white font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Marcar Investigado
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><span className="font-semibold text-slate-600">Lugar de hechos:</span> {item.location}</div>
                      <div>
                        <span className="font-semibold text-slate-600">Denunciante:</span>{' '}
                        {item.isConfidential ? (
                          <span className="bg-red-50 text-brand-red px-1.5 py-0.5 rounded font-bold text-[10px]">Anónimo / Confidencial</span>
                        ) : (
                          `${item.reporterName} (${item.email} / ${item.phone})`
                        )}
                      </div>
                      <div className="md:col-span-2 mt-1 bg-white p-3 rounded-xl border border-slate-100 text-slate-700">
                        <span className="font-semibold text-slate-500 block mb-1">Detalles del Suceso:</span>
                        {item.description}
                      </div>
                      <div className="text-[10px] text-slate-400">Radicado el: {item.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Internships */}
          {activeTab === 'internships' && (
            <div className="space-y-4">
              {filteredInternships.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <GraduationCap className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No hay postulaciones registradas</p>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed">Puedes aplicar a prácticas profesionales en la sección de Programas → Prácticas y Pasantías.</p>
                </div>
              ) : (
                filteredInternships.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-100 hover:border-blue-100 bg-slate-50/40 hover:bg-white transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-md">{item.id}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        {item.status !== 'approved' && (
                          <button
                            id={`approve-intern-${item.id}`}
                            onClick={() => handleStatusChange('internships', item.id, 'approved')}
                            className="text-[10px] bg-slate-950 hover:bg-slate-800 text-white font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Aprobar Pasantía
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><span className="font-semibold text-slate-600">Carrera / Semestre:</span> {item.career} - Semestre {item.semester}</div>
                      <div><span className="font-semibold text-slate-600">Universidad:</span> {item.university}</div>
                      <div><span className="font-semibold text-slate-600">Contacto:</span> {item.email} | {item.phone}</div>
                      <div className="md:col-span-2 mt-1 bg-white p-3 rounded-xl border border-slate-100 text-slate-700">
                        <span className="font-semibold text-slate-500 block mb-1">Carta de Motivación:</span>
                        {item.motivation}
                      </div>
                      <div className="text-[10px] text-slate-400">Postulación radicada el: {item.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Donations */}
          {activeTab === 'donations' && (
            <div className="space-y-4">
              {filteredDonations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Heart className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No hay aportes económicos registrados</p>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed">Puedes realizar un aporte mediante el botón de Donar en el menú de navegación.</p>
                </div>
              ) : (
                filteredDonations.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-800 bg-red-50 px-2 py-1 rounded-md">{item.id}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-50 text-brand-green px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Completado
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><span className="font-semibold text-slate-600">Monto del Aporte:</span> ${item.amount} USD</div>
                      <div><span className="font-semibold text-slate-600">Frecuencia:</span> {item.type === 'one-time' ? 'Donación Única' : 'Donación Recurrente'}</div>
                      <div><span className="font-semibold text-slate-600">Método:</span> {item.paymentMethod === 'paypal' ? 'PayPal' : 'Tarjeta de Crédito'}</div>
                      <div><span className="font-semibold text-slate-600">Correo registrado:</span> {item.email}</div>
                      <div className="md:col-span-2 text-right">
                        <button
                          id={`print-invoice-${item.id}`}
                          onClick={() => window.print()}
                          className="px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all"
                        >
                          Imprimir Recibo de Donación
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400">Procesado el: {item.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No hay mensajes de contacto registrados</p>
                  <p className="text-xs max-w-sm mx-auto leading-relaxed">Puedes enviar un mensaje institucional en la sección de Contacto.</p>
                </div>
              ) : (
                filteredContacts.map((item, index) => (
                  <div key={index} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white transition-all space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                    </div>
                    
                    <div className="text-xs text-slate-500 space-y-1.5">
                      <div><span className="font-semibold text-slate-600">Asunto:</span> {item.subject}</div>
                      <div><span className="font-semibold text-slate-600">Correo:</span> {item.email}</div>
                      <div className="mt-1 bg-white p-3 rounded-xl border border-slate-100 text-slate-700">
                        {item.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
