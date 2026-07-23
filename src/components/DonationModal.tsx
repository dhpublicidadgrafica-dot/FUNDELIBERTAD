import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CheckCircle2, 
  Lock, AlertCircle, Send, QrCode, Building2, Smartphone, Copy, Check
} from 'lucide-react';
import { Donation, DonationStats } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES_LIST = [
  'Colombia', 'Estados Unidos', 'España', 'México', 'Argentina', 'Chile',
  'Perú', 'Ecuador', 'Canadá', 'Reino Unido', 'Alemania', 'Francia', 'Suiza', 'Otro país'
];

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  // Stats state
  const [, setStats] = useState<DonationStats>({
    totalRaised: 125000000,
    goal: 0,
    totalDonationsCount: 315,
    averageDonation: 396825,
    recentDonors: [],
    monthlyData: [],
    annualData: []
  });

  // Donor Personal Info
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('Colombia');
  const [city, setCity] = useState<string>('Medellín');
  const [message, setMessage] = useState<string>('');
  const [receiveNews, setReceiveNews] = useState<boolean>(true);
  const [acceptPrivacy, setAcceptPrivacy] = useState<boolean>(true);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);

  // Fetch campaign statistics on load
  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.totalRaised) {
          setStats(data);
        }
      })
      .catch(() => {
        // Fallback silently
      });
  }, [isOpen, completedDonation]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setErrorMessage('Por favor ingrese su nombre completo.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor ingrese un correo electrónico válido.');
      return false;
    }
    if (!acceptPrivacy) {
      setErrorMessage('Debe aceptar la Política de Privacidad para continuar.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  // Donation Registration Submission
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50000,
          currency: 'COP',
          name: fullName,
          email,
          phone,
          country,
          city,
          message,
          receiveNews,
          type: 'one-time',
          paymentMethod: 'bank_transfer',
          status: 'completed'
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'No se pudo registrar la donación.');
      }

      const donationData: Donation = await res.json();

      // Update local storage and trigger update event
      const localDonations = JSON.parse(localStorage.getItem('fundelibertad_donations') || '[]');
      localDonations.unshift(donationData);
      localStorage.setItem('fundelibertad_donations', JSON.stringify(localDonations));
      window.dispatchEvent(new Event('storage_update'));

      setIsSubmitting(false);
      setCompletedDonation(donationData);
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Error al registrar la donación.');
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCountry('Colombia');
    setCity('Medellín');
    setMessage('');
    setErrorMessage(null);
    setCompletedDonation(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="donation-modal-root">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          id="donation-backdrop"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl z-10 border border-slate-200/80 my-auto"
          id="donation-modal-window"
        >
          {/* HEADER BRANDING */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-sky-400/30">
                      Canal Institucional de Donaciones
                    </span>
                    <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Cuenta Oficial
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1">
                    Apoya la Paz y los Derechos Humanos
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Fundación Fundelibertad • Nit: 900.497.212-2
                  </p>
                </div>
              </div>

              <button
                id="close-donation-modal-btn"
                onClick={handleClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN MODAL BODY */}
          <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-7 space-y-6">
            {!completedDonation ? (
              <form onSubmit={handleDonationSubmit} className="space-y-6" id="donation-active-form">
                
                {/* BLOQUE ÚNICO: DATOS DEL DONANTE */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                      Datos del Donante
                    </label>
                    <span className="text-[11px] text-slate-400">Paso 1 de 2: Información de contacto</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        id="donor-fullname-field"
                        type="text"
                        placeholder="Nombre Completo *"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 text-xs sm:text-sm text-slate-900 bg-white font-medium"
                      />
                    </div>
                    <div>
                      <input
                        id="donor-email-field"
                        type="email"
                        placeholder="Correo Electrónico *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 text-xs sm:text-sm text-slate-900 bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        id="donor-phone-field"
                        type="tel"
                        placeholder="Teléfono / WhatsApp"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <select
                        id="donor-country-field"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 text-xs sm:text-sm text-slate-900 bg-white font-medium"
                      >
                        {COUNTRIES_LIST.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        id="donor-city-field"
                        type="text"
                        placeholder="Ciudad"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 text-xs sm:text-sm text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      id="donor-message-field"
                      placeholder="Mensaje de apoyo o dedicatoria (Opcional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 text-xs sm:text-sm text-slate-900 bg-white resize-none"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-1 text-xs text-slate-600 font-sans">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        id="chk-receive-news"
                        type="checkbox"
                        checked={receiveNews}
                        onChange={(e) => setReceiveNews(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                      />
                      <span>Deseo recibir noticias e informes periódicos de la Fundación.</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        id="chk-accept-privacy"
                        type="checkbox"
                        checked={acceptPrivacy}
                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                      />
                      <span>
                        Acepto la <a href="/contacto" target="_blank" className="text-sky-700 underline font-semibold">Política de Privacidad</a> y tratamiento de datos personales.
                      </span>
                    </label>
                  </div>
                </div>

                {/* BLOQUE CÓDIGO QR Y DATOS BANCARIOS */}
                <div className="pt-3 border-t border-slate-100 space-y-4" id="donation-qr-code-section">
                  <div className="text-center space-y-1">
                    <span className="bg-sky-100 text-sky-900 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-sky-700" /> CÓDIGO QR Y TRANSFERENCIA DIRECTA
                    </span>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                      Escanea y Realiza tu Aporte
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Puedes realizar tu donación mediante tu aplicación bancaria (Nequi, Bancolombia, Daviplata o Transfiya) escaneando el código QR institucional.
                    </p>
                  </div>

                  {/* QR DISPLAY CARD - CENTERED */}
                  <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                    
                    {/* SVG GENERATED QR CODE CONTAINER */}
                    <div className="relative bg-white p-5 rounded-2xl shadow-lg shrink-0 flex flex-col items-center justify-center border-4 border-slate-800">
                      {/* Corner Accents */}
                      <div className="w-4 h-4 border-t-2 border-l-2 border-sky-500 absolute -top-2 -left-2" />
                      <div className="w-4 h-4 border-t-2 border-r-2 border-sky-500 absolute -top-2 -right-2" />
                      <div className="w-4 h-4 border-b-2 border-l-2 border-sky-500 absolute -bottom-2 -left-2" />
                      <div className="w-4 h-4 border-b-2 border-r-2 border-sky-500 absolute -bottom-2 -right-2" />

                      {/* Image QR Code */}
                      <img 
                        src="https://lh3.googleusercontent.com/d/1PNcF0uNgCOHdHMeRHLYVO8KjRg7qoNzA" 
                        alt="Código QR de Donación" 
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* ERROR ALERT */}
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* TRUST & SECURITY BANNER */}
                <div className="flex items-start gap-2.5 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong className="text-slate-700">Garantía de Transparencia:</strong> Escanea el código QR desde tu aplicación bancaria preferida para realizar tu aporte directo a la Fundación Fundelibertad.
                  </p>
                </div>
              </form>
            ) : (
              /* SUCCESS CERTIFICATE VIEW */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 sm:py-6 space-y-6"
                id="donation-success-certificate-view"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-200 text-emerald-600 shadow-md">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                    Aporte Registrado Con Éxito
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    ¡Infinitas Gracias, {completedDonation.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Tu valioso aporte impulsa la paz, la formación jurídica y los derechos humanos en la Comuna 15 de Medellín.
                  </p>
                </div>

                {/* CERTIFICATE RECEIPT */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl text-left relative overflow-hidden shadow-xl border border-slate-700">
                  <div className="border-b border-slate-700/80 pb-3 mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">CERTIFICADO DIGITAL DE DONACIÓN</p>
                      <p className="font-bold text-sm text-white">Fundación Fundelibertad Colombia</p>
                    </div>
                    <span className="text-[10px] text-slate-400">Nit: 900.497.212-2</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
                    <div>
                      <span className="text-slate-400 block text-[10px]">ID Registro:</span>
                      <strong className="font-mono text-white text-xs">{completedDonation.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Método:</span>
                      <strong className="text-emerald-400 text-xs font-black">Transferencia / Código QR</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Donante:</span>
                      <strong className="text-white">{completedDonation.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Correo:</span>
                      <strong className="text-white truncate block">{completedDonation.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ubicación:</span>
                      <strong className="text-sky-300">{completedDonation.city || 'Medellín'}, {completedDonation.country || 'Colombia'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fecha:</span>
                      <strong className="text-white">{completedDonation.date}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    id="finish-modal-btn"
                    onClick={handleClose}
                    className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    Entendido / Cerrar
                  </button>
                  <button
                    id="print-cert-btn"
                    onClick={() => window.print()}
                    className="py-3.5 px-6 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Imprimir Comprobante
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
