const { Sequelize } = require('sequelize');
const {name} = require('../package.json');

const db = new Sequelize(`postgres://localhost:5432/${name}`, {
// const db = new Sequelize(`postgres://postgres:roman123@localhost:5432/${name}`, {
    logging: false,
});

// const db = new Sequelize(`postgres://localhost:5432/gitnalysis_back_end`, {
// // const db = new Sequelize(`postgres://postgres:roman123@localhost:5432/${name}`, {
//     logging: false,
// });

module.exports = db;