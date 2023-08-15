const db = require("../db")
const { DataTypes } = require("sequelize");


const User=db.define(
    "User",
    {githubID: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull: false,
        unique: true,
    },
    githubAccessToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    username:{
        type:DataTypes.STRING,
        allowNull:true
    },
    fullname: {
        type: DataTypes.STRING,
    },
    profilePhoto: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
}   
)

module.exports=User