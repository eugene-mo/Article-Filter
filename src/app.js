const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
const articlesRoutes = require("./routes/article.route");
const initDatabase = require("./initDatabase"); // Подключаем модуль инициализации

const app = express();
app.use(bodyParser.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/articles", articlesRoutes);

// Initialize DB
(async () => {
  await initDatabase(); // Инициализация базы данных перед стартом сервера

  // Start Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
