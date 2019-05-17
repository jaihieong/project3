//Will handle registering users, adding users
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require ("../../models/User");

// @route  POST api/users
// @desc   Register user
// @access Public (don't need a token)
// We want to validate the input and report any errors before creating the user, so add 2nd parameter as middleware
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include the valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    //console.log(req.body);

    //Distructuring: req.body.name => name 
    const { name, email, password } = req.body;

    try {
        // See if user exists => send back error
        let user = await User.findOne({ email: email });

        if(user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }] });
        }
        // Get users gravatar based on its email
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        });

        //Create an instance of new user, not save yet
        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt password using bcrypt        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //Save user to DB
        await user.save();

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
            { expiresIn: 3600000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            } 
        );

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server error");
    }

  }
);
// router.get("/", (req, res) => {
//     res.send("User route");
// });

module.exports = router;
