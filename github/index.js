const app = require("express")();

const passport = require('passport');

require('../passport/passportConfig');

app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/error', (req, res) => res.send('Unknown Error'))

//mounted on `localhost:8080/github`
app.get('/auth',passport.authenticate('github',{ scope: [ 'user', 'repo' ] }));

//mounted on `localhost:8080/github`
app.get('/auth/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),

function(req, res) {
  // Access authenticated user's profile from req.user
  const { username, id } = req.user; // Assuming 'username' and 'id' are available in the profile

  // Construct the redirect URL with the repository name as a query parameter
  const redirectUrl = `http://localhost:3000/?username=${username}&userId=${id}`;

  // Redirect to the frontend URL with query parameters
  res.redirect(redirectUrl);
});

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
  })

  module.exports=app