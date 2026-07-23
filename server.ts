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
  createPayPalOrder, 
  capturePayPalOrder 
} from './server/paypalService.js';
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
 * 1. POST /api/paypal/create-order
 * Initiates a PayPal order for a donation
 */
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', frequency = 'one-time', name, email } = req.body;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      res.status(400).json({ error: 'El monto mínimo de donación es de $1 USD.' });
      return;
    }

    const order = await createPayPalOrder(parsedAmount, currency, `Donacion_${frequency}`);
    
    // Create pending donation record
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const pendingDonation: Donation = {
      id: 'DON-' + Math.floor(100000 + Math.random() * 900000),
      orderId: order.id,
      amount: parsedAmount,
      currency,
      email: email || '',
      name: name || 'Donante Anónimo',
      type: frequency === 'recurring' ? 'recurring' : 'one-time',
      paymentMethod: 'paypal',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      ip: clientIp
    };

    addDonation(pendingDonation);

    res.json({
      orderId: order.id,
      status: order.status,
      donationId: pendingDonation.id
    });
  } catch (err: any) {
    console.error('Error in /api/paypal/create-order:', err);
    res.status(500).json({ error: err.message || 'Error al crear la orden de PayPal' });
  }
});

/**
 * 2. POST /api/paypal/capture-order
 * Captures the funds from PayPal after user approves payment
 */
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { 
      orderId, 
      name, 
      email, 
      phone, 
      country, 
      city, 
      amount, 
      currency = 'USD', 
      frequency = 'one-time', 
      paymentMethod = 'paypal',
      message, 
      receiveNews 
    } = req.body;

    if (!orderId) {
      res.status(400).json({ error: 'El orderId es requerido' });
      return;
    }

    const captureResult = await capturePayPalOrder(orderId);
    
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const txId = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id || 'TX-' + Math.floor(100000 + Math.random() * 900000);

    const completedDonation: Donation = {
      id: txId,
      orderId: orderId,
      amount: parseFloat(amount) || 25,
      currency: currency || 'USD',
      name: name || captureResult.payer?.name?.given_name || 'Donante Solidario',
      email: email || captureResult.payer?.email_address || 'sin-correo@fundelibertad.org',
      phone: phone || '',
      country: country || 'Colombia',
      city: city || 'Medellín',
      message: message || '',
      receiveNews: Boolean(receiveNews),
      date: new Date().toISOString().split('T')[0],
      type: frequency === 'recurring' ? 'recurring' : 'one-time',
      paymentMethod: paymentMethod === 'credit_card' ? 'credit_card' : 'paypal',
      status: 'completed',
      ip: clientIp
    };

    addDonation(completedDonation);

    // Send automated email notifications asynchronously
    sendDonorThankYouEmail(
      completedDonation.name, 
      completedDonation.email, 
      completedDonation.amount, 
      completedDonation.currency, 
      completedDonation.id, 
      completedDonation.type
    ).catch(err => console.error('Error sending donor email:', err));

    sendAdminNotificationEmail(
      completedDonation.name, 
      completedDonation.email, 
      completedDonation.amount, 
      completedDonation.currency, 
      completedDonation.id
    ).catch(err => console.error('Error sending admin notification email:', err));

    res.json({
      success: true,
      donation: completedDonation,
      raw: captureResult
    });
  } catch (err: any) {
    console.error('Error in /api/paypal/capture-order:', err);
    res.status(500).json({ error: err.message || 'Error al capturar el pago con PayPal' });
  }
});

/**
 * 3. POST /api/paypal/webhook
 * Receives asynchronous status webhooks from PayPal
 */
app.post('/api/paypal/webhook', async (req, res) => {
  try {
    const event = req.body;
    console.log('[PAYPAL WEBHOOK] Event Received:', event.event_type);

    const eventType = event.event_type;
    const resource = event.resource;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = resource.id || resource.supplementary_data?.related_ids?.order_id;
      if (orderId) {
        updateDonationStatus(orderId, 'completed');
      }
    } else if (eventType === 'PAYMENT.CAPTURE.DENIED') {
      const orderId = resource.id;
      if (orderId) {
        updateDonationStatus(orderId, 'denied');
      }
    } else if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      const orderId = resource.id;
      if (orderId) {
        updateDonationStatus(orderId, 'refunded');
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error processing PayPal webhook:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

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
