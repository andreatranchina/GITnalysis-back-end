const router = require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser= require("../middleware/auth")
// get all pull requests for repo
router.get("/:owner/:repo",authenticateUser, async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const octokit =  octokitMain(req.user.githubAccessToken)
    const response = await octokit.paginate("GET /repos/:owner/:repo/pulls", {
      owner,
      repo,
      per_page:100,
    });
    const pullRequests = response;

    res.json({
      pullRequests: pullRequests,
    });
  } catch (error) {
    console.log("Error fetching pull requests", error);
    next(error);
  }
});

// get number of pull requests (open, closed, all) linked to repository
// ex:
// reponse object : {
//     openPullRequests: 3,
//     closedPullRequests: 5,
//     allPullRequests: 8
// }
router.get("/:owner/:repo/count/getNum",authenticateUser,async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const octokit =  octokitMain(req.user.githubAccessToken)
    const responseClosed = await octokit.paginate(
      "GET /repos/:owner/:repo/pulls?state=closed",
      {
        owner,
        repo,
        per_page:100,
      }
    );
    const numClosed = responseClosed.length;

    const responseOpen = await octokit.paginate(
      "GET /repos/:owner/:repo/pulls?state=open",
      {
        owner,
        repo,
        per_page: 100,
      }
    );
    const numOpen = responseOpen.length;

    const responseAll = await octokit.paginate(
      "GET /repos/:owner/:repo/pulls?state=all",
      {
        owner,
        repo,
        per_page:100,
      }
    );
    const numAll = responseAll.length;

    res.json({
      pullRequests: {
        numOpen,
        numClosed,
        numAll,
      },
    });
  } catch (error) {
    console.log("Error in retrieving num of pull requests", error);
    next(error);
  }
});

//get merge success rate
router.get("/merge-success-rate/:owner/:repo",authenticateUser, async (req, res) => {
  try {
    const { owner, repo } = req.params;

    // get pull requests
    const octokit =  octokitMain(req.user.githubAccessToken)
    const response = await octokit.paginate("GET /repos/:owner/:repo/pulls", {
      owner: owner,
      repo: repo,
      state: "all",
      per_page: 100,
    });

    const pullRequests = response;
    const totalPullRequests = response.length;
    let successfullyMergedPRs = 0;

    // count successfully merged pull requests
    for (const pullRequest of pullRequests) {
      if (pullRequest.merged_at) {
        successfullyMergedPRs++;
      }
    }

    // calculate merge success rate
    const mergeSuccessRate =
      (successfullyMergedPRs / totalPullRequests) * 100 || 0;

    res.json({
      successfullyMergedPRs: successfullyMergedPRs,
      totalPullRequests: totalPullRequests,
      mergeSuccessRate: mergeSuccessRate.toFixed(2),
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
