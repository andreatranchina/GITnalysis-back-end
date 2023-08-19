const router=require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser= require("../middleware/auth")
const {calcTimeAgo} = require("../services/helperFunctions");

// mounted on : http://localhost:8080/api/notifications

//************* */
//following returns notifications from pastWeek, returns 30 per page (should be used with pagination on frontend);

//ex reponse:
// {
//     "notifications": [
//         {
//             "type": "Issue Update",
//             "repo": "GITnalysis-back-end",
//             "actor": "shoaibashfaq",
//             "actorAvatarUrl": "https://avatars.githubusercontent.com/u/85181888?v=4",
//             "title": "Fix pagination for forks",
//             "timeAgo": "4 hours agohelper"
//         },
//         {
//             "type": "Pull Request",
//             "repo": "GITnalysis-back-end",
//             "actorName": "shoaibashfaq",
//             "actorAvatarUrl": "https://avatars.githubusercontent.com/u/85181888?v=4",
//             "title": "Paginates forks endpount to return the most recent 100 forks",
//             "timeAgo": "4 hours agohelper"
//         },
//     ]
// }        
router.get("/:page",authenticateUser,async(req,res,next)=>{
    try {
        const page = req.params.page;

        // Calculate the date for one week ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoISO = oneWeekAgo.toISOString(); // Get the date in ISO 8601 format
        
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /notifications', {
            page: page,
            per_page: 30,
            all: true,
            since: oneWeekAgoISO

        });

        const responseArray = [];
        let actorLogin = null;
        let timeAgo = null;

        for (const notification of response.data){
            switch(notification.subject.type){
                case "PullRequest":
                    const pullRequestResponse = await octokit.request('GET /repos/:owner/:repo/pulls/:pull_number', {
                        owner: notification.repository.owner.login,
                        repo: notification.repository.name,
                        pull_number: notification.subject.url.split('/').pop(),

                    })

                    actorLogin = pullRequestResponse.data.user.login;
                    actorAvatar = pullRequestResponse.data.user.avatar_url;
                    timeAgo = calcTimeAgo(new Date(notification.updated_at));

                    responseArray.push({
                        type: 'Pull Request',
                        repo: notification.repository.name,
                        actorName: actorLogin,
                        actorAvatarUrl: actorAvatar,
                        title: notification.subject.title,
                        timeAgo: timeAgo,
                    });
                    break;

                case "Issue":
                    const issueResponse = await octokit.request('GET /repos/:owner/:repo/issues/:issue_number', {
                        owner: notification.repository.owner.login,
                        repo: notification.repository.name,
                        issue_number: notification.subject.url.split('/').pop(),
                    })
                    actorLogin = issueResponse.data.user.login;
                    actorAvatar = issueResponse.data.user.avatar_url;
                    timeAgo = calcTimeAgo(new Date(notification.updated_at));

                    responseArray.push({
                        type: "Issue Update",
                        repo: notification.repository.name,
                        actor: actorLogin,
                        actorAvatarUrl: actorAvatar,
                        title: notification.subject.title,
                        timeAgo: timeAgo,
                    });
                    break;

                // case "Commit":
                //     // try{
                //         const commitResponse = await octokit.request('GET /repos/:owner/:repo/commits', {
                //             owner: notification.repository.owner.login,
                //             repo: notification.repository.name,
                //             // ref: notification.subject.url.split('/').pop().toString(),
                //         });
                //         res.json(commitResponse);
                //         actorLogin = commitResponse.data.author.login;
                //         actorLogin = commitResponse.data.user.login;
                //         responseArray.push({
                //             type: notification.subject.type,
                //             repo: notification.repository.name,
                //             actor: actorLogin,
                //         });
                //         break;
                    // }
                    // catch(error){
                    //     break;
                    // }

                // case 'Star':
                // case 'Fork':
                // case 'Watching':
                //     // Fetch actor information directly from the notification
                //     actorLogin = notification.actor.login;
                //     responseArray.push({
                //         type: notification.subject.type,
                //         repo: notification.repository,
                //         actor: actorLogin,
                //     });
                    // default:
                    // break;    
        }
    }
        res.json({
            notifications: responseArray,
        });
    } catch (error) {
        console.log("Error in retrieving notifications",error)
        next(error);
    }
    
})

module.exports=router