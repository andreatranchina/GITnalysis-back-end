//./passport/passPortconfig.js
const User = require("../db/models/user")
const GitHubStrategy = require('passport-github2').Strategy;
require("dotenv").config();


module.exports =  (passport) =>{
  
  passport.serializeUser((user, done) =>{
    console.log("Serialized User")
    done(null, user.githubID);
  });
  
  passport.deserializeUser(async (id, done) => {
    console.log("User id in deserializeUser: ", id);
    try {
      const user = await User.findByPk(id);
      // console.log(user)
      done(null, user);
    } catch (error) {
      console.log(error)
      done(error, null);
    }
  });
  
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: `${process.env.FRONTEND_URL}/github/auth/callback` || "localhost:8080/github/auth/callback"
    callbackURL: "http://localhost:8080/github/auth/callback"
  },
  
  async function(accessToken, refreshToken, profile, done) {
    const user = await User.findOne({where:{githubID:profile.id}})
    // console.log(profile)
    if (!user){
      const newUser=await User.create({
        githubID:profile.id,
        githubAccessToken:accessToken
      })
      return done(null,newUser)
    }
    return done(null, user);
  
  }
  ));
}
