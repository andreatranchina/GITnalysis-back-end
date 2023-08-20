const { route } = require("./collaborators");

const router = require("express").Router();

//Mounted on /api --> require needed routes from other files here
//example : router.use('/user', require("./user"));

router.use("/lead_time", require("./lead_time"));
router.use("/commits", require("./commits"));
router.use("/branches", require("./branches"));
router.use("/collaborators", require("./collaborators"));
router.use("/users", require("./users"));
router.use("/issues", require("./issues"));
router.use("/deployments", require("./deployments"));
router.use("/repos", require("./repos"));
router.use("/pull-requests", require("./pullRequests"));
router.use("/forks", require("./forks"));
router.use("/notifications", require("./notifications"));
router.use("/stars", require("./stars"));

//404 Handling
router.use((req, res, next) => {
  const error = new Error("404 Not Found in ./api");
  error.status = 404;
  next(error);
});

module.exports = router;
