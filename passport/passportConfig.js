const User = require("../db/models/user")
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require("dotenv").config();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  // callbackURL: `${process.env.FRONTEND_URL}/github/auth/callback` || "localhost:8080/github/auth/callback"
  callbackURL: "http://localhost:8080/github/auth/callback"
},

async function(accessToken, refreshToken, profile, done) {
  const user = await User.findOne({where:{githubID:profile.id}})
  console.log(profile)
  if (!user){
    await User.create({
      githubID:profile.id,
      githubAccessToken:accessToken,
      username:profile.username
    })
  }

  return done(null, profile);
}
));