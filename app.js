//./app.js
require("dotenv").config();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); //may or may not need
const app = express();

//Database imports
const passport = require('passport');
const db = require('./db');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({ db });


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

app.set("trust proxy",true);
//importing the cookie config and creating an express session to store it to be used by the passport

app.use(
  session({
    secret: "secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
      // secure:true,
      // sameSite:"none",
      // httpOnly:false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./passport/passportConfig")(passport)


//hiting root route
app.get("/", (req, res, next) => {
    res.send("Hitting backend root success!")
})


//mounted on `localhost:8080/github`
app.get('/github/auth',passport.authenticate('github',{ scope: [ 'user', 'repo' ] }));

//mounted on `localhost:8080/github`
app.get('/github/auth/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/error'
  }),
  (req, res,next) => {
    // Successful authentication, log the user in
    user = req.user;
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      const { username, githubID } = user;
      console.log(user,'is the current user auth');
      // res.send("User Logged IN")
       // Construct the redirect URL with the repository name as a query parameter
      const redirectUrl = `${process.env.FRONTEND_URL}/?username=${username}&userId=${githubID}`;

  // Redirect to the frontend URL with query parameters
    res.redirect(redirectUrl);
    });
  }
);


app.get('/github/logout', async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log("Logout successful in req.logout");

    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        res.status(500).send("Error occurred during logout");
      } else {
        res.clearCookie("connect.sid");
        res.send("Logout successful");
      }
    });
  });
});



//mounting on routes
app.use('/api', require('./api'));

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
  //syncing DB function
  // use {force: true} to drop the tables and starts from scratch (then re-seed)
  // const syncDB = () => db.sync( {force: true });
    await db.sync();
    await sessionStore.sync();
    serverRun();
}

//invoking all functions
main()

module.exports = app;