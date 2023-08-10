const router = require('express').Router();

//Mounted on /api --> require needed routes from other files here
//example : router.use('/user', require("./user"));


router.use("/lead_time",require("./lead_time"))
router.use("/commits",require("./commits"))

//404 Handling
router.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
})

module.exports = router;