const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
const articlesRoutes = require("./routes/article.route");
const sequelize = require("./config/db");

const app = express();
app.use(bodyParser.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/articles", articlesRoutes);

// Sync DB
sequelize.sync().then(() => console.log("Database synced"));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
