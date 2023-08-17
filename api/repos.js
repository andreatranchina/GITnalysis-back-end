const router = require("express").Router();
const octokitMain = require("../services/octokit");
const autheticateUser= require("../middleware/auth");
const authenticateUser = require("../middleware/auth");

// mounted on : http://localhost:8080/api/repositories

//get a repository
router.get("/:owner/:repo/getRepo",async(req,res,next)=>{
    try {
        const { owner, repo } = req.params;
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /repos/:owner/:repo', {
            owner,
            repo
        });
        const repoData = response.data
        
        res.json({
            repoData
        });
    } catch (error) {
        console.log("Error in retrieving repo",error)
        next(error);
    }

})

//list repository activities (notifications for speciic repository)
// ex response: 
// {
//     "repoActivityArray": [
//         {
//             "activityType": "pr_merge",
//             "activityTime": "2023-08-11T15:36:26Z",
//             "userName": "andreatranchina",
//             "userAvatar": "https://avatars.githubusercontent.com/u/105296511?v=4"
//         },
//         {
//             "activityType": "branch_creation",
//             "activityTime": "2023-08-11T12:03:29Z",
//             "userName": "RasulNekzad",
//             "userAvatar": "https://avatars.githubusercontent.com/u/96890866?v=4"
//         },
//     ]
// }        
router.get("/:owner/:repo/getActivity/:timePeriod",authenticateUser,async(req,res,next)=>{

    //NOTE timePeriod param should be = "day" or "week" or "month" or "quarter" or "year"
    try {
        const { owner, repo, timePeriod } = req.params;
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /repos/:owner/:repo/activity?time_period=:timePeriod', {
            owner,
            repo,
            timePeriod,
        });
        const repoActivityData = response.data

        let repoActivityArray = [];

        for (const repoActivity of repoActivityData) {
            repoActivityArray.push({
                activityType: repoActivity.activity_type,
                activityTime: repoActivity.timestamp,
                userName: repoActivity.actor.login,
                userAvatar: repoActivity.actor.avatar_url,
            })
        }
        
        res.json({
            repoActivityArray
        });
    } catch (error) {
        console.log("Error in retrieving repo activity",error)
        next(error);
    }

})


module.exports=router;
