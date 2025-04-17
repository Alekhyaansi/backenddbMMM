require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Database connection (MySQL)
const sequelize = require("./config/database");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure "uploads" directory exists & serve static files
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User, Profile & Post API",
      version: "1.0.0",
      description: "API for user authentication, profile management, and post management",
    },
    servers: [{ url: "backenddbmmm-production.up.railway.app" }],
  },
  apis: ["./routes/userRoutes.js", "./routes/postRoutes.js", "./routes/profileRoutes.js"], 
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", profileRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
sequelize
  .sync({ alter: true }) // Ensure tables are updated if needed
  .then(() => {
    console.log("✅ MySQL Database connected & tables synced");
    app.listen(PORT, () => console.log(`🚀 Server running on backenddbmmm-production.up.railway.app`));
  })
  .catch((err) => console.error("❌ Error connecting to database:", err));
