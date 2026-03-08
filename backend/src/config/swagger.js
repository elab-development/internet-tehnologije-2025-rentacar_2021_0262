const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rent-a-Car API',
      version: '1.0.0',
      description: 'REST API za sistem iznajmljivanja automobila'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Lokalni server' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            age: { type: 'integer' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        },
        Car: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            brand: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            power: { type: 'integer' },
            seats: { type: 'integer' },
            fuelType: { type: 'string', enum: ['diesel', 'petrol', 'hybrid'] },
            transmission: { type: 'string', enum: ['manual', 'automatic'] },
            pricePerDay: { type: 'number' },
            imageUrl: { type: 'string' },
            isActive: { type: 'boolean' },
            averageRating: { type: 'number' },
            categoryId: { type: 'string' }
          }
        },
        Rental: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            carId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            totalPrice: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'active', 'completed', 'cancelled'] }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../routes/auth.routes.js'),
    path.join(__dirname, '../routes/car.routes.js'),
    path.join(__dirname, '../routes/rental.routes.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
