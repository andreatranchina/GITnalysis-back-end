const { Sequelize } = require('sequelize');
const {name} = require('../package.json');
const pg = require("pg");

const db = new Sequelize(process.env.POSTGRES_URL || `postgres://localhost:5432/${name}`, {
// const db = new Sequelize(`postgres://postgres:roman123@localhost:5432/${name}`, {
    // const db = new Sequelize(process.env.POSTGRES_URL || `postgres://postgres:123@localhost:5432/${name}`, {

    logging: false,
});

// const db = new Sequelize(`postgres://localhost:5432/gitnalysis_back_end`, {
// // const db = new Sequelize(`postgres://postgres:roman123@localhost:5432/${name}`, {
//     logging: false,
// });


db.authenticate()
  .then(() => {
    console.log(`DB connection ${name} works`);
  })
  .catch((error) => {
    console.error(`DB connection ${name} failed:`, error);
});




module.exports = db;