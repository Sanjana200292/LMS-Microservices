const express = require('express');
const router = express.Router();
const {
  enrollStudent,
  getAllEnrollments,
  getEnrollmentsByUser,
  getEnrollmentsByCourse,
  cancelEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Student course enrollment management
 */

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: List of all enrollments
 */
router.get('/', getAllEnrollments);

/**
 * @swagger
 * /api/enrollments/user/{userId}:
 *   get:
 *     summary: Get active enrollments by user ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollments for the user
 */
router.get('/user/:userId', getEnrollmentsByUser);

/**
 * @swagger
 * /api/enrollments/course/{courseId}:
 *   get:
 *     summary: Get enrollments by course ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollments for the course
 */
router.get('/course/:courseId', getEnrollmentsByCourse);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enrollments]
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
 *     responses:
 *       201:
 *         description: Enrollment successful
 *       409:
 *         description: Already enrolled
 */
router.post('/', enrollStudent);

/**
 * @swagger
 * /api/enrollments/{id}/cancel:
 *   put:
 *     summary: Cancel an enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment cancelled
 *       404:
 *         description: Enrollment not found
 */
router.put('/:id/cancel', cancelEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment record
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment deleted
 *       404:
 *         description: Enrollment not found
 */
router.delete('/:id', deleteEnrollment);

module.exports = router;
