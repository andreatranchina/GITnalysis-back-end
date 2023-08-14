const authenticateUser = async (req, res, next) => {
  console.log("is auth?", await req.isAuthenticated());
  // console.log("req.cookie ", await req.cookie);
  // console.log("req.session ", await req.session);
  if (await req.isAuthenticated()) {
    // If the user is authenticated, allow them to proceed
    return next();
  }
  res.status(401).send("Unauthorized");
};

module.exports = authenticateUser
