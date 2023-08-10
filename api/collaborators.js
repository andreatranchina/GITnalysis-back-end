const router=require("express").Router();
const octokit = require("../services/octokit");

// mounted on: http://localhost:8080/api/collaborators"

//get all collaborators for a given repo
router.get("/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
        const response = await octokit.request('GET /repos/:owner/:repo/collaborators', {
            owner,
            repo
        });
        const collaborators=response.data
        
        res.json({
            collaborators
        });
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//get number of collaborators for a give repo
router.get("/count/:owner/:repo",async(req,res,next)=>{
    try {
        const owner = req.params.owner;
        const repo = req.params.repo;
       
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
        console.log("Error in average route",error)
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