const router=require("express").Router();
const octokit = require("../services/octokit");

// mounted on: "http://localhost:8080/api/deployments"

//note: the following routes still cannot be fully checkes as no deployments have been made yet

//get the total number of deployments linked to a repo
router.get("/:owner/:repo/count/getNum",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const response = await octokit.request('GET /repos/:owner/:repo/deployments', {
            owner,
            repo
        });
        const allDeployments=response.data
        
        res.json({
            numDeployments: allDeployments
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//get the total number of deployments linked to a repo over the past week or month
//note:  param timeRange should be strings: pastDay, pastWeek or pastMonth
// returns object ex:
//  {
//     "numDeploymentsInRange": 2,
//     "deploymentFrequency": 0.005479452054794521,
//     "fromDate": "2022-08-11T01:11:45.409Z",
//     "toDate": "2023-08-11T01:11:45.409Z" 
//  }
router.get("/:owner/:repo/deploymentFrequency/:timeRange",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        const timeRange = req.params.timeRange;
       
        const response = await octokit.request('GET /repos/:owner/:repo/deployments', {
            owner,
            repo
        });

        const allDeployments=response.data

        const currentDate = new Date();
        const fromDate = new Date();
        let daysAgo = null;

        timeRange === "pastDay" 
        ? daysAgo = 1
        : timeRange === "pastWeek"
        ? daysAgo = 7
        : timeRange === "pastMonth"
        ? daysAgo = 30
        : timeRange === "pastYear"
        ? daysAgo = 365
        : null

        fromDate.setDate(currentDate.getDate() - daysAgo);
        console.log(fromDate);

        //filtering the data array based on the date range

        const filteredDeployments = allDeployments.filter(deployment => new Date (deployment.created_at) >= fromDate && new Date(deployment.created_at) <= currentDate);
        res.json({
            numDeploymentsInRange: filteredDeployments.length,
            deploymentFrequency: filteredDeployments.length / daysAgo,
            fromDate,
            toDate: currentDate,
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})



module.exports=router