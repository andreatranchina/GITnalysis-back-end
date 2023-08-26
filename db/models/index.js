//requires
const User = require("./user");
const Repo = require("./repo");
const Branch = require("./branch");

//associations

User.hasMany(Repo, {
  foreignKey: "userId",
});

Repo.hasMany(Branch, {
  foreignKey: "repoId",
});

module.exports = { User, Repo };
