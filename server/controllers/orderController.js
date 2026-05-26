const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all orders (optionally filtered by userId)
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (status && status !== 'All') query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: orders, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    // Update user's total orders
    await User.findByIdAndUpdate(req.body.userId, { $inc: { totalOrders: 1 } });
    res.status(201).json({ success: true, data: order, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated, message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    await Order.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(order.userId, { $inc: { totalOrders: -1 } });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
