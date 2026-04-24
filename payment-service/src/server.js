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
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'LMS Payment Microservice - Processes course payments and tracks transactions',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5004}`, description: 'Direct Service' },
      { url: 'http://localhost:5000/payments', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Payment Service is running', port: process.env.PORT });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Payment Service connected to MongoDB (paymentDB)');
    app.listen(process.env.PORT || 5004, () => {
      console.log(`🚀 Payment Service running on port ${process.env.PORT || 5004}`);
      console.log(`📚 Swagger docs: http://localhost:${process.env.PORT || 5004}/api-docs`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));
