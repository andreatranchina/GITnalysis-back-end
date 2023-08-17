const router=require("express").Router();
const octokitMain = require("../services/octokit")();
const authenticateUser=require("../middleware/auth")

// mounted on: http://localhost:8080/api/issues

// get number of issues linked to repository
// ex: 
// reponse object : {
    //     openIssues: 3,
    //     closedIssues: 5,
    //     allIssues: 8
    // }
    router.get("/:owner/:repo/count/getNum",authenticateUser,async(req,res,next)=>{
        try {
        const { owner, repo } = req.params;
            
        const octokit =  octokitMain(req.user.githubAccessToken)
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
        const numAll = numOpen + numClosed;
        
        res.json({
            issues: {
                numOpen,
                numClosed,
                numAll
            }
        });
    } catch (error) {
        console.log("Error in retrieving num of issues",error)
        next(error);
    }
})

//get timesline of issues (open/closed/all) over the past month
//ex response object: 
// {
    //     "0 weeks ago": {
        //         "closed": 19,
        //         "open": 3,
        //         "all": 19
        //     },
        //     "1 weeks ago": {
            //         "all": 0,
            //         "closed": 0,
            //         "open": 0
            //     },
            //     "2 weeks ago": {
                //         "all": 0,
                //         "closed": 0,
                //         "open": 0
                //     },
                //     "3 weeks ago": {
                    //         "all": 0,
                    //         "closed": 0,
                    //         "open": 0
                    //     },
                    //     "4 weeks ago": {
                        //         "all": 0,
                        //         "closed": 0,
                        //         "open": 0
                        //     }
                        // }
                        router.get("/:owner/:repo/timeline/pastMonth",authenticateUser,async(req,res,next)=>{
                            try {
                                const { owner, repo } = req.params;
                                const octokit= octokitMain(req.user.githubAccessToken)
                                const responseAll = await octokit.request('GET /repos/:owner/:repo/issues?state=all', {
                                    owner,
                                    repo,
                                });
                                
                                const toDate = new Date();
                                
                                const issuesPerWeekObject = {
                                    "0 weeks ago" : {},
                                    "1 weeks ago" : {},
                                    "2 weeks ago" : {},
                                    "3 weeks ago" : {},
                                    "4 weeks ago" : {},
                                };
                                let weeksAgo = 0;
                                
                                while (weeksAgo <=  4){
                                    responseAll.data.map(issue => {
                                        issueCreationDate = new Date(issue.created_at);
                                        
                                        if (issueCreationDate <= toDate){
                                            if (issue.state === "closed" && new Date (issue.closed_at) <= toDate ) {
                                                if ("closed" in issuesPerWeekObject[`${weeksAgo} weeks ago`]){
                                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].closed++;
                                                }
                                                else {
                                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].closed = 1;
                                                }
                                            }
                                            else{
                                                if ("open" in issuesPerWeekObject[`${weeksAgo} weeks ago`]){
                                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].open++;
                                                }
                                                else {
                                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].open = 1;
                                                }
                                            }
                                        }
                                        
                                    }) //end map
                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].all = 
                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].closed || 0 + 
                                    issuesPerWeekObject[`${weeksAgo} weeks ago`].open || 0;
                                    
                                    !issuesPerWeekObject[`${weeksAgo} weeks ago`].closed 
                                    ? issuesPerWeekObject[`${weeksAgo} weeks ago`].closed = 0 
                                    : null
                                    
                                    !issuesPerWeekObject[`${weeksAgo} weeks ago`].open 
                                    ? issuesPerWeekObject[`${weeksAgo} weeks ago`].open = 0 
                                    : null
                                    
                                    weeksAgo++;
                                    toDate.setDate(toDate.getDate() - 7);
                                }
                                
                                res.json(issuesPerWeekObject);
                            } catch (error) {
                                console.log("Error in retrieving issue timeline",error)
                                next(error);
                            }
                        })
                        
                        //get timesline of issues (open/closed/all) over the past year
                        router.get("/:owner/:repo/timeline/pastYear",authenticateUser,async(req,res,next)=>{
                            console.log("hit");
                            try {
                                const { owner, repo } = req.params;
                                const octokit= octokitMain(req.user.githubAccessToken)
                                const responseAll = await octokit.request('GET /repos/:owner/:repo/issues?state=all', {
                                    owner,
                                    repo,
                                });
                                
                                const toDate = new Date();
                                
                                const issuesPerMonthObject = {
                                    "0 months ago" : {},
                                    "1 months ago" : {},
                                    "2 months ago" : {},
                                    "3 months ago" : {},
                                    "4 months ago" : {},
                                    "5 months ago" : {},
                                    "6 months ago" : {},
                                    "7 months ago" : {},
            "8 months ago" : {},
            "9 months ago" : {},
            "10 months ago" : {},
            "11 months ago" : {},
            "12 months ago" : {},
        };
        let monthsAgo = 0;

        while (monthsAgo <=  12){
            responseAll.data.map(issue => {
                issueCreationDate = new Date(issue.created_at);
        
                if (issueCreationDate <= toDate){
                    if (issue.state === "closed" && new Date (issue.closed_at) <= toDate ) {
                        if ("closed" in issuesPerMonthObject[`${monthsAgo} months ago`]){
                            issuesPerMonthObject[`${monthsAgo} months ago`].closed++;
                        }
                        else {
                            issuesPerMonthObject[`${monthsAgo} months ago`].closed = 1;
                        }
                    }
                    else{
                        if ("open" in issuesPerMonthObject[`${monthsAgo} months ago`]){
                            issuesPerMonthObject[`${monthsAgo} months ago`].open++;
                        }
                        else {
                            issuesPerMonthObject[`${monthsAgo} months ago`].open = 1;
                        }
                    }
                }

            }) //end map

            issuesPerMonthObject[`${monthsAgo} months ago`].all = 
            issuesPerMonthObject[`${monthsAgo} months ago`].closed || 0
            + issuesPerMonthObject[`${monthsAgo} months ago`].open || 0;

            !issuesPerMonthObject[`${monthsAgo} months ago`].closed 
            ? issuesPerMonthObject[`${monthsAgo} months ago`].closed = 0 
            : null

            !issuesPerMonthObject[`${monthsAgo} months ago`].open 
            ? issuesPerMonthObject[`${monthsAgo} months ago`].open = 0 
            : null

            monthsAgo++;
            toDate.setDate(toDate.getDate() - 30);
        }
        
        res.json(issuesPerMonthObject);

    } catch (error) {
        console.log("Error in retrieving issue timeline",error)
        next(error);
    }
})

//get timeline of issues (open/closed/all) of issues over past week
router.get("/:owner/:repo/timeline/pastWeek",authenticateUser,async(req,res,next)=>{
    try {
        const { owner, repo } = req.params;
        const octokit =  octokitMain(req.user.githubAccessToken)
        const responseAll = await octokit.request('GET /repos/:owner/:repo/issues?state=all', {
            owner,
            repo,
        });

        const toDate = new Date();
        console.log(toDate);

        const issuesPerDayObject = {
            "0 days ago" : {},
            "1 days ago" : {},
            "2 days ago" : {},
            "3 days ago" : {},
            "4 days ago" : {},
            "5 days ago" : {},
            "6 days ago" : {},
            "7 days ago" : {},
        };

        let daysAgo = 0;

        while (daysAgo <=  7){
            responseAll.data.map(issue => {
                issueCreationDate = new Date(issue.created_at);
        
                if (issueCreationDate <= toDate){
                    if (issue.state === "closed" && new Date (issue.closed_at) <= toDate ) {
                        if ("closed" in issuesPerDayObject[`${daysAgo} days ago`]){
                            issuesPerDayObject[`${daysAgo} days ago`].closed++;
                        }
                        else {
                            issuesPerDayObject[`${daysAgo} days ago`].closed = 1;
                        }
                    }
                    else{
                        if ("open" in issuesPerDayObject[`${daysAgo} days ago`]){
                            issuesPerDayObject[`${daysAgo} days ago`].open++;
                        }
                        else {
                            issuesPerDayObject[`${daysAgo} days ago`].open = 1;
                        }
                    }
                }

            }) //end map
            issuesPerDayObject[`${daysAgo} days ago`].all = 
            issuesPerDayObject[`${daysAgo} days ago`].closed || 0 + 
            issuesPerDayObject[`${daysAgo} days ago`].open || 0;

            !issuesPerDayObject[`${daysAgo} days ago`].closed 
            ? issuesPerDayObject[`${daysAgo} days ago`].closed = 0 
            : null

            !issuesPerDayObject[`${daysAgo} days ago`].open 
            ? issuesPerDayObject[`${daysAgo} days ago`].open = 0 
            : null

            daysAgo++;
            toDate.setDate(toDate.getDate() - 1);
            console.log(toDate);
        }
        
        res.json(issuesPerDayObject);

    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//get list of repository issues --> can also get count from this by just taking length
// note: state = open, closed, OR all
router.get("/:owner/:repo/:state",authenticateUser,async(req,res,next)=>{
    try {
        const { owner, repo, state } = req.params;
        const octokit =  octokitMain(req.user.githubAccessToken)
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
        console.log("Error in retrieving issue timeline",error)
        next(error);
    }
})


router.get("/:owner/:repo/events/getEvents",async(req,res,next)=>{
    try {
        const { owner, repo, state } = req.params;
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /repos/:owner/:repo/issues/events', {
            owner,
            repo,
            state
        });
        const allEvents=response.data
        
        res.json({
            allEvents
        });
    } catch (error) {
        console.log("Error in retrieving events",error)
        next(error);
    }
})

module.exports=router
