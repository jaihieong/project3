//Will have routes and anything to do with profile: fetching, updating, adding them
const express = require("express");
const router = express.Router();

// @route  GET api/profile
// @desc   Test Route
// @access Public (don't need a token)
router.get("/", (req, res) => res.send("Profile route"));


module.exports = router;