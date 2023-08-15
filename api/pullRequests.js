const router = require("express").Router();
const octokit = require("../services/octokit")();

// get all pull requests for repo
router.get("/:owner/:repo", async (req, res, next) => {
  try {
    const { owner, repo } = req.params;

    const response = await octokit.request("GET /repos/:owner/:repo/pulls", {
      owner,
      repo,
    });
    const pullRequests = response.data;

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
router.get("/:owner/:repo/count/getNum",async(req,res,next)=>{
  try {
      const { owner, repo } = req.params;

      const responseClosed = await octokit.request('GET /repos/:owner/:repo/pulls?state=closed', {
          owner,
          repo,
      });
      const numClosed = responseClosed.data.length;

      const responseOpen = await octokit.request('GET /repos/:owner/:repo/pulls?state=open', {
          owner,
          repo,
      });
      const numOpen = responseOpen.data.length;

      const responseAll = await octokit.request('GET /repos/:owner/:repo/pulls?state=all', {
          owner,
          repo,
      });
      const numAll = responseAll.data.length;
      
      res.json({
          pullRequests: {
              numOpen,
              numClosed,
              numAll
          }
      });
  } catch (error) {
      console.log("Error in retrieving num of pull requests",error)
      next(error);
  }
})

//get merge success rate
router.get("/merge-success-rate/:owner/:repo", async (req, res) => {
  try {
    const { owner, repo } = req.params;

    // get pull requests
    const response = await octokit.request("GET /repos/:owner/:repo/pulls", {
      owner: owner,
      repo: repo,
      state: "all",
    });

    const pullRequests = response.data;
    const totalPullRequests = response.data.length;
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
