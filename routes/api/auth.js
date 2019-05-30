//Will handle jsonwebtoken for authentication
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route  GET api/auth
// @desc   Test Route
// @access Public (don't need a token)
router.get("/", auth, async (req, res) => {
  try {
    //Since it's protected route and we use the token which has the id
    //In our middleware we set req.user to the user in the token, so we pass in req.user
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public (don't need a token)
// We want to validate the input and report any errors before creating the user, so add 2nd parameter as middleware
router.post(
  "/",
  [
    check("email", "Please include the valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //console.log(req.body);

    //Distructuring: req.body.name => name
    const { email, password } = req.body;

    try {
      // See if user exists => send back error
      let user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //We need to match passwords
      // password == req.body.password && user.password == hashed password from DB
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Return jsonwebtoken to be logged in
      const payload = {
        user: {
          id: user.id
        }
      };
      //console.log(payload);

      const privateKey = config.get("jwtSecret");

      jwt.sign(
        payload,
        //config.get("jwtSecret"),
        privateKey,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
