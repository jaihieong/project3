//Will have form where we can have posts, like, comment them
const express = require("express");
const router = express.Router();

// @route  GET api/posts
// @desc   Test Route
// @access Public (don't need a token)
router.get("/", (req, res) => res.send("Posts route"));


module.exports = router;