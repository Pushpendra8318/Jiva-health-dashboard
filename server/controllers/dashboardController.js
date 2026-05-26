const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const FamilyMember = require('../models/FamilyMember');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      primeUsers,
      totalOrders,
      totalFamilyMembers,
      recentUsers,
      recentOrders,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments({ isAdmin: { $ne: true } }),
      User.countDocuments({ isPrime: true, isAdmin: { $ne: true } }),
      Order.countDocuments(),
      FamilyMember.countDocuments(),
      User.find({ isAdmin: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email status userType role joinedDate'),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name')
        .select('orderNumber status totalAmount type orderDate userId items'),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        primeUsers,
        totalOrders,
        totalFamilyMembers,
        totalRevenue: revenueAgg[0]?.total || 0,
        recentUsers,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
