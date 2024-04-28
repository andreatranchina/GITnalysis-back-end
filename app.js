//./app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser"); //may or may not need
const cookieParser = require("cookie-parser");
const app = express();

//Database imports
const passport = require("passport");
const db = require("./db");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({ db });

const PORT = 8080;

//setup middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.enable("trust proxy",true);

//logging all headers
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Request headers:", req.headers);

  // Store reference to original res.end function
  const originalEnd = res.end;

  // Replace res.end function with custom function
  res.end = function (data, encoding, cb) {
    // Call original res.end function
    originalEnd.call(this, data, encoding, cb);

    // Log response details
    console.log("Outgoing response:", res.statusCode);
    console.log("Response headers:", res.getHeaders());
  };

  next();
});

app.use(
  cors({
    //production front end url
    origin: process.env.FRONTEND_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders:
      "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    preflightContinue: true,
  })
);

if (process.env.BACKEND_URL === "http://localhost:8080") {
  app.enable("trust proxy");
} else {
  app.set("trust proxy", 1);
}

if (process.env.BACKEND_URL === "http://localhost:8080") {
  app.use(
    session({
      secret: "secret",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
        // sameSite:"none",
        // secure:true,
        // httpOnly:false,
      },
    })
  );
} else {
  console.log("using production session");
  app.use(
    session({
      secret: process.env.GITHUB_CLIENT_SECRET,
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
        sameSite: "none",
        secure: true,
        httpOnly: false,
      },
      credentials: true,
    })
  );
}

app.use(passport.initialize());
app.use(passport.session());
require("./passport/passportConfig")(passport);

//hiting root route
app.get("/", (req, res, next) => {
  res.send("Hitting backend root success!");
});

//mounting on routes
app.use("/api", require("./api"));

//mounted on `localhost:8080/github`
app.get(
  "/github/auth",
  passport.authenticate("github", { scope: ["user", "repo"] })
);

// Mounted on `localhost:8080/github`
app.get(
  "/github/auth/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/error",
  }),
  (req, res, next) => {
    // Successful authentication, log the user in
    console.log(JSON.stringify(req.session) + " is the session");
    const user = req.user;
    console.log(JSON.stringify(user) + " is the user");
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Construct the redirect URL with the repository name as a query parameter
      const redirectUrl = `${process.env.FRONTEND_URL}/?username=${user.username}&userId=${user.githubID}`;
      return res.redirect(redirectUrl); // Redirect to your desired URL
    });
  }
);

app.get("/github/logout", async (req, res, next) => {
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

// 404 Handling - This route should be at the end to handle unknown routes
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(error.message);
});

//Run server function
const serverRun = () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

//aggregated all functions needed to be invoked before running the server
async function main() {
  console.log("This is going to print models: ", db.models);
  //syncing DB function
  // use {force: true} to drop the tables and starts from scratch (then re-seed)
  // await db.sync( {force: true });
  await db.sync();
  await sessionStore.sync();
  serverRun();
}

//invoking all functions
main();

module.exports = app;
