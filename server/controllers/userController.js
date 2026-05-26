const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const FamilyMember = require('../models/FamilyMember');

// @desc    Get all users with stats
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const { search, status, userType, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') query.status = status;
    if (userType && userType !== 'All') query.userType = userType;

    // Exclude admin users from list
    query.isAdmin = { $ne: true };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Summary stats
    const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });
    const primeUsers = await User.countDocuments({ isPrime: true, isAdmin: { $ne: true } });
    const nonPrimeUsers = await User.countDocuments({ isPrime: false, isAdmin: { $ne: true } });
    const familyCount = await FamilyMember.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
      stats: { totalUsers, primeUsers, nonPrimeUsers, totalFamilyMembers: familyCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user with full details
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });
    const payments = await Payment.find({ userId: req.params.id }).sort({ createdAt: -1 });
    const familyMembers = await FamilyMember.find({ userId: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { user, orders, payments, familyMembers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, phone, gender, dateOfBirth, bloodGroup, area, pinCode, city, state, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const userData = {
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      bloodGroup,
      password: 'Jiva@1234', // default password
      role: req.body.role || 'Patient',
    };

    if (area || pinCode || city || state || country) {
      userData.addresses = [{ type: 'Home', area, pinCode, city, state, country: country || 'India', isDefault: true }];
    }

    const user = await User.create(userData);
    res.status(201).json({ success: true, data: user, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Don't allow password update through this route
    delete req.body.password;
    delete req.body.isAdmin;

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await Order.deleteMany({ userId: req.params.id });
    await Payment.deleteMany({ userId: req.params.id });
    await FamilyMember.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle prime status
// @route   PATCH /api/users/:id/prime
const togglePrime = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isPrime = !user.isPrime;
    user.userType = user.isPrime ? 'Prime User' : 'Normal User';
    await user.save();

    res.json({ success: true, data: user, message: `User ${user.isPrime ? 'upgraded to Prime' : 'downgraded from Prime'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active/inactive status
// @route   PATCH /api/users/:id/status
const toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { status } = req.body;
    user.status = status || (user.status === 'Active' ? 'Inactive' : 'Active');
    await user.save();

    res.json({ success: true, data: user, message: `User status updated to ${user.status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/Update address for user
// @route   POST /api/users/:id/addresses
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { type, area, pinCode, city, state, country, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((addr) => { addr.isDefault = false; });
    }

    user.addresses.push({ type, area, pinCode, city, state, country, isDefault: isDefault || false });
    await user.save();

    res.json({ success: true, data: user, message: 'Address added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/:id/addresses/:addressId
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();

    res.json({ success: true, data: user, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, togglePrime, toggleStatus, addAddress, deleteAddress };
