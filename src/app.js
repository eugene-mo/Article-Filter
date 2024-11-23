const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
const articlesRoutes = require("./routes/article.route");
const statusesRoutes = require("./routes/status.route");
const tagsRoutes = require("./routes/tag.route");
const initDatabase = require("./initDatabase");
const cacheService = require("./services/cache.service");

const app = express();
app.use(bodyParser.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/articles", articlesRoutes);
app.use("/statuses", statusesRoutes);
app.use("/tags", tagsRoutes);

(async () => {
  // Initialize DB (add default statuses and tags)
  await initDatabase();

  //add tags and statuses list to cache
  await cacheService.init();

  // Start Server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
