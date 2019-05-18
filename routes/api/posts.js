const express = require ('express');
const router = express.Router();

// Route = GET api/posts
// Desc  = Test route
// access = public
router.get('/', (req, res) => res.send('Posts route'));


module.exports = router;