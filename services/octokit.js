const { Octokit } = require("@octokit/rest");

module.exports = (access_token) => {
  // If the method is called with an access token, create an axios header
  return access_token
    ? new Octokit({
        userAgent: "GITNALYSIS/1.0",
        auth: access_token,
      })
    : new Octokit({
        userAgent: "GITNALYSIS/1.0",
      });
};
