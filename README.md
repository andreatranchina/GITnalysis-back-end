# GITnalysis-back-end

# Backend Repository Documentation

[Frontend Repository](https://github.com/hafeefas/Gitnalysis_FE)

## Endpoints

root: https://gitnalysis-back-end-ahjh.onrender.com

### Branches

- `GET /api/branches/:owner/:repo`: Get all branches in a repository

- `GET /api/branches/count/:owner/:repo`: Get the number of branches existing for a repository

- `GET /api/branches//singleBranch/:owner/:repo/:branch`: Get more data on a singular branch of a repository

### Collaborators

- `GET /api/collaborators/:owner/:repo`: Get the collbators of a repository

- `GET /api/collaborators/count/:owner/:repo`: Get the number of collaborators of a repository

### Commits

- `GET /api/commits/:owner/:repo`: Get the commits made to a repository

- `GET /api/commits/count/:owner/:repo`: Get the number of commits made to a repository

- `GET /api/commits/timeline/:owner/:repo/:timeRange`: Get a weekly, monthly or yearly timeline for commits to a repo

### Deployments

- `GET /api/deployments/:owner/:repo/count/getNum`: Get the number of deployments attempts for a repo

- `GET /api/deployments/:owner/:repo/deploymentFrequency/:timeRange`: Get the deployment frequency over a time range

- `/api/deployments/:owner/:repo/cfr`: Get the change failure rate

- `/api/deployments/:owner/:repo/mttr`: Get the MTTR

### Forks

- `GET /api/forks/:owner/:repo`: Get the forks made from a repo

- `GET /api/forks/:owner/:repo/personalized`: Get a more concise and personalized response object for forks made from a repo

### Issues

- `GET /api/issues/:owner/:repo/count/getNum`: Get the number of open and closed issues for a repo

- `GET /api/issues/:owner/:repo/timeline/pastMonth`: Get the timeline of issues for the past month

- `GET /api/issues/:owner/:repo/timeline/pastYear`: Get the timeline of issues for the past year

- `GET /api/issues/:owner/:repo/timeline/pastWeek`: Get the timeline of issues for the past week

- `GET /api/issues/:owner/:repo/:state`: Get all issues of a certain state (all opened, or all closed)

- `GET /api/issues/:owner/:repo/events/getEvents`: Get the events regarding issues
  
### Lead Time

- `GET /api/lead_time/:owner/:repo`: Get the lead time

- `GET /api/lead_time/running_average/:owner/:repo`: Get the running average

### Notifications

- `GET /api/notifications/:page`: Get authenticated user notifications

### Pull Requests

- `GET /api/pull-requests/:owner/:repo`: Get the pull requests made on a repo

- `GET /api/pull-requests/:owner/:repo/count/getNum`: Get the number of open and closed pull requests made on a repo

- `GET /api/pull-requests/merge-success-rate/:owner/:repo`: Get the merge success rate for a repo

### Repos

- `GET /api/repos/:owner/:repo/getRepo`: Get repo data

- `GET /api/repos/:owner/:repo/getRepo/dates`: Get data regarding important dates for repo (such as created at, updated at, created time ago, updates at time ago)

- `GET /api/repos/:owner/:repo/getActivity/:timePeriod`: Get activity timeline (can be week, month, or year)

- `GET /api/repos/comments-per-code/:owner/:repo`: Get comments er code ratio

- `GET /api/repos/:owner/:repo/timeline/pastMonth`:
  
- `GET /api/repos/:owner/:repo/timeline/pastYear`:
  
- `GET /api/repos/:owner/:repo/timeline/pastWeek`:

### Stars

- `GET /api/stars/me/starred`: Get the starred repos by the authenticated user

- `GET /api/stars/:owner/:repo/stargazers`: Get the stargazers of a repo

### Users

- `GET /api/users/me`: Get authenticated user data

- `GET /api/users/:username`: Get user data from username
  
- `GET /api/users/me/followers`: Get authenticated user followers

- `GET /api/users/me/following`: Get the users followed by authenticated user
  
- `GET /api/users/me/following/:username`: Check if authenticated user is following another user

- `GET /api/users/:username/followers`: Get user's followers by username

- `GET /api/users/:username/following`: Get user's followings by username

- `GET /api/users/:username/following/:targetUser`:  Check if a user is following another user

- `GET /api/users/me/emails`: Get user emails

- `GET /api/users/me/repos`: Get authenticated user repos

- `GET /api/users/me/repos/getNum`: Get number of repos owned by authenticaed user

- `GET /api/users/:username/repos`: Get user repos by username
  
- `GET /api/users/getWebsiteUsers/getNum`: Get number of users signed up to website

## Setup Instructions

To set up the backend on your local machine, follow these steps:

1. Install the necessary dependencies using `npm i`.

2. Set up a .env file and use the your own API keys:

`  FRONTEND_URL= 
  BACKEND_URL= 
  GITHUB_CLIENT_ID= 
  GITHUB_CLIENT_SECRET= 
 `

4. Start the server using `npm start`.

5. Create the database and run `node seed.js`.
