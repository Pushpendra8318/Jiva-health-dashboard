const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  type: { type: String, default: 'Home' },
  area: { type: String },
  pinCode: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['Patient', 'Doctor', 'Nurse', 'Admin', 'Support Staff'],
      default: 'Patient',
    },
    userType: {
      type: String,
      enum: ['Normal User', 'Prime User'],
      default: 'Normal User',
    },
    isPrime: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    gender: {
      type: String,
      enum: ['Male', 'Female', '13-17 years', '18-35 years', '36-59 years', '60+ years', ''],
      default: '',
    },
    dateOfBirth: { type: Date },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
    addresses: [addressSchema],
    joinedDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    appointmentsCount: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalFamilyMembers: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
