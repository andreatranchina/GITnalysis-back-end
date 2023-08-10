const router=require("express").Router();
const octokit = require("../services/octokit");

//mounted on: http://localhost:8080/api/lead_time
//note: do not need auth for these routes

router.get("/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const response = await octokit.request('GET /repos/:owner/:repo/pulls?state=closed', {
            owner,
            repo
        });
        const closed_PRs=response.data
        let time_taken=closed_PRs.map((item)=>{
            //if the PR was resolved by a merge request
            if (item.merged_at){
                const created_date=new Date(item.created_at)
                const merged_at= new Date(item.merged_at)
                const time_taken=merged_at-created_date;
                return time_taken
            }
            return 0
        })
        //filtering out the times for PRs that were not closed via merge
        time_taken=time_taken.filter((item)=>item!==0)
        const sum=time_taken.reduce((item,acc)=>{
            return acc+item
        },0)
        
        const average=formatMilliseconds(sum/time_taken.length);
        res.json({average_lead_time:average});
    } catch (error) {
        console.log("Error in lead_time route",error)
        next(error);
    }
    
})


function formatMilliseconds(milliseconds) {
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerHour = 60 * 60 * 1000;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    const days = Math.floor(milliseconds / millisecondsPerDay);
    milliseconds %= millisecondsPerDay;

    const hours = Math.floor(milliseconds / millisecondsPerHour);
    milliseconds %= millisecondsPerHour;

    const minutes = Math.floor(milliseconds / millisecondsPerMinute);
    milliseconds %= millisecondsPerMinute;

    const seconds = Math.floor(milliseconds / millisecondsPerSecond);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

module.exports=router