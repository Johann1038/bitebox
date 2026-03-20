/**
 * PayPal API Helper
 *
 * LEARNING NOTE — PayPal uses OAuth 2.0 Client Credentials:
 *   1. We combine CLIENT_ID:CLIENT_SECRET and base64-encode them.
 *   2. We POST that as a Basic auth header to get a short-lived access token.
 *   3. Every subsequent PayPal API call uses: Authorization: Bearer <token>
 *
 * We cache the token so we don't fetch a new one on every request.
 */

const axios = require('axios');

const BASE_URL = process.env.PAYPAL_BASE_URL;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// ── Token cache ───────────────────────────────────────────────────────────────
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  // Reuse token if it's still valid (expire 5 min early to be safe)
  if (cachedToken && Date.now() < tokenExpiry) {
    console.log('[PayPal] Reusing cached access token');
    return cachedToken;
  }

  // Base64 encode "CLIENT_ID:CLIENT_SECRET" for Basic Auth
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',  // must be form-encoded, not JSON
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
  console.log('[PayPal] New access token obtained');
  return cachedToken;
}

/**
 * Build the PayPal Orders API v2 request body from a cart array.
 *
 * LEARNING NOTE — PayPal requires:
 *   - intent: "CAPTURE" (we want to charge immediately, not just authorize)
 *   - purchase_units: array of what the customer is buying
 *   - amount.value must match the sum of items (or PayPal will reject it)
 */
function buildOrderPayload(cart, internalRef) {
  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: internalRef,
        description: `BiteBox Order #${internalRef}`,
        amount: {
          currency_code: 'USD',
          value: itemTotal.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: itemTotal.toFixed(2),
            },
          },
        },
        items: cart.map((item) => ({
          name: item.name,
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: 'USD',
            value: Number(item.price).toFixed(2),
          },
        })),
      },
    ],
  };
}

module.exports = { getAccessToken, buildOrderPayload, BASE_URL };
