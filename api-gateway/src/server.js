const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// Swagger – aggregated gateway-level docs
// ─────────────────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API Gateway',
      version: '1.0.0',
      description:
        'Single entry-point for the Online Learning Management System. ' +
        'All requests are routed to the appropriate microservice. ' +
        'No need to know individual service ports – everything goes through port 5000.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'API Gateway (port 5000)' }],
    tags: [
      { name: 'Gateway', description: 'Gateway health & info' },
      { name: 'Auth', description: 'Proxied → Auth Service :5001' },
      { name: 'Courses', description: 'Proxied → Course Service :5002' },
      { name: 'Enrollments', description: 'Proxied → Enrollment Service :5003' },
      { name: 'Payments', description: 'Proxied → Payment Service :5004' },
    ],
  },
  apis: ['./src/routes/*.js', './src/server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─────────────────────────────────────────────────────────────────────────────
// Request logger middleware
// ─────────────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[Gateway] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Gateway health check
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Gateway is running
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    port: process.env.PORT || 5000,
    services: {
      auth:       process.env.AUTH_SERVICE_URL,
      courses:    process.env.COURSE_SERVICE_URL,
      enrollment: process.env.ENROLLMENT_SERVICE_URL,
      payments:   process.env.PAYMENT_SERVICE_URL,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Proxy routes – each path prefix maps to one microservice
// The proxy strips the prefix and forwards the rest of the URL.
// e.g.  GET /auth/api/auth/users  →  GET http://localhost:5001/api/auth/users
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /auth/{path}:
 *   get:
 *     summary: Proxy to Auth Service
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: api/auth/users
 *     responses:
 *       200:
 *         description: Response from Auth Service
 */
app.use(
  '/auth',
  proxy(process.env.AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url,
  })
);

/**
 * @swagger
 * /courses/{path}:
 *   get:
 *     summary: Proxy to Course Service
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: api/courses
 *     responses:
 *       200:
 *         description: Response from Course Service
 */
app.use(
  '/courses',
  proxy(process.env.COURSE_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url,
  })
);

/**
 * @swagger
 * /enroll/{path}:
 *   get:
 *     summary: Proxy to Enrollment Service
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: api/enrollments
 *     responses:
 *       200:
 *         description: Response from Enrollment Service
 */
app.use(
  '/enroll',
  proxy(process.env.ENROLLMENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url,
  })
);

/**
 * @swagger
 * /payments/{path}:
 *   get:
 *     summary: Proxy to Payment Service
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         example: api/payments
 *     responses:
 *       200:
 *         description: Response from Payment Service
 */
app.use(
  '/payments',
  proxy(process.env.PAYMENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.url,
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// 404 fallback
// ─────────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on API Gateway`,
    availableRoutes: ['/auth', '/courses', '/enroll', '/payments'],
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────
app.listen(process.env.PORT || 5000, () => {
  console.log(`\n🌐 API Gateway running on port ${process.env.PORT || 5000}`);
  console.log(`📚 Gateway Swagger: http://localhost:${process.env.PORT || 5000}/api-docs`);
  console.log('\nRouting table:');
  console.log(`  /auth      → ${process.env.AUTH_SERVICE_URL}`);
  console.log(`  /courses   → ${process.env.COURSE_SERVICE_URL}`);
  console.log(`  /enroll    → ${process.env.ENROLLMENT_SERVICE_URL}`);
  console.log(`  /payments  → ${process.env.PAYMENT_SERVICE_URL}\n`);
});
