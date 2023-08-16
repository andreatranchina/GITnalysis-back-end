const router=require("express").Router();
const octokitMain = require("../services/octokit");
const autheticateUser= require("../middleware/auth");

// mounted on: http://localhost:8080/api/users

//get authenticated user
router.get("/me",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /user');
        res.json(response.data);
    } catch (error) {
        console.log("Error in user/me® route",error)
        next(error);
    }
})

//get user info by username
router.get("/:username",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const username = req.params.username;

        const response = await octokit.request('GET /users/:username', {
            username
        });
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})


//get all followers of the authenticated user
router.get("/me/followers",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /user/followers');
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})


//get list of people followed by the authenticated user
router.get("/me/following",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /user/following');
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//check if a person is followed by the authenticated user
router.get("/me/following/:username",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const username = req.params.username;

        const response = await octokit.request('GET /user/following/:username', {
            username
        });
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//list of followers of a user by username
router.get("/:username/followers",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const username = req.params.username;

        const response = await octokit.request('GET /users/:username/followers', {
            username
        });
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//list of people a user follows
router.get("/:username/following",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const username = req.params.username;

        const response = await octokit.request('GET /users/:username/following', {
            username
        });
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//check if user is following another user
router.get("/:username/following/:targetUser",autheticateUser,async(req,res,next)=>{
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const { username, targetUser } = req.params;

        const response = await octokit.request('GET /users/:username/following/:targetUser', {
            username,
            targetUser
        });
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }
})

//list emails for authenticated user
router.get("/me/emails", autheticateUser,async(req, res, next) => {
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /user/emails');
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})

//list repositories for authenticated user
router.get("/me/repos",autheticateUser, async(req, res, next) => {
    try {
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /user/repos');
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})


//list repositories for of a user by username
router.get("/:username/repos",autheticateUser, async(req, res, next) => {
    try {
        const username = req.params.username;
        const octokit =  octokitMain(req.user.githubAccessToken)
        const response = await octokit.request('GET /users/:username/repos', {
            username
        });
        
        res.json(response.data);
    } catch (error) {
        console.log("Error in average route",error)
        next(error);
    }

})



module.exports=router;