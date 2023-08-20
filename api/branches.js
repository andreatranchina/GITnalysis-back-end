const router=require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser= require("../middleware/auth")
// mounted on : http://localhost:8080/api/branches
//note: do not need auth for these routes

//get all branches linke to a repo (all branch data including name)
router.get("/:owner/:repo",authenticateUser,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        
        const octokit =  octokitMain(req.user.githubAccessToken)
        // const response = await octokit.request('GET /repos/:owner/:repo/branches', {
        //     owner,
        //     repo
        // });
        // const all_branches=response.data
        const response = await octokit.paginate('GET /repos/:owner/:repo/branches', {
            owner,
            repo,
            per_page: 100,
        });
        const all_branches=response
        
        res.json({
            branches:all_branches
        });
    } catch (error) {
        console.log("Error in retrieving branches",error)
        next(error);
    }
    
})

//get number of branches (count) linked to a repo
router.get("/count/:owner/:repo",authenticateUser,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.paginate('GET /repos/:owner/:repo/branches', {
            owner,
            repo,
            per_page: 100,
        });
        const all_branches=response
        
        res.json({
            branches:all_branches.length
        });
    } catch (error) {
        console.log("Error in retrieving num of branches",error)
        next(error);
    }
    
})

//get all data for an individual branch linked to a repo
router.get("/singleBranch/:owner/:repo/:branch",authenticateUser,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        const branch = req.params.branch
        
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /repos/:owner/:repo/branches/:branch', {
            owner,
            repo,
            branch
        });
        const branchResponse = response.data
        
        res.json({
            branch:branchResponse
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})

module.exports=router