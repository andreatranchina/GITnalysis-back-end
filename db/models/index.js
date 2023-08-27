//requires
const User = require("./user");
const Repo = require("./repo");
const Branch = require("./branch");

//associations

User.hasMany(Repo, {
  foreignKey: "githubID",
});

Repo.belongsTo(User, {
  foreignKey: "userId",
});

Repo.hasMany(Branch, {
  foreignKey: "repoId",
});

Branch.belongsTo(Repo, {
  foreignKey: "repoId",
});

module.exports = { User, Repo, Branch };
