const router=require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser= require("../middleware/auth")
const {calcTimeAgo} = require("../services/helperFunctions");

// mounted on: http://localhost:8080/api/forks"

// 
//get all forks for a given repo
router.get("/:owner/:repo",authenticateUser,async(req,res,next)=>{
    try {
        //we still want the frontend to send the owner and the repo
        const owner=req.params.owner
        const repo=req.params.repo

        //extracting the accesstoken from the req and setting up the octokit header
        const octokit =  octokitMain(req.user.githubAccessToken)      
       
        const response = await octokit.paginate('GET /repos/:owner/:repo/forks', {
            owner,
            repo,
            per_page: 100,

        });
        const forks=response
        res.json({
            forks
        });
    } catch (error) {
        console.log("Error in retrieving forks",error)
        next(error);
    }
})

//get more personalized data on forks from your repo
//ex response: 
// {
//     "forks": [
//         {
//             "forkedRepoName": "GITnalysis-back-end",
//             "forkedFullRepoName": "shoaibashfaq/GITnalysis-back-end",
//             "forkedRepoUrl": "https://api.github.com/repos/shoaibashfaq/GITnalysis-back-end",
//             "forkerName": "shoaibashfaq",
//             "forkerVisitGithubUrl": "https://api.github.com/users/shoaibashfaq",
//             "forkerAvatar": "https://avatars.githubusercontent.com/u/85181888?v=4",
//             "forkedtime": "2023-08-15T02:11:09Z",
//             "forkedTimeAgo": "3 days ago"
//         },
//         {
//             "forkedRepoName": "gitnalysis-back-end",
//             "forkedFullRepoName": "itsgivingchaotica/gitnalysis-back-end",
//             "forkedRepoUrl": "https://api.github.com/repos/itsgivingchaotica/gitnalysis-back-end",
//             "forkerName": "itsgivingchaotica",
//             "forkerVisitGithubUrl": "https://api.github.com/users/itsgivingchaotica",
//             "forkerAvatar": "https://avatars.githubusercontent.com/u/91578619?v=4",
//             "forkedtime": "2023-08-14T02:13:51Z",
//             "forkedTimeAgo": "4 days ago"
//         }
//     ]
// }

router.get("/:owner/:repo/personalized",authenticateUser,async(req,res,next)=>{
    try {
        //we still want the frontend to send the owner and the repo
        const owner=req.params.owner
        const repo=req.params.repo

        //extracting the accesstoken from the req and setting up the octokit header
        const octokit =  octokitMain(req.user.githubAccessToken)
        
       
        const response = await octokit.paginate('GET /repos/:owner/:repo/forks', {
            owner,
            repo,
            per_page: 100,

        });
        const forks=response
        const forksArray = [];
        // res.send(response);

        for (const fork of response){
            const timeAgo = calcTimeAgo(new Date (fork.created_at));

            const newFork = {
                forkedRepoName: fork.name,
                forkedFullRepoName: fork.full_name,
                forkedRepoUrl: fork.url,
                forkerName: fork.owner.login,
                forkerVisitGithubUrl: fork.owner.url,
                forkerAvatar: fork.owner.avatar_url,
                forkedtime: fork.created_at,
                forkedTimeAgo: timeAgo,
            }
            forksArray.push(newFork);
        }

        res.json({
            forks: forksArray
        });
    } catch (error) {
        console.log("Error in retrieving forks",error)
        next(error);
    }
})


module.exports=router