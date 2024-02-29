const router = require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser = require("../middleware/auth");
const { User } = require("../db/models");

// mounted on: http://localhost:8080/api/users

//get authenticated user
router.get("/me", authenticateUser, async (req, res, next) => {
  try {
    console.log("hit auth me");
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.request("GET /user");
    res.json(response.data);
  } catch (error) {
    console.log("Error in user/me® route", error);
    next(error);
  }
});

//get user info by username
router.get("/:username", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const username = req.params.username;

    const response = await octokit.request("GET /users/:username", {
      username,
    });

    res.json(response.data);
  } catch (error) {
    console.log("Error in retrieving user route", error);
    next(error);
  }
});

//get all followers of the authenticated user
router.get("/me/followers", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.paginate("GET /user/followers", {
      per_page: 100,
    });

    res.json(response);
  } catch (error) {
    console.log("Error in retrieving authenticated user followers", error);
    next(error);
  }
});

//get list of people followed by the authenticated user
router.get("/me/following", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.paginate("GET /user/following", {
      per_page: 100,
    });

    res.json(response);
  } catch (error) {
    console.log("Error in retrieving authenticated user followings", error);
    next(error);
  }
});

//check if a person is followed by the authenticated user
router.get(
  "/me/following/:username",
  authenticateUser,
  async (req, res, next) => {
    try {
      const octokit = octokitMain(req.user.githubAccessToken);
      const username = req.params.username;

      const response = await octokit.request("GET /user/following/:username", {
        username,
      });

      res.json(response.data);
    } catch (error) {
      console.log("Error", error);
      next(error);
    }
  }
);

//list of followers of a user by username
router.get("/:username/followers", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const username = req.params.username;

    const response = await octokit.paginate("GET /users/:username/followers", {
      username,
      per_page: 100,
    });

    res.json(response);
  } catch (error) {
    console.log("Error retrieving user followers", error);
    next(error);
  }
});

//list of people a user follows
router.get("/:username/following", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const username = req.params.username;

    const response = await octokit.paginate("GET /users/:username/following", {
      username,
      per_page: 100,
    });

    res.json(response);
  } catch (error) {
    console.log("Error in retrieving user followings", error);
    next(error);
  }
});

//check if user is following another user
router.get(
  "/:username/following/:targetUser",
  authenticateUser,
  async (req, res, next) => {
    try {
      const octokit = octokitMain(req.user.githubAccessToken);
      const { username, targetUser } = req.params;

      const response = await octokit.request(
        "GET /users/:username/following/:targetUser",
        {
          username,
          targetUser,
        }
      );

      res.json(response.data);
    } catch (error) {
      console.log("Error in average route", error);
      next(error);
    }
  }
);

//list emails for authenticated user
router.get("/me/emails", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.request("GET /user/emails");

    res.json(response.data);
  } catch (error) {
    console.log("Error in retrieving user emails", error);
    next(error);
  }
});

//list repositories for authenticated user
router.get("/me/repos", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.paginate("GET /user/repos", {
      per_page: 100,
    });
    res.json(response);
  } catch (error) {
    console.log("Error in retreiving authenticated user repos", error);
    next(error);
  }
});

//get num of repositories for authenticated user
router.get("/me/repos/getNum", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.paginate("GET /user/repos", {
      per_page: 100,
    });
    res.json(response.length);
  } catch (error) {
    console.log(
      "Error in retrieving num of repos for authenticated user",
      error
    );
    next(error);
  }
});

//list repositories for of a user by username
router.get("/:username/repos", authenticateUser, async (req, res, next) => {
  try {
    const username = req.params.username;
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.paginate("GET /users/:username/repos", {
      username,
      per_page: 100,
    });

    res.json(response);
  } catch (error) {
    console.log("Error in retrieving user repos", error);
    next(error);
  }
});

//get number of users signed up to our website
router.get("/getWebsiteUsers/getNum", async (req, res, next) => {
  console.log("hit website users");
  try {
    const allUsers = await User.findAll();
    console.log(allUsers, "allUsers");
    res.json({ numUsers: allUsers.length });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;
