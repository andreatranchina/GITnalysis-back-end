const router=require("express").Router();
const {Octokit}=require('@octokit/rest');

// mounted on : ("localhost:8080/api/issues")

// get number of issues linked to repository
// ex: 
// reponse object : {
//     openIssues: 3,
//     closedIssues: 5,
//     allIssues: 8
// }
router.get("/:owner/:repo/count/getNum",async(req,res,next)=>{
    console.log("hit");
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const octokit = new Octokit({ 
            userAgent: {"User-Agent": "GITNALYSIS/1.0"},
            auth: process.env.GITHUB_TOKEN 
        });

        const responseClosed = await octokit.request('GET /repos/:owner/:repo/issues?state=closed', {
            owner,
            repo,
        });
        const numClosed = responseClosed.data.length;

        const responseOpen = await octokit.request('GET /repos/:owner/:repo/issues?state=open', {
            owner,
            repo,
        });
        const numOpen = responseOpen.data.length;

        const responseAll = await octokit.request('GET /repos/:owner/:repo/issues?state=all', {
            owner,
            repo,
        });
        const numAll = responseAll.data.length;
        
        res.json({
            issues: {
                numOpen,
                numClosed,
                numAll
            }
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//get list of repository issues --> can also get count from this by just taking length
// note: state = open, closed, OR all
router.get("/:owner/:repo/:state",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        const state = req.params.state
       
        const octokit = new Octokit({ 
            userAgent: {"User-Agent": "GITNALYSIS/1.0"},
            auth: process.env.GITHUB_TOKEN 
        });
        const response = await octokit.request('GET /repos/:owner/:repo/issues?state=:state', {
            owner,
            repo,
            state
        });
        const allIssues=response.data
        
        res.json({
            issues:allIssues
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})


module.exports=router