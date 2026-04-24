const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByUser,
  updatePaymentStatus,
  deletePayment,
} = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing and transaction management
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payment records
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get('/', getAllPayments);

/**
 * @swagger
 * /api/payments/user/{userId}:
 *   get:
 *     summary: Get payments by user ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payments for the user
 */
router.get('/user/:userId', getPaymentsByUser);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details
 *       404:
 *         description: Payment not found
 */
router.get('/:id', getPaymentById);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Initiate a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *               - courseTitle
 *               - userName
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 64abc123def456
 *               courseId:
 *                 type: string
 *                 example: 64xyz789ghi012
 *               courseTitle:
 *                 type: string
 *                 example: Introduction to Node.js
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               amount:
 *                 type: number
 *                 example: 49.99
 *               currency:
 *                 type: string
 *                 example: USD
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, bank_transfer]
 *                 example: credit_card
 *     responses:
 *       201:
 *         description: Payment initiated
 */
router.post('/', createPayment);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   put:
 *     summary: Update payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, refunded]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Payment not found
 */
router.put('/:id/status', updatePaymentStatus);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete a payment record
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment deleted
 *       404:
 *         description: Payment not found
 */
router.delete('/:id', deletePayment);

module.exports = router;
