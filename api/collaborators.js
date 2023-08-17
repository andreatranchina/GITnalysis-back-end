const router=require("express").Router();
const octokitMain = require("../services/octokit");
const autheticateUser= require("../middleware/auth")

// mounted on: http://localhost:8080/api/collaborators"

// 
//get all collaborators for a given repo
router.get("/:owner/:repo",autheticateUser,async(req,res,next)=>{
    try {
        //we still want the frontend to send the owner and the repo
        const owner=req.params.owner
        const repo=req.params.repo

        //extracting the accesstoken from the req and setting up the octokit header
        const octokit =  octokitMain(req.user.githubAccessToken)
        
       
        const response = await octokit.request('GET /repos/:owner/:repo/collaborators', {
            owner,
            repo
        });
        const collaborators=response.data
        
        res.json({
            collaborators
        });
    } catch (error) {
        console.log("Error in retrieving collaborators",error)
        next(error);
    }
})

//get number of collaborators for a give repo
router.get("/count/:owner/:repo",autheticateUser,async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
        
        const octokit =  octokitMain(req.user.githubAccessToken)

        const response = await octokit.request('GET /repos/:owner/:repo/collaborators', {
            owner,
            repo
        });
        
        const collaborators=response.data

        const numCollaborators = response.data.length
        
        res.json({
            numCollaborators
        });
    } catch (error) {
        console.log("Error in retrieving num of collaborators",error)
        next(error);
    }
})

// router.post("/:owner/:repo",async(req,res,next)=>{
//     try {
//         const owner = req.params.owner;
//         const repo = req.params.repo;

//         const username = req.body;

//         console.log(username);

//         const response = await octokit.request('PUT /repos/:owner/:repo/collaborators/:username', {
//             owner,
//             repo,
//             username,
//             permission: "admin",
//         });
        
//         res.json(response.data);
//     } catch (error) {
//         console.log("Error in average route",error)
//         next(error);
//     }
// })

// router.delete("/:owner/:repo",async(req,res,next)=>{
//     try {
//         const owner = req.params.owner;
//         const repo = req.params.repo;

//         const username = req.body;

//         const response = await octokit.request('PUT /repos/:owner/:repo/collaborators/:username', {
//             owner,
//             repo,
//             username,

//         });
        
//         res.json(response.data);
//     } catch (error) {
//         console.log("Error in average route",error)
//         next(error);
//     }
// })

module.exports=router