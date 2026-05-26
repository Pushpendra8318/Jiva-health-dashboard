const express = require('express');
const router = express.Router();
const { getPayments, getPaymentById } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPayments);
router.get('/:id', protect, getPaymentById);

module.exports = router;
