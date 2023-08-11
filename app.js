require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); //may or may not need
const db = require('./db');
const app = express();
const pg = require("pg");
const PORT = 8080;

//setup middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    //production front end url
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders:
    "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  preflightContinue: true,
}));

app.enable("trust proxy");


//mounting on routes
app.use('/api', require('./api'));
app.use('/github', require('./github'));

app.get("/", (req, res, next) => {
    res.send("Hitting backend root success!")
})

// 404 Handling - This route should be at the end to handle unknown routes
app.use((error, req, res, next) => {
    res.status(error.status || 500).send(error.message);
});



//syncing DB function
// use {force: true} to drop the tables and starts from scratch (then re-seed)
// const syncDB = () => db.sync( {force: true });
const syncDB = () => db.sync();


//Run server function
const serverRun = () => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}


syncDB();
serverRun();

module.exports = {app};