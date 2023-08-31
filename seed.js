const db = require("./db");
const { User, Repo, Branch } = require("./db/models");

const seedUsers = [
  {
    githubID: 91538619,
    githubAccessToken: "gho_rY8mWZPo6GS8frnIjPtlkKJDGYRPXC1kimDO",
    profilePhoto: "https://avatars.githubusercontent.com/u/105296511?v=4",
    fullName: "John Smith",
    username: "johsmith104",
  },
];

const seedRepos = [
  {
    repoId: 676340448,
    name: "gitnalysis_be",
    full_name: "johnsmith104/gitnalysis_be",
    url: "https://api.github.com/users/andreatranchina",
    id: "91538619", //user id
  },
];

const seedBranches = [
  {
    branchId:
      "C_kwDOKFCYENoAKGRkMDUzODVjNzhlMTlkOGJmNzFmNDMzYjI2NmQ5NWIwMWQzZjJlMGU",
    branchName: "hello i'm a branch!",
    authorName: "siobhan9912",
    repoId: 676340448,
  },
];

const seed = async () => {
  try {
    await db.sync({ force: true });
    await User.bulkCreate(seedUsers);
    await Repo.bulkCreate(seedRepos);
    await Branch.bulkCreate(seedBranches);

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    process.exit();
  }
};

seed().then(() => process.exit());
