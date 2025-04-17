require("dotenv").config();
const { Sequelize } = require("sequelize");

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("❌ Missing environment variable: DATABASE_URL");
  process.exit(1);
}

// Initialize Sequelize using the full URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For some Railway configurations
    },
  },
});

// Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log("✅ MySQL Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Export sequelize BEFORE requiring models
module.exports = sequelize;

// Import Models AFTER exporting sequelize
const Profile = require("../models/profileModel");
const Post = require("../models/postModel");

// Sync Models
sequelize
  .sync({ alter: false })
  .then(() => console.log("✅ MySQL Tables synced"))
  .catch((err) => console.error("❌ Error syncing tables:", err));
