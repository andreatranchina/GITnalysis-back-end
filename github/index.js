const app = require("express")();
const cookieSession = require('cookie-session')
const passport = require('passport');
require('../passport/passportConfig');

app.use(cookieSession({
  name: 'github-auth-session',
  keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/error', (req, res) => res.send('Unknown Error'))

//localhost:8080/github
app.get('/auth',passport.authenticate('github',{ scope: [ 'user', 'repo' ] }));

//localhost:8080/github
app.get('/auth/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),

function(req, res) {
  res.redirect('http://localhost:3000/');
});

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
  })

  module.exports=app