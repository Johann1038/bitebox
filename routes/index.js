const express = require('express');
const menu = require('../data/menu');
const { getOrder } = require('../store/orders');

const router = express.Router();

// Menu page
router.get('/', (req, res) => {
  res.render('menu', { menu });
});

// Cart page (client-side only — no server data needed)
router.get('/cart', (req, res) => {
  res.render('cart');
});

// Checkout page — passes PayPal client ID into the EJS template
// LEARNING NOTE: The JS SDK client ID IS safe to expose in the browser.
// It is NOT a secret. The secret stays server-side only.
router.get('/checkout', (req, res) => {
  res.render('checkout', {
    clientId: process.env.PAYPAL_JS_SDK_CLIENT_ID,
  });
});

// Success page — looks up the order by ref query param
router.get('/success', (req, res) => {
  const { ref } = req.query;
  const order = ref ? getOrder(ref) : null;
  res.render('success', {
    order,
    whatsappNumber: process.env.WHATSAPP_NUMBER || '',
  });
});

// Cancel page
router.get('/cancel', (req, res) => {
  res.render('cancel');
});

module.exports = router;
