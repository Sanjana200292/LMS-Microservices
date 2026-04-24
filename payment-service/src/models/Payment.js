const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
    },
    courseId: {
      type: String,
      required: [true, 'Course ID is required'],
    },
    courseTitle: {
      type: String,
      required: [true, 'Course title is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
      default: 'credit_card',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Generate a mock transaction ID before saving
paymentSchema.pre('save', function (next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
