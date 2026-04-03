const Enrollment = require('../models/Enrollment');

// @desc    Enroll student in a course
// @route   POST /api/enrollments
exports.enrollStudent = async (req, res) => {
  try {
    const { userId, courseId, courseTitle, userName } = req.body;

    if (!userId || !courseId || !courseTitle || !userName) {
      return res.status(400).json({ success: false, message: 'userId, courseId, courseTitle, and userName are required' });
    }

    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student is already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ userId, courseId, courseTitle, userName });

    res.status(201).json({ success: true, message: 'Enrollment successful', data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all enrollments
// @route   GET /api/enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get enrollments by user ID
// @route   GET /api/enrollments/user/:userId
exports.getEnrollmentsByUser = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.params.userId, status: 'active' });
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get enrollments by course ID
// @route   GET /api/enrollments/course/:courseId
exports.getEnrollmentsByCourse = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.courseId });
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Cancel enrollment
// @route   PUT /api/enrollments/:id/cancel
exports.cancelEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, message: 'Enrollment cancelled', data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
