
const db = require("../db");
const { DataTypes } = require("sequelize");

const Repo = db.define(
    "Branch",
    {branchId: {
        type: DataTypes.INTEGER,
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
    },
    }
)

module.exports = Repo
