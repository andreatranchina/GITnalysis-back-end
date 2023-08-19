const router = require("express").Router();
const octokitMain = require("../services/octokit");
const authenticateUser = require("../middleware/auth");
const { calcTimeAgo } = require("../services/helperFunctions");

// mounted on : http://localhost:8080/api/repos

//get a repository
router.get(
  "/:owner/:repo/getRepo",
  authenticateUser,
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const octokit = octokitMain(req.user.githubAccessToken);
      const response = await octokit.request("GET /repos/:owner/:repo", {
        owner,
        repo,
      });
      const repoData = response.data;

      res.json({
        repoData,
      });
    } catch (error) {
      console.log("Error in retrieving repo", error);
      next(error);
    }
  }
);

//list repository activities (notifications for speciic repository)
// ex response:
// {
//     "repoActivityArray": [
//         {
//             "activityType": "pr_merge",
//             "timeAgo": "4 hours ago",
//             "userName": "andreatranchina",
//             "userAvatar": "https://avatars.githubusercontent.com/u/105296511?v=4"
//         },
//         {
//             "activityType": "push",
//             "timeAgo": "5 hours ago",
//             "userName": "shoaibashfaq",
//             "userAvatar": "https://avatars.githubusercontent.com/u/85181888?v=4"
//         },
//         {
//             "activityType": "branch_creation",
//             "timeAgo": "16 hours ago",
//             "userName": "andreatranchina",
//             "userAvatar": "https://avatars.githubusercontent.com/u/105296511?v=4"
//         },
//         {
//             "activityType": "branch_deletion",
//             "timeAgo": "22 hours ago",
//             "userName": "shoaibashfaq",
//             "userAvatar": "https://avatars.githubusercontent.com/u/85181888?v=4"
//         },
//     ]
// }
router.get(
  "/:owner/:repo/getActivity/:timePeriod",
  authenticateUser,
  async (req, res, next) => {
    //NOTE timePeriod param should be = "day" or "week" or "month" or "quarter" or "year"
    try {
      const { owner, repo, timePeriod } = req.params;
      const octokit = octokitMain(req.user.githubAccessToken);
      const response = await octokit.paginate(
        "GET /repos/:owner/:repo/activity?time_period=:timePeriod",
        {
          owner,
          repo,
          timePeriod,
          per_page: 100,
        }
      );
      const repoActivityData = response;

      let repoActivityArray = [];

      for (const repoActivity of repoActivityData) {
        const timeAgo = calcTimeAgo(new Date(repoActivity.timestamp));

        repoActivityArray.push({
          activityType: repoActivity.activity_type,
          // activityTime: repoActivity.timestamp,
          timeAgo: timeAgo,
          userName: repoActivity.actor.login,
          userAvatar: repoActivity.actor.avatar_url,
        });
      }

      res.json({
        repoActivityArray,
      });
    } catch (error) {
      console.log("Error in retrieving repo activity", error);
      next(error);
    }
  }
);

/* recursively travels through directories in given repo to calculate
 * overall comment-per-code ratio
 */
router.get(
  "/comments-per-code/:owner/:repo",
  authenticateUser,
  async (req, res) => {
    try {
      const owner = req.params.owner;
      const repo = req.params.repo;
      const octokit = octokitMain(req.user.githubAccessToken);

      const calculateCommentsPerCode = async (path) => {
        const contentsResponse = await octokit.repos.getContent({
          owner: owner,
          repo: repo,
          path: path,
        });

        let totalLinesOfCode = 0;
        let totalLinesOfComments = 0;

        for (const content of contentsResponse.data) {
          const fileExtensionRegex = /\.(js|py|java|cpp|php|html|css|rb|jsx)$/i;
          if (
            content.type === "file" &&
            fileExtensionRegex.test(content.name)
          ) {
            const fileContent = await octokit.request(
              "GET /repos/:owner/:repo/contents/:path",
              {
                owner: owner,
                repo: repo,
                path: content.path,
              }
            );

            const codeAndComments = getCodeAndComments(
              fileContent.data.content
            );
            totalLinesOfCode += codeAndComments.linesOfCode;
            totalLinesOfComments += codeAndComments.linesOfComments;
          } else if (content.type === "dir") {
            const dirMetrics = await calculateCommentsPerCode(content.path);
            totalLinesOfCode += dirMetrics.linesOfCode;
            totalLinesOfComments += dirMetrics.linesOfComments;
          }
        }

        return {
          linesOfCode: totalLinesOfCode,
          linesOfComments: totalLinesOfComments,
        };
      };

      const result = await calculateCommentsPerCode("");
      const commentsPerCodeRatio = result.linesOfComments / result.linesOfCode;

      res.json({
        totalLinesOfCode: result.linesOfCode,
        totalLinesOfComments: result.linesOfComments,
        commentsPerCodeRatio: commentsPerCodeRatio.toFixed(2),
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

// extract lines of code and lines of comments from file content
function getCodeAndComments(content) {
  // decode base64-encoded content
  const decodedContent = Buffer.from(content, "base64").toString("utf-8");
  const lines = decodedContent.split("\n");
  let linesOfCode = 0;
  let linesOfComments = 0;
  let insideCommentBlock = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("//")) {
      linesOfComments++;
    }

    if (trimmedLine.startsWith("/*") || trimmedLine.startsWith("<!--")) {
      insideCommentBlock = true;
    }

    if (insideCommentBlock) {
      linesOfComments++;
    } else if (trimmedLine.length > 0 && !trimmedLine.startsWith("//")) {
      linesOfCode++;
    }

    if (trimmedLine.endsWith("*/") || trimmedLine.endsWith("-->")) {
      insideCommentBlock = false;
    }
  }

  return {
    linesOfCode: linesOfCode,
    linesOfComments: linesOfComments,
  };
}

module.exports = router;
