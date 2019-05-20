const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// ADDING A POST
// Route = POST api/posts
// Desc  = Create a post
// access = private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //errors checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      // console.log(req.user.id);
      // console.log(user);

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      return res.send(500).send("Server error");
    }
  }
);

// GET ALL POSTS
// Route = GET api/posts
// Desc  = Get all post
// access = private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //the most recent posts are coming first

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    return res.send(500).send("Server error");
  }
});

// GET SINGLE POST BY id
// Route = GET api/posts/:id
// Desc  = Get single post by id
// access = private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //if there is a post with id
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    // if(!error.kind === "ObjectId") {
    //     return res.status(404).json({ msg: "Post not found" });
    // }
    return res.send(500).send("Server error");
  }
});

// DELETE SINGLE POST BY id
// Route = DELETE api/posts/:id
// Desc  = DELETE single post by id
// access = private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(post.user);
    // console.log(req.user.id);

    //if there is no post with such id
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //Check if user authorized to delete post - the author of the post
    //post.user - is object with userID in it, so we do toString()
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "User not authorized to delete the post" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    // if(!error.kind === "ObjectId") {
    //     return res.status(404).json({ msg: "Post not found" });
    // }
    return res.send(500).send("Server error");
  }
});

// ADDING COMMENT TO THE POST
// Route = POST api/posts/comment/:id
// Desc  = Comment on post
// access = private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //errors checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      //console.log(post);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };
      console.log(newComment);

      // Add the comment to post comments array
      // unshift - add the comment to beginning
      post.comments.unshift(newComment);

      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      return res.send(500).send("Server error");
    }
  }
);

// DELETE COMMENT FROM THE POST
// Route = DELETE api/posts/comment/:id/comment_id
// Desc  = Delete comment
// access = private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    // Pull comment by id
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //console.log(comment);

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).jsonp({ msg: "User is not authorized" });
    }

    // Get remove index
    const removeIndex = post.comments
        .map(comment => comment.user.toString())
        .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);

  } catch (error) {
    console.error(error.message);
    return res.send(500).send("Server error");
  }
});

module.exports = router;
