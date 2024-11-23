const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Articles API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Article: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The ID of the article",
            },
            title: {
              type: "string",
              description: "The title of the article",
            },
            author: {
              type: "string",
              description: "The author of the article",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The creation date of the article",
            },
            status: {
              type: "string",
              description: "The status of the article",
              enum: ["published", "draft", "archived"],
            },
            views: {
              type: "integer",
              description: "The number of views the article has",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The tags associated with the article",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsDoc(swaggerOptions);
