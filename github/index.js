// const app = require("express")();



// app.get('/auth/error', (req, res) => res.send('Unknown Error'))

// module.exports=function(passport){
  
//   //mounted on `localhost:8080/github`
//   app.get('/auth',passport.authenticate('github',{ scope: [ 'user', 'repo' ] }));
  
//   //mounted on `localhost:8080/github`
//   app.get('/auth/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),
  
//   function(req, res) {
//     //redirect to the frontend url
//     res.redirect('http://localhost:3000/');
//   });
  
//   app.get('/logout', (req, res) => {
//       req.session = null;
//       req.logout();
//       res.redirect('/');
//     })
  
// }