const db = require("../db");
const { DataTypes } = require("sequelize");

const Repo = db.define(
    "Repo",
    {id: {
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
        allowNull: false,
    },
    issueTimeline: {
        type: DataTypes.JSON,
        allowNull: true, 
    },
    leadTimeChange: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    pullRequests:{
        type: DataTypes.JSON,
        allowNull: true,
    },
    openIssues:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    closedIssues:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    changeFailureRate:{
        type: DataTypes.JSON,
        allowNull: true,
    },
    deployments:{
        type: DataTypes.JSON,
        allowNull: true,
    },
    stargazers:{
        type: DataTypes.JSON,
        allowNull: true,
    }
    }      
)

module.exports = Repo
