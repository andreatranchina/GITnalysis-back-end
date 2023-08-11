const router = require("express").Router();
const octokit = require("../services/octokit");

// mounted on: "http://localhost:8080/api/deployments"

//note: the following routes still cannot be fully checkes as no deployments have been made yet

//get the total number of deployments linked to a repo
router.get("/:owner/:repo/count/getNum", async (req, res, next) => {
  try {
    const owner = req.params.owner;
    const repo = req.params.repo;

    const response = await octokit.request(
      "GET /repos/:owner/:repo/deployments",
      {
        owner,
        repo,
      }
    );
    const allDeployments = response.data;

    res.json({
      numDeployments: allDeployments.length,
    });
  } catch (error) {
    console.log("Error in average route", error);
    next(error);
  }
});

//get the total number of deployments linked to a repo over the past week or month
//note:  param timeRange should be strings: pastDay, pastWeek, pastMonth OR pastYear
// returns object ex:
// {
//     "numDeploymentsInRange": 2,
//     "deploymentFrequency": 0.06666666666666667,
//     "deploymentsPerDayObject": {
//         "2023-07-31": 2
//     },
//     "fromDate": "2023-07-12T04:06:26.263Z",
//     "toDate": "2023-08-11T04:06:26.263Z"
// }
router.get(
  "/:owner/:repo/deploymentFrequency/:timeRange",
  async (req, res, next) => {
    try {
      const owner = req.params.owner;
      const repo = req.params.repo;
      const timeRange = req.params.timeRange;

      const response = await octokit.request(
        "GET /repos/:owner/:repo/deployments",
        {
          owner,
          repo,
        }
      );

      const allDeployments = response.data;

      const currentDate = new Date();
      const fromDate = new Date();
      let daysAgo = null;

      timeRange === "pastDay"
        ? (daysAgo = 1)
        : timeRange === "pastWeek"
        ? (daysAgo = 7)
        : timeRange === "pastMonth"
        ? (daysAgo = 30)
        : timeRange === "pastYear"
        ? (daysAgo = 365)
        : null;

      fromDate.setDate(currentDate.getDate() - daysAgo);
      console.log(fromDate);

      //filtering the data array based on the date range

      const filteredDeployments = allDeployments.filter(
        (deployment) =>
          new Date(deployment.created_at) >= fromDate &&
          new Date(deployment.created_at) <= currentDate
      );

      const deploymentsPerDayObject = {};

      filteredDeployments.map((deployment) => {
        const deploymentDate = new Date(deployment.created_at); //formatted as a dateTime, need to get only date
        const year = deploymentDate.getFullYear();
        const month = deploymentDate.getMonth() + 1; // Months are zero-based, so add 1
        const day = deploymentDate.getDate();
        const formattedDate = `${year}-${month
          .toString()
          .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        if (formattedDate in deploymentsPerDayObject) {
          deploymentsPerDayObject[formattedDate]++;
        } else {
          deploymentsPerDayObject[formattedDate] = 1;
        }
      });

      // res.json(filteredDeployments);
      res.json({
        numDeploymentsInRange: filteredDeployments.length,
        deploymentFrequency: filteredDeployments.length / daysAgo,
        deploymentsPerDayObject,
        fromDate,
        toDate: currentDate,
      });
    } catch (error) {
      console.log("Error in average route", error);
      next(error);
    }
  }
);

async function calculateCFR(owner, repo) {
  try {
    const deploymentsResponse = await octokit.request(
      "GET /repos/:owner/:repo/deployments",
      {
        owner,
        repo,
      }
    );
    const deployments = deploymentsResponse.data;

    const failedDeployments = [];

    // iterate through deployments and get their statuses
    for (const deployment of deployments) {
      const deploymentStatuses = await octokit.repos.listDeploymentStatuses({
        owner: owner,
        repo: repo,
        deployment_id: deployment.id,
      });

      const hasFailedStatus = deploymentStatuses.data.some(
        (status) => status.state === "failure"
      );

      if (hasFailedStatus) {
        failedDeployments.push(deployment);
      }
    }

    // calculate CFR: (failed deployments / total deployments) * 100 %
    const totalDeployments = deployments.length;

    if (totalDeployments === 0) {
      return "No deployments available.";
    }

    const totalFailedDeployments = failedDeployments.length;

    const cfr = (totalFailedDeployments / totalDeployments) * 100;

    // returns CFR with two decimal places
    return cfr.toFixed(2);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// route to get Change Failure Rate (CFR)
router.get("/:owner/:repo/cfr", async (req, res) => {
  const owner = req.params.owner;
  const repo = req.params.repo;

  try {
    const cfr = await calculateCFR(owner, repo);
    res.json({ cfr: cfr + "%" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while calculating CFR." });
  }
});

module.exports = router;
