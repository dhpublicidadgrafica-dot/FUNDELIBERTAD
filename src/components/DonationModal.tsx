/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Shield, CreditCard, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Donation } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal'>('credit_card');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);

  const suggestedAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setIsCustom(true);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    } else {
      setAmount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Por favor ingrese un monto de donación válido.');
      return;
    }
    if (!email) {
      alert('Por favor ingrese su correo electrónico.');
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      const newDonation: Donation = {
        id: 'DON-' + Math.floor(Math.random() * 1000000),
        amount: amount,
        currency: 'USD',
        email: email,
        name: name || 'Donante Anónimo',
        date: new Date().toISOString().split('T')[0],
        type: donationType,
        paymentMethod: paymentMethod,
        status: 'completed'
      };

      // Save to localStorage
      const existing = localStorage.getItem('fundelibertad_donations');
      const donationsList = existing ? JSON.parse(existing) : [];
      donationsList.unshift(newDonation);
      localStorage.setItem('fundelibertad_donations', JSON.stringify(donationsList));

      // Trigger custom storage event for other components to react
      window.dispatchEvent(new Event('storage_update'));

      setIsSubmitting(false);
      setCompletedDonation(newDonation);
    }, 1500);
  };

  const resetForm = () => {
    setAmount(25);
    setCustomAmount('');
    setIsCustom(false);
    setDonationType('one-time');
    setPaymentMethod('credit_card');
    setName('');
    setEmail('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCompletedDonation(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          id="donation-backdrop"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl z-10 border border-slate-100"
          id="donation-modal-content"
        >
          {/* Header */}
          <div className="bg-brand-dark p-6 text-white flex justify-between items-center relative">
            <div className="flex items-center gap-3">
              <div className="bg-brand-red p-2 rounded-full text-white animate-pulse">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl tracking-tight">Canal de Solidaridad</h3>
                <p className="text-xs text-sky-200">Apoya la paz y los derechos humanos en Medellín</p>
              </div>
            </div>
            <button
              id="close-donation-btn"
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto p-6">
            {!completedDonation ? (
              <form onSubmit={handleSubmit} className="space-y-6" id="donation-form">
                {/* 1. Frequency Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Frecuencia de la Donación
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="freq-one-time-btn"
                      type="button"
                      onClick={() => setDonationType('one-time')}
                      className={`py-2.5 px-4 rounded-xl font-medium text-sm transition-all border ${
                        donationType === 'one-time'
                          ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Una sola vez
                    </button>
                    <button
                      id="freq-recurring-btn"
                      type="button"
                      onClick={() => setDonationType('recurring')}
                      className={`py-2.5 px-4 rounded-xl font-medium text-sm transition-all border ${
                        donationType === 'recurring'
                          ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Aporte Mensual (Recurrente)
                    </button>
                  </div>
                </div>

                {/* 2. Amount Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Monto del Aporte (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {suggestedAmounts.map((val) => (
                      <button
                        id={`amt-${val}-btn`}
                        key={val}
                        type="button"
                        onClick={() => handleAmountSelect(val)}
                        className={`py-3 px-2 rounded-xl font-bold text-lg transition-all border ${
                          amount === val && !isCustom
                            ? 'bg-brand-red border-brand-red text-white shadow-md shadow-red-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      id="custom-amount-input"
                      type="number"
                      placeholder="Otro valor (Monto personalizado USD)"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className={`w-full pl-8 pr-12 py-3 rounded-xl border font-semibold text-base focus:outline-none transition-all ${
                        isCustom
                          ? 'border-brand-red ring-2 ring-red-100 bg-white text-brand-dark'
                          : 'border-slate-200 bg-slate-50 text-slate-600 focus:border-slate-300'
                      }`}
                      min="5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                      USD
                    </span>
                  </div>
                </div>

                {/* 3. Donor Information */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Datos Personales
                  </label>
                  <div>
                    <input
                      id="donor-name-input"
                      type="text"
                      placeholder="Nombre Completo (Opcional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <input
                      id="donor-email-input"
                      type="email"
                      placeholder="Correo Electrónico (Requerido para el certificado)"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-brand-primary text-sm"
                    />
                  </div>
                </div>

                {/* 4. Payment Method Tab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      id="pay-cc-btn"
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all border ${
                        paymentMethod === 'credit_card'
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Tarjeta de Crédito
                    </button>
                    <button
                      id="pay-paypal-btn"
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all border ${
                        paymentMethod === 'paypal'
                          ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-extrabold italic text-sky-950 font-sans text-xs">Pay<span className="text-sky-800">Pal</span></span>
                    </button>
                  </div>

                  {paymentMethod === 'credit_card' ? (
                    <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                      <div>
                        <input
                          id="card-number-input"
                          type="text"
                          placeholder="Número de Tarjeta"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-4 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          id="card-expiry-input"
                          type="text"
                          placeholder="MM/AA"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-4 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm font-mono text-center"
                        />
                        <input
                          id="card-cvv-input"
                          type="password"
                          placeholder="CVC / CVV"
                          value={cvv}
                          maxLength={4}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-4 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm font-mono text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex flex-col items-center justify-center text-center py-6">
                      <p className="text-xs text-amber-900 max-w-xs leading-relaxed mb-3">
                        Serás redirigido al portal seguro de PayPal para completar tu transacción de forma internacional.
                      </p>
                      <div className="bg-white px-6 py-2 rounded-full border border-amber-200 flex items-center gap-1.5 shadow-xs">
                        <span className="text-xs text-slate-400 font-medium">Pago Express:</span>
                        <span className="font-extrabold italic text-sky-950 font-sans text-sm">Pay<span className="text-sky-800">Pal</span></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Safety & Trust info */}
                <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <Shield className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <p className="leading-normal">
                    <span className="font-semibold text-slate-700">Donación segura cifrada.</span> Al donar, apoyas el sostenimiento administrativo y los materiales pedagógicos para la defensa de derechos en la Comuna 15 Guayabal, Medellín.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  id="submit-donation-btn"
                  type="submit"
                  disabled={isSubmitting || amount <= 0}
                  className="w-full py-3.5 bg-brand-red text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando Aporte...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 fill-white" />
                      Realizar Donación de ${amount} USD
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Certificate State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 px-2 space-y-6"
                id="donation-success-panel"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-brand-green">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                    ¡Gracias por tu Solidaridad!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Hemos recibido con gratitud tu aporte para FUNDELIBERTAD. Tu generosidad impulsa la defensa de los derechos humanos y la vida en Medellín.
                  </p>
                </div>

                {/* Certificate Layout */}
                <div className="bg-gradient-to-br from-sky-50/50 to-emerald-50/30 p-6 rounded-2xl border border-sky-100/80 text-left relative overflow-hidden shadow-xs">
                  <div className="absolute right-3 top-3 opacity-10">
                    <Sparkles className="w-24 h-24 text-brand-primary" />
                  </div>
                  
                  <div className="text-center border-b border-sky-100 pb-3 mb-4">
                    <span className="font-display font-black text-xs text-slate-400 uppercase tracking-widest">
                      Certificado de Donación
                    </span>
                    <h5 className="font-display font-bold text-sm text-slate-800">
                      FUNDELIBERTAD COLOMBIA
                    </h5>
                    <p className="text-[10px] text-slate-400">Nit: 900.541.211-5 | Medellín</p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700 font-sans">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Referencia:</span>
                      <span className="font-mono font-semibold text-slate-900">{completedDonation.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Donante:</span>
                      <span className="font-semibold text-slate-900">{completedDonation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contacto:</span>
                      <span className="font-semibold text-slate-900">{completedDonation.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monto Aportado:</span>
                      <span className="font-bold text-slate-900">${completedDonation.amount} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Frecuencia:</span>
                      <span className="capitalize font-semibold text-sky-700">
                        {completedDonation.type === 'one-time' ? 'Único Aporte' : 'Aporte Mensual'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fecha:</span>
                      <span className="font-semibold text-slate-900">{completedDonation.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estado:</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Aprobado
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    id="donation-modal-done-btn"
                    onClick={handleClose}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                  >
                    Entendido
                  </button>
                  <button
                    id="print-certificate-btn"
                    onClick={() => window.print()}
                    className="py-3 px-4 bg-sky-100 hover:bg-sky-200 text-sky-800 font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Imprimir
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
