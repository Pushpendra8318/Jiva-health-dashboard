const express = require('express');
const router = express.Router();
const { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } = require('../controllers/familyController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getFamilyMembers).post(protect, addFamilyMember);
router.route('/:id').put(protect, updateFamilyMember).delete(protect, deleteFamilyMember);

module.exports = router;
