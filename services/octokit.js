const {Octokit}=require('@octokit/rest')

const octokit = new Octokit({ 
    userAgent: {"User-Agent": "GITNALYSIS/1.0"},
    auth: process.env.GITHUB_TOKEN 
});

module.exports = octokit;