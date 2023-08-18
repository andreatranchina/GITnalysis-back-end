const router = require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser = require("../middleware/auth");
const {calcTimeAgo} = require("../services/helperFunctions");

// mounted on : http://localhost:8080/api/repos

//get a repository
router.get("/:owner/:repo/getRepo",authenticateUser,async(req,res,next)=>{
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
//             "timeAgo": "4 hours ago",
//             "userName": "andreatranchina",
//             "userAvatar": "https://avatars.githubusercontent.com/u/105296511?v=4"
//         },
//         {
//             "activityType": "push",
//             "timeAgo": "5 hours ago",
//             "userName": "shoaibashfaq",
//             "userAvatar": "https://avatars.githubusercontent.com/u/85181888?v=4"
//         },
//         {
//             "activityType": "branch_creation",
//             "timeAgo": "16 hours ago",
//             "userName": "andreatranchina",
//             "userAvatar": "https://avatars.githubusercontent.com/u/105296511?v=4"
//         },
//         {
//             "activityType": "branch_deletion",
//             "timeAgo": "22 hours ago",
//             "userName": "shoaibashfaq",
//             "userAvatar": "https://avatars.githubusercontent.com/u/85181888?v=4"
//         },
//     ]
// }      
router.get("/:owner/:repo/getActivity/:timePeriod",authenticateUser,async(req,res,next)=>{

    //NOTE timePeriod param should be = "day" or "week" or "month" or "quarter" or "year"
    try {
        const { owner, repo, timePeriod } = req.params;
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.paginate('GET /repos/:owner/:repo/activity?time_period=:timePeriod', {
            owner,
            repo,
            timePeriod,
            per_page: 100,
        });
        const repoActivityData = response

        let repoActivityArray = [];

        for (const repoActivity of repoActivityData) {
            const timeAgo = calcTimeAgo(new Date (repoActivity.timestamp));

            repoActivityArray.push({
                activityType: repoActivity.activity_type,
                // activityTime: repoActivity.timestamp,
                timeAgo: timeAgo,
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
