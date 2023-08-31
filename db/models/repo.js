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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "githubID",
    },
  },
});

module.exports = Repo;
