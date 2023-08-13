const {Octokit}=require('@octokit/rest')

module.exports = (access_token)=>{

    //if the method is called with an access token, create an axios header
    return access_token?new Octokit({ 
        userAgent: {"User-Agent": "GITNALYSIS/1.0"},
        auth: access_token 
        //if the method is called without an access_token, return an empty header
    }):new Octokit({ 
        userAgent: {"User-Agent": "GITNALYSIS/1.0"},
    })
    
};