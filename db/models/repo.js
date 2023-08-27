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
  forks: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "githubID",
    },
    allowNull: false,
  },
  issueTimeline: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  commitsTimeline: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  numCommits: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leadTimeChange: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pullRequests: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  openIssues: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  closedIssues: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  changeFailureRate: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  deployments: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  stargazers: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Repo;
