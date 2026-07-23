import fs from 'fs';
import path from 'path';
import { Donation, DonationStats } from '../src/types.js';

const DB_FILE = path.join(process.cwd(), 'donations_db.json');

const DEFAULT_DONATIONS: Donation[] = [
  {
    id: 'DON-982412',
    amount: 100000,
    currency: 'COP',
    name: 'Carlos Alberto Restrepo',
    email: 'carlos.restrepo@gmail.com',
    phone: '+57 300 456 7890',
    country: 'Colombia',
    city: 'Medellín',
    message: 'Apoyo incondicional a la labor de derechos humanos en Guayabal.',
    receiveNews: true,
    date: '2026-07-22',
    type: 'one-time',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '181.135.22.10'
  },
  {
    id: 'DON-971045',
    amount: 50000,
    currency: 'COP',
    name: 'María Elena Gómez',
    email: 'maria.gomez@hotmail.com',
    phone: '+57 312 987 6543',
    country: 'Colombia',
    city: 'Bogotá',
    message: 'Gracias por su compromiso con los jóvenes de la Comuna 15.',
    receiveNews: true,
    date: '2026-07-21',
    type: 'recurring',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '190.27.120.4'
  },
  {
    id: 'DON-965312',
    amount: 250000,
    currency: 'COP',
    name: 'Fundación Aliada Int.',
    email: 'contacto@aliadaint.org',
    phone: '+57 300 555 0192',
    country: 'Colombia',
    city: 'Medellín',
    message: 'Aporte institucional para talleres pedagógicos.',
    receiveNews: false,
    date: '2026-07-19',
    type: 'one-time',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '72.14.201.2'
  },
  {
    id: 'DON-954109',
    amount: 50000,
    currency: 'COP',
    name: 'Alejandro Morales',
    email: 'alejo.morales@yahoo.es',
    phone: '+57 315 222 1100',
    country: 'Colombia',
    city: 'Medellín',
    message: 'Que viva la paz en Medellín.',
    receiveNews: true,
    date: '2026-07-15',
    type: 'one-time',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '181.135.12.88'
  },
  {
    id: 'DON-943210',
    amount: 100000,
    currency: 'COP',
    name: 'Sofia Ramirez',
    email: 'sramirez@outlook.com',
    phone: '+57 312 345 6789',
    country: 'Colombia',
    city: 'Cali',
    message: 'Abrazos solidarios para la causa.',
    receiveNews: true,
    date: '2026-07-10',
    type: 'recurring',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '88.12.33.102'
  },
  {
    id: 'DON-931002',
    amount: 500000,
    currency: 'COP',
    name: 'Red Solidaria DDHH',
    email: 'info@redddhh.org',
    phone: '+57 604 222 7300',
    country: 'Colombia',
    city: 'Medellín',
    message: 'Aporte solidario para informes de monitoreo.',
    receiveNews: true,
    date: '2026-06-28',
    type: 'one-time',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '194.230.14.5'
  },
  {
    id: 'DON-920192',
    amount: 100000,
    currency: 'COP',
    name: 'Juan Esteban Valencia',
    email: 'jesteban.valencia@gmail.com',
    phone: '+57 301 777 8899',
    country: 'Colombia',
    city: 'Sabaneta',
    message: '',
    receiveNews: true,
    date: '2026-06-14',
    type: 'recurring',
    paymentMethod: 'credit_card',
    status: 'completed',
    ip: '181.135.90.12'
  }
];

export function getDonations(): Donation[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DONATIONS, null, 2), 'utf-8');
      return DEFAULT_DONATIONS;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading donations database:', err);
    return DEFAULT_DONATIONS;
  }
}

export function saveDonations(donations: Donation[]): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(donations, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving donations database:', err);
    return false;
  }
}

export function addDonation(donation: Donation): Donation {
  const donations = getDonations();
  const existingIdx = donations.findIndex(d => d.id === donation.id || (donation.orderId && d.orderId === donation.orderId));
  if (existingIdx >= 0) {
    donations[existingIdx] = { ...donations[existingIdx], ...donation };
  } else {
    donations.unshift(donation);
  }
  saveDonations(donations);
  return donation;
}

export function updateDonationStatus(orderIdOrId: string, status: 'completed' | 'pending' | 'denied' | 'refunded'): Donation | null {
  const donations = getDonations();
  const item = donations.find(d => d.id === orderIdOrId || d.orderId === orderIdOrId);
  if (item) {
    item.status = status;
    saveDonations(donations);
    return item;
  }
  return null;
}

export function calculateStats(): DonationStats {
  const donations = getDonations().filter(d => d.status === 'completed');
  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalDonationsCount = donations.length;
  const averageDonation = totalDonationsCount > 0 ? Math.round(totalRaised / totalDonationsCount) : 0;
  
  const recentDonors = donations.slice(0, 5);

  // Group monthly in COP
  const monthlyMap: Record<string, { amount: number; count: number }> = {
    'Ene': { amount: 3200000, count: 24 },
    'Feb': { amount: 4100000, count: 30 },
    'Mar': { amount: 3800000, count: 28 },
    'Abr': { amount: 5400000, count: 42 },
    'May': { amount: 6200000, count: 50 },
    'Jun': { amount: 7800000, count: 65 },
    'Jul': { amount: totalRaised, count: totalDonationsCount }
  };

  const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    amount: Math.round(data.amount),
    count: data.count
  }));

  const annualData = [
    { year: '2024', amount: 38500000, count: 290 },
    { year: '2025', amount: 64200000, count: 480 },
    { year: '2026', amount: Math.round(30500000 + totalRaised), count: 315 + totalDonationsCount }
  ];

  return {
    totalRaised,
    goal: 0,
    totalDonationsCount,
    averageDonation,
    recentDonors,
    monthlyData,
    annualData
  };
}
