import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Marcelino School Management API",
      version: "1.0.0",
      description: "REST API for Marcelino International Academy",
    },
    servers: [{ url: process.env.API_URL || "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
});
