const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    relation: {
      type: String,
      enum: ['Father', 'Mother', 'Son', 'Daughter', 'Spouse', 'Brother', 'Sister', 'Other'],
      required: true,
    },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
