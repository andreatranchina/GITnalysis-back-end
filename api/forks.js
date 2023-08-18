const router=require("express").Router();
const octokitMain = require("../services/octokit");
const autheticateUser= require("../middleware/auth")

// mounted on: http://localhost:8080/api/forks"

// 
//get all forks for a given repo
router.get("/:owner/:repo",autheticateUser,async(req,res,next)=>{
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
module.exports=router