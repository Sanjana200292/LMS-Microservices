const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    instructorId: {
      type: String,
      required: [true, 'Instructor ID is required'],
    },
    instructorName: {
      type: String,
      required: [true, 'Instructor name is required'],
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
    duration: {
      type: String,
      default: 'Self-paced',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
