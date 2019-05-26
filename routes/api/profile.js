const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator/check");

// Route = GET api/profile/me
// Desc  = Get current users profile
// access = private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

router.post(
  "/",
  [auth],
  [
    check("status", "Status is required")
      .not()
      .isEmpty(),
    check("skills", "Skills is required")
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      testimonials,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedIn
    } = req.body;

    //building profile object

    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (testimonials) profileFields.testimonials = testimonials;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    //building blocks for social objects

    profileFields.social = {};
    if (youtube) profileFields.youtube = youtube;
    if (facebook) profileFields.facebook = facebook;
    if (twitter) profileFields.twitter = twitter;
    if (instagram) profileFields.instagram = instagram;
    if (linkedIn) profileFields.linkedIn = linkedIn;

    console.log(profileFields.skills);

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Route = GET api/profile
// Desc  = Get all profiles
// access = public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route = GET api/profile/user/user_id
// Desc  = Get profile by user
// access = public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Route = DELETE api/profile
// Desc  = Delete profile, user and posts
// access = private

router.delete("/", auth, async (req, res) => {
  try {
    //removing user posts
    await Post.deleteMany({ user: req.user.id });
    //removing profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //removing user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "user deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route = PUT api/profile/experience
// Desc  = add profile experience
// access = private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// Route = DELETE api/profile/experience/:exp_id
// Desc  = Delete experience from profile
// access = private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error deleting experience");
  }
});

// Route = PUT api/profile/education
// Desc  = add profile education
// access = private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// Route = DELETE api/profile/education/:edu_id
// Desc  = Delete education from profile
// access = private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error deleting education");
  }
});

module.exports = router;
