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
  //redirect to the frontend url
  res.redirect('http://localhost:3000/');
});

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
  })

  module.exports=app