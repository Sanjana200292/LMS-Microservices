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
      title: 'Enrollment Service API',
      version: '1.0.0',
      description: 'LMS Enrollment Microservice - Manages student-course relationships',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5003}`, description: 'Direct Service' },
      { url: 'http://localhost:5000/enroll', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/enrollments', enrollmentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Enrollment Service is running', port: process.env.PORT });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Enrollment Service connected to MongoDB (enrollmentDB)');
    app.listen(process.env.PORT || 5003, () => {
      console.log(`🚀 Enrollment Service running on port ${process.env.PORT || 5003}`);
      console.log(`📚 Swagger docs: http://localhost:${process.env.PORT || 5003}/api-docs`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));
