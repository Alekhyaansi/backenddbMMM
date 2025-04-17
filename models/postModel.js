const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const user = require("./userModel");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  startDestination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endDestination: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, { timestamps: true });

// ✅ Correct associations
user.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(user, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Post;
