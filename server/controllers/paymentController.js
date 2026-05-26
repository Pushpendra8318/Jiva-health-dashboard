const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc    Get payments (optionally by userId)
// @route   GET /api/payments
const getPayments = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (status && status !== 'All') query.status = status;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('orderId', 'totalAmount orderNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: payments, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('userId', 'name email');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPayments, getPaymentById };
