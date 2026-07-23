import dotenv from 'dotenv';
dotenv.config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_ENV = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

const BASE_URL = PAYPAL_ENV === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

/**
 * Generate Access Token from PayPal OAuth 2.0 API
 */
export async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    // Simulated token for development/sandbox fallback
    return 'SIMULATED_PAYPAL_ACCESS_TOKEN';
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`PayPal OAuth Failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create a PayPal Order via Orders API v2
 */
export async function createPayPalOrder(amount: number, currency: string = 'USD', customNote?: string) {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    // Fallback simulated order response
    const mockOrderId = 'ORD-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    return {
      id: mockOrderId,
      status: 'CREATED',
      links: [
        { href: `${BASE_URL}/v2/checkout/orders/${mockOrderId}`, rel: 'self', method: 'GET' },
        { href: `https://www.sandbox.paypal.com/checkoutnow?token=${mockOrderId}`, rel: 'approve', method: 'GET' }
      ]
    };
  }

  const accessToken = await getPayPalAccessToken();
  const url = `${BASE_URL}/v2/checkout/orders`;

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        description: 'Donación para la Fundación Fundelibertad - Canal de Solidaridad',
        custom_id: customNote || 'Fundelibertad Donation'
      },
    ],
    application_context: {
      brand_name: 'Fundación Fundelibertad',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'https://fundelibertad.org/donacion-completada',
      cancel_url: 'https://fundelibertad.org/donacion-cancelada',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to create PayPal order (${response.status}): ${errorData}`);
  }

  return await response.json();
}

/**
 * Capture payment for a PayPal Order via Capture API v2
 */
export async function capturePayPalOrder(orderId: string) {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || orderId.startsWith('ORD-')) {
    // Fallback simulated capture response
    const mockTransactionId = 'CAPTURE-' + Math.random().toString(36).substring(2, 11).toUpperCase();
    return {
      id: orderId,
      status: 'COMPLETED',
      payer: {
        name: { given_name: 'Donante', surname: 'Solidario' },
        email_address: 'donante@fundelibertad.org'
      },
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: mockTransactionId,
                status: 'COMPLETED',
                amount: { currency_code: 'USD', value: '25.00' }
              }
            ]
          }
        }
      ]
    };
  }

  const accessToken = await getPayPalAccessToken();
  const url = `${BASE_URL}/v2/checkout/orders/${orderId}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to capture PayPal order (${response.status}): ${errorData}`);
  }

  return await response.json();
}
