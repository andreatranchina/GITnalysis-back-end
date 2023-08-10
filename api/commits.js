const router=require("express").Router();
const octokit = require("../services/octokit");

// mounted on: "http://localhost:8080/api/commits"
// note: do not need auth for these routes

router.get("/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const response = await octokit.request('GET /repos/:owner/:repo/commits', {
            owner,
            repo
        });
        const all_commits=response.data
        
        res.json(
            all_commits
        );
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})

router.get("/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const response = await octokit.request('GET /repos/:owner/:repo/commits', {
            owner,
            repo
        });
        const all_commits=response.data
        
        res.json({
            commits:all_commits.length
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})






module.exports=router