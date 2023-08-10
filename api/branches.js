const router=require("express").Router();
const {Octokit}=require('@octokit/rest');

// mounted on : ("localhost:8080/api/branches")

router.get("/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const octokit = new Octokit({ userAgent: {"User-Agent": "GITNALYSIS/1.0",} });
        const response = await octokit.request('GET /repos/:owner/:repo/branches', {
            owner,
            repo
        });
        const all_branches=response.data
        
        res.json({
            branches:all_branches
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})

router.get("/count/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const octokit = new Octokit({ userAgent: {"User-Agent": "GITNALYSIS/1.0",} });
        const response = await octokit.request('GET /repos/:owner/:repo/branches', {
            owner,
            repo
        });
        const all_branches=response.data
        
        res.json({
            branches:all_branches.length
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})




module.exports=router