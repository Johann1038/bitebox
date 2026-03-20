/**
 * PayPal API Routes
 *
 * LEARNING NOTE — Two-step payment flow:
 *
 *  Step 1: POST /create-order
 *    - Browser sends the cart to your server.
 *    - Your server creates a PayPal order via the Orders API v2.
 *    - PayPal returns an order ID → sent back to the browser.
 *    - The PayPal JS SDK uses this ID to open the payment popup.
 *
 *  Step 2: POST /capture-order
 *    - After the buyer approves, the JS SDK calls this route.
 *    - Your server "captures" (charges) the payment.
 *    - PayPal confirms with a transaction ID, payer details, etc.
 */

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { getAccessToken, buildOrderPayload, BASE_URL } = require('../config/paypal');
const { createOrder, updateOrder } = require('../store/orders');

const router = express.Router();

// ── POST /api/paypal/create-order ─────────────────────────────────────────────
router.post('/create-order', async (req, res) => {
  try {
    const { cart, customerName, customerPhone } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }

    // Generate a short internal reference for this order
    const internalRef = uuidv4().slice(0, 8).toUpperCase();

    // Get OAuth token, then create the PayPal order
    const accessToken = await getAccessToken();
    const payload = buildOrderPayload(cart, internalRef);

    console.log('[PayPal] Creating order | Ref:', internalRef);

    const response = await axios.post(
      `${BASE_URL}/v2/checkout/orders`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paypalOrderId = response.data.id;

    // Save a PENDING order to the store so we can look it up after capture
    createOrder({
      ref: internalRef,
      paypalOrderId,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      status: 'PENDING',
    });

    console.log('[PayPal] Order created:', paypalOrderId);

    // Return both IDs to the browser
    res.json({ id: paypalOrderId, ref: internalRef });
  } catch (err) {
    console.error('[PayPal] create-order error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// ── POST /api/paypal/capture-order ────────────────────────────────────────────
router.post('/capture-order', async (req, res) => {
  try {
    const { orderID, ref } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: 'orderID is required' });
    }

    const accessToken = await getAccessToken();

    console.log('[PayPal] Capturing order:', orderID);

    // Capture = actually charge the buyer's payment method
    const response = await axios.post(
      `${BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = response.data;
    const capture = captureData.purchase_units[0].payments.captures[0];

    // Update the order in our store with full payment details
    updateOrder(ref, {
      status: 'COMPLETED',
      captureId: capture.id,
      payerName: `${captureData.payer.name.given_name} ${captureData.payer.name.surname}`,
      payerEmail: captureData.payer.email_address,
      capturedAt: capture.create_time,
    });

    console.log('[PayPal] Payment captured! Transaction ID:', capture.id);

    res.json({ success: true, ref, transactionId: capture.id });
  } catch (err) {
    console.error('[PayPal] capture-order error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

module.exports = router;
