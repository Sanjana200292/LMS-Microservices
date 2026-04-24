const Payment = require('../models/Payment');

// @desc    Initiate a payment
// @route   POST /api/payments
exports.createPayment = async (req, res) => {
  try {
    const { userId, courseId, courseTitle, userName, amount, currency, paymentMethod } = req.body;

    if (!userId || !courseId || !courseTitle || !userName || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'userId, courseId, courseTitle, userName, and amount are required',
      });
    }

    const payment = await Payment.create({
      userId,
      courseId,
      courseTitle,
      userName,
      amount,
      currency: currency || 'USD',
      paymentMethod: paymentMethod || 'credit_card',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Payment initiated successfully',
      data: payment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get payments by user ID
// @route   GET /api/payments/user/:userId
exports.getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, completed, failed, refunded',
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${status}`,
      data: payment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.status(200).json({ success: true, message: 'Payment record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
