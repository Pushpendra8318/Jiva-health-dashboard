const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Consultation Fee', 'Lab Test', 'Medicine Order', 'Ambulance', 'Prime Subscription'],
      required: true,
    },
    description: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    method: {
      type: String,
      enum: ['Card', 'UPI', 'Net Banking', 'Cash', 'Wallet'],
      default: 'Card',
    },
    transactionId: { type: String },
    paymentDate: { type: Date, default: Date.now },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
