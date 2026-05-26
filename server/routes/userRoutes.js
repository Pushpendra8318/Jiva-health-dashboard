const express = require('express');
const router = express.Router();
const {
  getUsers, getUserById, createUser, updateUser, deleteUser,
  togglePrime, toggleStatus, addAddress, deleteAddress,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, getUsers).post(protect, createUser);
router.route('/:id').get(protect, getUserById).put(protect, updateUser).delete(protect, admin, deleteUser);
router.patch('/:id/prime', protect, togglePrime);
router.patch('/:id/status', protect, toggleStatus);
router.post('/:id/addresses', protect, addAddress);
router.delete('/:id/addresses/:addressId', protect, deleteAddress);

module.exports = router;
