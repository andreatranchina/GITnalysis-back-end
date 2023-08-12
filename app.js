//github.js
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); //may or may not need
const app = express();

//Database imports
const db = require('./db');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({ db });

const PORT = 8080;

//setup middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//importing the cookie config and creating an express session to store it to be used by the passport
const cookieConfig=require("./passport/cookieConfig")
app.use(
    session({
      secret: "secret",
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      cookie: cookieConfig,
    })
);

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

//hiting root route
app.get("/", (req, res, next) => {
    res.send("Hitting backend root success!")
})

//mounting on routes
app.use('/api', require('./api'));

//mounting routes used to login/signup with Github OAuth2.0
app.use('/github', require('./github'));


// 404 Handling - This route should be at the end to handle unknown routes
app.use((error, req, res, next) => {
    res.status(error.status || 500).send(error.message);
});

//Run server function
const serverRun = () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
}

//aggregated all functions needed to be invoked before running the server
async function main() {
  console.log("This is going to print models: ", db.models);
    sessionStore.sync();
    //syncing DB function
    // use {force: true} to drop the tables and starts from scratch (then re-seed)
    // const syncDB = () => db.sync( {force: true });
    db.sync({force: true });
    serverRun();
}

//invoking all functions
main()

module.exports = app;