const router = require("express").Router();
const octokitMain = require("../services/octokit");
const autheticateUser = require("../middleware/auth");
// mounted on: "http://localhost:8080/api/deployments"

//note: the following routes still cannot be fully checkes as no deployments have been made yet

//get the total number of deployments linked to a repo
router.get(
  "/:owner/:repo/count/getNum",
  autheticateUser,
  async (req, res, next) => {
    try {
      const owner = req.params.owner;
      const repo = req.params.repo;

      const octokit = octokitMain(req.user.githubAccessToken);
      const response = await octokit.paginate(
        "GET /repos/:owner/:repo/deployments",
        {
          owner,
          repo,
          per_page: 100,
        }
      );
      const allDeployments = response;

      res.json({
        numDeployments: allDeployments.length,
      });
    } catch (error) {
      console.log("Error in retrieving num of deployments", error);
      next(error);
    }
  }
);

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
  autheticateUser,
  async (req, res, next) => {
    try {
      const owner = req.params.owner;
      const repo = req.params.repo;
      const timeRange = req.params.timeRange;

      const octokit = octokitMain(req.user.githubAccessToken);
      const response = await octokit.paginate(
        "GET /repos/:owner/:repo/deployments",
        {
          owner,
          repo,
          per_page: 100,
        }
      );

      const allDeployments = response;

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
      console.log("Error in retrieving deployment frequency", error);
      next(error);
    }
  }
);

async function calculateCFR(owner, repo, accesstoken) {
  try {
    const octokit = octokitMain(accesstoken);
    const deploymentsResponse = await octokit.paginate(
      "GET /repos/:owner/:repo/deployments",
      {
        owner,
        repo,
        per_page: 100,
      }
    );
    const deployments = deploymentsResponse;

    const failedDeployments = [];

    // iterate through deployments and get their statuses
    for (const deployment of deployments) {
      const octokit = octokitMain(accesstoken);
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
router.get("/:owner/:repo/cfr", autheticateUser, async (req, res) => {
  const owner = req.params.owner;
  const repo = req.params.repo;

  try {
    const cfr = await calculateCFR(owner, repo, req.user.githubAccessToken);
    res.json(cfr)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while calculating CFR." });
  }
});

// Define a route to calculate MTTR for a given repository
router.get("/:owner/:repo/mttr", autheticateUser, async (req, res) => {
  try {
    const octokit = octokitMain(req.user.githubAccessToken);
    const { owner, repo } = req.params;

    // Fetch deployment statuses for the specified repository
    const response = await octokit.repos.listDeploymentStatuses(
      "GET /repos/:owner/:repo/deployments",
      {
        owner,
        repo,
        per_page: 82,
      }
    );
    const deployments = response;

    // Return an error if no deployments are found
    if (!deployments || !deployments.data) {
      return res.status(404).send("No deployments found for the repository.");
    }

    // Sort deployments by creation date
    deployments.data.sort((a, b) => {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    // Initialize arrays to store MTTR data and all statuses
    const mttrData = [];
    const allStatuses = [];

    // Iterate through each deployment to fetch and sort its statuses
    for (let deployment of deployments.data) {
      const { statuses_url } = deployment;

      // Fetch deployment statuses
      const statusesResponse = await octokit.request(statuses_url, {
        method: "GET",
      });

      // Sort statuses by creation date
      const sortedStatuses = [...statusesResponse.data].sort((a, b) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      // Add sorted statuses to the array all statuses
      allStatuses.push(...sortedStatuses);

      // console.log("status", sortedStatuses);
    }

    // Loop through all statuses to detect failures and subsequent recoveries
    for (let i = 0; i < allStatuses.length - 1; i++) {
      const currentStatus = allStatuses[i].state;
      // console.log("curr Status", currentStatus);
      const nextStatus = allStatuses[i + 1].state;
      // console.log("next Status", nextStatus);

      // If a failure is followed by a success, calculate the time difference
      if (currentStatus === "failure" && nextStatus === "success") {
        const failedAt = new Date(allStatuses[i].created_at).getTime();
        const restoredAt = new Date(allStatuses[i + 1].created_at).getTime();

        const restoreTime = restoredAt - failedAt;
        mttrData.push(restoreTime);
      }
    }

    // Calculate the average recovery time from all recovery periods
    const totalRestoreTime = mttrData.reduce((acc, time) => acc + time, 0);
    console.log(mttrData.length);

    // Handle the scenario when no recoveries are found
    if (mttrData.length === 0) {
      return res.status(400).send("No recoveries found to calculate MTTR.");
    }

    // Calculate MTTR
    const mttr = totalRestoreTime / mttrData.length;
    console.log(mttr);

    // Return MTTR value in hours
    res.json({ mttr: parseFloat((mttr / (1000 * 60 * 60)).toFixed(2)) });
  } catch (error) {
    console.error("Error calculating MTTR for deployments:", error);
  }
});


module.exports = router;
