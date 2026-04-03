const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Management Service API',
      version: '1.0.0',
      description: 'LMS Course Microservice - Handles course creation, updates, and retrieval',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5002}`, description: 'Direct Service' },
      { url: 'http://localhost:5000/courses', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Course Service is running', port: process.env.PORT });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Course Service connected to MongoDB (courseDB)');
    app.listen(process.env.PORT || 5002, () => {
      console.log(`🚀 Course Service running on port ${process.env.PORT || 5002}`);
      console.log(`📚 Swagger docs: http://localhost:${process.env.PORT || 5002}/api-docs`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));
