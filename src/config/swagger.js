const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Articles API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsDoc(swaggerOptions);
