import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { 
  getDonations, 
  addDonation, 
  updateDonationStatus, 
  calculateStats 
} from './server/database.js';
import { 
  sendDonorThankYouEmail, 
  sendAdminNotificationEmail 
} from './server/emailService.js';
import { Donation } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

// Basic Middlewares
app.use(express.json());

// CORS & Basic Security Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-XSS-Protection', '1; mode=block');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Simple Rate Limiting for API routes
const requestCounts = new Map<string, { count: number; resetTime: number }>();
app.use('/api/', (req, res, next) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  const userReqs = requestCounts.get(clientIp) || { count: 0, resetTime: now + windowMs };

  if (now > userReqs.resetTime) {
    userReqs.count = 1;
    userReqs.resetTime = now + windowMs;
  } else {
    userReqs.count += 1;
  }

  requestCounts.set(clientIp, userReqs);

  if (userReqs.count > maxRequests) {
    res.status(429).json({ error: 'Demasiadas solicitudes. Intente nuevamente en un minuto.' });
    return;
  }
  next();
});

/* ==========================================================================
   REST API ENDPOINTS
   ========================================================================== */



/**
 * 4. GET /api/donations
 * Retrieves donations list with filtering & search
 */
app.get('/api/donations', (req, res) => {
  try {
    let donations = getDonations();
    const { search, frequency, method, status } = req.query;

    if (search && typeof search === 'string') {
      const query = search.toLowerCase();
      donations = donations.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        (d.city && d.city.toLowerCase().includes(query)) ||
        (d.country && d.country.toLowerCase().includes(query))
      );
    }

    if (frequency && frequency !== 'all') {
      donations = donations.filter(d => d.type === frequency);
    }

    if (method && method !== 'all') {
      donations = donations.filter(d => d.paymentMethod === method);
    }

    if (status && status !== 'all') {
      donations = donations.filter(d => d.status === status);
    }

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la lista de donaciones' });
  }
});

/**
 * 5. GET /api/statistics
 * Retrieves aggregate donation stats and campaign goal progress
 */
app.get('/api/statistics', (req, res) => {
  try {
    const stats = calculateStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al calcular las estadísticas de donación' });
  }
});

/**
 * 6. POST /api/donations
 * Direct submission or sync for completed donations
 */
app.post('/api/donations', (req, res) => {
  try {
    const donationData: Donation = req.body;
    
    if (!donationData.amount || donationData.amount < 1000) {
      res.status(400).json({ error: 'El monto mínimo de donación es de $5.000 COP.' });
      return;
    }

    const newDonation = addDonation({
      ...donationData,
      currency: donationData.currency || 'COP',
      paymentMethod: donationData.paymentMethod || 'credit_card',
      id: donationData.id || 'DON-' + Math.floor(100000 + Math.random() * 900000),
      date: donationData.date || new Date().toISOString().split('T')[0],
      status: donationData.status || 'completed'
    });

    // Send automated emails asynchronously
    sendDonorThankYouEmail(
      newDonation.name, 
      newDonation.email, 
      newDonation.amount, 
      newDonation.currency, 
      newDonation.id, 
      newDonation.type
    ).catch(err => console.error('Error sending donor email:', err));

    sendAdminNotificationEmail(
      newDonation.name, 
      newDonation.email, 
      newDonation.amount, 
      newDonation.currency, 
      newDonation.id
    ).catch(err => console.error('Error sending admin notification email:', err));

    res.status(201).json(newDonation);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar la donación' });
  }
});

/* ==========================================================================
   VITE DEV MIDDLEWARE & PRODUCTION STATIC SERVING
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
