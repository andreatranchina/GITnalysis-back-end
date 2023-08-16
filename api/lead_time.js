const router=require("express").Router();
const octokitMain = require("../services/octokit");
const authenticate=require("../middleware/auth")
//mounted on: http://localhost:8080/api/lead_time
//note: do not need auth for these routes

router.get("/:owner/:repo",authenticate,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        const octokit= octokitMain(req.user.githubAccessToken)
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

router.get("/running_average/:owner/:repo",authenticate,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        const octokit= octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /repos/:owner/:repo/pulls?state=closed', {
            owner,
            repo
        });
        const closed_PRs=response.data
    
        let sum=0
        const running_average=[];
        let count=1
        for (let i=0;i<closed_PRs.length;i++){
            let item=closed_PRs[i];
            if (item.merged_at){
                const created_date=new Date(item.created_at)
                const merged_at= new Date(item.merged_at)
                const time_taken=merged_at-created_date;
                sum+=time_taken;
                const average= formatMilliseconds(sum/(count))
                running_average.push({merged_at,average})
                count++
            }
        }
        res.json(running_average)
    } catch (error) {
        console.log("Error in lead_time/running_average route",error)
        next(error);
    }
})
    

// router.get("/running_average/:owner/:repo",async(req,res,next)=>{
//     try {
//         const owner = req.params.owner;
//         const repo = req.params.repo;
//         const octokit= octokitMain()
//         const response = await octokit.request('GET /repos/:owner/:repo/pulls?state=closed', {
//             owner,
//             repo
//         });
//         const closed_PRs=response.data
//         // let time_taken=closed_PRs.map((item)=>{
//         //     //if the PR was resolved by a merge request
//         //     if (item.merged_at){
//         //         const created_date=new Date(item.created_at)
//         //         const merged_at= new Date(item.merged_at)
//         //         const time_taken=merged_at-created_date;
//         //         return {merged_at,time_taken}
//         //     }
//         //     return 0
//         // })
//         let sum=0
//         const running_average=[];
//         let count=1
//         for (let i=0;i<closed_PRs.length;i++){
//             let item=closed_PRs[i];
//             if (item.merged_at){
//                 const created_date=new Date(item.created_at)
//                 const merged_at= new Date(item.merged_at)
//                 const time_taken=merged_at-created_date;
//                 sum+=time_taken;
//                 const average= formatMilliseconds(sum/(count))
//                 running_average.push({merged_at,average})
//                 count++
//             }
//         }

//         //filtering out the times for PRs that were not closed via merge
//         // time_taken=time_taken.filter((item)=>item!==0)
        
//         // const sum=time_taken.reduce((item,acc)=>{
//         //     return acc+item
//         // },0)
        
//         // const average=formatMilliseconds(sum/time_taken.length);
//         // res.json({average_lead_time:average});
//         res.json(running_average)
//     } catch (error) {
//         console.log("Error in lead_time route",error)
//         next(error);
//     }
    
// })


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

    let formattedTime = "";
    
    if (days > 0) {
        formattedTime += `${days} days, `;
    }
    if (hours > 0) {
        formattedTime += `${hours} hours, `;
    }
    if (minutes > 0) {
        formattedTime += `${minutes} minutes, `;
    }
    if (seconds > 0) {
        formattedTime += `${seconds} seconds`;
    }
    
    // Remove the trailing comma and space if present
    formattedTime = formattedTime.replace(/,\s*$/, "");

    return formattedTime;
}

console.log(formatMilliseconds(123456789)); // Example usage


module.exports=router