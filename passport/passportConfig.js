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
    User.findByPk(id).then((user) => done(null, user)); // Use 'done' instead of 'cb'
  });
  
  
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: `${process.env.FRONTEND_URL}/github/auth/callback` || "localhost:8080/github/auth/callback"
    callbackURL:`${process.env.BACKEND_URL}/github/auth/callback`
  },
  
  async function(accessToken, refreshToken, profile, done) {
    try {
      const user = await User.findOne({where:{githubID:profile.id}})
      // console.log(profile,'is the full profile')
      // console.log(profile.username,'is the username')
      // console.log(profile.id,'is the github id')
      // console.log(profile)
      if (!user){
        console.log(profile.displayName,'isthe displayname')
        const newUser=await User.create({
          githubID:profile.id,
          githubAccessToken:accessToken,
          username:profile.username,
          fullname:profile.displayName,
          profilePhoto: profile._json.avatar_url
        })
        return done(null,newUser)
      }
      return done(null, user);
      
    } catch (error) {
      console.log("Error in Stategy")
    }
  
  }
  ));
}
