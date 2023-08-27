const db = require("../db");
const { DataTypes } = require("sequelize");
const Repo = require("./repo");

const Branch = db.define("Branch", {
  branchId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  branchName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Repo,
      key: "repoId",
    },
  },
});

module.exports = Branch;
