const router = require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser = require("../middleware/auth");
// mounted on : http://localhost:8080/api/branches
//note: do not need auth for these routes

const NodeCache = require("node-cache");
const githubCache = new NodeCache({ stdTTL: 1800 }); // 1800 seconds = 30 minutes

//get all branches linke to a repo (all branch data including name) returned in sorted order by date created
// ex response
// "branches": [
//     {
//         "name": "cookie-dev",
//         "commitDate": "2023-08-21T01:01:55Z",
//         "commitDateNoTime": "2023-08-21"
router.get("/:owner/:repo", authenticateUser, async (req, res, next) => {
  try {
    const owner = req.params.owner;
    const repo = req.params.repo;

    const cacheKey = `${owner}-${repo}-branches`;
    const cachedData = githubCache.get(cacheKey);

    if (cachedData) {
      res.json(cachedData);
    } else {
      const octokit = octokitMain(req.user.githubAccessToken);
      // const response = await octokit.request('GET /repos/:owner/:repo/branches', {
      //     owner,
      //     repo
      // });
      // const all_branches=response.data
      const response = await octokit.paginate(
        "GET /repos/:owner/:repo/branches",
        {
          owner,
          repo,
          per_page: 100,
        }
      );

      const all_branches = await Promise.all(
        response.map(async (branch) => {
          const commitDetails = await octokit.request(
            `GET /repos/:owner/:repo/git/commits/:commit_sha`,
            {
              owner,
              repo,
              commit_sha: branch.commit.sha,
            }
          );
          return {
            name: branch.name,
            commitDate: commitDetails.data.committer.date,
            commitDateNoTime: new Date(commitDetails.data.committer.date)
              .toISOString()
              .split("T")[0],
          };
        })
      );

      const sortedBranches = all_branches.sort(
        (a, b) => new Date(b.commitDate) - new Date(a.commitDate)
      );

      githubCache.set(cacheKey, { branches: sortedBranches }, 1800);

      res.json({
        branches: sortedBranches,
      });
    }
  } catch (error) {
    console.log("Error in retrieving branches", error);
    next(error);
  }
});

//get number of branches (count) linked to a repo
router.get("/count/:owner/:repo", authenticateUser, async (req, res, next) => {
  try {
    const owner = req.params.owner;
    const repo = req.params.repo;

    const cacheKey = `${owner}-${repo}-branchcount`;
    const cachedData = githubCache.get(cacheKey);

    if (cachedData) {
      res.json(cachedData);
    } else {
      const octokit = octokitMain(req.user.githubAccessToken);
      const response = await octokit.paginate(
        "GET /repos/:owner/:repo/branches",
        {
          owner,
          repo,
          per_page: 100,
        }
      );
      const all_branches = response;

      githubCache.set(cacheKey, { branches: all_branches.length }, 1800);

      res.json({
        branches: all_branches.length,
      });
    }
  } catch (error) {
    console.log("Error in retrieving num of branches", error);
    next(error);
  }
});

//get all data for an individual branch linked to a repo
router.get(
  "/singleBranch/:owner/:repo/:branch",
  authenticateUser,
  async (req, res, next) => {
    try {
      const owner = req.params.owner;
      const repo = req.params.repo;
      const branch = req.params.branch;

      const cacheKey = `${owner}-${repo}-${branch}`;
      const cachedData = githubCache.get(cacheKey);

      if (cachedData) {
        res.json(cachedData);
      } else {
        const octokit = octokitMain(req.user.githubAccessToken);
        const response = await octokit.request(
          "GET /repos/:owner/:repo/branches/:branch",
          {
            owner,
            repo,
            branch,
          }
        );
        const branchResponse = response.data;

        githubCache.set(cacheKey, { branch: branchResponse }, 1800);

        res.json({
          branch: branchResponse,
        });
      }
    } catch (error) {
      console.log("Error in average route", error);
      next(error);
    }
  }
);

module.exports = router;
