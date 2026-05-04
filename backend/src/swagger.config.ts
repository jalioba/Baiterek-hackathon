import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Baiterek API',
      version: '1.0.0',
      description: 'API портала государственных услуг Байтерек. Моки интеграций и бизнес-логика.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/app.ts'], 
};

export default swaggerJSDoc(options);
