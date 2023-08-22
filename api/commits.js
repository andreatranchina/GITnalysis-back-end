const router=require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser= require("../middleware/auth");
const { all } = require("axios");
// mounted on: "http://localhost:8080/api/commits"
// note: do not need auth for these routes

//get commits to a repo
router.get("/:owner/:repo",authenticateUser,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;

        const octokit =  octokitMain(req.user.githubAccessToken)
        const all_commits = await octokit.paginate('GET /repos/:owner/:repo/commits', {
            owner,
            repo,
            per_page: 100
        });
        res.json(
            all_commits
        );
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})

//get num of commits on a repo and todays commits
router.get("/count/:owner/:repo",authenticateUser,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        /*  when you use octokit.paginate, 
        it returns the concatenated results directly and doesn't nest them under a data property like a typical octokit request.
        So response.data doesn't exist, We can extract the length of every commit received
        from the paginated request by using const all_commits directly,
        and this should provide us with the right count for the repository.
        */
        const octokit =  octokitMain(req.user.githubAccessToken)
        const all_commits = await octokit.paginate('GET /repos/:owner/:repo/commits', {
            owner,
            repo,
            per_page: 100
        });

        const all_commits_copy = all_commits;

        yesterdaysDateTime = new Date();
        yesterdaysDateTime.setDate(yesterdaysDateTime.getDate()-1);

        todays_commits = [];
        all_commits_copy.map(commit => {
            const commitDate = new Date(commit.commit.author.date);
            commitDate >= yesterdaysDateTime && todays_commits.push(commit);
        })
        
        res.json({
            commits:all_commits.length,
            todaysCommits:todays_commits.length,
        });
    } catch (error) {
        console.log("Error in commit count route",error)
        next(error);
    }

})


// The following route will return a map that would contain the number of commits
// added to a repo on a daily basis for now. The timeframe can be changed to
// monthly basis as well. For testing purposes the current timeframe is set to a daily-basis

router.get('/timeline/:owner/:repo/:timeRange',authenticateUser, async (req,res,next) => {
    try {
        const owner = req.params.owner
        const repo = req.params.repo
        const timeRange=req.params.timeRange
        let daysAgo="";
        timeRange === "pastDay"
        ? (daysAgo = 1)
        : timeRange === "pastWeek"
        ? (daysAgo = 7)
        : timeRange === "pastMonth"
        ? (daysAgo = 30)
        : timeRange === "pastYear"
        ? (daysAgo = 365)
        : null;
        
        let today = new Date();
        let sinceDate = new Date(today);
        sinceDate.setDate(today.getDate() - daysAgo);

        let untilDate = new Date(today);

        const octokit =  octokitMain(req.user.githubAccessToken)
        const all_commits = await octokit.paginate(`GET /repos/:owner/:repo/commits?since=${sinceDate.toISOString()}&until=${untilDate.toISOString()}`, {
            owner,
            repo,
            per_page: 100
        })

        // Initializing a map to store commits by Date
        let commitsByDate = new Map()

        //Iterating thru all of the commits and group them by date
        for(currCommit of all_commits){

            const date = new Date(currCommit.commit.author.date)
            const key = date.toISOString().split('T')[0] // extracting the date from --> "2023-08-11T16:29:34Z"

            // Use the following to get a monthly analysis of the commits done in a month

            const year = date.getFullYear()
            const month =  String(date.getMonth() + 1).padStart(2,0) // Months are 0-indexed, so add 1
            // const key = `${year}-${month}`

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