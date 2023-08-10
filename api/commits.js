const router=require("express").Router();
const {Octokit}=require('@octokit/rest')

/**The Full url
 * ("localhost:8080/api/commits")
 */
router.get("/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const octokit = new Octokit({ userAgent: {"User-Agent": "GITNALYSIS/1.0",} });
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