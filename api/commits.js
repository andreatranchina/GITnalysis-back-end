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

router.get("/count/:owner/:repo",async(req,res,next)=>{
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
        console.log("Error in commit count route",error)
        next(error);
    }

})

// The following route will return a map that would contain the number of commits
// added to a repo on a daily basis for now. The timeframe can be changed to
// monthly basis as well. For testing purposes the current timeframe is set to a daily-basis

router.get('/timeline/:owner/:repo', async (req,res,next) => {
    try {
        const owner = req.params.owner
        const repo = req.params.repo
        
        const response = await octokit.request('GET /repos/:owner/:repo/commits', {
            owner,
            repo
        })

        const all_commits = response.data

        // Initializing a map to store commits by Date
        let commitsByDate = new Map()

        //Iterating thru all of the commits and group them by date
        for(currCommit of all_commits){

            const date = new Date(currCommit.commit.author.date)
            // const key = date.toISOString().split('T')[0] // extracting the date from --> "2023-08-11T16:29:34Z"

            // Use the following to get a monthly analysis of the commits done in a month

            const year = date.getFullYear()
            const month =  String(date.getMonth() + 1).padStart(2,0) // Months are 0-indexed, so add 1
            const key = `${year}-${month}`

            if(commitsByDate.has(key)){
                currCommitCount = commitsByDate.get(key)
                commitsByDate.set(key, currCommitCount+1)
            }else{
                commitsByDate.set(key, 1)
            }
        }
        console.log(commitsByDate)

        const resMap = Object.fromEntries(commitsByDate)
        res.json(resMap)

    } catch (error) {
        next(error)
        
    }
})






module.exports=router