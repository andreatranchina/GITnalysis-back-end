const router = require("express").Router();
const octokit = require("../services/octokit");

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
