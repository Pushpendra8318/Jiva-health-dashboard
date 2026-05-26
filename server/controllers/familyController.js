const FamilyMember = require('../models/FamilyMember');
const User = require('../models/User');

// @desc    Get family members for a user
// @route   GET /api/family?userId=xxx
const getFamilyMembers = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const members = await FamilyMember.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add family member
// @route   POST /api/family
const addFamilyMember = async (req, res) => {
  try {
    const { userId, name, relation, phone, dateOfBirth, gender, bloodGroup } = req.body;

    if (!userId || !name || !relation) {
      return res.status(400).json({ success: false, message: 'userId, name and relation are required' });
    }

    const member = await FamilyMember.create({ userId, name, relation, phone, dateOfBirth, gender, bloodGroup });

    // Update user's family member count
    const count = await FamilyMember.countDocuments({ userId });
    await User.findByIdAndUpdate(userId, { totalFamilyMembers: count });

    res.status(201).json({ success: true, data: member, message: 'Family member added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update family member
// @route   PUT /api/family/:id
const updateFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Family member not found' });

    const updated = await FamilyMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated, message: 'Family member updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete family member
// @route   DELETE /api/family/:id
const deleteFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Family member not found' });

    const userId = member.userId;
    await FamilyMember.findByIdAndDelete(req.params.id);

    // Update user's family member count
    const count = await FamilyMember.countDocuments({ userId });
    await User.findByIdAndUpdate(userId, { totalFamilyMembers: count });

    res.json({ success: true, message: 'Family member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember };
