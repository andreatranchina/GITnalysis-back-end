const db = require("../db");
const { DataTypes } = require("sequelize");
const User = require("./user");

const Repo = db.define("Repo", {
  repoId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  repoName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "githubID",
    },
  },
});

module.exports = Repo;
