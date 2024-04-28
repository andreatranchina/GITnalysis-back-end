const authenticateUser = (req, res, next) => {
  console.log(JSON.stringify(req.session.user));
  // Print cookies
  console.log("Cookies:", JSON.stringify(req.session.cookies));

  // Print signed cookies
  console.log("Signed Cookies:", JSON.stringify(req.session.signedCookies));
  try {
    if (req.isAuthenticated()) {
      // If the user is authenticated, allow them to proceed
      return next();
    }
    // If the user is not authenticated, send an unauthorized response
    res.status(401).send("Unauthorized");
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error("Error in authentication middleware:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = authenticateUser;
