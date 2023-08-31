const router = require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser = require("../middleware/auth");
// mounted on : http://localhost:8080/api/stars
//note: do not need auth for these routes

//get all stargazers of a repo
router.get(
  "/:owner/:repo/stargazers",
  authenticateUser,
  async (req, res, next) => {
    try {
      const owner = req.params.owner;
      const repo = req.params.repo;

      const octokit = octokitMain(req.user.githubAccessToken);

      const response = await octokit.paginate(
        "GET /repos/:owner/:repo/stargazers",
        {
          owner,
          repo,
          per_page: 100,
        }
      );

      const responseArray = [];

      for (const stargazer of response) {
        responseArray.push({
          username: stargazer.login,
          avatarUrl: stargazer.avatar_url,
          profileUrl: stargazer.url,
        });
      }

      res.json({
        stargazers: responseArray,
      });
    } catch (error) {
      console.log("Error in repo stargazers", error);
      next(error);
    }
  }
);

//get authenticated users starred repos
router.get("/me/starred", authenticateUser, async (req, res, next) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const response = await octokit.paginate("GET /user/starred", {
      per_page: 100,
    });

    const responseArray = [];
    for (const starredRepo of response) {
      responseArray.push({
        name: starredRepo.name,
        full_name: starredRepo.full_name,
        url: starredRepo.url,
        owner: starredRepo.owner.login,
        ownerAvatarUrl: starredRepo.owner.avatar_url,
        ownerProfileUrl: starredRepo.owner.url,
      });
    }
    res.json({
      starredRepos: responseArray,
    });
  } catch (error) {
    console.log("Error in starred repos", error);
    next(error);
  }
});

//FOLLOWING BRANCH CURRENTLY NOT WORKING
//get user starred repos by username
// router.get("/:username/starred/",authenticateUser,async(req,res,next)=>{
//     const username = req.params.username;
//     try {

//         const octokit =  octokitMain(req.user.githubAccessToken)
//         const response = await octokit.paginate('GET /users/:username/starred}', {
//             username,
//             per_page: 100,
//         });

//         const responseArray = [];
//         for (const starredRepo of response){
//             responseArray.push({
//                 name: starredRepo.name,
//                 fullName: starredRepo.full_name,
//                 url: starredRepo.url,
//                 owner: starredRepo.owner.login,
//                 ownerAvatarUrl: starredRepo.owner.avatar_url,
//                 ownerProfileUrl: starredRepo.owner.url,
//             })
//         }
//         res.json({
//             starredRepos: responseArray
//         });
//     } catch (error) {
//         console.log("Error in retrieving num of branches",error)
//         next(error);
//     }

// })

module.exports = router;
