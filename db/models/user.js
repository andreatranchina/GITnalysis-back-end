const db = require("../db")
const { DataTypes } = require("sequelize");


const User=db.define(
    "User",
    {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    githubAccessToken: {
        type: DataTypes.STRING,
        allowNull: true,
    }
    }   
)

module.exports=User